import "../css/groups.css"
import { BsFillEnvelopeFill } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { BsGearFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export const Groups = ({userData, isLogged}) => {
    const [isUserLogged, ] = useState(isLogged)
    const [groups, setGroups] = useState(userData || {})
    const [newGroup, setNewGroup] = useState({title: "", desc: ""})
    const [invites, setInvites] = useState(groups.invites || [])
    const [auth,] = useCookies(["access_token"])
    console.log(userData)

    useEffect(() => {
            if(invites.length){
                let inviteNum = invites.length;
                let inviteIcon = document.getElementById("groupInvitesIcon");
                if(inviteNum > 0){
                    inviteIcon.style.backgroundColor = "rgb(197, 14, 14)";
                }
                else{
                    inviteIcon.style.backgroundColor = "transparent";
                }
            }

    }, [invites])

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
        {isUserLogged ? 
        <div className="groupsBox" onMouseDown={hidePrompt}>
            <div className="groupsBox-header">
                <h1>Groups</h1>
                <div className="groupsBox-headerActions">
                    <button id="createGroup" onClick={(e) => displayAddPrompt(e)}>Create New</button>
                    <input type="checkbox" id="groupInvites" style={{display: 'none'}}></input>
                    <label htmlFor="groupInvites" id="groupInvitesIcon"><BsFillEnvelopeFill /><span id="groupInvitesNumber">{invites.length}</span></label>
                    <div className="checkInvites">
                        <span id="groups-NoInvites">No Invites</span>
                    </div>
                </div>

            </div>
            <div className="groups">
                {groups.joined.length !== 0 ? 
                    // Section for: Logged user with groups -------------------------------------------
                    groups.joined.map((group) => (
                        <Link key={group.id} to={`/groups/${1}`} state={{from: group}}>
                        <div className="groupCard">
                                <h2>{group.groupName}</h2>
                                <p>{group.groupDescription}</p>
                        </div>
                        </Link>
                    ))
                    : 
                    // Section for: Logged user without groups -------------------------------------------
                    <span id="groups-NoGroup">Currently no groups</span> 
                }
            </div>
        </div> :
            <span id="groups-NotLogged">You are currently not logged, to access this feature log in </span>
        }
            
            <div className="addGroup" id="addGroup">
                <h2>Create a group</h2>
                <input type="checkbox" id="closeCreate" style={{display: 'none'}}></input>
                <label for="closeCreate" id="closeCreateIcon" onClick={hidePrompt}><BsX /></label>
                <form className="promptForm">
                    <label>Group Title: </label>
                    <input id="groupTitle" value={newGroup.title} onChange={(e) => {setNewGroup((prev) => {return {title: e.target.value, desc: prev.desc}})}}></input>
                    <label>Group Description: </label>
                    <input id="groupDesc" value={newGroup.desc} onChange={(e) => {setNewGroup((prev) => {return {title: prev.title, desc: e.target.value}})}}></input>
                    <button onClick={(e) => sendGroup(e)}>Submit</button>
                </form>
            </div>
    </div>
}