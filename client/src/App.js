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
  const [userLogin, setLogin] = useState(false);
  const [logStatus, setLogStatus] = useState("Not Logged");

  const loginStatus = (stat) => {
    setLogStatus(stat);
    setLoading(true);
    setLogin(true);
  }

  useEffect(() => {
    console.log("...calling effect");
      (async () => {
        if(window.localStorage.getItem("userId") !== null){
          try{
            console.log("user data now")
            setLoading(true);
            console.log("...making fetch call");
            const id = window.localStorage.getItem("userId")
            const taskResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/fetchTasks/${id}`);
            const taskData = await taskResponse.json();
            console.log("...updating state");
            setLoading(false);
            setTaskData(taskData);
            console.log(taskData)
            }catch(error){
        
            }
        }else{
          try{
          setLoading(true);
          console.log("Searching local Storage");
          const localTasks = window.localStorage.getItem("localTaskData");
          console.log("Updating data");
          setLoading(false);
          setTaskData(localTasks);
          } catch(error){

          }
      }
    })();
  }, [logStatus]);

  return (
    <>
    {loading ? 
    <h2>Loading...</h2>
    :
    <div className="App">
      <Router>
        <div className='pageFormat'>
          <div className='navbar'>
            <Navbar loginStatus={loginStatus}/>
          </div>
          <div className='home'>
          <Routes>
            <Route path="/" element={<Home data={taskData} isLogged={userLogin}/>} />
            <Route path="/login" element={<Login loginStatus={loginStatus}/>} />
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
