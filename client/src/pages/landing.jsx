import { useState } from "react";
import "../css/landing.css"
//import checkList from "../assets/checkList.png"
import { Link } from "react-router-dom"
import { Header } from "../components/header";
const pages = [
    {route: "/", name: "Basic Task Planner", img: "src/assets/checkList.png", imgSmall: "src/assets/checkListSmall.png", 
        description: "A Basic task planner for keeping track of tasks"
    }, 
    {route: "/collections", name: "Task Collections", img: "src/assets/collections.png", imgSmall: "src/assets/collectionsSmall.png", 
        description: "Create and manage task collections, each with its own tasks"
    },
    {route: "/groups", name: "Groups", img: "src/assets/groups.png", imgSmall: "src/assets/groups.png", 
        description: "Create and join groups, collaborate together by creating different collections and complete their respective tasks"
    },
    /*{route: "/", name: "Groups"}, {route: "/", name: "home"}*/]

export const Landing = () => {
    const [isLarge, setSize] = useState(false);
    const size = window.matchMedia("(max-width: 800px)");
    size.addEventListener("change", (e) => {setSize(e.matches)})
    
    return <div className="landingPage">
        <Header title="Task Planner"/>
        {pages.map((page, index) => (
            <Link to={page.route} className="landingPage-Link">
                <div className="landingPage-Card">
                    <div class="landingPageContent">
                        <h1>{page.name}</h1>
                        <p>{page.description}</p>
                    </div>
                    <div class="landingPageImage">
                        {isLarge ?
                        <img id={`img${index}`} src={page.imgSmall}></img> :
                        <img id={`img${index}`} src={page.img}></img>
                        }
                    </div>
                </div>
            </Link>
        ))}
    </div>
}