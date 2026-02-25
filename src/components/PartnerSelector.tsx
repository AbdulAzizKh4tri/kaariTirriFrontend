import { useState } from  "react";
import { hasCard } from "../utils";

const PartnerSelector = ({user, socket, theme, pgs, hand}) => {

	const [overlayOpen, setOverlayOpen] = useState(false);
	const [partners, setPartners] = useState([]);

    const partnerCount = Math.ceil(pgs.playerCount / 2) - 1;

	const selectPartners = () => {
		if(partners.length < partnerCount) return
		console.log("partners: ",partners)
		socket.emit('partnersSelected', partners);
		setOverlayOpen(false);
	}


	const toggleCard = (card, isHandCard) => {
		if(isHandCard) return

		if(hasCard(partners, card)) {
			setPartners(partners.filter(partner => partner != card));
		} else {
			if(partners.length >= partnerCount) return
			setPartners([...partners, card]);
		}
	}

	//each card obj in default deck should have a clickable image that toggles on and off, 
	return(
		<>
		<div className="h-full w-full flex items-center justify-center p-5">

		{
			pgs?.highestBidder == user ?
				<button className="w-[25%] mt-1 px-4 py-3 bg-[#d70040] text-white rounded-lg font-semibold text-sm shadow-sm hover:shadow-lg"
					onClick={() => setOverlayOpen(true)}
					>
					Show Cards List
				</button>
			:
				<div className="w-[50%] flex items-center justify-center text-[1.25vw] text-[#fafafa] font-bold bg-[#2c3839] rounded-lg m-1">
					{pgs?.highestBidder} is selecting their partner(s).
				</div>

		}

		{overlayOpen && (
		  <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
			<div className="w-full h-[90vh] m-5 bg-black/90 rounded-2xl shadow-2xl p-2 flex flex-col">
			  <div className="grid grid-cols-3 items-center py-2 px-4">
				<button
				  className="justify-self-start p-2 bg-[#d70040] text- rounded-lg font-semibold text-sm"
				  onClick={() => setOverlayOpen(false)}
				>
				  Close
				</button>
				<span className="justify-self-center text-center text-[1.25vw] text-[#fafafa]">
					Partners selected: {partners.length} / {partnerCount}
				</span>
				<button
				  className="justify-self-end p-2 bg-[#00ff92] rounded-lg font-semibold text-sm"
				  onClick={() => selectPartners()}
				>
				  Select these partners
				</button>
			  </div>

			  <div className="flex-1 bg-[#1c2829] rounded-lg m-1 overflow-hidden">
				<div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-2 overflow-y-auto h-full p-2">
				  {pgs.defaultDeck.map((card, index) => {
					
					const isHandCard = hasCard(hand, card)
					const isPartner = hasCard(partners, card)
					return(
						<div 
							key={`${card.suit}-${card.number}`}
							className={`flex items-center justify-center p-1 rounded-lg 
										${isHandCard ? "bg-[#0092ff]" : ""} 
										${isPartner ? "bg-[#00ff92] cursor-pointer hover:bg-[#d70040]" : ""}
										${!isHandCard && !isPartner ? "bg-[#2c3839] cursor-pointer hover:bg-[#00ff92]" : ""}
									`}
							onClick={() => {toggleCard(card, isHandCard)}}
						>
						  <img
							src={`/assets/cards/${theme}/${card.suit.toLowerCase()}/${card.number.toLowerCase()}.png`}
							className={`w-full h-auto rounded-lg 
									${isHandCard ? 'pointer-events-none opacity-70' : 'cursor-pointer hover:-translate-y-2 transition-transform'}
								`}
							alt={`${card.suit} ${card.number}`}
						  />
						</div>
					)
				  })}
				</div>
			  </div>

			</div>
		  </div>
		)}
						
		</div>
		</>
	)
}

export default PartnerSelector;
