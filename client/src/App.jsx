import './css/App.css';
import { useState } from "react";
import { useEffect } from "react";
import { useCookies } from 'react-cookie'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Home } from './pages/home';
import { Navbar } from './components/navbar';
import { Login } from './pages/login';
import { Collections } from './pages/collections';
import { CollectionTasks } from './pages/collectionsTasks';
import { Landing } from './pages/landing';

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
  const updateCollection = (data) => {
    setCollectionData(data);
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
            const taskResponse = await fetch(`${__API__}/fetchTasks/${id}`);
            const taskData = await taskResponse.json();
            const collectionResponse = await fetch(`${__API__}/fetchCollection/${id}`);
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
          const localCollection = window.localStorage.getItem("localCollectionData");
          console.log("Updating data");
          setLoading(false);
          setCollectionData(localCollection)
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
            <Route path="/landing" element={<Landing/>}/>
            <Route path="/" element={<Home data={taskData} isLogged={userLogin} updateTask={updateTask}/>} />
            <Route path="/login" element={<Login loginStatus={loginStatus}/>} />
            <Route path="/collections" element={<Collections data={collectionData} isLogged={userLogin} updateCollection={updateCollection}/>} />
            <Route path="/collections/:collectionID" element={<CollectionTasks data={collectionData} isLogged={userLogin} updateCollection={updateCollection}/>}/>
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
