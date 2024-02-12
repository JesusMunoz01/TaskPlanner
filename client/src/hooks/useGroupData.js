
export default function useGroupData() {

    const editGroup = () => {
        console.log("editGroup")
    }

    const deleteGroup = async () => {
        if(isUserLogged){
            const userID = window.localStorage.getItem("userId");
            const collectionID = currentCollection._id;
            await fetch(`${__API__}/deleteCollection/${userID}/${collectionID}/tasks/${taskID}`, {
                method: "DELETE", headers: {auth: check.access_token}, 
            });
            const deletedItem = collectionTasks.filter((task) => task._id !== taskID);
            let collectionsData = fetchCollections();
            collectionsData[currentCollectionIndex].tasks = deletedItem;
            setCollectionTasks(deletedItem)
            currentCollection.tasks = deletedItem;
            setCurrentCollection(currentCollection);
            filterTask(filterType, deletedItem);
            collections.updateCollection(collectionsData)
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
