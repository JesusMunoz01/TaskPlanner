import "../css/groups.css"
import { BsFillEnvelopeFill } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { Link } from "react-router-dom";
import { UserContext } from "../App";

export const Groups = ({userData, isLogged}) => {
    const {groupData, setGroupData} = useContext(UserContext)
    const [isUserLogged, ] = useState(isLogged)
    const [groups, setGroups] = useState(userData || {})
    const [newGroup, setNewGroup] = useState({title: "", desc: ""})
    const [invites, setInvites] = useState(groups.invites || [])
    const [auth,] = useCookies(["access_token"])

    useEffect(() => {
        if(groupData.invites && groupData.joined)
            setGroups(groupData)
    }, [])

    useEffect(() => {
        if(groups.invites){
            let inviteIcon = document.getElementById("groupInvitesIcon");

            if(groups.invites.length)
                inviteIcon.style.backgroundColor = "rgb(197, 14, 14)";
            else
                inviteIcon.style.backgroundColor = "transparent";
        }
    }, [invites.length])

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
            setGroups((prev) => {
                return {
                    invites: prev.invites,
                    joined: [...prev.joined, data]
                }
            })
            setGroupData((prev) => {
                return {
                    invites: prev.invites,
                    joined: [...prev.joined, data]
                }
            })

            let addBox = document.getElementById("addGroup");
                addBox.style.display = "none";
                document.getElementById("createGroup").disabled = false;
                document.getElementById("groups").style.filter = "none";
        }
        catch(error){
            console.log(error)
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
            //if(data.id)
            setGroups((prev) => {
                return {
                    invites: data.invites,
                    joined: [...prev.joined, data]
                }
            })
            setGroupData((prev) => {
                return {
                    invites: data.invites,
                    joined: [...prev.joined, data]
                }
            })
            setInvites(data.invites);
            setNewGroup({title: "", desc: ""})

        }catch(error){

        }

        return controller.abort();
    }

    function displayAddPrompt(e){
        e.preventDefault();
        let addBox = document.getElementById("addGroup");
        addBox.style.display = "flex";
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
                    <label htmlFor="groupInvites" id="groupInvitesIcon"><BsFillEnvelopeFill /><span id="groupInvitesNumber">{invites.length}</span></label>
                    <div className="checkInvites">
                        {groups.invites.length !== 0 ?
                            groups.invites.map((invite, index) => (
                                <div className="currentInvites">
                                    <p aria-label={`inviteTitle${invite}`}>Group: {invite}</p>
                                    <div className="inviteActions">
                                        <button id="acceptInvite" aria-label={`acceptGroup${index}`} onClick={() => inviteAction("accept", invite)}>Accept</button>
                                        <button id="denyInvite" aria-label={`denyGroup${index}`} onClick={() => inviteAction("deny", invite)}>Deny</button>
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
                    groups.joined.map((group, index) => (
                        <Link key={group._id} aria-label={`group${group._id}`} to={`/groups/${group._id}`} state={{from: group, index: index}}>
                        <div className="groupCard">
                                <h2 aria-label={`groupTitle${group._id}`}>{group.groupName}</h2>
                                <p aria-label={`groupDesc${group._id}`}>{group.groupDescription}</p>
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
                <label htmlFor="closeCreate" id="closeCreateIcon" onClick={hidePrompt}><BsX /></label>
                <form className="promptForm">
                    <label>Group Title: </label>
                    <input id="groupTitle" aria-label="groupTitleNew" value={newGroup.title} onChange={(e) => {setNewGroup((prev) => {return {title: e.target.value, desc: prev.desc}})}}></input>
                    <label>Group Description: </label>
                    <input id="groupDesc" aria-label="groupDescNew" value={newGroup.desc} onChange={(e) => {setNewGroup((prev) => {return {title: prev.title, desc: e.target.value}})}}></input>
                    <button aria-label="submitNewGroup" onClick={(e) => sendGroup(e)}>Submit</button>
                </form>
            </div>
    </div>
}