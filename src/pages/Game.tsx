import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

import logo from '/assets/logo.png'
import Card from '../components/Card';
import Auction from '../components/Auction';
import PowerSuitSelector from '../components/PowerSuitSelector'
import PartnerSelector from '../components/PartnerSelector'
import Round from '../components/Round'
import ChatBox from '../components/ChatBox'
import Info from '../components/Info';
import GameStartOverlay from '../components/GameStartOverlay'
import GameOver from '../components/GameOver'

import { playSound } from '../utils';

const Game = () => {
	const { roomId } = useParams();
	const { state } = useLocation();

	const theme = 'default';

	const navigate = useNavigate();
	const user = state?.username;

	const [overlayOpen, setOverlayOpen] = useState(true);
	const [memberList, setMemberList] = useState([]);
	const [publicGameState, setPublicGameState] = useState(null);
	const [playerGameState, setPlayerGameState] = useState(null);

	const [systemMessages, setSystemMessages] = useState([]);
	const [userMessages, setUserMessages] = useState([]);
	

	const socketRef = useRef(null);

	useEffect(() => {
		if(!user || roomId == "") {
			navigate('/');
		}

		socketRef.current = io(import.meta.env.VITE_SERVER_URL);

		const socket = socketRef.current;
		socket.removeAllListeners();
		socket.emit('joinRoom', { roomId, name: user });


		socket.on('connect', () => {
			console.log("Connected: ", socket.id);
		});

		socket.on('disconnect', () => {
			console.log("Disconnected");
		});

		socket.on('memberList', (listOfMembers) => {
			setMemberList(listOfMembers);
		});

		socket.on('gameStateUpdate', (data) => {
			setOverlayOpen(false);
			console.log(data);
			setPublicGameState(data.public);
			setPlayerGameState(data.playerGameState);

			if(data.public.stage == "gameOver") {

				if(data.public.gameWinners.includes(user)) {
					playSound('victory')
				} else {
					playSound('defeat')
				}

			}
		});

		socket.on('message', (msg) => {
			setSystemMessages(prev => [...prev, msg]);
			playSound('message');
		});

		socket.on('bulkMessage', (msgs) => {
			setSystemMessages(prev => [...prev, ...msgs]);
		});

		socket.on('userMessage', (msg) => {
			setUserMessages(prev => [...prev, msg]);
			playSound('userMessage');
		});

		socket.on('chatHistory', (msgs) => {
			setUserMessages(prev => [...prev, ...msgs]);
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

		<div className="portrait:hidden">
			{overlayOpen && (
				<GameStartOverlay socket={socketRef.current} memberList={memberList}/>
			)}
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
			{
				publicGameState?.stage == "gameOver" && (
					<GameOver socket={socketRef.current} user={user} pgs={publicGameState}/>
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

			<div className="h-full col-start-4 row-start-1 row-span-2 bg-[#2c3839] p-2 border-l-[2px] border-[#a56d00] pointer-events-auto">
				<div className="h-full flex flex-col bg-[#202c2d] p-1 rounded-lg gap-1">
					<div className="rounded-lg bg-[#2c3839] flex justify-center items-center text-[#fcfdfc] font-bold text-[3vh] h-[5vh] shrink-0">Room: {roomId}</div>
					<div className="h-[45vh] shrink-0">
						<Info socket={socketRef.current} pgs={publicGameState} user={user} theme={theme}/>
					</div>
					<div className="flex-1 min-h-0">
						<ChatBox socket={socketRef.current} user={user} systemMessages={systemMessages} userMessages={userMessages}/>
					</div>
				</div>
			</div>
		</div>			
		</>
	)
}

export default Game;
