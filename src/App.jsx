import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './pages/About';
import Questions from './pages/Questions';
import Resources from '../../src/pages/Resources';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar now always shows */}
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
