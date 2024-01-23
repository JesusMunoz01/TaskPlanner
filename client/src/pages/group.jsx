import "../css/group.css"
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
                document.getElementById("groups").style.filter = "none";
            }
    }

    return <div className="group" >
        <div onMouseDown={hidePrompt}>
        <Header title={`${from.groupName}`} 
            newAction={ from.permissions === "admin" ? <button>Delete Group</button>:
            null}/>
        </div>
        <div className="groupContent">
            <div className="groupContent" onMouseDown={hidePrompt}>
                <span>Content</span>
            </div>
            <SubmitForm hide={hidePrompt} title={"Create a Task"} labelData={{usePremade: true, title: "Task", lower: "task"}}/>
        </div>
            
    </div>
}