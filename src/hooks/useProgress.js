import { useCallback } from 'react';
import db from '../db';

/**
 * Central progress hook — helpers for recording and querying activity progress.
 */
export function useProgress() {
  /**
   * Save a progress record. Automatically sets `createdAt`.
   */
  const addProgress = useCallback(async (record) => {
    await db.progress.add({
      ...record,
      createdAt: new Date().toISOString(),
    });
  }, []);

  /**
   * Get progress records for a specific module, optionally filtered by date range.
   */
  const getProgressByModule = useCallback(async (module, startDate, endDate) => {
    const all = await db.progress
      .where('module')
      .equals(module)
      .toArray();

    return filterByDateRange(all, startDate, endDate);
  }, []);

  /**
   * Get all progress records within a date range.
   */
  const getProgressByDate = useCallback(async (startDate, endDate) => {
    const all = await db.progress.toArray();
    return filterByDateRange(all, startDate, endDate);
  }, []);

  /**
   * Get all progress records from today.
   */
  const getTodayProgress = useCallback(async () => {
    const today = new Date().toISOString().slice(0, 10);
    const all = await db.progress.toArray();
    return all.filter(
      (r) => typeof r.createdAt === 'string' && r.createdAt.startsWith(today)
    );
  }, []);

  /**
   * Sum of durationSecs, optionally filtered by module and/or date range.
   */
  const getTotalDuration = useCallback(async (module, startDate, endDate) => {
    let records;
    if (module) {
      records = await db.progress.where('module').equals(module).toArray();
    } else {
      records = await db.progress.toArray();
    }
    records = filterByDateRange(records, startDate, endDate);
    return records.reduce((sum, r) => sum + (r.durationSecs || 0), 0);
  }, []);

  /**
   * Aggregate word-level accuracy from progress records.
   * Expects activityData.word and result to be 'correct' or 'incorrect'.
   */
  const getWordAccuracy = useCallback(async () => {
    const all = await db.progress.toArray();
    const map = {};

    for (const r of all) {
      const word = r.activityData?.word;
      if (!word) continue;
      if (!map[word]) map[word] = { word, attempts: 0, correct: 0 };
      map[word].attempts += 1;
      if (r.result === 'correct') map[word].correct += 1;
    }

    return Object.values(map).map((entry) => ({
      ...entry,
      accuracy: entry.attempts > 0 ? Math.round((entry.correct / entry.attempts) * 100) : 0,
    }));
  }, []);

  /**
   * Aggregate sound practice progress.
   * Expects activityData.sound and activityData.level.
   */
  const getSoundProgress = useCallback(async () => {
    const all = await db.progress
      .filter((r) => r.module === 'sounds')
      .toArray();

    const map = {};
    for (const r of all) {
      const sound = r.activityData?.sound;
      if (!sound) continue;
      if (!map[sound]) map[sound] = { sound, levelsCompleted: new Set() };
      if (r.result === 'correct' && r.activityData?.level) {
        map[sound].levelsCompleted.add(r.activityData.level);
      }
    }

    return Object.values(map).map((entry) => ({
      sound: entry.sound,
      levelsCompleted: entry.levelsCompleted.size,
    }));
  }, []);

  /**
   * Aggregate puzzle completion data.
   * Expects activityData.puzzleId.
   */
  const getPuzzleCompletion = useCallback(async () => {
    const all = await db.progress
      .filter((r) => r.module === 'puzzles')
      .toArray();

    const map = {};
    for (const r of all) {
      const id = r.activityData?.puzzleId;
      if (!id) continue;
      if (!map[id]) map[id] = { puzzleId: id, completed: false, attempts: 0 };
      map[id].attempts += 1;
      if (r.result === 'correct') map[id].completed = true;
    }

    return Object.values(map);
  }, []);

  return {
    addProgress,
    getProgressByModule,
    getProgressByDate,
    getTodayProgress,
    getTotalDuration,
    getWordAccuracy,
    getSoundProgress,
    getPuzzleCompletion,
  };
}

/* ---- helpers ---- */

function filterByDateRange(records, startDate, endDate) {
  if (!startDate && !endDate) return records;

  return records.filter((r) => {
    if (typeof r.createdAt !== 'string') return false;
    const d = r.createdAt.slice(0, 10);
    if (startDate && d < startDate) return false;
    if (endDate && d > endDate) return false;
    return true;
  });
}
