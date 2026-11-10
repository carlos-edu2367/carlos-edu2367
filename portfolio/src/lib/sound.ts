export type SoundKind = 'hover' | 'click' | 'unlock' | 'boot';

export const SOUND_STORAGE_KEY = 'ce.sound';

type Listener = () => void;

let audioCtx: AudioContext | null = null;
const listeners = new Set<Listener>();

function readInitialEnabled(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    return window.localStorage.getItem(SOUND_STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

let soundEnabled: boolean = readInitialEnabled();

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) {
      return null;
    }
    try {
      audioCtx = new Ctor();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(next: boolean): void {
  soundEnabled = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(SOUND_STORAGE_KEY, next ? 'on' : 'off');
    } catch {
      // Ignore storage errors
    }
  }
  emitChange();
  if (next) {
    playSound('click');
  }
}

export function toggleSound(): boolean {
  const next = !soundEnabled;
  setSoundEnabled(next);
  return next;
}

export function subscribeSound(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function scheduleTone(
  ctx: AudioContext,
  type: OscillatorType,
  startFreq: number,
  endFreq: number,
  startTime: number,
  duration: number,
  peakGain: number,
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, startTime);
  if (endFreq !== startFreq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 20), startTime + duration);
  }
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(peakGain, startTime + Math.min(0.012, duration * 0.25));
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

export function playSound(kind: SoundKind): void {
  if (!soundEnabled) {
    return;
  }
  const ctx = getAudioContext();
  if (!ctx) {
    return;
  }
  try {
    const now = ctx.currentTime;
    switch (kind) {
      case 'hover':
        scheduleTone(ctx, 'sine', 880, 1180, now, 0.03, 0.022);
        break;
      case 'click':
        scheduleTone(ctx, 'triangle', 560, 260, now, 0.055, 0.06);
        break;
      case 'boot':
        scheduleTone(ctx, 'sawtooth', 140, 420, now, 0.22, 0.045);
        scheduleTone(ctx, 'sine', 280, 840, now + 0.04, 0.2, 0.04);
        break;
      case 'unlock': {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
          scheduleTone(ctx, 'triangle', freq, freq * 1.01, now + i * 0.06, 0.14, 0.065);
        });
        break;
      }
    }
  } catch {
    // Ignore audio synthesis issues in headless/restricted environments
  }
}
