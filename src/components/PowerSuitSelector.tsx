const PowerSuitSelector = ({user, socket, theme, pgs}) => {
	const disabled = pgs?.highestBidder != user

	const selectPowerSuit = (powerSuit) => {
		socket.emit('powerSuitSelected', powerSuit);
	}

	return(
		<>
		<div className="h-full w-full flex items-center justify-center p-5">
			<div className="grid grid-cols-4 grid-rows-1 h-full w-full">
			{
				["spades", "hearts", "diamonds", "clubs"].map((suit, index) => {
					return (
						<div key={suit} className="col-span-1 p-5 flex items-center justify-center">
							<img src={`/assets/cards/${theme}/${suit}.png`} alt={`${suit}`} 
								className={`${disabled ? 'pointer-events-none opacity-70' : 'cursor-pointer hover:-translate-y-2 transition-transform'}
									drop-shadow-[0_8px_12px_rgba(0,0,0,0.8)] drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] `}
								onClick={() => {selectPowerSuit(suit)}}
							/>
						</div>
					)
				})
			}
			</div>
		</div>
		</>
	)
}

export default PowerSuitSelector;
