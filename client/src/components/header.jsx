import { Link } from "react-router-dom";
import "../css/groups.css"
import { BsArrowLeft, BsList, BsX } from "react-icons/bs";


export const Header = ({title, backArrow, newAction, section, mainDiv}) => {

    function displayAddPrompt(e){
        e.preventDefault();
        let addBox = document.getElementById(`add${section}`);
        addBox.style.display = "flex";
        document.getElementById("createGroup").disabled = true;
        document.getElementById(mainDiv).style.filter = "blur(20px)";
    }

    return <>
            <div className="groupsBox-header">
                <div className="groupsBox-headerLeft">
                    {backArrow  ? <Link id="goBack" to={`${backArrow}`}><BsArrowLeft /></Link> : null}
                    <h1 aria-label={`${title}-Header`}>{title}</h1>
                </div>

                <input type='checkbox' id='actionMenu'/>
                <label htmlFor="actionMenu" className='expandActions'>
                    <BsList id='openActionMenu'/>
                    <BsX id='closeActionMenu'/>
                </label>

                <div className="groupsBox-headerActions">
                    <button id="createGroup" aria-label="createGroup" onClick={(e) => displayAddPrompt(e)}>Create New</button>
                    {newAction ? newAction : null}
                </div>
            </div>
    </>
}
