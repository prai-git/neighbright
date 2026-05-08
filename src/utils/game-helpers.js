export function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandom(items, n, excludeIds = []) {
  const filtered = items.filter((item) => !excludeIds.includes(item.id));
  return shuffle(filtered).slice(0, n);
}

export function pickOddOneOut(categories, mainCategoryId) {
  const mainCat = categories.find((c) => c.id === mainCategoryId);
  if (!mainCat || mainCat.words.length < 3) return null;

  const otherCats = categories.filter((c) => c.id !== mainCategoryId && c.words.length > 0);
  if (otherCats.length === 0) return null;

  const mainWords = pickRandom(mainCat.words, 3);
  const oddCat = otherCats[Math.floor(Math.random() * otherCats.length)];
  const oddWord = pickRandom(oddCat.words, 1)[0];

  return {
    items: shuffle([...mainWords, oddWord]),
    oddItem: oddWord,
    mainCategory: mainCat,
    oddCategory: oddCat,
  };
}

export function getRandomCategoryPair(categories) {
  const valid = categories.filter((c) => c.words.length >= 3);
  if (valid.length < 2) return null;
  const picked = shuffle(valid).slice(0, 2);
  return picked;
}

export function getRandomCategories(categories, count) {
  const valid = categories.filter((c) => c.words.length >= 3);
  if (valid.length < count) return valid;
  return shuffle(valid).slice(0, count);
}
