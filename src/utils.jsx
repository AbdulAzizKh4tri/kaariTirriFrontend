const ctx = new AudioContext();
let lastMessageSound = 0;
const cardSound = new Audio('/assets/card.mp3');
cardSound.volume = 0.6;

const title = s => s.replace(/\b\w/g, c => c.toUpperCase());

const hasCard = (cardList, card) => {
	return cardList.some(listCard => {
		return listCard.number == card.number && listCard.suit == card.suit
	})
}

const playSound = (type) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'message') {
        const now = Date.now();
        if (now - lastMessageSound < 1000) return;
        lastMessageSound = now;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'userMessage') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.setValueAtTime(400, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
	} else if (type === 'card') {
		cardSound.play();
	} else if (type === 'partner') {
		const start = ctx.currentTime;
		const SLOW = 0.7;      // 1.0 = original speed
		const TOTAL = 1.0;     // total length in seconds
		const peak = 0.07;

		// [frequency, start time in the original clip]
		const melody = [
			[784.00, 0.03],  // G5
			[622.25, 0.08],  // D#5
			[808.00, 0.18],  // G5 sliding toward G#5, as measured
			[784.00, 0.24],  // G5
			[698.46, 0.33],  // F5
			[659.25, 0.44],  // E5
			[698.46, 0.52],  // F5
			[587.33, 0.62],  // D5
			[790.00, 0.68]   // G5, held to the end
		];

		const filter = ctx.createBiquadFilter();
		filter.type = 'lowpass';
		filter.frequency.value = 2800;
		filter.Q.value = 1;

		const gain = ctx.createGain();
		filter.connect(gain);
		gain.connect(ctx.destination);

		// Three detuned saws plus a quiet octave-down saw for orchestral weight
		const layers = [
			{ mult: 1,   cents: -9, level: 1.0 },
			{ mult: 1,   cents: 0,  level: 1.0 },
			{ mult: 1,   cents: 9,  level: 1.0 },
			{ mult: 0.5, cents: 0,  level: 0.5 }
		];

		const lastTime = melody[melody.length - 1][1] * SLOW;

		layers.forEach(({ mult, cents, level }) => {
			const osc = ctx.createOscillator();
			const lg = ctx.createGain();
			lg.gain.value = level;
			osc.type = 'sawtooth';
			osc.detune.value = cents;
			osc.connect(lg);
			lg.connect(filter);

			// Legato: glide from each note into the next
			melody.forEach(([f, t], i) => {
				const time = start + t * SLOW;
				if (i === 0) {
					osc.frequency.setValueAtTime(f * mult, time);
				} else {
					osc.frequency.setValueAtTime(melody[i - 1][0] * mult, time);
					osc.frequency.linearRampToValueAtTime(f * mult, time + 0.03);
				}
			});

			// Light vibrato that fades in on the held note
			const lfo = ctx.createOscillator();
			const lfoGain = ctx.createGain();
			lfo.frequency.value = 5.5;
			lfoGain.gain.setValueAtTime(0, start + lastTime + 0.1);
			lfoGain.gain.linearRampToValueAtTime(4, start + lastTime + 0.4);
			lfo.connect(lfoGain);
			lfoGain.connect(osc.detune);

			osc.start(start + melody[0][1] * SLOW);
			osc.stop(start + TOTAL + 0.05);
			lfo.start(start);
			lfo.stop(start + TOTAL + 0.05);
		});

		// Envelope: soft attack, flat sustain, fade at the end (no per-note accents)
		const t0 = start + melody[0][1] * SLOW;
		gain.gain.setValueAtTime(0.001, t0);
		gain.gain.linearRampToValueAtTime(peak, t0 + 0.03);
		gain.gain.setValueAtTime(peak, start + TOTAL - 0.14);
		gain.gain.exponentialRampToValueAtTime(0.001, start + TOTAL);
	} else if (type === 'victory') {
		// Bright ascending arpeggio — C major triad + octave
		const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
		const times  = [0, 0.13, 0.26, 0.42];
		const lengths = [0.22, 0.22, 0.22, 0.55];

		notes.forEach((freq, i) => {
			const o = ctx.createOscillator();
			const g = ctx.createGain();
			o.connect(g);
			g.connect(ctx.destination);

			o.type = 'triangle';
			o.frequency.value = freq;

			const t = ctx.currentTime + times[i];
			g.gain.setValueAtTime(0, t);
			g.gain.linearRampToValueAtTime(0.25, t + 0.02);
			g.gain.exponentialRampToValueAtTime(0.001, t + lengths[i]);

			o.start(t);
			o.stop(t + lengths[i]);
		});

	} else if (type === 'defeat') {
		// Descending minor thirds — slow, heavy
		const notes = [392.00, 329.63, 277.18]; // G4  E4  C#4
		const times  = [0, 0.28, 0.60];
		const lengths = [0.38, 0.38, 0.75];

		notes.forEach((freq, i) => {
			const o = ctx.createOscillator();
			const g = ctx.createGain();
			o.connect(g);
			g.connect(ctx.destination);

			o.type = 'sawtooth';
			// slight detune for a heavier, duller tone
			o.detune.value = -18;
			o.frequency.value = freq;

			const t = ctx.currentTime + times[i];
			g.gain.setValueAtTime(0, t);
			g.gain.linearRampToValueAtTime(0.2, t + 0.04);
			g.gain.exponentialRampToValueAtTime(0.001, t + lengths[i]);

			o.start(t);
			o.stop(t + lengths[i]);
		});
    }
};


export { title, hasCard, playSound }
