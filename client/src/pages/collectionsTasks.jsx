import "../css/collectionsTasks.css"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { BsGearFill } from "react-icons/bs";
import { useCookies } from 'react-cookie';

export const CollectionTasks = (collections) => {
    let { collectionID } = useParams()
    let [intCollectionID] = useState(parseInt(collectionID))
    const [isUserLogged] = useState(collections.isLogged)
    const [allCollectionTasks] = useState(collections.data);
    const [currentCollectionIndex] = useState(getThisCollectionIndex())
    const [currentCollection, setCurrentCollection] = useState(fetchCollections()[currentCollectionIndex])
    const [collectionTasks, setCollectionTasks] = useState(currentCollection.tasks);
    const [filterType, setFilter] = useState("filter1");
    const [collectionTasksFilter, setCurrentFilter] = useState(currentCollection.tasks);
    const [collectionTaskTitle, setCollectionTaskTitle] = useState("");
    const [collectionTaskDesc, setCollectionTaskDesc] = useState("");
    const [updtColTaskTitle, updateColTaskTitle] = useState("")
    const [updtColTaskDesc, updateColTaskDesc] = useState("")
    const [check] = useCookies(["access_token"]);

    function getThisCollectionIndex(){
        if(isUserLogged){
            return intCollectionID;
        }
        else{
            const thisCollectionIndex = JSON.parse(window.localStorage.getItem("localCollectionData")).findIndex((col) => col._id === intCollectionID);
            return thisCollectionIndex;
        }        
    }

    function fetchCollections(){
        if(isUserLogged){
            return allCollectionTasks;
        }
        else{
            return JSON.parse(window.localStorage.getItem("localCollectionData"))
        }
    }

    async function addCollectionTask(e){
        e.preventDefault()    
        if(isUserLogged){
            try{
                const userID = window.localStorage.getItem("userId");
                const res = await fetch(`${__API__}/addCollection/newTask`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: check.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        currentCollectionIndex,
                        collectionTaskTitle,
                        collectionTaskDesc,
                        status: "Incomplete"
                        })
                    });
                const collection = await res.json()
                if(collection == null)
                    console.log("Failed to create collection")
                else{
                    let collectionsData = fetchCollections();
                    collectionsData[currentCollectionIndex] = collection;
                    setCurrentCollection(collection);
                    setCollectionTasks(collection.tasks)
                    filterTask(filterType, collection.tasks)
                    collections.updateCollection(collectionsData)
                }
            }catch(error){
                console.log(error)
            }
        }
        else{
            let collectionsData = fetchCollections();
            let nextId = 1;
            let lastCollectionTaskID = [];
            let hasPrevTasks = fetchCollections()[currentCollectionIndex].tasks;
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
            
            collectionsData[currentCollectionIndex].tasks.push(newCollectionTask)
            window.localStorage.setItem("localCollectionData", JSON.stringify(collectionsData))
            setCurrentCollection(collectionsData[currentCollectionIndex])
            setCollectionTasks(collectionsData[currentCollectionIndex].tasks);
            filterTask(filterType, collectionsData[currentCollectionIndex].tasks)
            collections.updateCollection(collectionsData)
        }

        setCollectionTaskTitle('');
        setCollectionTaskDesc('');
    }

    async function delCollectionTask(taskID){
        if(isUserLogged){
            const userID = window.localStorage.getItem("userId");
            const collectionID = currentCollection._id;
            await fetch(`${__API__}/deleteCollection/${userID}/${collectionID}/tasks/${taskID}`, {
                method: "DELETE", headers: {auth: check.access_token}, 
            });
            const deletedItem = collectionTasks.filter((task) => task._id !== taskID);
            let collectionsData = fetchCollections();
            collectionsData[currentCollectionIndex].tasks = deletedItem;
            setCollectionTasks(deletedItem)
            currentCollection.tasks = deletedItem;
            setCurrentCollection(currentCollection);
            filterTask(filterType, deletedItem);
            collections.updateCollection(collectionsData)
        }
        else{
            let collectionsData = fetchCollections();
            const newList = collectionsData[currentCollectionIndex].tasks.filter((task) => task._id !== taskID)
            collectionsData[currentCollectionIndex].tasks = newList;
            window.localStorage.setItem("localCollectionData", JSON.stringify(collectionsData))
            setCurrentCollection(collectionsData[currentCollectionIndex])
            setCollectionTasks(collectionsData[currentCollectionIndex].tasks);
            filterTask(filterType, collectionsData[currentCollectionIndex].tasks)
            collections.updateCollection(collectionsData)
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
                const userID = window.localStorage.getItem("userId");
                const collectionID = currentCollection._id;
                const res = await fetch(`${__API__}/updateCollection/task/data`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: check.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        intCollectionID,
                        collectionID,
                        taskID,
                        newTitle,
                        newDesc
                        })
                    });
                const updatedValues = await res.json()
                let collectionsData = fetchCollections();
                const index = updatedValues.tasks.findIndex((task => task._id === taskID))
                updatedValues.tasks[index].title = `${newTitle}`
                updatedValues.tasks[index].description = `${newDesc}`
                collectionsData[currentCollectionIndex] = updatedValues;
                setCollectionTasks(updatedValues.tasks)
                setCurrentCollection(updatedValues);
                filterTask(filterType, updatedValues.tasks)
                collections.updateCollection(collectionsData);
            }catch(error){
                console.log(error)
            }
        else{
            let collectionsData = fetchCollections();
            const index = collectionsData[currentCollectionIndex].tasks.findIndex((task => task._id === taskID))
            collectionsData[currentCollectionIndex].tasks[index].title = `${newTitle}`
            collectionsData[currentCollectionIndex].tasks[index].description = `${newDesc}`
            window.localStorage.setItem("localCollectionData", JSON.stringify(collectionsData))
            setCurrentCollection(collectionsData[currentCollectionIndex]);
            setCollectionTasks(collectionsData[currentCollectionIndex].tasks);
            filterTask(filterType, collectionsData[currentCollectionIndex].tasks)
            //data.updateTask(getUpdatedLocal);
        }

        updateColTaskTitle("");
        updateColTaskDesc("");

    }

    async function changeStatus(taskStatus, taskID){
        if(isUserLogged)
            try{
                const userID = window.localStorage.getItem("userId");
                const collectionID = currentCollection._id;
                const res = await fetch(`${__API__}/updateCollection/task/status`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: check.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        collectionID,
                        intCollectionID,
                        taskID,
                        taskStatus
                        })
                    });
                const updatedValues = await res.json()
                let collectionsData = fetchCollections();
                const index = updatedValues.tasks.findIndex((task => task._id === taskID))
                updatedValues.tasks[index].status = `${taskStatus}`
                collectionsData[currentCollectionIndex] = updatedValues;
                setCollectionTasks(updatedValues.tasks)
                setCurrentCollection(updatedValues);
                filterTask(filterType, updatedValues.tasks)
                collections.updateCollection(collectionsData);
            }catch(error){
                console.log(error)
            }
        else{
            let collectionsData = fetchCollections();
            const index = currentCollection.tasks.findIndex((task => task._id === taskID))
            collectionsData[currentCollectionIndex].tasks[index].status = `${taskStatus}`
            window.localStorage.setItem("localCollectionData", JSON.stringify(collectionsData))
            setCurrentCollection(collectionsData[currentCollectionIndex])
            setCollectionTasks(collectionsData[currentCollectionIndex].tasks);
            filterTask(filterType, collectionsData[currentCollectionIndex].tasks)
            //data.updateTask(getUpdatedLocal);
            if(taskStatus == "Complete"){
                let completedTasks = 1;
                collectionTasks.map((task) => {
                    if(task.status === "Complete")
                        completedTasks++;
                })
                if(completedTasks === currentCollection.tasks.length){
                    collectionsData[currentCollectionIndex].status = "Complete";
                    window.localStorage.setItem("localCollectionData", JSON.stringify(collectionsData));
                }
            }
            else{
                if(collectionsData[currentCollectionIndex].status === "Complete"){
                    collectionsData[currentCollectionIndex].status = "Incomplete";
                    window.localStorage.setItem("localCollectionData", JSON.stringify(collectionsData));
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
    
    return <div className="colTaskPage">
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
                        <input aria-label="addColTaskTitle" id="taskTitle" value={collectionTaskTitle} onChange={(e) => setCollectionTaskTitle(e.target.value)}></input>
                        <label>Description: </label>
                        <input aria-label="addColTaskDesc" id="taskDesc" value={collectionTaskDesc} onChange={(e) => setCollectionTaskDesc(e.target.value)}></input>
                        <button aria-label="confirmColTaskAdd" onClick={(e) => addCollectionTask(e)}>Submit</button>
                    </form>
                </div>
                
            </div>
}