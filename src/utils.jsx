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
		//TODO: 
	} else if (type === 'victory') {
		//TODO: 
	} else if (type === 'defeat') {
		//TODO: 
    }
};


export { title, hasCard, playSound }
