import "../css/groups.css"
import { BsX } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';


export const SubmitForm = ({hide, title, labelData, children, getData}) => {
    const [newGroup, setNewGroup] = useState({title: "", desc: ""})
    const [auth,] = useCookies(["access_token"])


    async function sendData(e){
        e.preventDefault();
        try{
            const userID = localStorage.getItem("userId");
            const response = await fetch(`${__API__}/groups/${labelData.action}`, {
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
            getData(data)
        }
        catch(error){

        }
        
    }

    return <div className={`addGroup${labelData.title}`} id={`addGroup${labelData.title}`}>
            <h2>{title}</h2>
            <input type="checkbox" id="closeCreate" style={{display: 'none'}}></input>
            <label for="closeCreate" id="closeCreateIcon" onClick={() => hide(undefined, `${labelData.title}`)}><BsX /></label>
            {labelData.usePremade ?
            <form className={`promptFormGroup${labelData.title}`}>
                <label>{labelData.title} Title: </label>
                <input id={`${labelData.title}Title`} value={newGroup.title} onChange={(e) => {setNewGroup((prev) => {return {title: e.target.value, desc: prev.desc}})}}></input>
                <label>{labelData.title} Description: </label>
                <input id={`${labelData.title}Desc`} value={newGroup.desc} onChange={(e) => {setNewGroup((prev) => {return {title: prev.title, desc: e.target.value}})}}></input>
                <button onClick={(e) => sendData(e, labelData.action)}>Submit</button>
            </form> : null
            }
            {children ?
            children 
            : 
            null}
        </div>
}