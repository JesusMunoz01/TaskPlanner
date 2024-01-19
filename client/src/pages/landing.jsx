import { useState } from "react";
import "../css/landing.css"
//import checkList from "../assets/checkList.png"
import { Link } from "react-router-dom"
const pages = [{route: "/", name: "Basic Task Planner", img: "src/assets/checkList.png", imgSmall: "src/assets/checkListSmall.png", description: "Basic task planner"}, 
    {route: "/collections", name: "Task Collections", img: "src/assets/collections.png", imgSmall: "src/assets/collectionsSmall.png", description: "Collection of Tasks"}, 
    /*{route: "/", name: "Groups"}, {route: "/", name: "home"}*/]

export const Landing = () => {
    const [isLarge, setSize] = useState(false);
    const size = window.matchMedia("(max-width: 800px)");
    size.addEventListener("change", (e) => {setSize(e.matches)})
    
    return <div className="landingPage">
        <h1 id="landingPage-Title">Task Planner</h1>
        {pages.map((page, index) => (
            <Link to={page.route} className="landingPage-Link">
                <div className="landingPage-Card">
                    <h1>{page.name}</h1>
                    <div class="landingPageContent">
                        {isLarge ?
                        <img id={`img${index}`} src={page.imgSmall}></img> :
                        <img id={`img${index}`} src={page.img}></img>
                        }
                        <p>{page.description}</p>
                    </div>
                </div>
            </Link>
        ))}
    </div>
}