import sleep from "../../../utils/sleep.js";
import outro from "../data/outro.js";

export default async function displayOutro() {
  // Victoria 3
  const lines = outro.setup_complete.split("\n");
  for (const line of lines) {
    console.log(line);
    await sleep(100);
  }
}
