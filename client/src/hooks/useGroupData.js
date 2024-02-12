import { useCookies } from "react-cookie";

export default function useGroupData() {
    const [verify, ] = useCookies(["access_token"])

    const editGroup = () => {
        console.log("editGroup")
    }

    const deleteGroup = async (groupID) => {
            const userID = window.localStorage.getItem("userId");
        if(userID){
            const groupID = groupID;
            await fetch(`${__API__}/groups/${groupID}/deleteGroup/${userID}`, {
                method: "DELETE", headers: {auth: verify.access_token}, 
            });
        }
        else{
            alert("You need to be logged in to perform this action")
        }
    }

    const leaveGroup = () => {
        console.log("leaveGroup")
    }

    return {editGroup, deleteGroup, leaveGroup}
};
