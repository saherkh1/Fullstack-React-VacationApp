import { NavLink } from "react-router-dom";
import "./Menu.css";

function Menu(): JSX.Element {
    return (
        <nav className="Menu">
			<NavLink to="/login" exact></NavLink>
        </nav>
    );
}

export default Menu;
