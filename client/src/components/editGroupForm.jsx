export default function EditGroupForm(params) {
    const [newGroupName, setNewGroupName] = useState("")
    const [newGroupDescription, setNewGroupDescription] = useState("")
    
    return (
        <div className="editGroupForm">
            <h2>Edit Group</h2>
            <form>
                <label htmlFor="groupName">Group Name: {}</label>
                <input type="text" id="groupName" value={params.groupName} onChange={(e) => params.setGroupName(e.target.value)}></input>
                <label htmlFor="groupDescription">Group Description</label>
                <textarea id="groupDescription" value={params.groupDescription} onChange={(e) => params.setGroupDescription(e.target.value)}></textarea>
                <label htmlFor="groupPermissions">Group Permissions</label>
                <button id="saveGroup" onClick={params.confirmChanges}>Confirm</button>
                <button id="deleteGroup" onClick={params.closeEdit}>Cacel</button>
            </form>
        </div>
    )
};
