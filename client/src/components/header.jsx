import "../css/groups.css"
import { BsFillEnvelopeFill } from "react-icons/bs";
import { BsX } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';


export const Header = ({title, newAction, section}) => {

    function displayAddPrompt(e){
        e.preventDefault();
        let addBox = document.getElementById(`addGroup${section}`);
        addBox.style.display = "flex";
        document.getElementById("createGroup").disabled = true;
    }

    return <div>
            <div className="groupsBox-header">
                <h1>{title}</h1>
                <div className="groupsBox-headerActions">
                    <button id="createGroup" onClick={(e) => displayAddPrompt(e)}>Create New</button>
                    {newAction ? newAction : null}
                </div>
            </div>
    </div>
}
