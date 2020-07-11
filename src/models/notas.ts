import { Schema, model, Document } from "mongoose";

export interface INota extends Document {
  courseId: string;
  notas: {
    instancia: string;
    calificacion: number;
  }[];
}

const notasSchema: Schema = new Schema({
  courseId: { type: String, required: true },
  notas: { type: Array, required: true },
});

export default model<INota>("Notas", notasSchema);
