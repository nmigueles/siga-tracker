import sigaScraper from "siga-scraper";
import { Course, Nota, Notas as ANotas } from "siga-scraper/dist/interfaces";

import config from "./config";

import Notas, { INota } from "./models/notas";
import compararNotas from "./helpers/compararNotas";
import triggerEvent from "./helpers/triggerEvent";

import events from "./constants/events";

type OnErrorCallback = (error: Error) => void;

export async function trackNotas(onError?: OnErrorCallback) {
  try {
    const notas = await Notas.find({});
    // Indexo para buscar por id más rápido.
    const notasById: { [key: string]: INota } = notas.reduce(
      (byId: any, nota) => {
        byId[nota.courseId] = nota;
        return byId;
      },
      {}
    );

    await sigaScraper.start({
      headless: true,
      executablePath: config.CHROMIUM_PATH,
      args: ["--no-sandbox"],
    });
    await sigaScraper.login(config.USER, config.PASS);

    const responseNotas: ANotas[] = await sigaScraper.scrapeNotas();

    const idAsignaturasNuevas: string[] = [];

    for await (const { courseId, notas, name } of responseNotas) {
      const asignaturaInDb = notasById[courseId];
      if (asignaturaInDb) {
        const nuevasNotas: Nota[] = compararNotas(asignaturaInDb.notas, notas);

        if (nuevasNotas.length) {
          console.log("Se detectaron nuevas notas.");
          const data = {
            courseId,
            name,
            notas: nuevasNotas,
          };

          //Guardar en la db del tracker.
          asignaturaInDb.notas = [...asignaturaInDb.notas, ...nuevasNotas];
          asignaturaInDb.save();

          // Enviar los eventos al webhook.
          await triggerEvent(
            config.WEBHOOK_URL_NEW_GRADE,
            events.newGrade,
            data
          );
        }
      } else {
        // No estaba guardada en la db, por lo tanto es una nueva asignatura.
        idAsignaturasNuevas.push(courseId);
        try {
          await new Notas({ courseId, notas }).save();
        } catch {
          throw new Error(`Error guardando ${courseId} en la db.`);
        }
      }
    }

    if (idAsignaturasNuevas.length) {
      console.log("Se detectaron nuevas asignaturas.");
      const asignaturasNuevas: Course[] = [];
      // Busco más información sobre las asignaturas nuevas para enviarla en el evento.
      const responseCursada = await sigaScraper.scrapeCursada();
      const asignaturasById: {
        [key: string]: Course;
      } = responseCursada.reduce((byId: any, asignatura) => {
        byId[asignatura.courseId] = asignatura;
        return byId;
      }, {});

      idAsignaturasNuevas.forEach((id) => {
        const asignatura: Course = asignaturasById[id];
        if (asignatura) {
          asignatura.aula = asignatura.aula || "sin definir";
          asignaturasNuevas.push(asignatura);
        } else {
          throw new Error(`Asignatura no encontrada ${id}.`);
        }
      });
      // Enviar los eventos al webhook.
      await triggerEvent(
        config.WEBHOOK_URL_NEW_COURSE,
        events.newCourse,
        asignaturasNuevas
      );
    }

    await sigaScraper.stop();
  } catch (error) {
    if (onError) onError(error);
    console.error("Error detectado: ", { error });
  }
}
