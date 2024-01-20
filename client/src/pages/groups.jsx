import "../css/groups.css"
import { BsFillEnvelopeFill } from "react-icons/bs";
import { useState } from "react";
import { useCookies } from 'react-cookie';
import { BsGearFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export const Groups = ({userData, isLogged}) => {
    const [isUserLogged, ] = useState(isLogged)
    const [groups, setGroups] = useState(userData)
    const [newGroup, setNewGroup] = useState({title: "", desc: ""})

    function sendGroup(){
        e.preventDefault();
    }

    return <div className="groupsHome">
        {isUserLogged ? 
        <div className="groupsBox">
            <div className="groupsBox-header">
                <h1>Groups</h1>
                <div className="groupsBox-headerActions">
                    <button id="createGroup">Create New</button>
                    <input type="checkbox" id="groupInvites" style={{display: 'none'}}></input>
                    <label for="groupInvites" id="groupInvitesIcon"><BsFillEnvelopeFill />{groups.invites.length}</label>
                </div>
            </div>
            <div className="groups">
                {groups.joined.length !== 0 ? 
                    // Section for: Logged user with tasks -------------------------------------------
                    <span>Your groups</span>
                    : 
                    // Section for: Logged user without tasks -------------------------------------------
                    <span id="groups-NoGroup">Currently no groups</span> 
                }
                
            </div>
            <div className="addGroup">
                <h2>Create a group</h2>
                <form>
                    <label>Collection Title: </label>
                    <input id="groupTitle" value={newGroup.title} onChange={(e) => setGroupTitle(e.target.value)}></input>
                    <label>Description: </label>
                    <input id="groupDesc" value={newGroup.desc} onChange={(e) => setGroupDesc(e.target.value)}></input>
                    <button onClick={(e) => sendGroup(e)}>Submit</button>
                </form>
            </div>
        </div> :
            <span id="groups-NotLogged">You are currently not logged, to access this feature log in </span>
        }
    </div>
}