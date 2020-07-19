import { CronJob } from "cron";

import "./tasks/connectDb";

import { trackNotas } from "./trackers";

// Correrlo cada hora, entre las 7 a las 23 hs.
const notasCronJob = new CronJob(
  "*/15 07-23 * * *",
  () => {
    trackNotas();
    console.log(
      "Tracker runned, next run: ",
      notasCronJob.nextDates().toLocaleString()
    );
  },
  null,
  true,
  "America/Buenos_Aires"
);

console.log(
  notasCronJob.running ? "[INFO] Job started" : "[ALERT] Job does not started"
);
console.log("Next run: ", notasCronJob.nextDates().toLocaleString());
