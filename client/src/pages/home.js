import { useState } from "react";
import { useCookies } from 'react-cookie'

export const Home = (data) => {
    const [tasks, setTasks] = useState(data.data);
    const [isUserLogged, ] = useState(data.isLogged)
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [cookies, ] = useCookies(["access_token"]);
    const [filterOptn, setFiler] = useState(1)

    async function sendTask(e){
        e.preventDefault();
        if(isUserLogged)
            try{
                const userID = window.localStorage.getItem("userId");
                console.log(userID)
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/addTask`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: cookies.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        title,
                        desc,
                        })
                    });
                const task = await res.json()
                console.log(task)
                setTasks([...tasks, task])
            }catch(error){
                console.log(error)
            }
        else{
            const getLocal = window.localStorage.getItem("localTaskData");
            let nextId = 0;
            let localTask = [];
            let lastTask = [];
            if(getLocal)
                localTask = JSON.parse(window.localStorage.getItem("localTaskData"))
            let localCopy = JSON.parse(window.localStorage.getItem("localTaskData"))
            if(localCopy)
                lastTask = localCopy.pop();
            if(lastTask)
                nextId = lastTask._id + 1;

                const newTask = {
                    title: title, description: desc, _id: nextId
                }

            localTask.push(newTask)
            window.localStorage.setItem("localTaskData", JSON.stringify(localTask))
            console.log(window.localStorage.getItem("localTaskData"))
            const getUpdatedLocal = window.localStorage.getItem("localTaskData");
            setTasks(getUpdatedLocal);
            
        }

        setTitle('');
        setDesc('');
    }

    async function delTask(taskId){
        if(isUserLogged){
        await fetch(`${process.env.REACT_APP_BASE_URL}/tasks/${taskId}`, {
            method: "DELETE", headers: {auth: cookies.access_token}});

        setTasks(tasks.filter((task) => task._id !== taskId))
    }
        else{
            const delItem = JSON.parse(tasks).filter((task) => task._id !== taskId)
            window.localStorage.setItem("localTaskData", JSON.stringify(delItem))
            console.log(JSON.parse(tasks).length)
            console.log(JSON.parse(tasks).length === 0)
            if(JSON.parse(tasks).length === 1){
                window.localStorage.removeItem("localTaskData");
                setTasks(null);
            }else{
                const getUpdatedLocal = window.localStorage.getItem("localTaskData");
                setTasks(getUpdatedLocal);
            }
        }
    }

    function filterTask(action){
        const selected = document.getElementById(`${action}`)
        switch(action){
            case "filter1":
                selected.style.color = "green"
                document.getElementById("filter2").style.color = "white"
                document.getElementById("filter3").style.color = "white"
                break;
            case "filter2":
                selected.style.color = "green"
                document.getElementById("filter1").style.color = "white"
                document.getElementById("filter3").style.color = "white"
                break;
            case "filter3":
                selected.style.color = "green"
                document.getElementById("filter1").style.color = "white"
                document.getElementById("filter2").style.color = "white"
                break;
        }

    }

    return <div>
        <div className="intro">
        <h1>Checklist</h1>
            <span className="filterClass">
                <button id="filter1" style={{color: "green" }} onClick={(e) => filterTask(e.target.id)}>All Tasks</button>
                <button id="filter2" onClick={(e) => filterTask(e.target.id)}>Completed</button>
                <button id="filter3" onClick={(e) => filterTask(e.target.id)}>Incompleted</button>
            </span>
            <div className="tasks">
                {isUserLogged ?
                    tasks ? 
                        tasks.map((task)=> (
                            <li key={task._id}>
                                {task.title}
                                <button onClick={() => delTask(task._id)}>x</button>
                            </li>
                        )) : 
                        <span>Currently no tasks</span> :
                    tasks ?
                        JSON.parse(tasks).map((task)=> (
                            <li key={task._id}>
                                {task.title}
                                <button onClick={() => delTask(task._id)}>x</button>
                            </li>
                        )) :
                        <span>Currently no tasks</span>
                }
            </div>
            <div className="addTask">
                <h2>Add Task</h2>
                <form>
                    <label>Title: </label>
                    <input id="taskTitle" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                    <label>Description: </label>
                    <input id="taskDesc" value={desc} onChange={(e) => setDesc(e.target.value)}></input>
                    <button onClick={(e) => sendTask(e)}>Submit</button>
                </form>
            </div>
        </div>
    </div>
}