import Joi from "@hapi/joi";

import * as env from "dotenv";
env.config();

const options = {
  MONGO_URI: Joi.string().required(),
  USER: Joi.string().required(),
  PASS: Joi.string().required(),
};

const schema = Joi.object(options).unknown(true);

const { error, value: config } = schema.validate(process.env);

if (error) {
  console.error("Missing property in config.", error.message);
  process.exit(1);
}

export default config;
