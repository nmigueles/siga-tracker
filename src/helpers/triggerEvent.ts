import Axios from "axios";
import sendDiscordMessage from "./sendDiscordMessage";

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
    sendDiscordMessage(`Event Fired: ${event}`);
  } catch (error) {
    console.error(error.message);
    console.error(error.response.data);
  }
}
