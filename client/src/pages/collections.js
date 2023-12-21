import "../css/collections.css"
import { useState } from "react";
import { useCookies } from 'react-cookie';
import { BsGearFill } from "react-icons/bs";

export const Collections = (data) => {
    const [collections, setCollections] = useState(data.data);
    //const [taskFilter, setCurrentFilter] = useState(data.data);
    const [isUserLogged, ] = useState(data.isLogged)
    const [collectionTitle, setCollectionTitle] = useState("");
    const [collectionDescription, setCollectionDesc] = useState("");
    const [updtCollectionTitle, updateCollectionTitle] = useState("");
    const [updtCollectionDescription, updateCollectionDesc] = useState("");
    const [cookies, ] = useCookies(["access_token"]);

    async function sendCollection(e){
        e.preventDefault();
            try{
                const userID = window.localStorage.getItem("userId");
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/addCollection`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: cookies.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        collectionTitle,
                        collectionDescription,
                        status: "incomplete"
                        })
                    });
                const collection = await res.json()
                if(collection == null)
                setCollections([collection])
                setCollections([...collections, collection])
            }catch(error){
                console.log(error)
            }

        setCollectionTitle('');
        setCollectionDesc('');
    }
/*
    async function sendCollectionTask(e){
        e.preventDefault();
            try{
                const userID = window.localStorage.getItem("userId");
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/addCollectionTask`, {
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
                setCollections([task])
                setCollections([...tasks, task])
                setCurrentFilter([...tasks, task])
            }catch(error){
                console.log(error)
            }

        setCollectionTitle('');
        setCollectionDesc('');
    }
*/
    async function delCollection(collectionID){

        await fetch(`${process.env.REACT_APP_BASE_URL}/tasks/${collectionID}`, {
            method: "DELETE", headers: {auth: cookies.access_token}});

        setCollections(collections.filter((collection) => collection._id !== collectionID))
        //setCurrentFilter(tasks);
    }

    async function changeStatus(collectionStatus, collectionID){
            try{
                const userID = window.localStorage.getItem("userId");
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/updateTask`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: cookies.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        collectionID,
                        collectionStatus
                        })
                    });
                const updatedValues = await res.json()
                const index = updatedValues.findIndex((collection => collection._id === collectionID))
                updatedValues[index].status = `${collectionStatus}`
                setCollections(updatedValues)
                //setCurrentFilter(updatedValues)
            }catch(error){
                console.log(error)
            }
    }

    async function changeInfo(taskID, oldTitle, oldDesc){
        let newTitle, newDesc = "";

        if(updtCollectionTitle === "")
            newTitle = oldTitle;
        else
            newTitle = updtCollectionTitle;
        if(updtCollectionDescription === "")
            newDesc = oldDesc;
        else
            newDesc = updtCollectionDescription;

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
                setCollections(updatedValues)
                //setCurrentFilter(updatedValues)
            }catch(error){
                console.log(error)
            }
        else{
            const localTask = JSON.parse(window.localStorage.getItem("localTaskData"))
            const index = localTask.findIndex((task => task._id === taskID))
            localTask[index].title = `${updtCollectionTitle}`
            localTask[index].description = `${updtCollectionDescription}`
            window.localStorage.setItem("localTaskData", JSON.stringify(localTask))
            const getUpdatedLocal = window.localStorage.getItem("localTaskData");
            setCollections(getUpdatedLocal);
            //setCurrentFilter(getUpdatedLocal);
        }

        updateCollectionTitle("");
        updateCollectionDesc("");

    }
/*
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
*/
    function displayEdit(id){
        const currentMode = document.getElementById(`setting${id}`).className
        if(currentMode === "editTask active")
            document.getElementById(`setting${id}`).className = "editTask"
        else
            document.getElementById(`setting${id}`).className = "editTask active"
    }

    return <div className="collectionsHome">
        <div className="collectionsBox">
        <h1>Collections</h1>
            <div className="collections">
                {collections ? 
                    // Section for: Logged user with tasks -------------------------------------------
                    collections.map((collection)=> (
                        <div className="collectionsList">
                        <li key={collection._id}>
                            <button onClick={() => delCollection(collection._id)}>x</button>
                            <input id={collection._id} style={{display:"none"}} type="checkbox" onClick={() => displayEdit(collection._id)}/>
                            <label id="settingsIcon" for={collection._id}><BsGearFill style={{cursor:'pointer'}}></BsGearFill></label>
                                {collection.title}
                            <div className="statusBox">
                                <label id="taskState">Status: </label>
                                <select for="taskState" value={collection.status} onChange={(e) => changeStatus(e.target.value, collection._id)}>
                                    <option value={"incomplete"}>Incomplete</option>
                                    <option value={"complete"}>Complete</option>
                                </select>
                            </div>
                        </li>
                        <ul className="editTask" id={`setting${collection._id}`} style={{display:"none", transition: 0.4}}>
                            <li id={`setting${collection._id}`} style={{display:"flex", transition: 0.4}}>
                                <label>Edit title:</label>
                                <input id="taskTitle" value={updtCollectionTitle} onChange={(e) => updateCollectionTitle(e.target.value)}></input>
                            </li>
                            <li id={`setting${collection._id}`} style={{display:"flex", transition: 0.4}}>
                                <label>Edit Description:</label>
                                <input id="taskDesc" value={updtCollectionDescription} onChange={(e) => updateCollectionDesc(e.target.value)}></input>
                            </li>
                            <button onClick={() => changeInfo(collection._id, collection.title, collection.description)}>Save Changes</button>
                        </ul>
                    </div>
                    )) : 
                        // Section for: Logged user without tasks -------------------------------------------
                    <span>Currently no Collections</span> 

                }
            </div>
            <div className="addCollection">
                <h2>Add Collection</h2>
                <form>
                    <label>Collection Title: </label>
                    <input id="collectionTitle" value={collectionTitle} onChange={(e) => setCollectionTitle(e.target.value)}></input>
                    <label>Description: </label>
                    <input id="collectionDesc" value={collectionDescription} onChange={(e) => setCollectionDesc(e.target.value)}></input>
                    <button onClick={(e) => sendCollection(e)}>Submit</button>
                </form>
            </div>
        </div>
    </div>
}