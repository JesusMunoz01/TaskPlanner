import "../css/group.css"
import { BsFillPersonLinesFill } from "react-icons/bs";
import { useLocation, useParams } from "react-router-dom"
import { Header } from "../components/header";
import { SubmitForm } from "../components/submitForm";
import { useState } from "react";

export const Group = () => {
    const location = useLocation()
    const { from } = location.state
    const { groupID } = useParams();
    const [invUsername, setUsername] = useState("")
    // console.log(from)
    // console.log(groupID)

    function hidePrompt(e, name){
        let addBox = document.getElementById(`addGroup${name}`);
        if(e === undefined){
            addBox.style.display = "none";
            document.getElementById("createGroup").disabled = false;
            document.getElementById("group").style.filter = "none";
        }
        if(addBox.style.display !== "none" && e.button === 0){
            addBox.style.display = "none";
            document.getElementById("createGroup").disabled = false;
            document.getElementById("group").style.filter = "none";
        }
    }

    function showPrompt(){
        let addBox = document.getElementById(`inviteUser`);
            if(addBox.style.display === "none")
                setTimeout(() => {addBox.style.display = "flex"}, "200")
            else
                addBox.style.display = "none";
        }

    return <div className="group" id="group">
        <div className="header" onMouseDown={(e) => hidePrompt(e, "Collection")}>
        <Header title={`${from.groupName}`} section="Collection" backArrow={"/groups"}
            newAction={ from.permissions === "Admin" ? 
            <>
            <button id="delGroup">Delete Group</button>
            <input type="checkbox" id="groupUsers" onChange={showPrompt} style={{display: "none"}}/>
            <label id="groupUsers" htmlFor="groupUsers"><BsFillPersonLinesFill /></label>
            <div className="checkUsers">
                    <span id="groups-NoInvites">Members</span>
            </div>
            </>
            :
            null}/>
            <div className="inviteUser" id="inviteUser" style={{display: "none"}}>
                <label>Username:</label>
                <input value={invUsername} onChange={(e) => setUsername(e.target.value)}></input>
                <button id="inviteBtn" onClick={"test"}>Invite</button>
            </div>
        </div>
        <div className="groupContent">
            <div className="groupContent" onMouseDown={(e) => hidePrompt(e, "Collection")}>
                <span>Content</span>
            </div>
            <SubmitForm hide={hidePrompt} title={"Create a Collection"} 
                labelData={{usePremade: true, title: "Collection", lower: "collection", action: "createCollection"}}/>
        </div>
            
    </div>
}