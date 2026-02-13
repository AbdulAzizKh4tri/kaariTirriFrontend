import logo from '/assets/logo.png'

function App() {

	const startGame = (e : any) => {
		console.log(e);
	}


	const renderPage = () => {

		return (
			<div className="min-h-screen flex items-center justify-center px-4">
				<div className="w-full max-w-md bg-black/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
					<div className="flex flex-col items-center gap-6">
						<img src={logo} alt="Kaari Tirri" className="object-contain" />

						<form className="w-full flex flex-col gap-4" onSubmit={(e) => {startGame(e)}}>
							<input
								className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#667eea]/20 transition"
								type="text"
								placeholder="Name"
								aria-label="Name"
							/>

							<input
								className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#667eea]/20 transition"
								type="text"
								placeholder="Room ID"
								aria-label="Room ID"
							/>

							<button
								type="submit"
								className="w-full mt-1 px-4 py-3 bg-[#d70040] text-white rounded-lg font-semibold text-sm shadow-sm hover:shadow-lg transform-gpu hover:-translate-y-0.5 transition"
							>
								Join Room
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	};

	return <div>{renderPage()}</div>;
}

export default App
