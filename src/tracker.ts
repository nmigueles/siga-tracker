import sigaScraper from "siga-scraper";
import { Course, Nota, Notas as ANotas } from "siga-scraper/dist/interfaces";

import config from "./config";

import Notas, { INota } from "./models/notas";
import compararNotas from "./helpers/compararNotas";

import { Events } from "./constants";

export interface Event {
  name: keyof Events;
  data: object;
}

export interface TrackerOptions {
  onError?: (error: Error) => void;
  onEventFired?: (data: Event) => void;
  onRun?: () => void;
}

export async function trackNotas({
  onError,
  onEventFired,
  onRun,
}: TrackerOptions) {
  try {
    if (onRun) onRun();
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
    const grades: ANotas[] = [];

    for await (const { courseId, notas, name } of responseNotas) {
      let asignaturaInDb = notasById[courseId];
      if (!asignaturaInDb) {
        // No estaba guardada en la db, por lo tanto es una nueva asignatura.
        idAsignaturasNuevas.push(courseId);
        asignaturaInDb = await new Notas({ courseId, notas: [] }).save();
      }

      const nuevasNotas: Nota[] = compararNotas(asignaturaInDb.notas, notas);

      if (nuevasNotas.length) {
        const data: ANotas = {
          courseId,
          name,
          notas: nuevasNotas,
        };

        //Guardar en la db del tracker.
        asignaturaInDb.notas = [...asignaturaInDb.notas, ...nuevasNotas];
        await asignaturaInDb.save();
        grades.push(data);
      }
    }

    if (idAsignaturasNuevas.length) {
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

      if (onEventFired) {
        onEventFired({
          name: "new-course",
          data: { courses: asignaturasNuevas },
        });
      }
    }

    if (grades.length) {
      if (onEventFired) onEventFired({ name: "new-grade", data: { grades } });
    }

    await sigaScraper.stop();
  } catch (error) {
    if (onError) onError(error);
    console.error("Error detectado: ", { error });
  }
}
