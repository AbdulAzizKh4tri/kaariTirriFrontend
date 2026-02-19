import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PreLobby from './pages/PreLobby.tsx';
import Game from './pages/Game.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PreLobby/>} />
        <Route path="/game/:roomId" element={<Game/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
