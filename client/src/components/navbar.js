import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie'

export const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"]);

    const logout = () => {
        setCookies('access_token', "")
        window.localStorage.removeItem("userId");
    }

    return <div className='navbar'>
        <div className="links">
            <li><Link to={"/login"}>Login</Link></li>
            <li>{!cookies.access_token ? (<Link to={"/"}>Home</Link>) : <button onClick={logout}>Logout</button>}</li>
        </div>
    </div>
}