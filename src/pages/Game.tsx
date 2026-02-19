import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const Game = () => {
	const { roomId } = useParams();
	const { state } = useLocation();
	const navigate = useNavigate();
	const user = state?.username;

	useEffect(() => {
		console.log(roomId);
		if(!user || roomId == "") {
			navigate('/');
		}

		const socket = io('http://localhost:3000');
		socket.emit('joinRoom', { roomId, name: user });


		socket.on('connect', () => {
			console.log("Connected: ", socket.id);
		});

		socket.on('disconnect', () => {
			console.log("Disconnected");
		});

		socket.on('gameStateUpdate', (data) => {
			console.log(data);
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
	<div> 
		<h1>Hello {user}, Welcome to Game {roomId}</h1>
	</div>
	)
}

export default Game;
