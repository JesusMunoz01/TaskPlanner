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
    const [collectionTaskTitle, setCollectionTaskTitle] = useState("");
    const [collectionTaskDesc, setCollectionTaskDesc] = useState("");
    const [updtColTaskTitle, setColTaskTitle] = useState("")
    const [updtColTaskDesc, setColTaskDesc] = useState("")

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
                const userID = window.localStorage.getItem("userId");
                const res = await fetch(`${__API__}/addCollection`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: cookies.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        collectionTaskTitle,
                        collectionTaskDesc,
                        })
                    });
                const collectionTask = await res.json()
                if(collection == null)
                    console.log("Failed to create collection")
                else{
                    setCollections([...collectionTasks, collectionTask])
                    data.updateCollection(collectionTasks)
                }
            }catch(error){
                console.log(error)
            }
        }
        else{
            let nextId = 1;
            let lastCollectionTaskID = [];
            let hasPrevTasks = JSON.parse(window.localStorage.getItem("localCollectionData")).filter((col) => col._id === intCollectionID);
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
            const changeIndex = JSON.parse(window.localStorage.getItem("localCollectionData")).findIndex((col) => col._id === intCollectionID)
            currentCollectionState[changeIndex].tasks.push(newCollectionTask)
            window.localStorage.setItem("localCollectionData", JSON.stringify(currentCollectionState))
            setCurrentCollection(currentCollectionState[changeIndex])
            setCollectionTasks(currentCollectionState[changeIndex].tasks);
            //collections.updateCollection([...collectionTasks, newCollectionTask])
            // setCurrentFilter(getUpdatedLocal);
        }

        setCollectionTaskTitle('');
        setCollectionTaskDesc('');
    }

    function delCollectionTask(taskID){

    }

    function displayEdit(){

    }

    function changeStatus(){

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
                <div className="tasks">
                    {collectionTasks.length !== 0 ?
                        collectionTasks.map((colTask) => (
                            <div className="listTasks" data-testid="colTask-item" key={colTask._id}>
                                <li key={colTask._id}>
                                    <button aria-label={`delColTaskBtn${colTask._id}`} onClick={() => delTask(colTask._id)}>x</button>
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
                                        <input aria-label={`editColTaskTitle${colTask._id}`} id="colTaskTitle" value={updtColTaskTitle} onChange={(e) => updateTitle(e.target.value)}></input>
                                    </li>
                                    <li id={`colTaskSetting${colTask._id}`} style={{display:"flex"}}>
                                        <label>Edit Description:</label>
                                        <input aria-label={`editColTaskDesc${colTask._id}`} id="colTaskDesc" value={updtColTaskDesc} onChange={(e) => updateDesc(e.target.value)}></input>
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