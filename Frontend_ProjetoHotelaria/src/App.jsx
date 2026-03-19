import './App.css';  // Comente se não existir
import Home from './components/pages/Home';
import Contato from './components/pages/Contato';
import About from './components/pages/About';
import Hospedes from './components/pages/Hospedes';
import Quartos from './components/pages/Quartos';
import Reservas from './components/pages/Reservas';
import NavbarTWM from './components/layout/NavbarTWM';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <NavbarTWM />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/hospedes" element={<Hospedes />} />
        <Route path="/quartos" element={<Quartos />} />
        <Route path="/reservas" element={<Reservas />} />
      </Routes>
    </Router>
  );
}

export default App;