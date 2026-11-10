import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS, ALL_SECTIONS, computeLevelInfo, FLAGSHIP_IDS } from './achievements';
import {
  gameReducer,
  hydrateGameState,
  INITIAL_GAME_STATE,
  PROJECT_INSPECT_XP,
  SECTION_VISIT_XP,
} from './reducer';

describe('gameReducer', () => {
  it('increments XP and computes levels across thresholds', () => {
    let state = INITIAL_GAME_STATE;
    expect(state.level).toBe(1);

    state = gameReducer(state, { type: 'ADD_XP', amount: 65 });
    expect(state.xp).toBe(65);
    expect(state.level).toBe(2);

    state = gameReducer(state, { type: 'ADD_XP', amount: 100 });
    expect(state.xp).toBe(165);
    expect(state.level).toBe(3);

    const info = computeLevelInfo(550);
    expect(info.level).toBe(6);
    expect(info.progress).toBe(1);
  });

  it('unlocks achievements idempotently without duplicating XP or toasts', () => {
    const first = gameReducer(INITIAL_GAME_STATE, { type: 'UNLOCK', id: 'konami' });
    expect(first.unlocked).toEqual(['konami']);
    expect(first.xp).toBe(ACHIEVEMENTS.konami.xp);
    expect(first.toastQueue).toEqual(['konami']);

    const second = gameReducer(first, { type: 'UNLOCK', id: 'konami' });
    expect(second).toBe(first);
    expect(second.xp).toBe(ACHIEVEMENTS.konami.xp);
    expect(second.unlocked).toHaveLength(1);
    expect(second.toastQueue).toHaveLength(1);
  });

  it('awards section visit XP once per section and unlocks explorer when all visited', () => {
    let state = gameReducer(INITIAL_GAME_STATE, { type: 'VISIT_SECTION', sectionId: 'hero' });
    expect(state.xp).toBe(SECTION_VISIT_XP);

    const duplicate = gameReducer(state, { type: 'VISIT_SECTION', sectionId: 'hero' });
    expect(duplicate).toBe(state);

    for (const sec of ALL_SECTIONS) {
      state = gameReducer(state, { type: 'VISIT_SECTION', sectionId: sec });
    }
    expect(state.unlocked).toContain('explorer');
    expect(state.xp).toBe(ALL_SECTIONS.length * SECTION_VISIT_XP + ACHIEVEMENTS.explorer.xp);
  });

  it('unlocks curious on first project inspect and collector after all flagships', () => {
    let state = gameReducer(INITIAL_GAME_STATE, {
      type: 'INSPECT_PROJECT',
      projectId: FLAGSHIP_IDS[0],
    });
    expect(state.unlocked).toContain('curious');
    expect(state.xp).toBe(PROJECT_INSPECT_XP + ACHIEVEMENTS.curious.xp);

    for (const fid of FLAGSHIP_IDS.slice(1)) {
      state = gameReducer(state, { type: 'INSPECT_PROJECT', projectId: fid });
    }
    expect(state.unlocked).toContain('collector');
  });

  it('hydrates stored JSON safely with an empty toast queue', () => {
    const hydrated = hydrateGameState(
      JSON.stringify({
        xp: 150,
        unlocked: ['boot', 'unknown_fake'],
        visitedSections: ['hero'],
        inspectedProjects: [],
      }),
    );
    expect(hydrated.xp).toBe(150);
    expect(hydrated.level).toBe(3);
    expect(hydrated.unlocked).toEqual(['boot']);
    expect(hydrated.toastQueue).toEqual([]);
  });
});
