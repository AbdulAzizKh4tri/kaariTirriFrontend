const Round = ({user, socket, theme, pgs}) => {

	return (
		<div className="h-full w-full">
			<div className="flex justify-items-start p-2 bg-[#202020] bg-opacity-20 rounded-lg w-full h-[90%] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{
					pgs.round.map((obj, index) => {
						const card = obj.card
						return (
							<div className="p-3" key={`round: ${card.number} of ${card.suit}`}>
								<div className="flex items-center justify-center">{obj.playerName == user? "YOU" : obj.playerName}</div>
								<img src={`/assets/cards/${theme}/${card.suit.toLowerCase()}/${card.number.toLowerCase()}.png`} 
									alt={`${card.number} of ${card.suit}`}
									className="max-h-[25vh] h-auto w-auto drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)] drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]"
								></img>
							</div>
						)
					})
				}
			</div>
			<div className="flex justify-center items-center h-[10%] bg-[#202020] bg-opacity-30 w-full">
			  {
				  pgs.players.map((player, index) => (
						<div 
						  key={`playerScores-${player}`} 
						  className="px-3 text-[#fafafa]"
						>
						  <span>{player}: {pgs.playerScores[player]}</span>
						</div>
				  ))
			  }
			</div>
		</div>
	)
}

export default Round;
