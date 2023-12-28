import './css/App.css';
import { useState } from "react";
import { useEffect } from "react";
import { useCookies } from 'react-cookie'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Home } from './pages/home';
import { Navbar } from './components/navbar';
import { Login } from './pages/login';
import { Collections } from './pages/collections';

function App() {
  const [taskData, setTaskData] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLogin, setLogin] = useState(false);
  const [logStatus, setLogStatus] = useState("Not Logged");
  const [logExpired, ] = useCookies(["access_token"]);

  const loginStatus = (stat) => {
    setLogStatus(stat);
    setLoading(true);
    setLogin(true);
  }

  const updateTask = (data) => {
    setTaskData(data);
  }

  useEffect(() => {
    if(!logExpired.access_token){
      window.localStorage.removeItem("userId");}
    console.log("...calling effect");
      (async () => {
        if(window.localStorage.getItem("userId") !== null){
          try{
            console.log("user data now")
            setLogin(true)
            setLoading(true);
            console.log("...making fetch call");
            const id = window.localStorage.getItem("userId")
            const taskResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/fetchTasks/${id}`);
            const taskData = await taskResponse.json();
            const collectionResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/fetchCollection/${id}`);
            const collectionData = await collectionResponse.json();
            console.log("...updating state");
            setLoading(false);
            setTaskData(taskData);
            setCollectionData(collectionData)
            }catch(error){
        
            }
        }else{
          try{
          setLoading(true);
          setLogin(false)
          console.log("Searching local Storage");
          const localTasks = window.localStorage.getItem("localTaskData");
          console.log("Updating data");
          setLoading(false);
          setCollectionData()
          setTaskData(localTasks);
          } catch(error){

          }
      }
    })();
  }, [logStatus, logExpired]);

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
            <Route path="/" element={<Home data={taskData} isLogged={userLogin} updateTask={updateTask}/>} />
            <Route path="/login" element={<Login loginStatus={loginStatus}/>} />
            <Route path="/collections" element={<Collections data={collectionData} isLogged={userLogin}/>} />
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
