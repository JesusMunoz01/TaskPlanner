import "../css/collectionsTasks.css"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { BsGearFill } from "react-icons/bs";

export const CollectionTasks = (collections) => {
    const [isUserLogged] = useState(collections.isLogged)
    let { collectionID } = useParams()
    let [intCollectionID] = useState(parseInt(collectionID))
    const [allCollectionTasks] = useState(collections.data);
    const [currentCollection, setCurrentCollection] = useState(fetchAndModifyCollections())
    const [collectionTasks, setCollectionTasks] = useState(currentCollection.tasks);
    const [collectionTaskTitle, setCollectionTaskTitle] = useState("");
    const [collectionTaskDesc, setCollectionTaskDesc] = useState("");

    function fetchAndModifyCollections(updateLocalInfo, updatedCurrentCollection){
        if(isUserLogged)
            return allCollectionTasks.filter((col) => col._id === intCollectionID).pop()
        else{
            if(updateLocalInfo === undefined)
                return JSON.parse(allCollectionTasks).filter((col) => col._id === intCollectionID).pop()
            else{
                let currentCollectionState = JSON.parse(allCollectionTasks)
                const changeIndex = JSON.parse(allCollectionTasks).findIndex((col) => col._id === intCollectionID)
                currentCollectionState[changeIndex] = updatedCurrentCollection;
                setCurrentCollection(currentCollectionState[changeIndex])
                console.log(currentCollection)
                window.localStorage.setItem("localCollectionData", JSON.stringify(currentCollectionState))
            }
        }  
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
            let localCollection = currentCollection;
            let lastCollectionTaskID = [];
            let hasPrevTasks = collectionTasks;
            // If there is a task, get last one, its id, and add 1
            console.log(hasPrevTasks.length)
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

            localCollection.tasks.push(newCollectionTask)
            fetchAndModifyCollections(true, localCollection.tasks)
            setCollectionTasks([...localCollection.tasks, newCollectionTask]);
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
    
    return <div>
                <h1>{currentCollection.collectionTitle}</h1>
                <div className="tasks">
                    {collectionTasks.length !== 0 ?
                        collectionTasks.map((colTask) => (
                            <div>
                                <li>
                                    <span>{colTask.title}</span>
                                </li>
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