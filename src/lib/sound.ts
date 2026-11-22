import { useSettings } from '@/os/settings';

/**
 * UI sounds synthesised with Web Audio: no files to download and nothing
 * borrowed from a real OS. Browsers only allow audio after a user gesture, and
 * every sound here follows one (signing in, clicking, dropping in the Trash).
 */
export type Sound = 'startup' | 'pop' | 'tick';

let context: AudioContext | undefined;

function voice(ctx: AudioContext, out: AudioNode, freq: number, start: number, length: number, peak: number, type: OscillatorType = 'sine') {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peak, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(out);
  osc.start(start);
  osc.stop(start + length + 0.05);
  return osc;
}

const SOUNDS: Record<Sound, (ctx: AudioContext, out: AudioNode, t: number) => void> = {
  // A soft, open voicing (C, G, C, E, G) that swells and fades.
  startup: (ctx, out, t) => {
    for (const [i, f] of [130.81, 196, 261.63, 329.63, 392].entries()) voice(ctx, out, f, t + i * 0.012, 2.4, 0.16, 'triangle');
  },
  pop: (ctx, out, t) => {
    const osc = voice(ctx, out, 880, t, 0.16, 0.35);
    osc.frequency.exponentialRampToValueAtTime(520, t + 0.12);
  },
  tick: (ctx, out, t) => {
    voice(ctx, out, 2400, t, 0.03, 0.12, 'square');
  },
};

export function play(sound: Sound) {
  const { sound: enabled, volume } = useSettings.getState();
  if (!enabled || volume <= 0) return;
  context ??= new AudioContext();
  const ctx = context;
  void ctx.resume();
  const master = ctx.createGain();
  master.gain.value = volume * 0.6;
  master.connect(ctx.destination);
  SOUNDS[sound](ctx, master, ctx.currentTime + 0.01);
}
