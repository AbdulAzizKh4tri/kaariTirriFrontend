const ctx = new AudioContext();

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
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
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
        // white noise burst for card friction
        const bufferSize = ctx.sampleRate * 0.12;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1);
        filter.Q.value = 0.8;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.4, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

        source.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        source.start(ctx.currentTime);

	} else if (type === 'victory') {
		const play = (freq, startTime, duration, type = 'square', volume = 0.2) => {
			const o = ctx.createOscillator();
			const g = ctx.createGain();
			o.connect(g);
			g.connect(ctx.destination);
			o.type = type;
			o.frequency.setValueAtTime(freq, startTime);
			g.gain.setValueAtTime(0.0, startTime);
			g.gain.linearRampToValueAtTime(volume, startTime + 0.02);
			g.gain.setValueAtTime(volume, startTime + duration - 0.05);
			g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
			o.start(startTime);
			o.stop(startTime + duration);
		};

		const t = ctx.currentTime;

		// quick ascending run
		play(392, t,        0.1);   // G
		play(440, t + 0.1,  0.1);   // A
		play(494, t + 0.2,  0.1);   // B
		play(523, t + 0.3,  0.1);   // C

		// fanfare hits
		play(523, t + 0.4,  0.15);  // C
		play(523, t + 0.55, 0.15);  // C
		play(659, t + 0.7,  0.15);  // E

		// final triumphant chord - held, layered
		const chord = [523, 659, 784, 1047];
		chord.forEach(freq => {
			play(freq, t + 0.9, 0.8, 'square', 0.15);
			play(freq, t + 0.9, 0.8, 'sine',   0.1);   // sine layer for warmth
			play(freq * 2, t + 0.9, 0.8, 'sine', 0.05); // octave shimmer
		});
	} else if (type === 'defeat') {
        // sad trombone: wah wah wah wahhh (Bb A Ab G)
        const notes = [
            { freq: 466, dur: 0.25 },
            { freq: 440, dur: 0.25 },
            { freq: 415, dur: 0.25 },
            { freq: 392, dur: 0.7  },
        ];
        let t = ctx.currentTime;
        notes.forEach(({ freq, dur }) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = 'sawtooth';
            o.frequency.setValueAtTime(freq, t);
            // slight droop on the last note for the wahhh feel
            if (dur > 0.5) o.frequency.exponentialRampToValueAtTime(freq * 0.85, t + dur);
            g.gain.setValueAtTime(0.3, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            o.start(t);
            o.stop(t + dur);
            t += dur;
        });
    }
};


export { title, hasCard, playSound }
