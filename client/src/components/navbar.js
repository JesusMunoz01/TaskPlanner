import { Link } from 'react-router-dom';

export const Navbar = () => {
    return <div>
        <div className="links">
            <li><Link to={"/login"}>Login</Link></li>
            <li><Link to={"/"}>Home</Link></li>
        </div>
    </div>
}