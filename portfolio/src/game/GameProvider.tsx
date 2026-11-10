import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { playSound } from '../lib/sound';
import { computeLevelInfo, type AchievementId, type LevelInfo } from './achievements';
import {
  GAME_STORAGE_KEY,
  gameReducer,
  hydrateGameState,
  INITIAL_GAME_STATE,
  serializeGameState,
  type GameState,
} from './reducer';

export interface GameContextValue {
  state: GameState;
  levelInfo: LevelInfo;
  unlock: (id: AchievementId) => void;
  addXp: (amount: number) => void;
  visitSection: (sectionId: string) => void;
  inspectProject: (projectId: string) => void;
  dismissToast: (id: AchievementId) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

function loadInitialGameState(): GameState {
  if (typeof window === 'undefined') {
    return INITIAL_GAME_STATE;
  }
  try {
    return hydrateGameState(window.localStorage.getItem(GAME_STORAGE_KEY));
  } catch {
    return INITIAL_GAME_STATE;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadInitialGameState);
  const prevUnlockedCountRef = useRef<number>(state.unlocked.length);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(GAME_STORAGE_KEY, serializeGameState(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  useEffect(() => {
    if (state.unlocked.length > prevUnlockedCountRef.current) {
      playSound('unlock');
    }
    prevUnlockedCountRef.current = state.unlocked.length;
  }, [state.unlocked.length]);

  const unlock = useCallback((id: AchievementId) => {
    dispatch({ type: 'UNLOCK', id });
  }, []);

  const addXp = useCallback((amount: number) => {
    dispatch({ type: 'ADD_XP', amount });
  }, []);

  const visitSection = useCallback((sectionId: string) => {
    dispatch({ type: 'VISIT_SECTION', sectionId });
  }, []);

  const inspectProject = useCallback((projectId: string) => {
    dispatch({ type: 'INSPECT_PROJECT', projectId });
  }, []);

  const dismissToast = useCallback((id: AchievementId) => {
    dispatch({ type: 'DISMISS_TOAST', id });
  }, []);

  const levelInfo = useMemo(() => computeLevelInfo(state.xp), [state.xp]);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      levelInfo,
      unlock,
      addXp,
      visitSection,
      inspectProject,
      dismissToast,
    }),
    [state, levelInfo, unlock, addXp, visitSection, inspectProject, dismissToast],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return ctx;
}
