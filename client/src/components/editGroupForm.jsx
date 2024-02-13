import { useState } from "react"

export default function EditGroupForm(params) {
    const [newGroupName, setNewGroupName] = useState("")
    const [newGroupDescription, setNewGroupDescription] = useState("")
    
    return (
        <div className="editGroupFormBackground">
            <div className="editGroupFormContainer">
                <h1>Edit Group</h1>
                <form className="editGroupForm">
                    <label htmlFor="groupName">Old Group Name: {params.groupName}</label>
                    <div style={{display: "flex", flexDirection: "row", fontSize: "1.2rem"}}>
                        <label htmlFor="newGroupName">Group Name:</label>
                        <input type="text" id="newGroupName" defaultValue={params.groupName} value={newGroupName} 
                            onChange={(e) => setNewGroupName(e.target.value)}></input>
                    </div>
                    <label htmlFor="groupDescription">Old Group Description: {params.groupDescription}</label>
                    <div style={{display: "flex", flexDirection: "row", fontSize: "1.2rem"}}>
                        <label htmlFor="newGroupDescription">Group Description:</label>
                        <textarea id="newGroupDescription" defaultValue={params.groupDescription} value={newGroupDescription} 
                            onChange={(e) => setNewGroupDescription(e.target.value)}></textarea>
                    </div>
                    <div className="editGroupFormActions">
                        <button id="saveGroup" onClick={params.confirmChanges}>Confirm</button>
                        <button id="deleteGroup" onClick={params.closeEdit}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
};
