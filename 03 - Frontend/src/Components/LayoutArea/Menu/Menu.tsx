import { NavLink } from "react-router-dom";
import "./Menu.css";

function Menu(): JSX.Element {
    return (
        <nav className="Menu">
			<NavLink to="/home" exact>Home</NavLink>
			<NavLink to="/products" exact>Products</NavLink>
			<NavLink to="/support" exact>Support</NavLink>
			<NavLink to="/contact-us" exact>Contact Us</NavLink>
        </nav>
    );
}

export default Menu;
