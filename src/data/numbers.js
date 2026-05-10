const numberWords = [
  'zero','one','two','three','four','five','six','seven','eight','nine','ten',
  'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'
];

const numberEmojis = ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟',
  '1️⃣1️⃣','1️⃣2️⃣','1️⃣3️⃣','1️⃣4️⃣','1️⃣5️⃣','1️⃣6️⃣','1️⃣7️⃣','1️⃣8️⃣','1️⃣9️⃣','2️⃣0️⃣'];

export const numberData = numberWords.map((word, i) => ({
  value: i,
  word,
  i18nWord: `numbers.word${i}`,
  emoji: numberEmojis[i],
  fingers: i <= 10 ? i : null,
}));

export const tensData = [
  { value: 10, i18nWord: 'numbers.ten' },
  { value: 20, i18nWord: 'numbers.twenty' },
  { value: 30, i18nWord: 'numbers.thirty' },
  { value: 40, i18nWord: 'numbers.forty' },
  { value: 50, i18nWord: 'numbers.fifty' },
  { value: 60, i18nWord: 'numbers.sixty' },
  { value: 70, i18nWord: 'numbers.seventy' },
  { value: 80, i18nWord: 'numbers.eighty' },
  { value: 90, i18nWord: 'numbers.ninety' },
  { value: 100, i18nWord: 'numbers.hundred' },
];

export const countableEmojis = ['🍎','🌟','🐟','🦋','🌸','🐝','🍪','🎈','🐸','🐢','🍊','🐱'];

// Helper: get number range for a tier
export function getNumberRange(tier) {
  if (tier === 1) return [0, 5];
  if (tier === 2) return [0, 10];
  return [0, 20];
}
