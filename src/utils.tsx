const title = s => s.replace(/\b\w/g, c => c.toUpperCase());


const hasCard = (cardList, card) => {
	return cardList.some(listCard => {
		return listCard.number == card.number && listCard.suit == card.suit
	})
}


export { title, hasCard }
