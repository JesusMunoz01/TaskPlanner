import "../css/collections.css"
import { useState } from "react";
import { useCookies } from 'react-cookie';
import { BsGearFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export const Groups = (data) => {
    const [isUserLogged, ] = useState(data.isLogged)

    return <div className="groupsHome">
        {isUserLogged ? 
        <div className="groupsBox">
        <h1>Groups</h1>
            <div className="groups">
                {groups ? 
                    // Section for: Logged user with tasks -------------------------------------------
                    <span>Your groups</span>
                    : 
                    // Section for: Logged user without tasks -------------------------------------------
                    <span>Currently no groups</span> 
                }
                
            </div>
            <div className="addGroup">
                <h2>Create a group</h2>
                {/* <form>
                    <label>Collection Title: </label>
                    <input id="groupTitle" value={groupTitle} onChange={(e) => setGroupTitle(e.target.value)}></input>
                    <label>Description: </label>
                    <input id="groupDesc" value={groupDescription} onChange={(e) => setGroupDesc(e.target.value)}></input>
                    <button onClick={(e) => sendGroup(e)}>Submit</button>
                </form> */}
            </div>
        </div> :
        <div>
            <span>You are currently not logged, to access this feature log in </span>
        </div>
        }
    </div>
}