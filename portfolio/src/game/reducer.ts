import {
  ACHIEVEMENTS,
  ALL_SECTIONS,
  computeLevelInfo,
  FLAGSHIP_IDS,
  type AchievementId,
} from './achievements';

export const GAME_STORAGE_KEY = 'ce.game';
export const SECTION_VISIT_XP = 15;
export const PROJECT_INSPECT_XP = 20;

export interface GameState {
  xp: number;
  level: number;
  unlocked: AchievementId[];
  visitedSections: string[];
  inspectedProjects: string[];
  toastQueue: AchievementId[];
}

export type GameAction =
  | { type: 'ADD_XP'; amount: number }
  | { type: 'UNLOCK'; id: AchievementId }
  | { type: 'VISIT_SECTION'; sectionId: string }
  | { type: 'INSPECT_PROJECT'; projectId: string }
  | { type: 'DISMISS_TOAST'; id: AchievementId };

export const INITIAL_GAME_STATE: GameState = {
  xp: 0,
  level: 1,
  unlocked: [],
  visitedSections: [],
  inspectedProjects: [],
  toastQueue: [],
};

function applyUnlock(state: GameState, id: AchievementId): GameState {
  const def = ACHIEVEMENTS[id];
  if (!def || state.unlocked.includes(id)) {
    return state;
  }
  const nextXp = state.xp + def.xp;
  const { level } = computeLevelInfo(nextXp);
  return {
    ...state,
    xp: nextXp,
    level,
    unlocked: [...state.unlocked, id],
    toastQueue: [...state.toastQueue, id],
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_XP': {
      if (action.amount <= 0) {
        return state;
      }
      const nextXp = state.xp + action.amount;
      const { level } = computeLevelInfo(nextXp);
      return { ...state, xp: nextXp, level };
    }

    case 'UNLOCK': {
      return applyUnlock(state, action.id);
    }

    case 'VISIT_SECTION': {
      if (!action.sectionId || state.visitedSections.includes(action.sectionId)) {
        return state;
      }
      const visitedSections = [...state.visitedSections, action.sectionId];
      const nextXp = state.xp + SECTION_VISIT_XP;
      const { level } = computeLevelInfo(nextXp);
      let nextState: GameState = {
        ...state,
        xp: nextXp,
        level,
        visitedSections,
      };
      const visitedAll = ALL_SECTIONS.every((sec) => visitedSections.includes(sec));
      if (visitedAll) {
        nextState = applyUnlock(nextState, 'explorer');
      }
      return nextState;
    }

    case 'INSPECT_PROJECT': {
      if (!action.projectId) {
        return state;
      }
      const alreadyInspected = state.inspectedProjects.includes(action.projectId);
      const inspectedProjects = alreadyInspected
        ? state.inspectedProjects
        : [...state.inspectedProjects, action.projectId];
      const nextXp = alreadyInspected ? state.xp : state.xp + PROJECT_INSPECT_XP;
      const { level } = computeLevelInfo(nextXp);

      let nextState: GameState = {
        ...state,
        xp: nextXp,
        level,
        inspectedProjects,
      };
      nextState = applyUnlock(nextState, 'curious');

      const allFlagships = FLAGSHIP_IDS.every((fid) => inspectedProjects.includes(fid));
      if (allFlagships) {
        nextState = applyUnlock(nextState, 'collector');
      }
      return nextState;
    }

    case 'DISMISS_TOAST': {
      if (!state.toastQueue.includes(action.id)) {
        return state;
      }
      return {
        ...state,
        toastQueue: state.toastQueue.filter((item) => item !== action.id),
      };
    }

    default:
      return state;
  }
}

export function hydrateGameState(raw: string | null): GameState {
  if (!raw) {
    return INITIAL_GAME_STATE;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<GameState>;
    const xp = typeof parsed.xp === 'number' && parsed.xp >= 0 ? parsed.xp : 0;
    const unlocked = Array.isArray(parsed.unlocked)
      ? parsed.unlocked.filter((id): id is AchievementId => id in ACHIEVEMENTS)
      : [];
    const visitedSections = Array.isArray(parsed.visitedSections)
      ? parsed.visitedSections.filter((s): s is string => typeof s === 'string')
      : [];
    const inspectedProjects = Array.isArray(parsed.inspectedProjects)
      ? parsed.inspectedProjects.filter((s): s is string => typeof s === 'string')
      : [];
    const { level } = computeLevelInfo(xp);
    return {
      xp,
      level,
      unlocked,
      visitedSections,
      inspectedProjects,
      toastQueue: [],
    };
  } catch {
    return INITIAL_GAME_STATE;
  }
}

export function serializeGameState(state: GameState): string {
  return JSON.stringify({
    xp: state.xp,
    unlocked: state.unlocked,
    visitedSections: state.visitedSections,
    inspectedProjects: state.inspectedProjects,
  });
}
