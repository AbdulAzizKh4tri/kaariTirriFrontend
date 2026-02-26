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
