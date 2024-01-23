import "../css/group.css"
import { BsFillPersonLinesFill } from "react-icons/bs";
import { useLocation, useParams } from "react-router-dom"
import { Header } from "../components/header";
import { SubmitForm } from "../components/submitForm";

export const Group = () => {
    const location = useLocation()
    const { from } = location.state
    const { groupID } = useParams();
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

    return <div className="group" id="group">
        <div onMouseDown={(e) => hidePrompt(e, "Collection")}>
        <Header title={`${from.groupName}`} section="Collection" 
            newAction={ from.permissions === "Admin" ? 
            <>
            <button id="delGroup">Delete Group</button>
            <input type="checkbox" id="groupUsers" style={{display: "none"}}/>
            <label id="groupUsers" htmlFor="groupUsers"><BsFillPersonLinesFill /></label>
            <div className="checkUsers">
                <span id="groups-NoInvites">No Invites</span>
            </div>
            </>
            :
            null}/>
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