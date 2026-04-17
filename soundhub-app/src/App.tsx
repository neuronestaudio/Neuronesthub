import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SoundHub from './pages/SoundHub';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SoundHub />} />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
