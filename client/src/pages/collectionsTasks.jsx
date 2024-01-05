import { useState } from "react"
import { useParams } from "react-router-dom"

export const CollectionTasks = (collections) => {
    let { collectionID } = useParams()
    let [intCollectionID] = useState(parseInt(collectionID))
    const [allCollectionTasks] = useState(collections.data);
    const [collectionTasks, setCollectionTasks] = useState(JSON.parse(allCollectionTasks).filter((col) => col._id === intCollectionID).pop());
    
    console.log(collectionTasks)
    return <div>
        <h1>{collectionTasks.collectionTitle}</h1>Test
    </div>
}