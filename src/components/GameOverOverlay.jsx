const GameOverOverlay = ({ memberList, socket, pgs, user, gameResults = [] }) => {

	const handleStartGame = () => {
		socket.emit('gameStart');
	};

	const didWin = pgs?.gameWinners?.includes(user);

	// ── Score calculation ────────────────────────────────────────────────────
	const scores = {};

	gameResults.forEach(({ highestBid, highestBidder, gameWinners, gameLosers }) => {
		[...gameWinners, ...gameLosers].forEach(p => {
			if (!(p in scores)) scores[p] = 0;
		});

		gameWinners.forEach(p => {
			if (p === highestBidder) {
				scores[p] += highestBid * 2;
			} else {
				scores[p] += highestBid;
			}
		});

		gameLosers.forEach(p => {
			if (p === highestBidder) {
				scores[p] -= highestBid;
			}
			// non-bidder losers get 0 — no change needed
		});
	});

	const sortedPlayers = Object.entries(scores).sort((a, b) => b[1] - a[1]);

	// ── Render ───────────────────────────────────────────────────────────────
	return (
		<div className="fixed top-0 left-0 bottom-0 w-3/4 backdrop-blur-sm bg-black/60 flex items-center justify-center z-50">
			<div className="w-full max-w-lg bg-[#111918] border border-[#2c3839] rounded-2xl shadow-2xl p-6 flex flex-col gap-5">

				{/* Win / Lose header */}
				<div className={`text-center text-[3.5vh] font-extrabold tracking-wide rounded-xl py-3 
					${didWin 
						? 'bg-[#4dff91]/20 text-[#4dff91] border border-[#4dff91]/40' 
						: 'bg-[#fe4c40]/20 text-[#fe4c40] border border-[#fe4c40]/40'
					}`}>
					{didWin ? 'You Win!' : 'You Lose!'}
				</div>

				{/* Leaderboard */}
				{sortedPlayers.length > 0 && (
					<div className="flex flex-col gap-1">
						<div className="text-[#aaaaaa] text-[1.1vw] font-semibold mb-1 px-1">Room Leaderboard</div>
						<div className="max-h-[28vh] overflow-y-auto flex flex-col gap-1 pr-1 [scrollbar-width:thin]">
							{sortedPlayers.map(([name, score], index) => {
								const isUser = name === user;
								return (
									<div
										key={name}
										className={`flex items-center justify-between px-3 py-2 rounded-lg text-[1.1vw]
											${isUser 
												? 'bg-[#df9822]/20 border border-[#df9822]/50 text-[#df9822] font-bold' 
												: 'bg-[#2c3839] text-[#fcfdfc]'
											}`}
									>
										<span className="flex items-center gap-2">
											<span className="text-[#aaaaaa] w-5 text-right text-[0.9vw]">
												{`${index + 1}.`}
											</span>
											<span>{name}</span>
										</span>
										<span className={`font-bold tabular-nums ${score < 0 ? 'text-[#fe4c40]' : ''}`}>
											{score}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{/* Players in room */}
				<div className="flex flex-col gap-1">
					<div className="text-[#aaaaaa] text-[1.1vw] font-semibold px-1">Players in Room</div>
					<div className="grid grid-cols-3 gap-1">
						{memberList.map(member => (
							<div
								key={`member-${member}`}
								className={`px-2 py-2 rounded-lg text-center text-[1vw] font-semibold bg-[#2c3839] text-[#fcfdfc]`}
							>
								{member}
							</div>
						))}
					</div>
				</div>

				{/* Play again */}
				<button
					onClick={handleStartGame}
					className="w-full py-3 bg-[#d70040] hover:bg-[#b5003a] text-white rounded-lg font-bold text-[1.2vw] transition-colors"
				>
					Play Again!
				</button>

			</div>
		</div>
	);
};

export default GameOverOverlay;
