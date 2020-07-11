import Joi from "joi";

import * as env from "dotenv";
env.config();

const options = {
  MONGO_URI: Joi.string().required(),
  USER: Joi.string().required(),
  PASS: Joi.string().required(),
};

const schema = Joi.object(options).unknown(true);

const { error, value: config } = Joi.validate(process.env, schema);

if (error) {
  console.error("Missing property in config.", error.message);
  process.exit(1);
}

export default config;
