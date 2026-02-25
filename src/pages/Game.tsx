import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

import logo from '/assets/logo.png'
import Card from '../components/Card';
import Auction from '../components/Auction';
import PowerSuitSelector from '../components/PowerSuitSelector'
import PartnerSelector from '../components/PartnerSelector'
import Round from '../components/Round'

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
		if(!user || roomId == "") {
			navigate('/');
		}

		socketRef.current = io('http://localhost:3000');
		const socket = socketRef.current;
		socket.removeAllListeners();
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

		socket.on('bulkMessage', (msgs)=>{
			msgs.forEach(msg => {
				console.log(msg);
			})
		});

		return () => {
		  socket.disconnect();
		};

	}, [navigate, roomId, user])

	return (
		<>
		<div className="hidden portrait:flex items-center justify-center h-screen">
			<h2>Please rotate your phone to landscape</h2>
		</div>

		<div className={`portrait:hidden grid grid-cols-4 grid-rows-2 h-screen w-screen ${overlayOpen ? 'pointer-events-none' : ''}`}>
			<div className="col-span-3 h-full flex flex-wrap justify-center items-center content-center p-1 gap-1">
			{
				publicGameState?.stage == "auction" && (
					<Auction socket={socketRef.current} pgs={publicGameState} user={user}/>
				)
			}
			{
				publicGameState?.stage == "powerSuitSelection" && (
					<PowerSuitSelector theme={theme} socket={socketRef.current} user={user} pgs={publicGameState}/>
				)
			}
			{
				publicGameState?.stage == "partnerSelection" && (
					<PartnerSelector theme={theme} socket={socketRef.current} user={user} pgs={publicGameState} hand={playerGameState?.hand}/>
				)
			}
			{
				publicGameState?.stage == "playing" && (
					<Round theme={theme} socket={socketRef.current} user={user} pgs={publicGameState}/>
				)
			}
			</div>
			
			<div className="col-span-3 h-full flex flex-wrap justify-center items-center content-center p-1 gap-1">
			  {(()=>{
				const playerTurn = publicGameState?.players[publicGameState?.turnIndex] == user;
				
				return playerGameState?.hand.map((card, index) => (
				  <Card key={`handCard-${card.suit}-${card.number}`}
					theme={theme}
					socket={socketRef.current}
					suit={card.suit}
					number={card.number}
					disabled={playerTurn ? false : true}
				  />
				))
			  })()}
			</div>

			<div className="h-full col-start-4 row-start-1 row-span-2 justify-center bg-[#2c3839] p-2 border-l-[2px] border-[#a56d00]">
				<div className="bg-[#202c2d] p-1 rounded-lg">
					<div className="rounded-lg bg-[#2c3839] flex justify-center items-center text-[#fcfdfc] mb-1 font-bold text-[3vh] h-[5vh]">Room: {roomId}</div>
					<div className="h-[45vh]">
						<Info socket={socketRef.current} pgs={publicGameState} user={user} theme={theme}/>
					</div>
				</div>
			</div>
		</div>			

		{overlayOpen && (
		  <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
			<div className="w-full max-w-lg bg-black/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
			  <div className="flex flex-col items-center gap-6">
				<h2 className="text-white font-bold">Player List</h2>

				<div className="w-full">
					<div className="grid grid-cols-3">
					  {playerList.map((player, index) => (
						<div 
						  key={`playerList-${player}`} 
						  className="px-3 py-4 text-center"
						>
						  <span className="text-white font-semibold">{player}</span>
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
