import './App.css';
import { useState } from "react";
import { useEffect } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Home } from './pages/home';
import { Navbar } from './components/navbar';
import { Login } from './pages/login';

function App() {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("...calling effect");
      (async () => {
        try{
        setLoading(true);
        console.log("...making fetch call");
        const taskResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/fetchTasks`);
        const taskData = await taskResponse.json();
        console.log("...updating state");
        setLoading(false);
        setTaskData(taskData);
      } catch(error){

      }
    })();
  }, []);

  return (
    <>
    {loading ? 
    <h2>Loading...</h2>
    :
    <div className="App">
      <Router>
        <div className='pageFormat'>
          <div className='navbar'>
            <Navbar />
          </div>
          <div className='home'>
          <Routes>
            <Route path="/" element={<Home data={taskData}/>} />
            <Route path="/login" element={<Login />} />
          </Routes>
          </div>
        </div>
      </Router>
    </div>
    }
    </>
  );
}

export default App;
