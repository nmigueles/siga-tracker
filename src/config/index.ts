import Joi from "@hapi/joi";

const options = {
  MONGO_URI: Joi.string().required(),
  USER: Joi.string().required(),
  PASS: Joi.string().required(),
  CHROMIUM_PATH: Joi.string(),
  WEBHOOK_URL_NEW_COURSE: Joi.string(),
  WEBHOOK_URL_NEW_GRADE: Joi.string(),
  WEBHOOK_DISCORD: Joi.string(),
};

const schema = Joi.object(options).unknown(true);

const { error, value: config } = schema.validate(process.env);

if (error) {
  console.error("Missing property in config.", error.message);
  process.exit(1);
}

export default config;
