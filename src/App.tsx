import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SoundHub from './pages/SoundHub';
import RadioApp from './pages/RadioApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/sound-hub" replace />} />
        <Route path="/sound-hub" element={<SoundHub />} />
        <Route path="/radio" element={<RadioApp />} />
        {/* Placeholder for individual category pages requested */}
        <Route path="/sound-hub/:slug" element={<SoundHub />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
