import "../css/groups.css"
import { BsX } from "react-icons/bs";
import { useState } from "react";
import { useCookies } from 'react-cookie';


export const SubmitForm = ({hide, title, labelData, children, getData, section, isLogged}) => {
    const [newGroup, setNewGroup] = useState({title: "", desc: ""})
    const [auth,] = useCookies(["access_token"])


    async function sendData(e){
        e.preventDefault();
        if(newGroup.title !== "" && newGroup.desc !== ""){
            if(isLogged){
                try{
                    const userID = localStorage.getItem("userId");
                    const response = await fetch(`${__API__}/${labelData.action}`, {
                        method: "POST", headers: {
                            'Content-Type': 'application/json',
                            auth: auth.access_token},
                        body: JSON.stringify({
                            userID,
                            title: newGroup.title,
                            desc: newGroup.desc
                            })
                        });
                    const data = await response.json()
                    console.log(data)
                    getData(data)
                    setNewGroup({title: "", desc: ""})
                    
                }
                catch(error){

                }
            }
            else{
                const getLocal = window.localStorage.getItem("localCollectionData");
                let nextId = 0;
                let localCollection = [];
                let lastCollectionID = [];
                if(getLocal)
                    localCollection = JSON.parse(window.localStorage.getItem("localCollectionData"))
                let localCopy = JSON.parse(window.localStorage.getItem("localCollectionData"))
                if(localCopy)
                    lastCollectionID = localCopy.pop();
                if(lastCollectionID.length !== 0)
                    nextId = lastCollectionID._id + 1;
    
                    const newCollection = {
                        collectionTitle: newGroup.title, collectionDescription: newGroup.desc, 
                        _id: nextId, tasks: [], collectionStatus:"Incomplete"
                    }
    
                localCollection.push(newCollection)
                window.localStorage.setItem("localCollectionData", JSON.stringify(localCollection))
                const getUpdatedLocal = window.localStorage.getItem("localCollectionData");
                getData(getUpdatedLocal)
                setNewGroup({title: "", desc: ""})
                // setCurrentFilter(getUpdatedLocal);
            }
        }
    }

    return <div className={`add${section}`} id={`add${section}`}>
            <h2>{title}</h2>
            <input type="checkbox" id="closeCreate" style={{display: 'none'}}></input>
            <label htmlFor="closeCreate" id="closeCreateIcon" aria-label="closeCreateIcon" onClick={() => hide(undefined, `${labelData.title}`)}><BsX /></label>
            {labelData.usePremade ?
            <form className={`promptForm${section}`}>
                <label>{labelData.title} Title: </label>
                <input id={`${labelData.title}Title`} aria-label={`add${section}Title`} value={newGroup.title} onChange={(e) => {setNewGroup((prev) => {return {title: e.target.value, desc: prev.desc}})}}></input>
                <label>{labelData.title} Description: </label>
                <input id={`${labelData.title}Desc`} aria-label={`add${section}Desc`} value={newGroup.desc} onChange={(e) => {setNewGroup((prev) => {return {title: prev.title, desc: e.target.value}})}}></input>
                <button aria-label={`createNew${section}`} onClick={(e) => sendData(e, labelData.action)}>Submit</button>
            </form> : null
            }
            {children ?
            children 
            : 
            null}
        </div>
}