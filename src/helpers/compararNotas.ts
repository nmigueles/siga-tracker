import { Nota } from "siga-scraper/dist/interfaces";

/**
 * Dados dos arrays de notas, devuelve las diferencias.
 */
export default function compararNotas(
  notasViejas: Nota[],
  notasNuevas: Nota[]
): Nota[] {
  const response: Nota[] = [];

  const notasViejasByInstancia = notasViejas.reduce(
    (byInstancia: any, nota) => {
      byInstancia[nota.instancia] = nota.calificacion;
      return byInstancia;
    },
    {}
  );

  notasNuevas.forEach(({ instancia, calificacion }) => {
    if (notasViejasByInstancia[instancia]) {
      // La nota existe, checkeamos si no es la misma.
      if (notasViejasByInstancia[instancia] !== calificacion)
        response.push({ instancia, calificacion });
    } else {
      // La nota no existia, la guardamos.
      response.push({ instancia, calificacion });
    }
  });

  return response;
}
