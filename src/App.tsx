import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SoundHub from './pages/SoundHub';
import RadioApp from './pages/RadioApp';
import LandingPage from './pages/LandingPage';
import ResearchHub from './pages/ResearchHub';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/research-hub" element={<ResearchHub />} />
        <Route path="/sound-hub" element={<SoundHub />} />
        <Route path="/radio" element={<RadioApp />} />
        {/* Placeholder for individual category pages requested */}
        <Route path="/sound-hub/:slug" element={<SoundHub />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
