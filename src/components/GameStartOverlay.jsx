const GameStartOverlay = ({memberList, socket}) => {

	const handleStartGame = () => {
		socket.emit('gameStart');
	};

	return (
     	  <div className="fixed top-0 left-0 bottom-0 w-3/4 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
			<div className="w-full max-w-lg bg-black/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
			  <div className="flex flex-col items-center gap-6">
				<h2 className="text-white font-bold">Member List</h2>

				<div className="w-full">
					<div className="grid grid-cols-3">
					  {memberList.map((member, index) => (
						<div 
						  key={`memberList-${member}`} 
						  className="px-3 py-4 text-center"
						>
						  <span className="text-white font-semibold">{member}</span>
						</div>
					  ))}
					</div>
				  </div>

				<button
				  onClick={handleStartGame}
				  className="w-full mt-1 px-4 py-3 bg-[#d70040] text-white rounded-lg font-semibold text-sm shadow-sm hover:shadow-lg"
				>
				Start Game
				</button>
			  </div>
			</div>
		  </div>
	)
}

export default GameStartOverlay
