import {title} from "../utils"

const Info = ({socket, pgs, user, theme}) => {

	const stage = pgs?.stage ?? ""

	const restartGame = () => {
		socket.emit('gameStart');
	}

	const auctionInfo = () => {
		const bidTurn = pgs.bidders[pgs.currentBidIndex] ?? ""

		return (
			<>
			<div className="w-full h-[45vh] grid grid-cols-3 grid-rows-7 p-2 rounded-lg bg-[#2c3839] text-[1.4vw] text-[#fcfdfc]">
				<div className="h-[5vh] row-span-1 col-span-3 text-center text-[3vh] text-[#fafafa] bg-[#0092ff] rounded-lg mb-1"> {title(stage)} </div>
				<div className="row-span-3 col-span-1 flex items-center justify-center">
					<div className="bg-[#df9822] rounded-lg p-2 my-1 text-[#0d405d]">
						<div className="flex items-center justify-center m-0">Highest</div>
						<div className="flex items-center justify-center">
							<span>{pgs.highestBid > 0 ? pgs.highestBid : "None"}</span>
						</div>
					</div>
				</div>
				<div className="row-span-3 col-span-2 items-center justify-center bg-[#2c3839] rounded-lg ml-3">
					<div className="flex items-center justify-center"> Bidders:</div>
					<div className="flex items-center justify-center">
						<ul className="ml-2">
						{
							pgs.bidders.map((bidder, index) => {
								return (
									<li key={`bidder-${bidder}`} className={`${bidTurn == bidder ? "font-bold text-[#ff9700] list-['>'] pl-1" : ""}`}>{bidder}</li>
								)
							})
						}
						</ul>
					</div>
				</div>
			</div>
			</>
		)
	}

	const generalInfo = () => {

		return (
			<>
			<div className="w-full h-[45vh] p-1 rounded-lg bg-[#2c3839] text-[1.4vw] text-[#fcfdfc]">
				{stage != "playing" &&
					<div className="h-[5vh] row-span-1 col-span-3 text-center text-[3vh] text-[#fafafa] bg-[#0092ff] rounded-lg mb-1"> {title(stage)} </div>
				}
				{stage == "playing" &&
					<div className="h-[5vh] row-span-1 col-span-3 flex justify-between items-center text-[3vh] text-[#fafafa] rounded-lg mb-1"> 
						<span>{pgs.highestBidder}:{pgs.highestBid}</span>
						<span>{title(stage)}</span>
					</div>
				}
				{
					!(pgs?.powerSuit) &&
					<div className="h-[15vh] flex items-center justify-center">
						<div className="text-center text-[#fafafa]">
							<div className="text-[2.5vh] flex items-center justify-center m-0">{pgs.highestBidder} is selecting the power suit</div>
						</div>
					</div>
				}
				{
					pgs?.powerSuit && 
					<div className="h-[15vh] flex items-center justify-center">
						<div className="text-center text-[#fafafa]">
							<div className="text-[2.5vh] flex items-center justify-center m-0">Power Suit</div>
							<div className="flex items-center justify-center m-0">
								<img src={`/assets/cards/${theme}/${pgs.powerSuit.toLowerCase()}.png`}
									alt="powerSuit {pgs.powerSuit}"
									className=" h-[10vh] object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]"
								/>
							</div>
						</div>
					</div>
				}
				{
					pgs?.partnerCards.length > 0 && 
					<div className="h-[15vh] my-2 flex items-center justify-center overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
						<div className="text-center text-[#fafafa]">
						<div className="text-[2vh] flex items-center justify-center m-0">Partners</div>
							<div className="flex items-center justify-center m-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
								{	
									pgs.partnerCards.map((partnerCard, index) => {
										return (
											<div className="p-0 bg-[#2c3839]/50 rounded-lg mx-1" key={`partnerCard-${partnerCard.number} of ${partnerCard.suit}`} >
												<img src={`/assets/cards/${theme}/${partnerCard.suit.toLowerCase()}/${partnerCard.number.toLowerCase()}.png`}
													alt="powerSuit {pgs.powerSuit}"
													className=" h-[10vh] mx-1 object-contain"
												/>
												<div className="text-[2vh] flex items-center justify-center font-bold text-[#fafafa]">{partnerCard.player}</div>
											</div>

										)
									})
								}
							</div>
						</div>
					</div>
				}
			</div>
			</>
		)
	}


	const gameOverMenu = () => {
		return (
			<>
			<div className="w-full h-[45vh] grid grid-cols-3 p-2 rounded-lg bg-[#2c3839] text-[1.4vw] text-[#fcfdfc]">
				<div className="h-[5vh] col-span-3 text-center text-[3vh] text-[#fafafa] bg-[#fe4c40] rounded-lg mb-1"> {title(stage)} </div>
				<div className="col-span-3 items-center justify-center bg-[#df9822] text-[#0d405d] font-bold rounded-lg mb-1">
					<div className="flex items-center justify-center">Winners!</div>
					<div className="flex items-center justify-center">
						<ul className="ml-2">
						{
							pgs.gameWinners.map((winner, index) => {
								return (
									<li key={`winner-${winner}`}>{winner}</li>
								)
							})
						}
						</ul>
					</div>
				</div>
				<div className="col-span-3 items-center justify-center bg-[#1c2829] text-[#fcfdfc] font-bold rounded-lg">
					<div className="flex items-center justify-center">Losers!</div>
					<div className="flex items-center justify-center">
						<ul className="ml-2">
						{
							pgs.players.filter(player => !pgs.gameWinners.includes(player)).map((loser, index) => {
								return (
									<li key={`loser-${loser}`}>{loser}</li>
								)
							})
						}
						</ul>
					</div>
				</div>
			</div>
			</>
		)
	}


	switch(stage) {
		case "auction":
			return auctionInfo()
		case "powerSuitSelection":
		case "partnerSelection":
		case "playing":
			return generalInfo()
		case "gameOver":
			return gameOverMenu()
		default:
			return <div></div>
	}
}

export default Info
