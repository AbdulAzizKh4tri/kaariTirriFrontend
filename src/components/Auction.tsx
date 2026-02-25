import { useState, useEffect } from "react";

const Auction = ({socket, pgs, user}) => {

	const [bid, setBid] = useState(pgs.highestBid + 5);
	useEffect(() => {
	  setBid(pgs.highestBid + 5);
	}, [pgs.highestBid]);

	const increaseBid = () => {
		if(bid == 250) return
		setBid(bid + 5);
	}

	const decreaseBid = () => {
		if(bid == 125 || bid == pgs.highestBid + 5) return
		setBid(bid - 5);
	}

	const placeBid = () => {
		socket.emit('bidPlaced', bid);
	}

	const passBidding = () => {
		socket.emit('bidPlaced', 0);
	}

	return (
		<div className="h-full w-full flex items-center justify-center p-1">
			<div className="grid grid-cols-2 grid-rows-5 p-2 bg-[#202020] bg-opacity-20 rounded-lg w-[40%] h-[90%]">
				<div className="col-span-2 flex items-center justify-center text-[1.25vw] text-[#fafafa] font-bold bg-[#2c3839] rounded-lg m-1"> Auction </div>
				<div className="col-span-1 row-span-2 flex items-center justify-center text-center text-[1.25vw] text-[#fafafa] bg-[#2c3839] rounded-lg m-1"> 
					Highest Bid<br/>{pgs.highestBid == 0? "None" : pgs.highestBid}
				</div>
				<div className="col-span-1 row-span-2 flex items-center justify-center text-center text-[1.25vw] text-[#fafafa] bg-[#2c3839] rounded-lg m-1"> 
					Highest Bidder<br/>{pgs.highestBidder == null ? "None" : pgs.highestBidder}
				</div>

				<div className="col-span-2 flex items-center justify-center bg-[#2c3839] rounded-lg m-1"> 
					<button className="mx-2 w-[10%] h-[90%] bg-[#1c2829] rounded-lg text-[#ff9700] text-[3vh]" onClick={decreaseBid}>-</button>
					<div className="mx-2 w-[60%] h-[90%] bg-[#3c4849] rounded-lg text-[#fafafa] text-[3vh] font-bold flex items-center justify-center">{bid}</div>
					<button className="mx-2 w-[10%] h-[90%] bg-[#1c2829] rounded-lg text-[#ff9700] text-[3vh]" onClick={increaseBid}>+</button>
				</div>

				<button className="col-span-1 flex items-center justify-center text-[1.5vw] text-[#fafafa] bg-[#fe4c40] rounded-lg m-1" 
						onClick={passBidding}>Pass</button>
				<button className="col-span-1 flex items-center justify-center text-[1.5vw] text-[#fafafa] bg-[#0092ff] rounded-lg m-1" 
						onClick={placeBid}>Bid</button>
			</div>
		</div>
	)
}

export default Auction;
