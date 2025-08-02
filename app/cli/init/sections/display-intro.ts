import Logger from '../../../utils/logger/logger.js';
import sleep from '../../../utils/sleep.js';
import intro from '../data/intro.js';

export default async function displayIntro() {
  // Victoria 3
  const lines = intro.Victoria3.split('\n');
  for (const line of lines) {
    Logger.text(line);
    await sleep(100);
  }

  // V3MT
  const sequences = [intro.V, intro.V3, intro.V3M, intro.V3MT];
  for (const sequence of sequences) {
    console.clear();
    Logger.text(sequence);
    await sleep(500);
  }
}
