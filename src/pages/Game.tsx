import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

import logo from '/assets/logo.png'
import Card from '../components/Card';
import Auction from '../components/Auction';
import Info from '../components/Info';

const Game = () => {
	const { roomId } = useParams();
	const { state } = useLocation();

	const theme = 'default';

	const navigate = useNavigate();
	const user = state?.username;

	const [overlayOpen, setOverlayOpen] = useState(true);
	const [playerList, setPlayerList] = useState([]);
	const [publicGameState, setPublicGameState] = useState(null);
	const [playerGameState, setPlayerGameState] = useState(null);
	

	const socketRef = useRef(null);

	const handleStartGame = () => {
		socketRef.current?.emit('gameStart');
	};

	useEffect(() => {
		console.log(roomId);
		if(!user || roomId == "") {
			navigate('/');
		}

		socketRef.current = io('http://localhost:3000');
		const socket = socketRef.current;
		socket.emit('joinRoom', { roomId, name: user });


		socket.on('connect', () => {
			console.log("Connected: ", socket.id);
		});

		socket.on('disconnect', () => {
			console.log("Disconnected");
		});

		socket.on('playerList', (listOfPlayers) => {
			setPlayerList(listOfPlayers);
		});

		socket.on('gameStateUpdate', (data) => {
			setOverlayOpen(false);
			console.log(data);
			setPublicGameState(data.public);
			setPlayerGameState(data.playerGameState);
		});

		socket.on('message', (msg) => {
			console.log(msg);
		});

		socket.on('bulkMessage', (msgs)=>{});

		return () => {
		  socket.disconnect();
		};

	}, [navigate])

	return (
		<>
		<div className="hidden portrait:flex items-center justify-center h-screen">
			<h2>Please rotate your phone to landscape</h2>
		</div>

		<div className="portrait:hidden grid grid-cols-4 grid-rows-2 h-screen w-screen {overlayOpen ? 'pointer-events-none' : ''}">
			<div className="col-span-3">
			{publicGameState?.stage == "auction" && (
				<Auction />
			)}
			</div>
			
			<div className="col-span-3 overflow-hidden h-full flex flex-wrap justify-center items-center content-center p-1 gap-1">
			  {(()=>{
				const playerTurn = publicGameState?.players[playerGameState?.turnIndex] == user;
				
				return playerGameState?.hand.map((card, index) => (
				  <Card key={index}
					theme={theme}
					socket={socketRef.current}
					suit={card.suit}
					number={card.number}
					disabled={playerTurn ? false : false}//TODO: CHANGE SECOND TO TRUE
				  />
				))
			  })()}
			</div>

			<div className="col-start-4 row-start-1 row-span-2 justify-center bg-[#2c3839] p-5">
				<div className="rounded-lg bg-[#0065aa] text-[1.5rem] text-center text-[#d3e1ea] mb-2" >Room: {roomId}</div>
				<Info socket={socketRef.current} pgs={publicGameState} user={user}/>
			</div>
		</div>			

		{overlayOpen && (
		  <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
			<div className="w-full max-w-lg bg-black/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
			  <div className="flex flex-col items-center gap-6">
				<h2 className="text-white text-2xl font-bold">Player List</h2>

				<div className="w-full">
					<div className="grid grid-cols-3">
					  {playerList.map((player, index) => (
						<div 
						  key={index} 
						  className="px-3 py-4 text-center"
						>
						  <span className="text-white text-lg font-semibold">{player}</span>
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
		)}

		</>
	)
}

export default Game;
