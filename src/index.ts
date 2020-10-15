import { CronJob } from "cron";

import "./tasks/connectDb";

import config from "./config";

import { trackNotas, Event } from "./tracker";

import triggerEvent from "./helpers/triggerEvent";
import sendDiscordMessage from "./helpers/sendDiscordMessage";

const onError = (error: Error): void => {
  // En caso de que un error ocurra se ejecuta este callback.
  // En mi caso quiero que me mande un mensaje por discord.
  sendDiscordMessage(`Ocurrió un error: ${error.message}`);
};

const onEventFired = (event: Event): void => {
  // Cuando se detecta un nuevo evento se ejecuta este callback.
  console.log("Se detectó un nuevo evento", event.name);
  triggerEvent(config.WEBHOOK_SIGA_PLUS, event.name, event.data);
  sendDiscordMessage(`Evento detectado: ${event.name}`);
};

const onRun = (): void => {
  // Cada vez que corre el cronjob se ejecuta este callback.
  console.log("Tracker runned at", new Date().toLocaleString());
};

// Correrlo cada hora, entre las 7 a las 23 hs.
const TrackerCronJob = new CronJob(
  "*/15 07-23 * * *",
  () => {
    trackNotas({ onError, onEventFired, onRun });
  },
  null,
  true,
  "America/Buenos_Aires"
);

TrackerCronJob.start();

console.info(`SIGA Tracker v${process.env.npm_package_version || "Unknown"}`);
