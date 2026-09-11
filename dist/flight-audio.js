// A quiet propeller hum and wind, synthesized locally without downloads.
export class FlightAudio {
  constructor(createContext = () => new (window.AudioContext || window.webkitAudioContext)()) {
    this.createContext = createContext;
    this.context = null;
    this.active = null;
    this.enabled = true;
  }
  unlock() {
    try {
      this.context ||= this.createContext();
      if (this.context.state !== 'running') this.context.resume().catch(() => {});
    } catch { /* Speech and the game remain usable without Web Audio. */ }
  }
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) this.stop();
    else this.unlock();
  }
  start(duration = 6.5) {
    this.stop();
    if (!this.enabled) return;
    this.unlock(); // Called directly from the player's takeoff tap on iPad.
    const ctx = this.context;
    if (!ctx) return;
    const now = ctx.currentTime, end = now + duration;
    const master = ctx.createGain();
    master.connect(ctx.destination);
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(.12, now + Math.min(.5, duration / 4));
    master.gain.setValueAtTime(.12, Math.max(now + duration / 2, end - .6));
    master.gain.linearRampToValueAtTime(0, end);
    const engine = ctx.createOscillator(), engineGain = ctx.createGain();
    engine.type = 'triangle';
    engine.frequency.setValueAtTime(65, now);
    engine.frequency.exponentialRampToValueAtTime(125, now + duration * .35);
    engine.frequency.exponentialRampToValueAtTime(85, end);
    engineGain.gain.value = .55;
    engine.connect(engineGain).connect(master);
    const pulse = ctx.createOscillator(), pulseGain = ctx.createGain();
    pulse.frequency.value = 24; pulseGain.gain.value = .12;
    pulse.connect(pulseGain).connect(engineGain.gain);
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const wind = ctx.createBufferSource(), filter = ctx.createBiquadFilter();
    wind.buffer = buffer; wind.loop = true;
    filter.type = 'lowpass'; filter.frequency.value = 650; filter.Q.value = .4;
    wind.connect(filter).connect(master);
    const sources = [engine, pulse, wind], nodes = [master, engineGain, pulseGain, filter, ...sources];
    const run = { sources, nodes, master };
    this.active = run;
    wind.onended = () => {
      nodes.forEach(node => node.disconnect());
      if (this.active === run) this.active = null;
    };
    sources.forEach(source => { source.start(now); source.stop(end); });
  }
  stop() {
    const run = this.active;
    if (!run) return;
    this.active = null;
    // Mute immediately; cancel every source so sound never leaks into the next trip.
    run.master.gain.cancelScheduledValues(this.context.currentTime);
    run.master.gain.setValueAtTime(0, this.context.currentTime);
    run.sources.forEach(source => { try { source.stop(); } catch {} });
  }
}
