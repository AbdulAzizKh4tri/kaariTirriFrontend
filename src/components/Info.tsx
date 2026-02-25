import {title} from "../utils.tsx"

const Info = ({socket, pgs, user, theme}) => {

	const stage = pgs?.stage ?? ""

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
									<li key={`bidder-${bidder}`} className={`${bidTurn == bidder ? "font-bold text-[#ff9700] list-['>'] pl-1" : ""}`}>{bidder == user? "YOU" : bidder}</li>
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

	const selectionsInfo = () => {

		return (
			<>
			<div className="w-full h-[45vh] p-1 rounded-lg bg-[#2c3839] text-[1.4vw] text-[#fcfdfc]">
				<div className="h-[5vh] text-center text-[3vh] text-[#fafafa] bg-[#0092ff] rounded-lg mb-1"> {title(stage)} </div>
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
									className=" h-[12vh] object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]"
								/>
							</div>
						</div>
					</div>
				}
				{
					pgs?.partners.length > 0 && 
					<div className="h-[15vh] my-2 flex items-center justify-center overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
						<div className="text-center text-[#fafafa]">
							<div className="text-[2.5vh] flex items-center justify-center m-0">Partners</div>
							<div className="flex items-center justify-center m-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
								{	
									pgs.partners.map((partner, index) => {
										return (
											<img src={`/assets/cards/${theme}/${partner.suit.toLowerCase()}/${partner.number.toLowerCase()}.png`}
												key={`partner-${partner.number} of ${partner.suit}`}
												alt="powerSuit {pgs.powerSuit}"
												className=" h-[11vh] mx-1 object-contain"
											/>
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


	switch(stage) {
		case "auction":
			return auctionInfo()
			break;
		case "powerSuitSelection":
		case "partnerSelection":
		case "playing":
			return selectionsInfo()
			break;
		default:
			return <div></div>
	}
}

export default Info
