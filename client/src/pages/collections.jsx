import "../css/collections.css"
import { useContext, useState } from "react";
import { useCookies } from 'react-cookie';
import { BsGearFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { CollectionsCard } from "../components/collectionsCard";
import { UserContext } from "../App";
import { Header } from "../components/header";
import { SubmitForm } from "../components/submitForm";

export const Collections = (data) => {
    const { collectionData, setCollectionData } = useContext(UserContext)
    const [collections, setCollections] = useState(data.data);
    const [isUserLogged, ] = useState(data.isLogged)
    const [collectionTitle, setCollectionTitle] = useState("");
    const [collectionDescription, setCollectionDesc] = useState("");
    const [updtCollectionTitle, updateCollectionTitle] = useState("");
    const [updtCollectionDescription, updateCollectionDesc] = useState("");
    const [cookies, ] = useCookies(["access_token"]);

    function getCollection(params){
        if(isUserLogged){
            setCollections(params)
            setCollectionData(params)
        }
        else{
            const getUpdatedLocal = window.localStorage.getItem("localCollectionData");
            setCollections(getUpdatedLocal)
            setCollectionData(getUpdatedLocal)
        }
    }

    async function sendCollection(e){
        e.preventDefault();
        if(isUserLogged){
            try{
                const userID = window.localStorage.getItem("userId");
                const res = await fetch(`${__API__}/addCollection`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: cookies.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        collectionTitle,
                        collectionDescription,
                        })
                    });
                const collection = await res.json()
                if(collection == null)
                    console.log("Failed to create collection")
                else{
                    setCollections([...collections, collection])
                    data.updateCollection([...collections, collection])
                }
            }catch(error){
                console.log(error)
            }
        }
        else{
            const getLocal = window.localStorage.getItem("localCollectionData");
            let nextId = 0;
            let localCollection = [];
            let lastCollectionID = [];
            if(getLocal)
                localCollection = JSON.parse(window.localStorage.getItem("localCollectionData"))
            let localCopy = JSON.parse(window.localStorage.getItem("localCollectionData"))
            if(localCopy)
                lastCollectionID = localCopy.pop();
            if(lastCollectionID.length !== 0)
                nextId = lastCollectionID._id + 1;

                const newCollection = {
                    collectionTitle: collectionTitle, collectionDescription: collectionDescription, 
                    _id: nextId, tasks: [], status:"Incomplete"
                }

            localCollection.push(newCollection)
            window.localStorage.setItem("localCollectionData", JSON.stringify(localCollection))
            const getUpdatedLocal = window.localStorage.getItem("localCollectionData");
            setCollections(getUpdatedLocal);
            data.updateCollection(getUpdatedLocal)
            // setCurrentFilter(getUpdatedLocal);
        }

        setCollectionTitle('');
        setCollectionDesc('');
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
    async function delCollection(collectionID){
        if(isUserLogged){
            const userID = window.localStorage.getItem("userId");
            await fetch(`${__API__}/deleteCollection/${userID}/${collectionID}`, {
                method: "DELETE", headers: {auth: cookies.access_token}, 
            });

            setCollections(collections.filter((collection) => collection._id !== collectionID))
            //setCurrentFilter(collections);
        }
        else{
            const delItem = JSON.parse(collections).filter((collection) => collection._id !== collectionID)
            window.localStorage.setItem("localCollectionData", JSON.stringify(delItem))
            if(JSON.parse(collections).length === 1){
                window.localStorage.removeItem("localCollectionData");
                setCollections(null);
                //setCurrentFilter(null);
            }else{
                const getUpdatedLocal = window.localStorage.getItem("localCollectionData");
                setCollections(getUpdatedLocal);
                data.updateCollection(getUpdatedLocal);
                //setCurrentFilter(getUpdatedLocal);
            }
        }
    }

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

    async function changeInfo(collectionID, oldColTitle, oldColDesc){
        let newColTitle = "", newColDesc = "";

        if(updtCollectionTitle === "")
            newColTitle = oldColTitle;
        else
            newColTitle = updtCollectionTitle;
        if(updtCollectionDescription === "")
            newColDesc = oldColDesc;
        else
            newColDesc = updtCollectionDescription;

        if(isUserLogged)
            try{
                const userID = window.localStorage.getItem("userId");
                const res = await fetch(`${__API__}/updateCollection`, {
                    method: "POST", headers: {
                        'Content-Type': 'application/json',
                        auth: cookies.access_token
                    },
                    body: JSON.stringify({
                        userID,
                        collectionID,
                        newColTitle,
                        newColDesc
                        })
                    });
                const updatedValues = await res.json()
                const index = updatedValues.findIndex((collection => collection._id === collectionID))
                updatedValues[index].collectionTitle = `${newColTitle}`
                updatedValues[index].collectionDescription = `${newColDesc}`
                setCollections(updatedValues)
                //setCurrentFilter(updatedValues)
            }catch(error){
                console.log(error)
            }
        else{
            const localCollection = JSON.parse(window.localStorage.getItem("localCollectionData"))
            const index = localCollection.findIndex((collection => collection._id === collectionID))
            localCollection[index].collectionTitle = `${newColTitle}`
            localCollection[index].collectionDescription = `${newColDesc}`
            window.localStorage.setItem("localCollectionData", JSON.stringify(localCollection))
            const getUpdatedLocal = window.localStorage.getItem("localCollectionData");
            setCollections(getUpdatedLocal);
            data.updateCollection(getUpdatedLocal);
            //setCurrentFilter(getUpdatedLocal);
        }

        updateCollectionTitle("");
        updateCollectionDesc("");

    }
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
    function displayEdit(id){
        updateCollectionTitle("")
        updateCollectionDesc("")

        const currentMode = document.getElementById(`colSetting${id}`).className
        var list = document.getElementsByClassName("editCollection active")

        Array.prototype.forEach.call(list, (item) => {
            item.className = "editCollection"
        })

        if(currentMode === "editCollection active")
            document.getElementById(`colSetting${id}`).className = "editCollection"
        else
            document.getElementById(`colSetting${id}`).className = "editCollection active"
    }

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
                        JSON.parse(collections).map((collection, index)=> (
                            <CollectionsCard key={collection._id} data={collections} collection={collection} isLogged={false}
                            index={index} returnCollection={getCollection} section="collections"/>
                        )) : 
                            // Section for: Not logged user without collections -------------------------------------------
                        <span id="collectionEmptyPrompt">Currently no Collections</span>
                        
                }
        </div>
        <div id="test">
            <SubmitForm hide={hidePrompt} title={"Create a Collection"} getData={getCollection} section={"Collections"}
                labelData={{usePremade: true, title: "Collection", lower: "collection", action: `createCollection`}} isLogged={isUserLogged}/>
        </div>
                
            </div>
        </div> 
    </div>
}