import db from '../db';

export async function getWeightedWordList(categoryWords) {
  const records = await db.progress
    .where('module')
    .equals('words')
    .toArray();

  const statsMap = {};
  for (const r of records) {
    const wid = r.activityData?.wordId;
    if (!wid) continue;
    if (!statsMap[wid]) statsMap[wid] = { correct: 0, total: 0 };
    statsMap[wid].total++;
    if (r.result === 'correct') statsMap[wid].correct++;
  }

  const weighted = [];
  for (const word of categoryWords) {
    const stats = statsMap[word.id];
    let repeats = 1;
    if (stats && stats.total > 0) {
      const score = stats.correct / stats.total;
      if (score < 0.5) repeats = 3;
      else if (score <= 0.8) repeats = 2;
    }
    for (let i = 0; i < repeats; i++) weighted.push(word);
  }

  for (let i = weighted.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [weighted[i], weighted[j]] = [weighted[j], weighted[i]];
  }

  return weighted;
}
