import { CronJob } from "cron";

import "./tasks/connectDb";

import { trackNotas } from "./tracker";

import sendDiscordMessage from "./helpers/sendDiscordMessage";

const onError = (error: Error): void => {
  // Si el cronjob tira error se ejecuta este callback.
  // En mi caso quiero que me mande un mensaje por discord.
  sendDiscordMessage(error.message);
};

// Correrlo cada hora, entre las 7 a las 23 hs.
const notasCronJob = new CronJob(
  "*/15 07-23 * * *",
  () => {
    trackNotas(onError);
    console.log(
      "Tracker runned, next run: ",
      notasCronJob.nextDates().toLocaleString()
    );
  },
  null,
  true,
  "America/Buenos_Aires"
);

console.info(`SIGA Tracker v${process.env.npm_package_version || "Unknown"}`);
