import { useLocation, useParams } from "react-router-dom"
import { Header } from "../components/header";

export const Group = () => {
    const location = useLocation()
    const { from } = location.state
    const { groupID } = useParams();
    // console.log(from)
    // console.log(groupID)

    return <div style={{width: "100%"}}>
        <Header title={`${from.groupName}`} 
            newAction={ from.permissions === "admin" ? <button>Delete Group</button>:
            null}/>
    </div>
}