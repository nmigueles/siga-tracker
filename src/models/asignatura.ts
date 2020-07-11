const { Schema, model } = require("mongoose");

const asignaturaSchema = new Schema({
  courseId: { type: String, required: true },
  curso: { type: String, required: true },
  nombre: { type: String, required: true },
  color: { type: String, required: true },
  dia: { type: Array, default: [] },
  hora: { type: Array, default: [] },
  horaT: { type: Array, default: [] },
  turno: { type: String, required: true },
  aula: { type: String, required: true },
  sede: { type: String, required: true },
});

const Asignatura = model("Asignatura", asignaturaSchema);

module.exports = Asignatura;
