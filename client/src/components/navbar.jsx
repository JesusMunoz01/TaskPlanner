import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie'

export const Navbar = ({loginStatus}) => {
    const [cookies, setCookies] = useCookies(["access_token"]);

    const logout = () => {
        setCookies('access_token', "")
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

    return <div>
        <div className="links" id="links">
            <li aria-label='loginLink'>{!cookies.access_token ? (<Link id="Login" onClick={(e) => changeActive(e.target.innerText)} to={"/login"}>
                <span>Login</span></Link>) : <button onClick={logout}>Logout</button>}</li>
            <li ><Link id="Home" className="navbar active" onClick={(e) => changeActive(e.target.innerText)} to={"/"}><span>Home</span></Link></li>
            <li><Link id="Collections" onClick={(e) => changeActive(e.target.innerText)} to={"/collections"}><span id='collectionLink'>Collections</span></Link></li>
        </div>
    </div>
}