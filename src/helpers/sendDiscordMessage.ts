import Axios from "axios";

import config from "../config";

export default function sendDiscordMessage(content: string): void {
  try {
    Axios.post(
      config.WEBHOOK_DISCORD,
      { content },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("Error enviando mensaje a discord", error.message);
  }
}
