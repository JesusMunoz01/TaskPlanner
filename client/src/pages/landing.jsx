import "../css/landing.css"
//import checkList from "../assets/checkList.png"
import { Link } from "react-router-dom"
const pages = [{route: "/", name: "Basic Task Planner", img: "src/assets/checkList.png"}, {route: "/collections", name: "Task Collections"}, /*{route: "/", name: "Groups"}, {route: "/", name: "home"}*/]

export const Landing = () => {
    return <div className="landingPage">
        {pages.map((page) => (
            <Link to={page.route} className="landingPage-Link">
                <div className="landingPage-Card">
                    <h1>{page.name}</h1>
                    <img src={page.img}></img>
                </div>
            </Link>
        ))}
    </div>
}