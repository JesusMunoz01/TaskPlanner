import "../css/collections.css"
import { useContext, useEffect, useState } from "react";
import { CollectionsCard } from "../components/collectionsCard";
import { UserContext } from "../App";
import { Header } from "../components/header";
import { SubmitForm } from "../components/submitForm";

export const Collections = (data) => {
    const { collectionData, setCollectionData } = useContext(UserContext)
    const [collections, setCollections] = useState(collectionData);
    const [isUserLogged, ] = useState(data.isLogged)

    function getCollection(params){
        if(isUserLogged){
            setCollectionData((prev) => prev = params)
            setCollections((prev) => prev = params)
        }
        else{
            const getUpdatedLocal = window.localStorage.getItem("localCollectionData");
            setCollections(getUpdatedLocal)
            setCollectionData(getUpdatedLocal)
        }
    }

/*
    async function sendCollectionTask(e){
        e.preventDefault();
            try{
                const userID = window.localStorage.getItem("userId");
                const res = await fetch(`${__API__}/addCollectionTask`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: cookies.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        title,
                        desc,
                        status: "incomplete"
                        })
                    });
                const task = await res.json()
                if(tasks == null)
                setCollections([task])
                setCollections([...tasks, task])
                setCurrentFilter([...tasks, task])
            }catch(error){
                console.log(error)
            }

        setCollectionTitle('');
        setCollectionDesc('');
    }
*/

    // async function changeStatus(collectionStatus, collectionID){
    //         try{
    //             const userID = window.localStorage.getItem("userId");
    //             const res = await fetch(`${__API__}/updateTask`, {
    //                 method: "POST", headers: {
    //                     'Content-Type': 'application/json',
    //                     auth: cookies.access_token
    //                 },
    //                 body: JSON.stringify({
    //                     userID,
    //                     collectionID,
    //                     collectionStatus
    //                     })
    //                 });
    //             const updatedValues = await res.json()
    //             const index = updatedValues.findIndex((collection => collection._id === collectionID))
    //             updatedValues[index].status = `${collectionStatus}`
    //             setCollections(updatedValues)
    //             //setCurrentFilter(updatedValues)
    //         }catch(error){
    //             console.log(error)
    //         }
    // }

/*
    function filterTask(action){
        const selected = document.getElementById(`${action}`)
        let data = [];
        if(!isUserLogged)
        data = JSON.parse(tasks)
        else
        data = tasks;
        switch(action){
            case "filter1": // All Tasks Filter
                selected.style.color = "green"
                document.getElementById("filter2").style.color = "white"
                document.getElementById("filter3").style.color = "white"
                isUserLogged ? 
                setCurrentFilter(data) : 
                setCurrentFilter(JSON.stringify(data));
                break;
            case "filter2": // Incomplete Tasks Filter
                selected.style.color = "green"
                document.getElementById("filter1").style.color = "white"
                document.getElementById("filter3").style.color = "white"
                isUserLogged ?
                setCurrentFilter(data.filter((task) => task.status === "complete")) :
                setCurrentFilter(JSON.stringify(data.filter((task) => task.status === "complete")))
                break;
            case "filter3": // Completed Tasks Filter
                selected.style.color = "green"
                document.getElementById("filter1").style.color = "white"
                document.getElementById("filter2").style.color = "white"
                isUserLogged ?
                setCurrentFilter(data.filter((task) => task.status === "incomplete")) :
                setCurrentFilter(JSON.stringify(data.filter((task) => task.status === "incomplete")))
                break;
            default:
                break;
        }

    }
*/

    function hidePrompt(e){
        let addBox = document.getElementById(`addCollections`);
        if(e === undefined){
            addBox.style.display = "none";
            document.getElementById("createGroup").disabled = false;
            document.getElementById("collections").style.filter = "none";
        }
        if(addBox.style.display !== "none" && e.button === 0){
            addBox.style.display = "none";
            document.getElementById("createGroup").disabled = false;
            document.getElementById("collections").style.filter = "none";
        }
    }


    return <div className="collectionsHome" id="collectionsHome">
        <div style={{width: '100%', height: "100%"}}>
            <Header title={"Collections"} section="Collections" mainDiv="collections"/>
            <div className="collectionsBox" >
                <div className="collections" id="collections" onMouseDown={hidePrompt}>
                {isUserLogged ? 
                    collections.length !== 0 ? 
                        // Section for: Logged user with collections -------------------------------------------
                        collections.map((collection, index)=> (
                            <CollectionsCard key={collection._id} data={collections} collection={collection} isLogged={true}
                            index={index} returnCollection={getCollection} section="collections"/>
                        )) : 
                            // Section for: Logged user without collections -------------------------------------------
                        <span id="collectionEmptyPrompt">Currently no Collections</span>
                    :
                        collections ? 
                        // Section for: Not logged user with collections -------------------------------------------
                        JSON.parse(collectionData).map((collection, index)=> (
                            <CollectionsCard key={collection._id} data={collections} collection={collection} isLogged={false}
                            index={index} returnCollection={getCollection} section="collections"/>
                        )) : 
                            // Section for: Not logged user without collections -------------------------------------------
                        <span id="collectionEmptyPrompt">Currently no Collections</span>
                        
                }
        </div>
        <div id="test">
            <SubmitForm hide={hidePrompt} title={"Create a Collection"} getData={getCollection} section={"Collections"}
                labelData={{usePremade: true, title: "Collection", lower: "collection", action: `addCollection`}} isLogged={isUserLogged}/>
        </div>
                
            </div>
        </div> 
    </div>
}