import intro from "./intro.js";

export default async function displayIntro() {
  const displayWithDelay = async (text: string) => {
    const lines = text.split("\n");
    for (const line of lines) {
      console.log(line);
      await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms = 0.1 seconds
    }
  };

  await displayWithDelay(intro.Victoria3);

  const sequences = [intro.V, intro.V3, intro.V3M, intro.V3MT];

  for (const sequence of sequences) {
    console.clear();
    console.log(sequence);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
