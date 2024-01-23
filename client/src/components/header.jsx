import "../css/groups.css"
import { BsFillEnvelopeFill } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';


export const Header = ({title, newAction}) => {

    async function sendGroup(e){
        e.preventDefault();
        try{
            const userID = localStorage.getItem("userId");
            const response = await fetch(`${__API__}/groups/createGroup`, {
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
        }
        catch(error){

        }
        
    }

    function displayAddPrompt(e){
        e.preventDefault();
        console.log("test")
        let addBox = document.getElementById("addGroup");
        addBox.style.display = "flex";
        document.getElementById("createGroup").disabled = true;
    }

    function hidePrompt(e){
        e.preventDefault();
        let addBox = document.getElementById("addGroup");
            if(addBox.style.display !== "none" && e.button === 0){
                addBox.style.display = "none";
                document.getElementById("createGroup").disabled = false;
            }
    }

    return <div className="groupsHome">
        <div className="groupsBox" onMouseDown={hidePrompt}>
            <div className="groupsBox-header">
                <h1>{title}</h1>
                <div className="groupsBox-headerActions">
                    <button id="createGroup" onClick={(e) => displayAddPrompt(e)}>Create New</button>
                    {newAction ? newAction : null}
                </div>
            </div>
        </div>
    </div>
}
