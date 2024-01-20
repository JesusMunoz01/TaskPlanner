import '../css/App.css';
import { BsX } from "react-icons/bs";
import { BsList } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';

export const Navbar = ({loginStatus}) => {
    const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
    const [activeTab, setActive] = useState(window.sessionStorage.getItem("selectedRoute"));
    console.log(activeTab)
    
    useEffect(() => {
        if(document.getElementById(activeTab).className !== "navbar active") 
            document.getElementById(activeTab).className = "navbar active";
        }, [])

    const logout = () => {
        removeCookie("access_token")
        window.localStorage.removeItem("userId");
        loginStatus("Logged out");
    }

    const changeActive = (target) => {
        setActive(target)
        window.sessionStorage.setItem("selectedRoute", target)
        const links = document.getElementById("links").children;
        const menu = document.getElementById("menu");
        for(const element of links) {
            if(element.children[0].id === target)
                element.children[0].className = "navbar active";
            else
                element.children[0].className = "";
        };

        menu.checked = false;
    }

    const changeTheme = () => {
        const currentTheme = document.getElementsByClassName('App')[0];
        if(currentTheme.className == "App")
            currentTheme.className = "App white";
        else
            currentTheme.className = "App";
    }

    return <div className="navActions">

        <input type='checkbox' id='menu'/>
        <label for="menu" className='expandLinks'>
            <BsList id='openMenu'/>
            <BsX id='closeMenu'/>
        </label>

        <div className='navContent'>
            <div className="links" id="links">
                <li aria-label='loginLink'>{!cookies.access_token ? (<Link id="Login" onClick={(e) => changeActive(e.target.innerText)} to={"/login"}>
                    <span>Login</span></Link>) : <button onClick={logout}>Logout</button>}</li>
                <li><Link id="Home" onClick={(e) => changeActive(e.target.innerText)} to={"/"}><span>Home</span></Link></li>
                <li><Link id="Collections" onClick={(e) => changeActive(e.target.innerText)} to={"/collections"}><span id='collectionLink'>Collections</span></Link></li>
                <li><Link id="Groups" onClick={(e) => changeActive(e.target.innerText)} to={"/groups"}><span id='groupLink'>Groups</span></Link></li>
            </div>
        </div>
        <div className='modeToggle'>
            <label className="switch">
                <input type="checkbox" onClick={changeTheme}/>
                <span className="slider"></span>
            </label>
        </div>
    </div>
}