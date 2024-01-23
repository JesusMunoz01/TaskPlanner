import "../css/groups.css"
import { BsFillEnvelopeFill } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { Link } from "react-router-dom";

export const Groups = ({userData, isLogged}) => {
    const [isUserLogged, ] = useState(isLogged)
    const [groups, setGroups] = useState(userData || {})
    const [newGroup, setNewGroup] = useState({title: "", desc: ""})
    const [invites, setInvites] = useState(groups.invites || [])
    const [auth,] = useCookies(["access_token"])

    useEffect(() => {
        let inviteIcon = document.getElementById("groupInvitesIcon");

            if(groups.invites.length)
                inviteIcon.style.backgroundColor = "rgb(197, 14, 14)";
            else
                inviteIcon.style.backgroundColor = "transparent";

    }, [groups.invites.length])

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

    async function inviteAction(action, id){
        const controller = new AbortController()
        try{
            const userID = localStorage.getItem("userId");
            const response = await fetch(`${__API__}/groups/${id}/invite/action`, { signal: controller.signal,
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    auth: auth.access_token
                },
                body: JSON.stringify({
                    userID,
                    action
                })
            })

            const data = await response.json();
            console.log(data)
            setGroups((prev) => {
                return {
                    invites: data.invites,
                    joined: [...prev.joined, data]
                }
            })
            setInvites(data.invites);

        }catch(error){

        }

        return controller.abort();
    }

    function displayAddPrompt(e){
        e.preventDefault();
        let addBox = document.getElementById("addGroup");
        addBox.style.display = "flex";
        addBox.style.backfaceVisibility = "hidden";
        document.getElementById("createGroup").disabled = true;
        document.getElementById("groups").style.filter = "blur(20px)";
    }

    function hidePrompt(e){
        e.preventDefault();
        let addBox = document.getElementById("addGroup");
            if(addBox.style.display !== "none" && e.button === 0){
                addBox.style.display = "none";
                document.getElementById("createGroup").disabled = false;
                document.getElementById("groups").style.filter = "none";
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
                    <label htmlFor="groupInvites" id="groupInvitesIcon"><BsFillEnvelopeFill /><span id="groupInvitesNumber">{groups.invites.length}</span></label>
                    <div className="checkInvites">
                        {groups.invites.length !== 0 ?
                            groups.invites.map((invite) => (
                                <div className="currentInvites">
                                    <p>{invite}</p>
                                    <div className="inviteActions">
                                        <button id="acceptInvite" onClick={() => inviteAction("accept", invite)}>Accept</button>
                                        <button id="denyInvite" onClick={() => inviteAction("deny", invite)}>Deny</button>
                                    </div>
                                </div>
                            ))
                        :
                            <span id="groups-NoInvites">No Invites</span>
                        }
                    </div>
                </div>

            </div>
            <div className="groups" id="groups">
                {groups.joined.length !== 0 ? 
                    // Section for: Logged user with groups -------------------------------------------
                    groups.joined.map((group) => (
                        <Link key={group.id} to={`/groups/${1}`} state={{from: group}}>
                        <div className="groupCard">
                                <h2>{group.groupName}</h2>
                                <p>{group.groupDescription}</p>
                                <p>Status: {group.permissions}</p>
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