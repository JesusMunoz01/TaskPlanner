import '../css/App.css';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export const Navbar = ({loginStatus}) => {
    const [cookies, setCookies, removeItem] = useCookies(["access_token"]);

    const logout = () => {
        removeItem("access_token")
        window.localStorage.removeItem("userId");
        loginStatus("Logged out");
    }

    const changeActive = (target) => {
        const links = document.getElementById("links").children
        for(const element of links) {
            if(element.children[0].id === target)
                element.children[0].className = "navbar active";
            else
                element.children[0].className = "";
        };
    }

    const changeTheme = () => {
        const currentTheme = document.getElementsByClassName('App')[0];
        if(currentTheme.className == "App")
            currentTheme.className = "App white";
        else
            currentTheme.className = "App";

        console.log(currentTheme)
    }

    return <div className="navActions">
        <div className="links" id="links">
            <li aria-label='loginLink'>{!cookies.access_token ? (<Link id="Login" onClick={(e) => changeActive(e.target.innerText)} to={"/login"}>
                <span>Login</span></Link>) : <button onClick={logout}>Logout</button>}</li>
            <li ><Link id="Home" className="navbar active" onClick={(e) => changeActive(e.target.innerText)} to={"/"}><span>Home</span></Link></li>
            <li><Link id="Collections" onClick={(e) => changeActive(e.target.innerText)} to={"/collections"}><span id='collectionLink'>Collections</span></Link></li>
        </div>
        <div className='modeToggle'>
            <label class="switch">
                <input type="checkbox" onClick={changeTheme}/>
                <span class="slider"></span>
            </label>
        </div>
    </div>
}