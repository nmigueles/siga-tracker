import { CronJob } from "cron";

import "./tasks/connectDb";

import { trackNotas } from "./trackers";

// Correrlo cada hora, entre las 7 a las 23 hs.
const notasCronJob = new CronJob(
  "*/30 07-23 * * *",
  () => {
    console.log("Running tracker at ", new Date().toLocaleString());
    trackNotas();
    console.log("Next run: ", notasCronJob.nextDates().toLocaleString());
  },
  null,
  true,
  "America/Buenos_Aires"
);

console.log(
  notasCronJob.running ? "[INFO] Job started" : "[ALERT] Job does not started"
);
