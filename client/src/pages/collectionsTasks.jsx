import "../css/collectionsTasks.css"
import { useState } from "react"
import { useParams } from "react-router-dom"

export const CollectionTasks = (collections) => {
    const [isUserLogged] = useState(collections.isLogged)
    let { collectionID } = useParams()
    let [intCollectionID] = useState(parseInt(collectionID))
    const [allCollectionTasks] = useState(collections.data);
    const [currentCollection] = useState(checkLog())
    const [collectionTasks, setCollectionTasks] = useState(currentCollection.tasks);

    function checkLog(){
        if(isUserLogged)
        return allCollectionTasks.filter((col) => col._id === intCollectionID).pop()
        else
        return JSON.parse(allCollectionTasks).filter((col) => col._id === intCollectionID).pop()
    }
    
    return <div>
                <h1>{currentCollection.collectionTitle}</h1>
                <div className="tasks">
                    {collectionTasks.length !== 0 ?
                        <span>test</span>
                        :
                        <span id="noTasks">Currently no tasks in this collection</span>
                    }
                </div>
                <div className="addTask">
                    <h2>Add Task</h2>
                    <form>
                        <label>Title: </label>
                        <input aria-label="addTaskTitle" id="taskTitle" value={1} onChange={(e) => setTitle(e.target.value)}></input>
                        <label>Description: </label>
                        <input aria-label="addTaskDesc" id="taskDesc" value={1} onChange={(e) => setDesc(e.target.value)}></input>
                        <button aria-label="confirmAdd" onClick={(e) => sendTask(e)}>Submit</button>
                    </form>
                </div>
                
            </div>
}