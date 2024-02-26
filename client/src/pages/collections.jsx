import "../css/collections.css"
import { useContext, useState } from "react";
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
                            index={index} returnCollection={getCollection} section="collections" link={`/collections/${collection._id}`}/>
                        )) : 
                            // Section for: Logged user without collections -------------------------------------------
                        <span id="collectionEmptyPrompt">Currently no Collections</span>
                    :
                        collections ? 
                        // Section for: Not logged user with collections -------------------------------------------
                        JSON.parse(collections).map((collection, index)=> (
                            <CollectionsCard key={collection._id} data={collections} collection={collection} isLogged={false}
                            index={index} returnCollection={getCollection} section="collections" link={`/collections/${collection._id}`}/>
                        )) : 
                            // Section for: Not logged user without collections -------------------------------------------
                        <span id="collectionEmptyPrompt">Currently no Collections</span>
                        
                }
        </div>
        <div id="test">
            <SubmitForm hide={hidePrompt} title={"Create a Collection"} getData={getCollection} section="Collections"
                labelData={{usePremade: true, title: "Collection", lower: "collection", action: `addCollection`}} isLogged={isUserLogged}/>
        </div>
                
            </div>
        </div> 
    </div>
}