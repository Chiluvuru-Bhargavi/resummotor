/**
 * Daily Real Roast Counter Engine
 * Tracks roasts for the current calendar day (IST UTC+5:30)
 * Automatically resets to 0 every day at midnight.
 */

interface DailyCounterState {
  date: string;
  count: number;
}

export function getTodayDateString(): string {
  // Returns current date in IST (UTC+5:30) as YYYY-MM-DD
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  return istTime.toISOString().slice(0, 10);
}

// Global variable in memory on the server/worker
let globalDailyCounter: DailyCounterState = {
  date: getTodayDateString(),
  count: 0,
};

export function incrementDailyCount(): number {
  const today = getTodayDateString();
  if (globalDailyCounter.date !== today) {
    // A brand new day starts from 0!
    globalDailyCounter = {
      date: today,
      count: 0,
    };
  }
  globalDailyCounter.count += 1;
  return globalDailyCounter.count;
}

export function getDailyCount(): { date: string; count: number } {
  const today = getTodayDateString();
  if (globalDailyCounter.date !== today) {
    // A brand new day starts from 0!
    globalDailyCounter = {
      date: today,
      count: 0,
    };
  }
  return { ...globalDailyCounter };
}
