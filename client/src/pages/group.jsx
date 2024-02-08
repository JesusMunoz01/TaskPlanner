import "../css/group.css"
import { BsFillPersonLinesFill } from "react-icons/bs";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Header } from "../components/header";
import { SubmitForm } from "../components/submitForm";
import { useContext, useState } from "react";
import { useCookies } from "react-cookie";
import { CollectionsCard } from "../components/collectionsCard";
import { UserContext } from "../App";
import ConfirmationPopup from "../components/confirmationPopup";
import useGroupData from "../hooks/useGroupData";

export const Group = () => {
    const { deleteGroup } = useGroupData();
    const [verification, ] = useCookies(["access_token"]);
    const { groupData, setGroupData } = useContext(UserContext)
    const location = useLocation()
    const navigate = useNavigate()
    const { from, index } = location.state
    const { groupID } = useParams();
    const [invUsername, setUsername] = useState("")
    const [collections, setCollections] = useState(from.collections)
    const [editMode, setEditMode] = useState(false)
    
    function getCollection(params){
        console.log(params)
        setCollections(params)
        groupData.joined[index].collections = params;
        setGroupData(groupData)
        location.state.from.collections = params;
        navigate(".", {state: {from: location.state.from, index: index}});
    }

    async function sendInvite(){
        try{
            const userID = localStorage.getItem("userId");
            const response = await fetch(`${__API__}/groups/${from._id}/invite`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    auth: verification.access_token
                },
                body: JSON.stringify({
                    userID,
                    invUsername
                })
            })

            const data = await response.json();
            console.log(data)

        }catch(error){

        }
    }

    function hidePrompt(e, name){
        let addBox = document.getElementById(`addGroup${name}`);
        if(e === undefined){
            addBox.style.display = "none";
            document.getElementById("createGroup").disabled = false;
            document.getElementById("groupCollections").style.filter = "none";
        }
        if(addBox.style.display !== "none" && e.button === 0){
            addBox.style.display = "none";
            document.getElementById("createGroup").disabled = false;
            document.getElementById("groupCollections").style.filter = "none";
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
        <div className="groupHeader" onMouseDown={(e) => hidePrompt(e, "Collection")}>
        <Header title={`${from.groupName}`} section="GroupCollection" backArrow={"/groups"}
            mainDiv="groupCollections" newAction={ from.permissions === "Admin" ? 
            <>
            <button id="editGroup">Edit Group</button>
            <button id="delGroup" onClick={() => setEditMode(!editMode)}>Delete Group</button>
            <input type="checkbox" id="groupUsers" onChange={showPrompt} style={{display: "none"}}/>
            <label id="groupUsers" htmlFor="groupUsers"><BsFillPersonLinesFill /></label>
            <div className="checkUsers">
                    <span id="groups-NoInvites">Members</span>
            </div>
            </>
            :
            <button id="leaveGroup">Leave Group</button>}/>
            <div className="inviteUser" id="inviteUser" style={{display: "none"}}>
                <label>Username:</label>
                <input value={invUsername} onChange={(e) => setUsername(e.target.value)}></input>
                <button id="inviteBtn" onClick={sendInvite}>Invite</button>
            </div>
        </div>
        <div className="groupContent">
            <div className="groupCollections" id="groupCollections" onMouseDown={(e) => hidePrompt(e, "Collection")}>
                {collections.length !== 0 ?
                    <div className="groupCollection" id="groupCollections">
                        <div className="collections" style={{width: "100%", height: "fit-content", border: "none"}}>
                            {collections.map((collection, index)=> (
                                <CollectionsCard key={collection._id} data={collections} collection={collection} isLogged={true}
                                index={index} returnCollection={getCollection} section="groupsCollection" route={`/groups/${from._id}`}/>
                            ))}
                        </div>
                        {editMode ? <ConfirmationPopup actionTitle="Delete Group" actionBody="delete this group" action={deleteGroup} 
                            hidePrompt={() => setEditMode(!editMode)}/> : null}
                    </div>
                :
                <span id="noGroupCollections">No Collections</span>
                }
            </div>
            <SubmitForm hide={hidePrompt} title={"Create a Collection"} getData={getCollection} section="GroupCollection" isLogged={true}
                labelData={{usePremade: true, title: "Collection", lower: "collection", action: `groups/${groupID}/createCollection`}}/>
        </div>
            
    </div>
}