/**
 * A synthesized "heavy" notification sound — a low thump followed by two sharp
 * bell tones. Built entirely with the Web Audio API so no audio file has to be
 * shipped or fetched.
 */
let ctx = null;

function getContext() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(context, { freq, start, duration, type = "sine", peakGain = 0.35 }) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, context.currentTime + start);
  gain.gain.setValueAtTime(0, context.currentTime + start);
  gain.gain.linearRampToValueAtTime(peakGain, context.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + start + duration);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start(context.currentTime + start);
  osc.stop(context.currentTime + start + duration + 0.05);
}

export function playHeavyNotificationSound() {
  try {
    const context = getContext();
    // Low percussive thump for "weight"
    tone(context, { freq: 90, start: 0, duration: 0.25, type: "sine", peakGain: 0.5 });
    // Two sharp bell-like beeps on top
    tone(context, { freq: 880, start: 0.05, duration: 0.18, type: "square", peakGain: 0.22 });
    tone(context, { freq: 660, start: 0.22, duration: 0.22, type: "square", peakGain: 0.22 });
  } catch {
    // Web Audio unavailable/blocked (e.g. autoplay policy before any user interaction) — fail silently.
  }
}
