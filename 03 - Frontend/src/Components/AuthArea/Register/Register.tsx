import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { AuthActionType } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import config from "../../../Services/Config";
import notify from "../../../Services/Notify";
import "./Register.css";

function Register(): JSX.Element {

    const history = useHistory();
    const { register, handleSubmit } = useForm<UserModel>(); //useForm Connects the data to the model
    
    //form will call this function on Submit 
    async function send(user: UserModel) {
        try {
            const response = await axios.post<UserModel>(config.registerUrl, user);
            store.dispatch({ type: AuthActionType.UserRegistered, payload: response.data });
            notify.success("You have been successfully registered!");
            history.push("/home");
        }
        catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="Register Box">

            <h2>Register</h2>

            <form onSubmit={handleSubmit(send)}>

                <label>First name: </label>
                {/* first name will connect the firstName to the userModel  */}
                <input type="text" {...register("firstName")} /> 

                <label>Last name: </label>
                <input type="text" {...register("lastName")} />

                <label>Username: </label>
                <input type="text" {...register("username")} />

                <label>Password: </label>
                <input type="password" {...register("password")} />

                <button>Register</button>

            </form>

        </div>
    );
}

export default Register;
