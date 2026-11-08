const LastRoundOverlay = ({lastRound, theme, onClose}) => {

	console.log(lastRound);

	return (

		<div className="fixed top-0 left-0 bottom-0 w-3/4 backdrop-blur-sm bg-black/60 flex items-center justify-center z-51"
			onClick={onClose}
		>
			<div
				className="w-full max-w-xl bg-[#111918] border border-[#2c3839] rounded-2xl shadow-2xl p-5 flex flex-col gap-3 max-h-[85vh]"
				onClick={e => e.stopPropagation()}
			>
				<div className="flex items-center justify-between px-1">
					<span className="text-[#fafafa] font-bold text-[1.5vw]">Last Round</span>
					<button
						onClick={onClose}
						className="text-[#aaaaaa] hover:text-[#fafafa] text-[1.2vw] transition-colors px-2"
					>
						✕
					</button>
				</div>

				<div className="overflow-y-auto flex flex-col gap-2 pr-1 [scrollbar-width:thin]">

				<div className="h-full w-full">
					<div className="flex justify-center p-2 bg-[#202020]/20 rounded-lg w-full h-[90%] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
						{
							lastRound.map((obj, index) => {
								const card = obj.card
								return (
									<div className="p-3 bg-[#2c3839]/50 rounded-lg mx-1" key={`round: ${card.number} of ${card.suit}`}>
										<div className="flex items-center justify-center font-bold text-[#fafafa]">{obj.playerName}</div>
										<img src={`/assets/cards/${theme}/${card.suit.toLowerCase()}/${card.number.toLowerCase()}.png`} 
											alt={`${card.number} of ${card.suit}`}
											className="max-h-[25vh] h-auto w-auto drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)] drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]"
										></img>
									</div>
								)
							})
						}
					</div>
				</div>

				</div>
			</div>
		</div>
	);
};

export default LastRoundOverlay;
