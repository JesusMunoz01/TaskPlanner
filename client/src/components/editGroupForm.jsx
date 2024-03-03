import { useState } from "react"

export default function EditGroupForm(params) {
    const [newGroupName, setNewGroupName] = useState("")
    const [newGroupDescription, setNewGroupDescription] = useState("")

    const acceptChanges = async (e, groupID, groupName, groupDescription) => {
        setNewGroupName("")
        setNewGroupDescription("")
        e.preventDefault()
        await params.confirmChanges(groupID, groupName, groupDescription)
        params.closeEdit()
    }
    
    return (
        <div className="editGroupFormBackground">
            <div className="editGroupFormContainer">
                <h1 aria-label="editForm">Edit Group</h1>
                <form className="editGroupForm">
                    <label htmlFor="groupName">Old Group Name: <br></br> {params.groupName}</label>
                    <div style={{display: "flex", flexDirection: "row", fontSize: "1.2rem", alignItems: "center"}}>
                        <label htmlFor="newGroupName">Group Name:</label>
                        <input type="text" id="updtGroupName" aria-label="updtGroupName" value={newGroupName} 
                            onChange={(e) => setNewGroupName(e.target.value)}></input>
                    </div>
                    <br></br>
                    <label htmlFor="groupDescription">Old Group Description: <br></br> {params.groupDescription}</label>
                    <div style={{display: "flex", flexDirection: "row", fontSize: "1.2rem", alignItems: "center", justifyContent: "center"}}>
                        <label htmlFor="newGroupDescription">Group Description:</label>
                        <textarea id="newGroupDescription" aria-label="updtGroupDesc" value={newGroupDescription} 
                            onChange={(e) => setNewGroupDescription(e.target.value)}></textarea>
                    </div>
                    <div className="editGroupFormActions">
                        <button id="saveGroup" aria-label="saveGroup" onClick={(e) => acceptChanges(e, params.groupID, newGroupName, newGroupDescription)}>Confirm</button>
                        <button id="deleteGroup" aria-label="cancelEdit" onClick={params.closeEdit}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
};
