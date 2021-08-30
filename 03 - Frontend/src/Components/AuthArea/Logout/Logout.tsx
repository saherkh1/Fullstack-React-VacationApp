import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthActionType } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notify";

function Logout(): JSX.Element {
    const history = useHistory();
    useEffect(() => {
        store.dispatch({ type: AuthActionType.UserLoggedOut });
        notify.success("You are now logged out.");
        history.push("/home");
    });
    return <></>;
}

export default Logout;
