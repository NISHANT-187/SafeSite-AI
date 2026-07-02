// Web Audio API Synthesizer for SafeSite AI System Sounds

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playSuccessSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // A sweet 3-note ascending chime
    const notes = [523.25, 659.25, 784.00]; // C5, E5, G5
    const durations = [0.08, 0.08, 0.25];
    const delays = [0, 0.08, 0.16];

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delays[index]);

      gain.gain.setValueAtTime(0.15, now + delays[index]);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delays[index] + durations[index]);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delays[index]);
      osc.stop(now + delays[index] + durations[index]);
    });
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};

export const playFailureSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // A low pitch dual buzz alarm
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(120, now);
    osc1.frequency.linearRampToValueAtTime(80, now + 0.3);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(123, now);
    osc2.frequency.linearRampToValueAtTime(83, now + 0.3);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.35);
    osc2.start(now);
    osc2.stop(now + 0.35);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};

export const playLaserBeep = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // A short laser blip
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};
