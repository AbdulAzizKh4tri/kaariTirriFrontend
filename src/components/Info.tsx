import {title} from "../utils.tsx"

const Info = ({socket, pgs, user}) => {
	//PGS = Public Game State
	//
	const stage = pgs?.stage ?? ""

	const auctionInfo = () => {
		const bidTurn = pgs.bidders[pgs.currentBidIndex] ?? ""

		return (
			<>
			<div className="w-full grid grid-cols-3 grid-rows-4 my-2 p-2 rounded-lg bg-[#0d405d] text-[#d3e1ea]">
				<div className="row-span-1 col-span-3 text-center text-[4vh]"> {title(stage)} </div>
				<div className="row-span-2 col-span-1 items-center justify-center">
					<div className="flex items-center justify-center">
					Highest:</div>
					<div className="bg-[#203e9e] rounded-lg flex items-center justify-center">
						<span>{pgs.highestBid} </span>
						<span>{pgs.highestBid ? `by ${pgs.highestBidder}` : ""}</span>
					</div>
				</div>
				<div className="row-span-2 col-span-2 items-center justify-center">
					<div className="flex items-center justify-center">
					Bidders:</div>
					<div className="flex items-center justify-center">
						<ul className="">
						{
							pgs.bidders.map((bidder, index) => {
								return (
									<li key={bidder} className={`${bidTurn == bidder ? "font-bold list-['>'] pl-2" : ""}`}>{bidder}</li>
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

	const playerTurn = pgs?.players[pgs?.turnIndex] ?? ""

	switch(stage) {
		case "auction":
			return auctionInfo()
			break;
		default:
			return <div></div>
	}
}

export default Info
