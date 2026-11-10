import type { Dictionary } from '../i18n/en';

export type AchievementId = keyof Dictionary['achievements']['items'];

export const ALL_SECTIONS = ['hero', 'about', 'projects', 'stack', 'contact'] as const;
export type SectionId = (typeof ALL_SECTIONS)[number];

export const FLAGSHIP_IDS = ['orin', 'auryly', 'marketfy'] as const;

export const LEVEL_THRESHOLDS = [0, 60, 140, 240, 360, 500] as const;

export interface AchievementDef {
  id: AchievementId;
  xp: number;
}

export const ACHIEVEMENTS: Record<AchievementId, AchievementDef> = {
  boot: { id: 'boot', xp: 25 },
  explorer: { id: 'explorer', xp: 75 },
  polyglot: { id: 'polyglot', xp: 35 },
  curious: { id: 'curious', xp: 40 },
  collector: { id: 'collector', xp: 90 },
  konami: { id: 'konami', xp: 100 },
  sound: { id: 'sound', xp: 25 },
  palette: { id: 'palette', xp: 35 },
  contact: { id: 'contact', xp: 60 },
};

export const ACHIEVEMENT_LIST: AchievementDef[] = Object.values(ACHIEVEMENTS);

export interface LevelInfo {
  level: number;
  currentFloor: number;
  nextThreshold: number | null;
  progress: number;
}

export function computeLevelInfo(xp: number): LevelInfo {
  const safeXp = Math.max(0, xp);
  let levelIndex = 0;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (safeXp >= LEVEL_THRESHOLDS[i]) {
      levelIndex = i;
    } else {
      break;
    }
  }

  const level = levelIndex + 1;
  const currentFloor = LEVEL_THRESHOLDS[levelIndex];
  const nextThreshold =
    levelIndex + 1 < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[levelIndex + 1] : null;

  if (nextThreshold === null) {
    return { level, currentFloor, nextThreshold: null, progress: 1 };
  }

  const span = nextThreshold - currentFloor;
  const progress = span > 0 ? Math.min(1, Math.max(0, (safeXp - currentFloor) / span)) : 1;

  return { level, currentFloor, nextThreshold, progress };
}
