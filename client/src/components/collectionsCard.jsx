import "../css/collections.css"
import { useContext, useState } from "react";
import { useCookies } from 'react-cookie';
import { BsGearFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../App";

export const CollectionsCard = (data) => {
    const { collectionData, setCollectionData, groupData } = useContext(UserContext)
    const [collections, setCollections] = useState(data.data);
    const [collection, setCollection] = useState(data.collection);
    const [index, ] = useState(data.index);
    const { groupID } = useParams();
    const [isUserLogged, ] = useState(data.isLogged)
    const [updtCollectionTitle, updateCollectionTitle] = useState("");
    const [updtCollectionDescription, updateCollectionDesc] = useState("");
    const [cookies, ] = useCookies(["access_token"]);
 
    async function delCollection(collectionID){
        if(isUserLogged){
            const userID = window.localStorage.getItem("userId");
            let test;
            if(data.route !== undefined)
            test = await fetch(`${__API__}${data.route}/deleteCollection/${collectionID}`, {
                method: "DELETE", headers: {auth: cookies.access_token}, 
            });
            else
            test = await fetch(`${__API__}/deleteCollection/${userID}/${collectionID}`, {
                method: "DELETE", headers: {auth: cookies.access_token}, 
            });
            const response = await test.json();
            setCollections(response);
            setCollection(response);
            data.returnCollection(response)
        }
        else{
            const localData = JSON.parse(window.localStorage.getItem("localCollectionData"))
            const delItem = localData.filter((collection) => collection._id !== collectionID)
            window.localStorage.setItem("localCollectionData", JSON.stringify(delItem))
            const updatedData = JSON.parse(window.localStorage.getItem("localCollectionData"))
            if(updatedData.length === 0){
                window.localStorage.removeItem("localCollectionData");
                setCollections(null);
                setCollection(JSON.parse(null))
                data.returnCollection(null);
                //setCurrentFilter(null);
            }else{
                const getUpdatedLocal = window.localStorage.getItem("localCollectionData");
                setCollections(JSON.parse(getUpdatedLocal));
                setCollection(JSON.parse(getUpdatedLocal))
                data.returnCollection(getUpdatedLocal);
                //setCurrentFilter(getUpdatedLocal);
            }
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

        if(isUserLogged){
            try{
                let res;
                const userID = window.localStorage.getItem("userId");
                if(data.route)
                res = await fetch(`${__API__}${data.route}/updateCollection`, {
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
                else
                res = await fetch(`${__API__}/updateCollection`, {
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
                setCollection(updatedValues[index])
                data.returnCollection(updatedValues)
            }catch(error){
                console.log(error)
            }
        }
        else{
            const localCollection = JSON.parse(window.localStorage.getItem("localCollectionData"))
            const index = localCollection.findIndex((collection => collection._id === collectionID))
            localCollection[index].collectionTitle = `${newColTitle}`
            localCollection[index].collectionDescription = `${newColDesc}`
            window.localStorage.setItem("localCollectionData", JSON.stringify(localCollection))
            const getUpdatedLocal = window.localStorage.getItem("localCollectionData");
            setCollections(JSON.parse(getUpdatedLocal));
            setCollection(JSON.parse(getUpdatedLocal)[index])
            data.returnCollection(getUpdatedLocal);
            //setCurrentFilter(getUpdatedLocal);
        }

        updateCollectionTitle("");
        updateCollectionDesc("");

    }

    function displayEdit(id){
        updateCollectionTitle("")
        updateCollectionDesc("")

        const currentMode = document.getElementById(`colSetting${id}`).className
        var list = document.getElementsByClassName(`${data.section}Edit active`)

        Array.prototype.forEach.call(list, (item) => {
            item.className = `${data.section}Edit`
        })

        if(currentMode === `${data.section}Edit active`)
            document.getElementById(`colSetting${id}`).className = `${data.section}Edit`
        else
            document.getElementById(`colSetting${id}`).className = `${data.section}Edit active`
    }


    return <div className={`${data.section}List`} data-testid={`${data.section}-item`} key={collection._id}>
                            <li key={collection._id}>
                                {isUserLogged ?
                                    <Link id="collectionDisplayTitle" aria-label={`${data.section}Title${collection._id}`} 
                                    to={data.link}>{collection.collectionTitle}</Link>
                                :
                                    <Link id="collectionDisplayTitle" aria-label={`${data.section}Title${collection._id}`} 
                                    to={data.link}>{collection.collectionTitle}</Link>}
                                <div className="descBox">
                                    <p id="collectionDisplayDesc" aria-label={`${data.section}Desc${collection._id}`}>{collection.collectionDescription}</p>
                                </div>
                                <div style={{display: "flex", flexDirection: "column", minHeight: "100px"}}>
                                    <div className="statusBox">
                                        <span>Status: {collection.collectionStatus}</span>
                                    </div>
                                    <input id={collection._id} style={{display:"none"}} type="checkbox" onClick={() => displayEdit(collection._id)}/>
                                    <label id={`${data.section}SettingsIcon`} aria-label={`${data.section}SettingsIcon`} htmlFor={collection._id}>
                                        <BsGearFill style={{cursor:'pointer'}}></BsGearFill></label>
                                    <button aria-label={`del${data.section}${collection._id}`} onClick={() => delCollection(collection._id)}>X</button>
                                </div>
                            </li>
                            <ul className={`${data.section}Edit`} id={`colSetting${collection._id}`} >
                                <li id={`colSetting${collection._id}`}>
                                    <label>Edit title:</label>
                                    <input id="collectionTitle" aria-label={`edit${data.section}Title${collection._id}`} value={updtCollectionTitle} 
                                        onChange={(e) => updateCollectionTitle(e.target.value)}></input>
                                </li>
                                <li id={`colSetting${collection._id}`}>
                                    <label>Edit Description:</label>
                                    <input aria-label={`edit${data.section}Desc${collection._id}`} id="collectionDesc" value={updtCollectionDescription} 
                                        onChange={(e) => updateCollectionDesc(e.target.value)}></input>
                                </li>
                                <button id="confirmColEdit" aria-label={`confirm${data.section}Edit${collection._id}`} 
                                    onClick={() => changeInfo(collection._id, collection.collectionTitle, collection.collectionDescription)}>Save Changes</button>
                            </ul>
                        </div>
}