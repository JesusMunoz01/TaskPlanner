import "../css/collections.css"
import { useState } from "react";
import { useCookies } from 'react-cookie';
import { BsGearFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export const Collections = (data) => {
    const [collections, setCollections] = useState(data.data);
    const [isUserLogged, ] = useState(data.isLogged)
    const [collectionTitle, setCollectionTitle] = useState("");
    const [collectionDescription, setCollectionDesc] = useState("");
    const [updtCollectionTitle, updateCollectionTitle] = useState("");
    const [updtCollectionDescription, updateCollectionDesc] = useState("");
    const [cookies, ] = useCookies(["access_token"]);

    async function delCollection(collectionID){
        if(isUserLogged){
            const userID = window.localStorage.getItem("userId");
            await fetch(`${__API__}/deleteCollection/${userID}/${collectionID}`, {
                method: "DELETE", headers: {auth: cookies.access_token}, 
            });

            setCollections(collections.filter((collection) => collection._id !== collectionID))
        }
    }

    async function changeInfo(collectionID, oldColTitle, oldColDesc){
        let newColTitle = "", newColDesc = "";

        if(updtCollectionTitle === "")
            newColTitle = oldColTitle;
        else
            newColTitle = updtCollectionTitle;
        if(updtCollectionDescription === "")
            newColDesc = oldColDesc;
        else
            newColDesc = updtCollectionDescription;

        if(isUserLogged)
            try{
                const userID = window.localStorage.getItem("userId");
                const res = await fetch(`${__API__}/updateCollection`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: cookies.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        collectionID,
                        newColTitle,
                        newColDesc
                        })
                    });
                const updatedValues = await res.json()
                const index = updatedValues.findIndex((collection => collection._id === collectionID))
                updatedValues[index].collectionTitle = `${newColTitle}`
                updatedValues[index].collectionDescription = `${newColDesc}`
                setCollections(updatedValues)
            }catch(error){
                console.log(error)
            }

        updateCollectionTitle("");
        updateCollectionDesc("");

    }

    function displayEdit(id){
        updateCollectionTitle("")
        updateCollectionDesc("")

        const currentMode = document.getElementById(`colSetting${id}`).className
        var list = document.getElementsByClassName("editCollection active")

        Array.prototype.forEach.call(list, (item) => {
            item.className = "editCollection"
        })

        if(currentMode === "editCollection active")
            document.getElementById(`colSetting${id}`).className = "editCollection"
        else
            document.getElementById(`colSetting${id}`).className = "editCollection active"
    }


    return <div className="collectionsHome">
        <div className="collectionsBox">
        <h1>Collections</h1>
            <div className="collections">
                    {collections.map((collection, index)=> (
                        <div className="collectionsList" data-testid="collection-item" key={collection._id}>
                            <li key={collection._id}>
                                <Link id="collectionDisplayTitle" aria-label={`collectionTitle${collection._id}`} 
                                    to={`/collections/${index}`}>{collection.collectionTitle}</Link>
                                <div className="descBox">
                                    <p id="collectionDisplayDesc"aria-label={`collectionDesc${collection._id}`}>{collection.collectionDescription}</p>
                                </div>
                                <div className="statusBox">
                                    <span>Status: {collection.collectionStatus}</span>
                                </div>
                                <input id={collection._id} style={{display:"none"}} type="checkbox" onClick={() => displayEdit(collection._id)}/>
                                <label id="collectionsSettingsIcon" htmlFor={collection._id}><BsGearFill style={{cursor:'pointer'}}></BsGearFill></label>
                                <button aria-label={`delCollection${collection._id}`} onClick={() => delCollection(collection._id)}>X</button>
                            </li>
                            <ul className="editCollection" id={`colSetting${collection._id}`} >
                                <li id={`colSetting${collection._id}`}>
                                    <label>Edit title:</label>
                                    <input id="collectionTitle" aria-label={`editCollectionTitle${collection._id}`} value={updtCollectionTitle} 
                                        onChange={(e) => updateCollectionTitle(e.target.value)}></input>
                                </li>
                                <li id={`colSetting${collection._id}`}>
                                    <label>Edit Description:</label>
                                    <input aria-label={`editCollectionDesc${collection._id}`} id="collectionDesc" value={updtCollectionDescription} 
                                        onChange={(e) => updateCollectionDesc(e.target.value)}></input>
                                </li>
                                <button id="confirmColEdit" aria-label={`confirmColEdit${collection._id}`} 
                                    onClick={() => changeInfo(collection._id, collection.collectionTitle, collection.collectionDescription)}>Save Changes</button>
                            </ul>
                        </div>
                    ))}
            </div>
        </div>
    </div>
}