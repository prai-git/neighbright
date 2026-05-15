import Dexie from 'dexie';

const db = new Dexie('NeighBrightDB');

db.version(1).stores({
  profile: '++id, name, avatarKey, tier, createdAt',
  progress: '++id, module, activityType, activityData, result, durationSecs, createdAt',
  rewards: '++id, totalStars, currentStreak, longestStreak, lastActive, avatarLevel, stickers',
  sessionNotes: '++id, noteText, createdAt, updatedAt',
  customVocabulary: '++id, category, word, emoji, phrase',
  settings: '++id, language, voiceURI, voiceRate, voicePitch, dailyGoalMinutes, tierOverrides, moduleToggles',
});

db.version(2).stores({
  profile: '++id, name, avatarKey, tier, createdAt',
  progress: '++id, module, activityType, activityData, result, durationSecs, createdAt',
  rewards: '++id, totalStars, currentStreak, longestStreak, lastActive, avatarLevel, stickers',
  sessionNotes: '++id, noteText, createdAt, updatedAt',
  customVocabulary: '++id, category, word, emoji, phrase',
  settings: '++id, language, voiceURI, voiceRate, voicePitch, dailyGoalMinutes, tierOverrides, moduleToggles',
  hiddenCards: '&cardId',
});

export default db;
