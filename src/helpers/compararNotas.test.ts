import "jest";
import compararNotas from "./compararNotas";
import { Nota } from "siga-scraper/dist/interfaces";

describe("Comparar notas y devolver las diferencias.", () => {
  test("Debería detectar una nueva nota.", () => {
    const notasViejas: Nota[] = [];
    const notasNuevas: Nota[] = [
      {
        instancia: "PP",
        calificacion: 9,
      },
    ];

    const diferencias = compararNotas(notasViejas, notasNuevas);
    const expected: Nota[] = [
      {
        instancia: "PP",
        calificacion: 9,
      },
    ];
    expect(diferencias).toStrictEqual(expected);
  });

  test("Debería detectar cuando una nota ya establecida, cambia.", () => {
    const notasViejas: Nota[] = [
      {
        instancia: "PP",
        calificacion: 7,
      },
    ];
    const notasNuevas: Nota[] = [
      {
        instancia: "PP",
        calificacion: 10,
      },
    ];

    const diferencias = compararNotas(notasViejas, notasNuevas);
    const expected: Nota[] = [
      {
        instancia: "PP",
        calificacion: 10,
      },
    ];
    expect(diferencias).toStrictEqual(expected);
  });

  test("Debería detectar una nueva nota sin tener en cuenta las que ya existian.", () => {
    const notasViejas: Nota[] = [
      {
        instancia: "PP",
        calificacion: 7,
      },
    ];
    const notasNuevas: Nota[] = [
      {
        instancia: "PP",
        calificacion: 7,
      },
      {
        instancia: "SP",
        calificacion: 10,
      },
    ];

    const diferencias = compararNotas(notasViejas, notasNuevas);
    const expected: Nota[] = [
      {
        instancia: "SP",
        calificacion: 10,
      },
    ];
    expect(diferencias).toStrictEqual(expected);
  });
});
