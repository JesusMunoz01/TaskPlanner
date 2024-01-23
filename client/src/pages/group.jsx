import { useLocation, useParams } from "react-router-dom"

export const Group = (data) => {
    const location = useLocation()
    const { from } = location.state
    const { groupID } = useParams();
    console.log(from)
    console.log(groupID)

    return <div>Test</div>
}