import { useState } from "react";
import { useCookies } from 'react-cookie';
import { BsGearFill } from "react-icons/bs";

export const Home = (data) => {
    const [tasks, setTasks] = useState(data.data);
    const [taskFilter, setCurrentFilter] = useState(data.data);
    const [filterType, setFilter] = useState("filter1");
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
                const res = await fetch(`${__API__}/addTask`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: cookies.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        title,
                        desc,
                        status: "Incomplete"
                        })
                    });
                const task = await res.json()
                if(tasks == null)
                setTasks([task])
                setTasks([...tasks, task])
                data.updateTask([...tasks, task])
                filterTask(filterType, [...tasks, task])
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
                    title: title, description: desc, _id: nextId, status:"Incomplete"
                }

            localTask.push(newTask)
            window.localStorage.setItem("localTaskData", JSON.stringify(localTask))
            const getUpdatedLocal = window.localStorage.getItem("localTaskData");
            setTasks(getUpdatedLocal);
            data.updateTask(getUpdatedLocal)
            filterTask(filterType, getUpdatedLocal);
        }

        setTitle('');
        setDesc('');
    }

    async function delTask(taskId){
        if(isUserLogged){
            const userID = window.localStorage.getItem("userId");
            const res = await fetch(`${__API__}/tasks/${userID}/${taskId}`, {
                method: "DELETE", headers: {auth: cookies.access_token}});
            const resData = await res.json();
            const filtered = resData.filter((task) => task._id !== taskId)
            setTasks(filtered)
            data.updateTask(filtered)
            filterTask(filterType, filtered);
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
                data.updateTask(getUpdatedLocal);
                filterTask(filterType, getUpdatedLocal);
            }
        }
    }

    async function changeStatus(taskStatus, taskID){
        if(isUserLogged)
            try{
                const userID = window.localStorage.getItem("userId");
                const res = await fetch(`${__API__}/updateTask`, {
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
                data.updateTask(updatedValues);
                filterTask(filterType, updatedValues)
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
            data.updateTask(getUpdatedLocal);
            filterTask(filterType, getUpdatedLocal);
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
                const res = await fetch(`${__API__}/updateTaskInfo`, {
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
                data.updateTask(updatedValues);
                filterTask(filterType, updatedValues);
            }catch(error){
                console.log(error)
            }
        else{
            const localTask = JSON.parse(window.localStorage.getItem("localTaskData"))
            const index = localTask.findIndex((task => task._id === taskID))
            localTask[index].title = `${updtTitle}`
            localTask[index].description = `${updtDesc}`
            localStorage.setItem("localTaskData", JSON.stringify(localTask))
            window.localStorage.setItem("localTaskData", JSON.stringify(localTask))
            const getUpdatedLocal = window.localStorage.getItem("localTaskData");
            setTasks(getUpdatedLocal);
            data.updateTask(getUpdatedLocal);
            filterTask(filterType, getUpdatedLocal);
        }

        updateTitle("");
        updateDesc("");

    }

    function filterTask(action, data){
        if(action !== filterType)
            setFilter(action);
        const selected = document.getElementById(`${action}`)
        if(!isUserLogged)
            data = JSON.parse(data)

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
                setCurrentFilter(data.filter((task) => task.status === "Complete")) :
                setCurrentFilter(JSON.stringify(data.filter((task) => task.status === "Complete")))
                break;
            case "filter3": // Completed Tasks Filter
                selected.style.color = "green"
                document.getElementById("filter1").style.color = "white"
                document.getElementById("filter2").style.color = "white"
                isUserLogged ?
                setCurrentFilter(data.filter((task) => task.status === "Incomplete")) :
                setCurrentFilter(JSON.stringify(data.filter((task) => task.status === "Incomplete")))
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
                <button id="filter1" style={{color: "green" }} onClick={(e) => filterTask(e.target.id, tasks)}>All Tasks</button>
                <button id="filter2" onClick={(e) => filterTask(e.target.id, tasks)}>Completed</button>
                <button id="filter3" onClick={(e) => filterTask(e.target.id, tasks)}>Incomplete</button>
            </span>
            <div className="tasks">
                {isUserLogged ?
                    taskFilter.length !== 0 ? 
                        // Section for: Logged user with tasks -------------------------------------------
                        taskFilter.map((task)=> (
                            <div className="listTasks" data-testid="task-item" key={task._id}>
                                <li key={task._id}>
                                    <button aria-label={`delBtn${task._id}`} onClick={() => delTask(task._id)}>x</button>
                                    <input aria-label={`editDropdown${task._id}`} id={task._id} style={{display:"none"}} type="checkbox" onClick={() => displayEdit(task._id)}/>
                                    <label id="settingsIcon" htmlFor={task._id}><BsGearFill style={{cursor:'pointer'}}></BsGearFill></label>
                                    <p aria-label={`taskTitle${task._id}`}>{task.title}</p>
                                    <div className="statusBox">
                                    <label id="taskState">Status: </label>
                                    <select aria-label="taskStatus" htmlFor="taskState" value={task.status} onChange={(e) => changeStatus(e.target.value, task._id)}>
                                        <option aria-label="incompleteStatus" value={"Incomplete"}>Incomplete</option>
                                        <option aria-label="completeStatus" value={"Complete"}>Complete</option>
                                    </select>
                                    </div>
                                </li>
                                <ul className="editTask" id={`setting${task._id}`} >
                                    <li id={`setting${task._id}`} style={{display:"flex"}}>
                                        <label>Edit title:</label>
                                        <input aria-label={`editTaskTitle${task._id}`} id="taskTitle" value={updtTitle} onChange={(e) => updateTitle(e.target.value)}></input>
                                    </li>
                                    <li id={`setting${task._id}`} style={{display:"flex"}}>
                                        <label>Edit Description:</label>
                                        <input aria-label={`editTaskDesc${task._id}`} id="taskDesc" value={updtDesc} onChange={(e) => updateDesc(e.target.value)}></input>
                                    </li>
                                    <button aria-label={`confirmEdit${task._id}`} onClick={() => changeInfo(task._id, task.title, task.description)}>Save Changes</button>  
                                </ul>
                            </div>
                        )) : 
                        // Section for: Logged user without tasks -------------------------------------------
                        <span id="noTasks">Currently no tasks</span> :
                    taskFilter ?
                        // Section for: Non-Logged user with tasks -------------------------------------------
                        JSON.parse(taskFilter).map((task)=> (
                            <div className="listTasks" data-testid="task-item" key={task._id}>
                                <li key={task._id}>
                                    <button aria-label={`delBtn${task._id}`} onClick={() => delTask(task._id)}>x</button>
                                    <input aria-label={`editDropdown${task._id}`} id={task._id} style={{display:"none"}} type="checkbox" onClick={() => displayEdit(task._id)}/>
                                    <label id="settingsIcon" htmlFor={task._id}><BsGearFill style={{cursor:'pointer'}}></BsGearFill></label>
                                    <p aria-label={`taskTitle${task._id}`}>{task.title}</p>
                                    <div className="statusBox">
                                    <label id="taskState">Status: </label>
                                    <select aria-label="taskStatus" htmlFor="taskState" value={task.status} onChange={(e) => changeStatus(e.target.value, task._id)}>
                                        <option aria-label="incompleteStatus" value={"Incomplete"}>Incomplete</option>
                                        <option aria-label="completeStatus" value={"Complete"}>Complete</option>
                                    </select>
                                    </div>
                                </li>
                                <ul className="editTask" id={`setting${task._id}`} >
                                    <li id={`setting${task._id}`} style={{display:"flex"}}>
                                        <label>Edit title:</label>
                                        <input aria-label={`editTaskTitle${task._id}`} id="taskTitle" value={updtTitle} onChange={(e) => updateTitle(e.target.value)}></input>
                                    </li>
                                    <li id={`setting${task._id}`} style={{display:"flex"}}>
                                        <label>Edit Description:</label>
                                        <input aria-label={`editTaskDesc${task._id}`} id="taskDesc" value={updtDesc} onChange={(e) => updateDesc(e.target.value)}></input>
                                    </li>
                                    <button aria-label={`confirmEdit${task._id}`} onClick={() => changeInfo(task._id, task.title, task.description)}>Save Changes</button>  
                                </ul>
                            </div>
                        )) :
                        // Section for: Non-Logged user without tasks -------------------------------------------
                        <span id="noTasks">Currently no tasks</span>
                }
            </div>
            <div className="addTask">
                <h2>Add Task</h2>
                <form>
                    <label>Title: </label>
                    <input aria-label="addTaskTitle" id="taskTitle" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                    <label>Description: </label>
                    <input aria-label="addTaskDesc" id="taskDesc" value={desc} onChange={(e) => setDesc(e.target.value)}></input>
                    <button aria-label="confirmAdd" onClick={(e) => sendTask(e)}>Submit</button>
                </form>
            </div>
        </div>
    </div>
}