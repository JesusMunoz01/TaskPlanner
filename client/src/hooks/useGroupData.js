import { useCookies } from "react-cookie";

export default function useGroupData() {
    const [verify, ] = useCookies(["access_token"])

    const editGroup = async (groupID, groupName, groupDescription) => {
        try{
            const userID = localStorage.getItem("userId");
            const response = await fetch(`${__API__}/groups/${groupID}/updateGroup`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    auth: verify.access_token
                },
                body: JSON.stringify({
                    userID,
                    groupName,
                    groupDescription
                })
            })

            const data = await response.json();
            return data;
        }catch(error){

        }
    }

    const deleteGroup = async (groupID) => {
        const userID = window.localStorage.getItem("userId");
        if(userID){
            await fetch(`${__API__}/groups/${groupID}/deleteGroup/${userID}`, {
                method: "DELETE", headers: {auth: verify.access_token}, 
            });
        }
        else{
            alert("You need to be logged in to perform this action")
        }
    }

    const leaveGroup = async (groupID) => {
        const userID = window.localStorage.getItem("userId");
        if(userID){
            await fetch(`${__API__}/groups/${groupID}/leaveGroup/${userID}`, {
                method: "DELETE", headers: {auth: verify.access_token}, 
            });
        }
        else{
            alert("You need to be logged in to perform this action")
        }
    }

    const sendInvite = async (groupID, invUsername) => {
        try{
            const userID = localStorage.getItem("userId");
            const response = await fetch(`${__API__}/groups/${groupID}/invite`, {
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

    return {editGroup, deleteGroup, leaveGroup, sendInvite}
};
