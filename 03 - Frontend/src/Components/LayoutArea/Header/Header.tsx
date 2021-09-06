import "./Header.css";
import { useEffect, useState } from "react";
import store from "../../../Redux/Store";
import { NavLink } from "react-router-dom";

function Header(): JSX.Element {
    const [logged, isLogged] = useState(false);
    const [admin, isAdmin] = useState(false);

    useEffect(() => {
        activate();
    });
    const activate = () => {
        isLogged(store.getState().authState.user !== null);
        (store.getState().authState.user?.role === "admin") && isAdmin(true);

    }
    return (
        <div className="Header">
            
            <NavLink to="/home">Home</NavLink>
            {admin && <NavLink to="/chart">chart</NavLink>}
            {logged?<NavLink to="/logout">logout</NavLink>:<><NavLink to="/login">Login</NavLink><NavLink to="/logout">logout</NavLink></>}

        </div>
    );
}

export default Header;
