import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SoundHub from '../../src/pages/SoundHub';

function App() {
  return (
    <BrowserRouter basename="/soundhub-app">
      <Routes>
        <Route path="/" element={<SoundHub />} />
        <Route path="/:slug" element={<SoundHub />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
