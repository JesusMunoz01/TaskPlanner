import "../css/collectionsTasks.css"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { BsGearFill } from "react-icons/bs";

export const CollectionTasks = (collections) => {
    const [isUserLogged] = useState(collections.isLogged)
    let { collectionID } = useParams()
    let [intCollectionID] = useState(parseInt(collectionID))
    const [allCollectionTasks] = useState(collections.data);
    const [currentCollection, setCurrentCollection] = useState(fetchCurrentCollection())
    const [collectionTasks, setCollectionTasks] = useState(currentCollection.tasks);
    const [collectionTasksFilter, setCurrentFilter] = useState(currentCollection.tasks);
    const [filterType, setFilter] = useState("");
    const [collectionTaskTitle, setCollectionTaskTitle] = useState("");
    const [collectionTaskDesc, setCollectionTaskDesc] = useState("");
    const [updtColTaskTitle, updateColTaskTitle] = useState("")
    const [updtColTaskDesc, updateColTaskDesc] = useState("")

    function fetchCurrentCollection(){
        if(isUserLogged)
            return allCollectionTasks.filter((col) => col._id === intCollectionID).pop()
        else
            return JSON.parse(allCollectionTasks).filter((col) => col._id === intCollectionID).pop()
    }

    async function addCollectionTask(e){
        e.preventDefault()
        if(isUserLogged){
            try{
                // const userID = window.localStorage.getItem("userId");
                // const res = await fetch(`${__API__}/addCollection`, {
                //     method: "POST", headers: {
                //         'Content-Type': 'application/json',
                //         auth: cookies.access_token
                //     },
                //     body: JSON.stringify({
                //         userID,
                //         collectionTaskTitle,
                //         collectionTaskDesc,
                //         })
                //     });
                // const collectionTask = await res.json()
                // if(collection == null)
                //     console.log("Failed to create collection")
                // else{
                //     setCollections([...collectionTasks, collectionTask])
                //     data.updateCollection(collectionTasks)
                // }
            }catch(error){
                console.log(error)
            }
        }
        else{
            let nextId = 1;
            let lastCollectionTaskID = [];
            const changeIndex = JSON.parse(window.localStorage.getItem("localCollectionData")).findIndex((col) => col._id === intCollectionID)
            let hasPrevTasks = JSON.parse(window.localStorage.getItem("localCollectionData"))[changeIndex].tasks
            // If there is a task, get last one, its id, and add 1
            if(hasPrevTasks.length !== 0)
                lastCollectionTaskID = hasPrevTasks.pop();
            if(lastCollectionTaskID.length !== 0)
                nextId = lastCollectionTaskID._id + 1;

            const newCollectionTask = {
                title: collectionTaskTitle, 
                description: collectionTaskDesc,
                _id: nextId, 
                status:"Incomplete"
            }
            
            let currentCollectionState = JSON.parse(window.localStorage.getItem("localCollectionData"))
            currentCollectionState[changeIndex].tasks.push(newCollectionTask)
            window.localStorage.setItem("localCollectionData", JSON.stringify(currentCollectionState))
            setCurrentCollection(currentCollectionState[changeIndex])
            setCollectionTasks(currentCollectionState[changeIndex].tasks);
            filterTask(filterType, currentCollectionState[changeIndex].tasks)
            //collections.updateCollection([...collectionTasks, newCollectionTask])
        }

        setCollectionTaskTitle('');
        setCollectionTaskDesc('');
    }

    async function delCollectionTask(taskID){
        if(isUserLogged){
            // await fetch(`${__API__}/tasks/${taskId}`, {
            //     method: "DELETE", headers: {auth: cookies.access_token}});
    
            // setTasks(tasks.filter((task) => task._id !== taskId))
            // data.updateTask(tasks.filter((task) => task._id !== taskId))
            // setCurrentFilter(tasks);
        }
        else{
            let currentCollectionState = JSON.parse(window.localStorage.getItem("localCollectionData"))
            const changeIndex = JSON.parse(window.localStorage.getItem("localCollectionData")).findIndex((col) => col._id === intCollectionID)
            const newList = currentCollectionState[changeIndex].tasks.filter((task) => task._id !== taskID)
            currentCollectionState[changeIndex].tasks = newList;
            window.localStorage.setItem("localCollectionData", JSON.stringify(currentCollectionState))
            setCurrentCollection(currentCollectionState[changeIndex])
            setCollectionTasks(currentCollectionState[changeIndex].tasks);
            filterTask(filterType, currentCollectionState[changeIndex].tasks)
            //data.updateTask(getUpdatedLocal);
            }
        }
    
    async function changeInfo(taskID, oldTitle, oldDesc){
        let newTitle, newDesc = "";

        if(updtColTaskTitle === "")
            newTitle = oldTitle;
        else
            newTitle = updtColTaskTitle;
        if(updtColTaskDesc === "")
            newDesc = oldDesc;
        else
            newDesc = updtColTaskDesc;

        if(isUserLogged)
            try{
                // const userID = window.localStorage.getItem("userId");
                // const res = await fetch(`${__API__}/updateTaskInfo`, {
                //     method: "POST", headers: {
                //         'Content-Type': 'application/json',
                //         auth: cookies.access_token
                //     },
                //     body: JSON.stringify({
                //         userID,
                //         taskID,
                //         newTitle,
                //         newDesc
                //         })
                //     });
                // const updatedValues = await res.json()
                // const index = updatedValues.findIndex((task => task._id === taskID))
                // updatedValues[index].title = `${newTitle}`
                // updatedValues[index].description = `${newDesc}`
                // setTasks(updatedValues)
                // data.updateTask(updatedValues);
                // setCurrentFilter(updatedValues);
            }catch(error){
                console.log(error)
            }
        else{
            let currentCollectionState = JSON.parse(window.localStorage.getItem("localCollectionData"))
            const changeIndex = JSON.parse(window.localStorage.getItem("localCollectionData")).findIndex((col) => col._id === intCollectionID)
            const index = currentCollectionState[changeIndex].tasks.findIndex((task => task._id === taskID))
            currentCollectionState[changeIndex].tasks[index].title = `${newTitle}`
            currentCollectionState[changeIndex].tasks[index].description = `${newDesc}`
            window.localStorage.setItem("localCollectionData", JSON.stringify(currentCollectionState))
            setCurrentCollection(currentCollectionState[changeIndex]);
            setCollectionTasks(currentCollectionState[changeIndex].tasks);
            filterTask(filterType, currentCollectionState[changeIndex].tasks)
            //data.updateTask(getUpdatedLocal);
        }

        updateTitle("");
        updateDesc("");

    }

    async function changeStatus(taskStatus, taskID){
        if(isUserLogged)
            try{
                // const userID = window.localStorage.getItem("userId");
                // const res = await fetch(`${__API__}/updateTask`, {
                //     method: "POST", headers: {
                //         'Content-Type': 'application/json',
                //         auth: cookies.access_token
                //     },
                //     body: JSON.stringify({
                //         userID,
                //         taskID,
                //         taskStatus
                //         })
                //     });
                // const updatedValues = await res.json()
                // const index = updatedValues.findIndex((task => task._id === taskID))
                // updatedValues[index].status = `${taskStatus}`
                // setTasks(updatedValues)
                // data.updateTask(updatedValues);
                // setCurrentFilter(updatedValues)
            }catch(error){
                console.log(error)
            }
        else{
            let currentCollectionState = JSON.parse(window.localStorage.getItem("localCollectionData"));
            const changeIndex = JSON.parse(window.localStorage.getItem("localCollectionData")).findIndex((col) => col._id === intCollectionID);
            const index = currentCollection.tasks.findIndex((task => task._id === taskID))
            currentCollectionState[changeIndex].tasks[index].status = `${taskStatus}`
            window.localStorage.setItem("localCollectionData", JSON.stringify(currentCollectionState))
            setCurrentCollection(currentCollectionState[changeIndex])
            setCollectionTasks(currentCollectionState[changeIndex].tasks);
            filterTask(filterType, currentCollectionState[changeIndex].tasks)
            //data.updateTask(getUpdatedLocal);
            if(taskStatus == "Complete"){
                let completedTasks = 1;
                collectionTasks.map((task) => {
                    if(task.status === "Complete")
                        completedTasks++;
                })
                if(completedTasks === currentCollection.tasks.length){
                    currentCollectionState[changeIndex].status = "Complete";
                    window.localStorage.setItem("localCollectionData", JSON.stringify(currentCollectionState));
                }
            }
            else{
                if(currentCollectionState[changeIndex].status === "Complete"){
                    currentCollectionState[changeIndex].status = "Incomplete";
                    window.localStorage.setItem("localCollectionData", JSON.stringify(currentCollectionState));
                }
            }
        }
    }

    function filterTask(action, data){
        if(action !== filterType)
            setFilter(action);
        const selected = document.getElementById(`${action}`)
        switch(action){
            case "filter1": // All Tasks Filter
                selected.style.color = "green"
                document.getElementById("filter2").style.color = "white"
                document.getElementById("filter3").style.color = "white"
                setCurrentFilter(data)
                break;
            case "filter2": // Incomplete Tasks Filter
                selected.style.color = "green"
                document.getElementById("filter1").style.color = "white"
                document.getElementById("filter3").style.color = "white"
                setCurrentFilter(data.filter((task) => task.status === "Complete"))
                break;
            case "filter3": // Completed Tasks Filter
                selected.style.color = "green"
                document.getElementById("filter1").style.color = "white"
                document.getElementById("filter2").style.color = "white"
                setCurrentFilter(data.filter((task) => task.status === "Incomplete"))
                break;
            default:
                break;
        }

    }

    function displayEdit(id){
        const currentMode = document.getElementById(`colTaskSetting${id}`).className
        if(currentMode === "editColTask active")
            document.getElementById(`colTaskSetting${id}`).className = "editColTask"
        else
            document.getElementById(`colTaskSetting${id}`).className = "editColTask active"
    }
    
    return <div>
                <h1>{currentCollection.collectionTitle}</h1>
                <span className="filterClass">
                    <button id="filter1" style={{color: "green" }} onClick={(e) => filterTask(e.target.id, collectionTasks)}>All Tasks</button>
                    <button id="filter2" onClick={(e) => filterTask(e.target.id, collectionTasks)}>Completed</button>
                    <button id="filter3" onClick={(e) => filterTask(e.target.id, collectionTasks)}>Incomplete</button>
                </span>
                <div className="tasks">
                    {collectionTasksFilter.length !== 0 ?
                        collectionTasksFilter.map((colTask) => (
                            <div className="listTasks" data-testid="colTask-item" key={colTask._id}>
                                <li key={colTask._id}>
                                    <button aria-label={`delColTaskBtn${colTask._id}`} onClick={() => delCollectionTask(colTask._id)}>x</button>
                                    <input aria-label={`editColTaskDropdown${colTask._id}`} id={colTask._id} style={{display:"none"}} type="checkbox" onClick={() => displayEdit(colTask._id)}/>
                                    <label id="colTaskSettingsIcon" htmlFor={colTask._id}><BsGearFill style={{cursor:'pointer'}}></BsGearFill></label>
                                    <p aria-label={`colTaskTitle${colTask._id}`}>{colTask.title}</p>
                                    <div className="colTaskStatusBox">
                                    <label id="colTaskState">Status: </label>
                                    <select aria-label="colTaskStatus" htmlFor="colTaskState" value={colTask.status} onChange={(e) => changeStatus(e.target.value, colTask._id)}>
                                        <option aria-label="incompleteColTaskStatus" value={"Incomplete"}>Incomplete</option>
                                        <option aria-label="completeColTaskStatus" value={"Complete"}>Complete</option>
                                    </select>
                                    </div>
                                </li>
                                <ul className="editColTask" id={`colTaskSetting${colTask._id}`} >
                                    <li id={`setting${colTask._id}`} style={{display:"flex"}}>
                                        <label>Edit title:</label>
                                        <input aria-label={`editColTaskTitle${colTask._id}`} id="colTaskTitle" value={updtColTaskTitle} onChange={(e) => updateColTaskTitle(e.target.value)}></input>
                                    </li>
                                    <li id={`colTaskSetting${colTask._id}`} style={{display:"flex"}}>
                                        <label>Edit Description:</label>
                                        <input aria-label={`editColTaskDesc${colTask._id}`} id="colTaskDesc" value={updtColTaskDesc} onChange={(e) => updateColTaskDesc(e.target.value)}></input>
                                    </li>
                                    <button aria-label={`confirmColTaskEdit${colTask._id}`} onClick={() => changeInfo(colTask._id, colTask.title, colTask.description)}>Save Changes</button>  
                                </ul>
                            </div>
                        ))
                        :
                        <span id="noTasks">Currently no tasks in this collection</span>
                    }
                </div>
                <div className="addTask">
                    <h2>Add Task</h2>
                    <form>
                        <label>Title: </label>
                        <input aria-label="addTaskTitle" id="taskTitle" value={collectionTaskTitle} onChange={(e) => setCollectionTaskTitle(e.target.value)}></input>
                        <label>Description: </label>
                        <input aria-label="addTaskDesc" id="taskDesc" value={collectionTaskDesc} onChange={(e) => setCollectionTaskDesc(e.target.value)}></input>
                        <button aria-label="confirmAdd" onClick={(e) => addCollectionTask(e)}>Submit</button>
                    </form>
                </div>
                
            </div>
}