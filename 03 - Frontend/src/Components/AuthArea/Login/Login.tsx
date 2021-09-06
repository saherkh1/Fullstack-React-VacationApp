import axios from "axios";
import { useForm } from "react-hook-form";
import { NavLink, useHistory } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import UserModel from "../../../Models/UserModel";
import { AuthActionType } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import config from "../../../Services/Config";
import notify from "../../../Services/Notify";
import "./Login.css";

function Login(): JSX.Element {

    const history = useHistory();
    const { register, handleSubmit } = useForm<CredentialsModel>();

    async function send(credentials: CredentialsModel) {
        try {
            const response = await axios.post<UserModel>(config.loginUrl, credentials);
            store.dispatch({ type: AuthActionType.UserLoggedIn, payload: response.data });
            notify.success("You are now logged in.");
            history.push("/home");
        }
        catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="Login Box">

            <h2>Login</h2>

            <form onSubmit={handleSubmit(send)}>

                <label>Username: </label>
                <input type="text" {...register("username")} />

                <label>Password: </label>
                <input type="password" {...register("password")} />
                <NavLink to="/register" >Register now</NavLink>
                <button>Login</button>

            </form>

        </div>
    );
}

export default Login;
