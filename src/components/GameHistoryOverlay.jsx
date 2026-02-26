const GameHistoryOverlay = ({ gameResults = [], onClose }) => {

	if (!gameResults.length) return null;

	return (
		<div className="fixed top-0 left-0 bottom-0 w-3/4 backdrop-blur-sm bg-black/60 flex items-center justify-center z-51"
			onClick={onClose}
		>
			<div
				className="w-full max-w-xl bg-[#111918] border border-[#2c3839] rounded-2xl shadow-2xl p-5 flex flex-col gap-3 max-h-[85vh]"
				onClick={e => e.stopPropagation()}
			>
				<div className="flex items-center justify-between px-1">
					<span className="text-[#fafafa] font-bold text-[1.5vw]">Game History</span>
					<button
						onClick={onClose}
						className="text-[#aaaaaa] hover:text-[#fafafa] text-[1.2vw] transition-colors px-2"
					>
						✕
					</button>
				</div>

				<div className="overflow-y-auto flex flex-col gap-2 pr-1 [scrollbar-width:thin]">
					{[...gameResults].reverse().map(({ highestBid, highestBidder, gameWinners, gameLosers }, index) => {

						const renderName = (name) => {
							const isBidder = name === highestBidder;
							return (
								<span key={name} className="flex items-center gap-1.5">
									<span className={isBidder ? 'text-[#df9822] font-bold' : 'text-[#fcfdfc]'}>
										{name}
									</span>
									{isBidder && (
										<span className="text-[0.65vw] font-bold tracking-widest text-[#df9822] border border-[#df9822]/50 rounded px-1 py-px leading-none">
											BID
										</span>
									)}
								</span>
							);
						};

						return (
							<div
								key={index}
								className="grid grid-cols-[auto_1fr] gap-x-4 bg-[#1c2829] rounded-xl px-4 py-3 border border-[#2c3839]"
							>
								{/* Bid number — spans both rows */}
								<div className="row-span-2 flex items-center justify-center pr-4 border-r border-[#2c3839]">
									<span className="text-[3vw] font-extrabold text-[#fafafa] tabular-nums leading-none">
										{highestBid}
									</span>
								</div>

								{/* Winners */}
								<div className="flex items-center gap-2 flex-wrap pb-1.5 border-b border-[#2c3839]">
									<span className="text-[0.75vw] font-semibold tracking-widest text-[#4dff91] uppercase w-14 shrink-0">
										Won
									</span>
									<div className="flex gap-2 flex-wrap text-[1vw]">
										{gameWinners.map(renderName)}
									</div>
								</div>

								{/* Losers */}
								<div className="flex items-center gap-2 flex-wrap pt-1.5">
									<span className="text-[0.75vw] font-semibold tracking-widest text-[#fe4c40] uppercase w-14 shrink-0">
										Lost
									</span>
									<div className="flex gap-2 flex-wrap text-[1vw]">
										{gameLosers.map(renderName)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default GameHistoryOverlay;
