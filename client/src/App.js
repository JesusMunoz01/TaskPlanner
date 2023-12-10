import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Home } from './pages/home';
import { Navbar } from './components/navbar';
import { Login } from './pages/login';

function App() {
  return (
    <div className="App">
      <Router>
        <div className='pageFormat'>
          <div className='navbar'>
            <Navbar />
          </div>
          <div className='home'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
