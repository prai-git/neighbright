/**
 * Sticker definitions — each has an unlock condition checked against the rewards record.
 * `threshold.field` corresponds to a column in the db.rewards table.
 */
export const stickers = [
  { id: 'first-word', i18nKey: 'rewards.milestones.firstWord', emoji: '🎉', threshold: { field: 'totalStars', value: 1 } },
  { id: 'ten-words', i18nKey: 'rewards.milestones.tenWords', emoji: '📚', threshold: { field: 'totalStars', value: 10 } },
  { id: 'sound-star', i18nKey: 'rewards.milestones.soundStar', emoji: '🔊', threshold: { field: 'totalStars', value: 15 } },
  { id: 'puzzle-master', i18nKey: 'rewards.milestones.puzzleMaster', emoji: '🧩', threshold: { field: 'totalStars', value: 25 } },
  { id: 'fifty-words', i18nKey: 'rewards.milestones.fiftyWords', emoji: '🏆', threshold: { field: 'totalStars', value: 50 } },
  { id: 'hundred-stars', i18nKey: 'rewards.milestones.hundredStars', emoji: '💯', threshold: { field: 'totalStars', value: 100 } },
  { id: 'three-day', i18nKey: 'rewards.milestones.threeDay', emoji: '🔥', threshold: { field: 'currentStreak', value: 3 } },
  { id: 'seven-day', i18nKey: 'rewards.milestones.sevenDay', emoji: '⚡', threshold: { field: 'currentStreak', value: 7 } },
  { id: 'thirty-day', i18nKey: 'rewards.milestones.thirtyDay', emoji: '🌟', threshold: { field: 'currentStreak', value: 30 } },
];

/**
 * Avatar level tiers — level is determined by total stars earned.
 */
export const avatarLevels = [
  { level: 1, starsNeeded: 0, badge: null, label: 'rewards.avatarLevels.beginner' },
  { level: 2, starsNeeded: 25, badge: '⭐', label: 'rewards.avatarLevels.starLearner' },
  { level: 3, starsNeeded: 50, badge: '🦸', label: 'rewards.avatarLevels.superLearner' },
  { level: 4, starsNeeded: 100, badge: '👑', label: 'rewards.avatarLevels.champion' },
  { level: 5, starsNeeded: 200, badge: '✨', label: 'rewards.avatarLevels.legend' },
];
