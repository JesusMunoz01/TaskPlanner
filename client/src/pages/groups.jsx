import "../css/groups.css"
import { BsFillEnvelopeFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { BsGearFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export const Groups = ({userData, isLogged}) => {
    const [isUserLogged, ] = useState(isLogged)
    const [groups, setGroups] = useState(userData || {})
    const [newGroup, setNewGroup] = useState({title: "", desc: ""})
    const [invites, setInvites] = useState(groups.invites || [])

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

    function sendGroup(e){
        e.preventDefault();
        
    }

    function displayAddPrompt(e){
        e.preventDefault()
        let addBox = document.getElementById("addGroup")
        addBox.style.display = "flex";
    }

    return <div className="groupsHome">
        {isUserLogged ? 
        <div className="groupsBox">
            <div className="groupsBox-header">
                <h1>Groups</h1>
                <div className="groupsBox-headerActions">
                    <button id="createGroup" onClick={(e) => displayAddPrompt(e)}>Create New</button>
                    <input type="checkbox" id="groupInvites" style={{display: 'none'}}></input>
                    <label for="groupInvites" id="groupInvitesIcon"><BsFillEnvelopeFill /><span id="groupInvitesNumber">{invites.length}</span></label>
                </div>
            </div>
            <div className="groups">
                {groups.joined.length !== 0 ? 
                    // Section for: Logged user with groups -------------------------------------------
                    <span>Your groups</span>
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
                <form>
                    <label>Collection Title: </label>
                    <input id="groupTitle" value={newGroup.title} onChange={(e) => setGroupTitle(e.target.value)}></input>
                    <label>Description: </label>
                    <input id="groupDesc" value={newGroup.desc} onChange={(e) => setGroupDesc(e.target.value)}></input>
                    <button onClick={(e) => sendGroup(e)}>Submit</button>
                </form>
            </div>
    </div>
}