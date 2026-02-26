const GameOver = ({user, socket, pgs}) => {

	return (
		<div className="h-full w-full flex items-center justify-center p-5">
			{
				pgs.gameWinners.includes(user) ?
				<img 
					src={`/assets/victory.png`}
					alt="Victory"
					className="h-full w-auto drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)] drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]"
				/>
				:
				<img 
					src={`/assets/defeat.png`}
					alt="Defeat"
					className="h-full w-auto drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)] drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]"
				/>
			}
		</div>
	)
	
}

export default GameOver;
