import mongoose from "mongoose";
import config from "../config";

const connectionOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose.connect(config.MONGO_URI!, connectionOpts, (error) => {
  if (error) {
    console.error(
      "[DB] No se pudo conectar a la base de datos.",
      error.message
    );
    process.exit(1);
  }
  console.log("[DB] Conectado a la base de datos.");
});
