import { useState } from "react";
import { useCookies } from 'react-cookie';
import { BsGearFill } from "react-icons/bs";

export const Home = (data) => {
    const [tasks, setTasks] = useState(data.data);
    const [taskFilter, setCurrentFilter] = useState(data.data);
    const [isUserLogged, ] = useState(data.isLogged)
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [updtTitle, updateTitle] = useState("");
    const [updtDesc, updateDesc] = useState("");
    const [cookies, ] = useCookies(["access_token"]);

    async function sendTask(e){
        e.preventDefault();
        if(isUserLogged)
            try{
                const userID = window.localStorage.getItem("userId");
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/addTask`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: cookies.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        title,
                        desc,
                        status: "incomplete"
                        })
                    });
                const task = await res.json()
                if(tasks == null)
                setTasks([task])
                setTasks([...tasks, task])
                setCurrentFilter([...tasks, task])
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
            if(lastTask.length !== 0)
                nextId = lastTask._id + 1;

                const newTask = {
                    title: title, description: desc, _id: nextId, status:"incomplete"
                }

            localTask.push(newTask)
            window.localStorage.setItem("localTaskData", JSON.stringify(localTask))
            const getUpdatedLocal = window.localStorage.getItem("localTaskData");
            setTasks(getUpdatedLocal);
            setCurrentFilter(getUpdatedLocal);
        }

        setTitle('');
        setDesc('');
    }

    async function delTask(taskId){
        if(isUserLogged){
        await fetch(`${process.env.REACT_APP_BASE_URL}/tasks/${taskId}`, {
            method: "DELETE", headers: {auth: cookies.access_token}});

        setTasks(tasks.filter((task) => task._id !== taskId))
        setCurrentFilter(tasks);
    }
        else{
            const delItem = JSON.parse(tasks).filter((task) => task._id !== taskId)
            window.localStorage.setItem("localTaskData", JSON.stringify(delItem))
            if(JSON.parse(tasks).length === 1){
                window.localStorage.removeItem("localTaskData");
                setTasks(null);
                setCurrentFilter(null);
            }else{
                const getUpdatedLocal = window.localStorage.getItem("localTaskData");
                setTasks(getUpdatedLocal);
                setCurrentFilter(tasks);
            }
        }
    }

    async function changeStatus(taskStatus, taskID){
        if(isUserLogged)
            try{
                const userID = window.localStorage.getItem("userId");
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/updateTask`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: cookies.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        taskID,
                        taskStatus
                        })
                    });
                const updatedValues = await res.json()
                const index = updatedValues.findIndex((task => task._id === taskID))
                updatedValues[index].status = `${taskStatus}`
                setTasks(updatedValues)
                setCurrentFilter(updatedValues)
            }catch(error){
                console.log(error)
            }
        else{
            const localTask = JSON.parse(window.localStorage.getItem("localTaskData"))
            const index = localTask.findIndex((task => task._id === taskID))
            localTask[index].status = `${taskStatus}`
            window.localStorage.setItem("localTaskData", JSON.stringify(localTask))
            const getUpdatedLocal = window.localStorage.getItem("localTaskData");
            setTasks(getUpdatedLocal);
            setCurrentFilter(getUpdatedLocal);
        }
    }

    async function changeInfo(taskID, oldTitle, oldDesc){
        let newTitle, newDesc = "";

        if(updtTitle === "")
            newTitle = oldTitle;
        else
            newTitle = updtTitle;
        if(updtDesc === "")
            newDesc = oldDesc;
        else
            newDesc = updtDesc;

        if(isUserLogged)
            try{
                const userID = window.localStorage.getItem("userId");
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/updateTaskInfo`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: cookies.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        taskID,
                        newTitle,
                        newDesc
                        })
                    });
                const updatedValues = await res.json()
                const index = updatedValues.findIndex((task => task._id === taskID))
                updatedValues[index].title = `${newTitle}`
                updatedValues[index].description = `${newDesc}`
                setTasks(updatedValues)
                setCurrentFilter(updatedValues)
            }catch(error){
                console.log(error)
            }
        else{
            const localTask = JSON.parse(window.localStorage.getItem("localTaskData"))
            const index = localTask.findIndex((task => task._id === taskID))
            localTask[index].title = `${updtTitle}`
            localTask[index].description = `${updtDesc}`
            window.localStorage.setItem("localTaskData", JSON.stringify(localTask))
            const getUpdatedLocal = window.localStorage.getItem("localTaskData");
            setTasks(getUpdatedLocal);
            setCurrentFilter(getUpdatedLocal);
        }

        updateTitle("");
        updateDesc("");

    }

    function filterTask(action){
        const selected = document.getElementById(`${action}`)
        let data = [];
        if(!isUserLogged)
        data = JSON.parse(tasks)
        else
        data = tasks;
        switch(action){
            case "filter1": // All Tasks Filter
                selected.style.color = "green"
                document.getElementById("filter2").style.color = "white"
                document.getElementById("filter3").style.color = "white"
                isUserLogged ? 
                setCurrentFilter(data) : 
                setCurrentFilter(JSON.stringify(data));
                break;
            case "filter2": // Incomplete Tasks Filter
                selected.style.color = "green"
                document.getElementById("filter1").style.color = "white"
                document.getElementById("filter3").style.color = "white"
                isUserLogged ?
                setCurrentFilter(data.filter((task) => task.status === "complete")) :
                setCurrentFilter(JSON.stringify(data.filter((task) => task.status === "complete")))
                break;
            case "filter3": // Completed Tasks Filter
                selected.style.color = "green"
                document.getElementById("filter1").style.color = "white"
                document.getElementById("filter2").style.color = "white"
                isUserLogged ?
                setCurrentFilter(data.filter((task) => task.status === "incomplete")) :
                setCurrentFilter(JSON.stringify(data.filter((task) => task.status === "incomplete")))
                break;
            default:
                break;
        }

    }

    function displayEdit(id){
        const currentMode = document.getElementById(`setting${id}`).className
        if(currentMode === "editTask active")
            document.getElementById(`setting${id}`).className = "editTask"
        else
            document.getElementById(`setting${id}`).className = "editTask active"
    }

    return <div className="checklistHome">
        <div className="intro">
        <h1>Checklist</h1>
            <span className="filterClass">
                <button id="filter1" style={{color: "green" }} onClick={(e) => filterTask(e.target.id)}>All Tasks</button>
                <button id="filter2" onClick={(e) => filterTask(e.target.id)}>Completed</button>
                <button id="filter3" onClick={(e) => filterTask(e.target.id)}>Incomplete</button>
            </span>
            <div className="tasks">
                {isUserLogged ?
                    taskFilter ? 
                        // Section for: Logged user with tasks -------------------------------------------
                        taskFilter.map((task)=> (
                            <div className="listTasks">
                            <li key={task._id}>
                                <button onClick={() => delTask(task._id)}>x</button>
                                <input id={task._id} style={{display:"none"}} type="checkbox" onClick={() => displayEdit(task._id)}/>
                                <label id="settingsIcon" for={task._id}><BsGearFill style={{cursor:'pointer'}}></BsGearFill></label>
                                {task.title}
                                <div className="statusBox">
                                    <label id="taskState">Status: </label>
                                    <select for="taskState" value={task.status} onChange={(e) => changeStatus(e.target.value, task._id)}>
                                        <option value={"incomplete"}>Incomplete</option>
                                        <option value={"complete"}>Complete</option>
                                    </select>
                                </div>
                            </li>
                            <ul className="editTask" id={`setting${task._id}`} style={{display:"none", transition: 0.4}}>
                                <li id={`setting${task._id}`} style={{display:"flex", transition: 0.4}}>
                                    <label>Edit title:</label>
                                    <input id="taskTitle" value={updtTitle} onChange={(e) => updateTitle(e.target.value)}></input>
                                </li>
                                <li id={`setting${task._id}`} style={{display:"flex", transition: 0.4}}>
                                    <label>Edit Description:</label>
                                    <input id="taskDesc" value={updtDesc} onChange={(e) => updateDesc(e.target.value)}></input>
                                </li>
                                <button onClick={() => changeInfo(task._id, task.title, task.description)}>Save Changes</button>
                            </ul>
                        </div>
                        )) : 
                        // Section for: Logged user without tasks -------------------------------------------
                        <span>Currently no tasks</span> :
                    taskFilter ?
                        // Section for: Non-Logged user with tasks -------------------------------------------
                        JSON.parse(taskFilter).map((task)=> (
                            <div className="listTasks">
                                <li key={task._id}>
                                    <button onClick={() => delTask(task._id)}>x</button>
                                    <input id={task._id} style={{display:"none"}} type="checkbox" onClick={() => displayEdit(task._id)}/>
                                    <label id="settingsIcon" for={task._id}><BsGearFill style={{cursor:'pointer'}}></BsGearFill></label>
                                    {task.title}
                                    <div className="statusBox">
                                    <label id="taskState">Status: </label>
                                    <select for="taskState" value={task.status} onChange={(e) => changeStatus(e.target.value, task._id)}>
                                        <option value={"incomplete"}>Incomplete</option>
                                        <option value={"complete"}>Complete</option>
                                    </select>
                                    </div>
                                </li>
                                <ul className="editTask" id={`setting${task._id}`} >
                                    <li id={`setting${task._id}`} style={{display:"flex"}}>
                                        <label>Edit title:</label>
                                        <input id="taskTitle" value={updtTitle} onChange={(e) => updateTitle(e.target.value)}></input>
                                    </li>
                                    <li id={`setting${task._id}`} style={{display:"flex"}}>
                                        <label>Edit Description:</label>
                                        <input id="taskDesc" value={updtDesc} onChange={(e) => updateDesc(e.target.value)}></input>
                                    </li>
                                    <button onClick={(e) => changeInfo(task._id, task.title, task.description)}>Save Changes</button>  
                                </ul>
                            </div>
                        )) :
                        // Section for: Non-Logged user without tasks -------------------------------------------
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