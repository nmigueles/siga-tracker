import axios from "axios";

export default async function triggerEvent(
  webhook: string,
  event: string,
  data: any,
  extraData?: any
): Promise<void> {
  try {
    await axios.post(
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
    console.error(error.message);
    console.error(error.response.data);
  }
}
