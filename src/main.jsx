import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Questions from './pages/Questions.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Resources from './pages/Resources.jsx'; // import Resources

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<About />} />  
        <Route path="questions" element={<Questions />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="resources" element={<Resources />} />  {/* added Resources */}
      </Route>
    </Routes>
  </BrowserRouter>
);
