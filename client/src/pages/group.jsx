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

    function hidePrompt(e){
        e.preventDefault();
        let addBox = document.getElementById("addGroup");
            if(addBox.style.display !== "none" && e.button === 0){
                addBox.style.display = "none";
                document.getElementById("createGroup").disabled = false;
                document.getElementById("group").style.filter = "none";
            }
    }

    return <div className="group" id="group">
        <div onMouseDown={hidePrompt}>
        <Header title={`${from.groupName}`} section="tasks" 
            newAction={ from.permissions === "Admin" ? 
            <>
            <button id="delGroup">Delete Group</button>
            <input type="checkbox" id="userTab" style={{display: "none"}}/>
            <label id="usersIcon" htmlFor="userTab"><BsFillPersonLinesFill /></label>
            </>
            :
            null}/>
        </div>
        <div className="groupContent">
            <div className="groupContent" onMouseDown={hidePrompt}>
                <span>Content</span>
            </div>
            <SubmitForm hide={hidePrompt} title={"Create a Collection"} labelData={{usePremade: true, title: "Collection", lower: "collection"}}/>
            {/* <SubmitForm hide={hidePrompt} title={"Create a "} labelData={{usePremade: false} children={}}/> */}
        </div>
            
    </div>
}