import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie'

export const Navbar = ({loginStatus}) => {
    const [cookies, setCookies] = useCookies(["access_token"]);

    const logout = () => {
        setCookies('access_token', "")
        window.localStorage.removeItem("userId");
        loginStatus("Logged out");
    }

    return <div>
        <div className="links">
            <li>{!cookies.access_token ? (<Link to={"/login"}><span>Login</span></Link>) : <button onClick={logout}>Logout</button>}</li>
            <li><Link to={"/"}><span>Home</span></Link></li>
            <li><Link to={"/collections"}><span id='collectionLink'>Collections</span></Link></li>
        </div>
    </div>
}