import Axios from "axios";
import sendDiscordMessage from "./sendDiscordMessage";

/**
 * Envia un evento al backend de la app SIGA Plus
 */
export default async function triggerEvent(
  webhook: string,
  event: string,
  data: any,
  extraData?: any
): Promise<void> {
  try {
    await Axios.post(
      webhook,
      {
        event,
        data,
        ...extraData,
      },
      {
        responseType: "json",
      }
    );
  } catch (error) {
    console.log(JSON.stringify(error));
    sendDiscordMessage(`Error al disparar un evento, ${error.message}}`);
  }
}
