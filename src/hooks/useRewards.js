import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../db';
import { stickers, avatarLevels } from '../data/rewards';

/**
 * Returns the avatar level object for a given star count.
 */
export function getAvatarLevel(totalStars) {
  let current = avatarLevels[0];
  for (const lvl of avatarLevels) {
    if (totalStars >= lvl.starsNeeded) {
      current = lvl;
    }
  }
  return current;
}

/**
 * Returns an array of sticker IDs that are unlocked given a rewards record.
 */
export function getUnlockedStickers(rewards) {
  if (!rewards) return [];
  return stickers
    .filter((s) => (rewards[s.threshold.field] || 0) >= s.threshold.value)
    .map((s) => s.id);
}

/**
 * Ensures a rewards record exists, creating a default one if needed.
 */
async function ensureRewardsRecord() {
  let record = await db.rewards.toCollection().first();
  if (!record) {
    const id = await db.rewards.add({
      totalStars: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActive: null,
      avatarLevel: 1,
      stickers: [],
    });
    record = await db.rewards.get(id);
  }
  return record;
}

/**
 * Central rewards hook — provides reactive reward state and mutation helpers.
 */
export function useRewards() {
  const rewards = useLiveQuery(() => db.rewards.toCollection().first());

  /**
   * Update the daily streak. Call once on app load / session start.
   * - If already active today, no-op.
   * - If last active yesterday, increment streak.
   * - Otherwise reset streak to 1.
   */
  const updateStreak = useCallback(async () => {
    const record = await ensureRewardsRecord();

    const today = new Date().toISOString().slice(0, 10);

    if (record.lastActive === today) return; // already counted today

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    let newStreak;
    if (record.lastActive === yesterday) {
      newStreak = (record.currentStreak || 0) + 1;
    } else {
      newStreak = 1;
    }

    const newLongest = Math.max(newStreak, record.longestStreak || 0);

    await db.rewards.update(record.id, {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActive: today,
    });
  }, []);

  /**
   * Award one or more stars. Returns `{ newStickers, newAvatarLevel }` describing
   * any freshly-unlocked achievements so the caller can show celebrations.
   */
  const awardStar = useCallback(async (count = 1) => {
    const record = await ensureRewardsRecord();

    const previousStars = record.totalStars || 0;
    const newTotalStars = previousStars + count;

    // Determine newly-unlocked stickers
    const previousUnlocked = new Set(getUnlockedStickers(record));
    const updatedRecord = { ...record, totalStars: newTotalStars };
    const nowUnlocked = getUnlockedStickers(updatedRecord);
    const newStickers = nowUnlocked.filter((id) => !previousUnlocked.has(id));

    // Determine if avatar level changed
    const previousLevel = getAvatarLevel(previousStars);
    const currentLevel = getAvatarLevel(newTotalStars);
    const newAvatarLevel = currentLevel.level > previousLevel.level ? currentLevel : null;

    // Persist
    const stickersList = [...new Set([...(record.stickers || []), ...newStickers])];
    await db.rewards.update(record.id, {
      totalStars: newTotalStars,
      avatarLevel: currentLevel.level,
      stickers: stickersList,
    });

    return { newStickers, newAvatarLevel };
  }, []);

  return {
    rewards: rewards || null,
    updateStreak,
    awardStar,
    getUnlockedStickers,
    getAvatarLevel,
  };
}
