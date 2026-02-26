import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PreLobby from './pages/PreLobby';
import Game from './pages/Game';

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
