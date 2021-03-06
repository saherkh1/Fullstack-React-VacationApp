import { VacationsAction, VacationsActionType } from "../../../Redux/VacationsState";
import socketService from "../../../Services/SocketService";
import VacationModel from "../../../Models/VacationModel";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notify";
import config from "../../../Services/Config";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import store from "../../../Redux/Store";
import { BsX } from "react-icons/bs";
import "./AddVacation.css";


function AddVacation(): JSX.Element {
    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<VacationModel>();
    const [admin, isAdmin] = useState(false);

    // If you are not logged in:
    useEffect(() => {
        activate();
        if (!store.getState().authState.user ) {
            notify.error("You are not logged in!");
            history.push("/login");
        }
        if (!(store.getState().authState.user.role === "admin" )) {
            notify.error("(^///^)");
            history.push("/home");
        }
    });
    const activate = () => (store.getState().authState.user.role === "admin") && isAdmin(true);
    async function send(Vacation: VacationModel) {
        try {
            // console.log("Form ",Vacation.startTime.toString()+":00.000Z",Vacation.endTime)
            // const start = new Date(dateHandler(Vacation.startTime.toString()));
            // console.log(start);
            // const end = new Date(dateHandler(Vacation.endTime.toString()))
            // validateStartEndTime(fixFormDate(Vacation.startTime),Vacation.endTime);
            let myFormData = new FormData();
            myFormData.append("destination", Vacation.destination);
            myFormData.append("description", Vacation.description);
            myFormData.append("price", Vacation.price.toString());
            myFormData.append("startTime", Vacation.startTime.toString());
            myFormData.append("endTime", Vacation.endTime.toString());
            myFormData.append("image", Vacation.image.item(0));
          
            // POST to the server the FormData object:
            const response = await jwtAxios.post<VacationModel>(config.vacationsUrl, myFormData);

            // Add the added product to Redux (response.data is the added product which backend sends us back): 
            const vacationsAction: VacationsAction ={ type: VacationsActionType.VacationAdded, payload: response.data };
            store.dispatch(vacationsAction);
            admin && socketService.send(vacationsAction);

            notify.success("Product has been added.");

            history.push("/home");
        }
        catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="Box AddVacation ">
            <h1>Add Vacation</h1>
            <form onSubmit={handleSubmit(send)}>

                <label>Destination: </label>
                <input  {...register("destination", { required: true })} />
                {formState.errors.destination && <span>Missing Destination.</span>}

                <label>Description: </label>
                <input  {...register("description", { required: true })} />
                {formState.errors.description && <span>Missing Description.</span>}

                <label>Image: </label>
                <input type="file" accept="image/*" {...register("image", { required: true })} />
                {formState.errors.image && <span>Missing image.</span>}

                <label>Start Date: </label>
                <input type="datetime-local" {...register("startTime", { required: true })} />
                {formState.errors.startTime && <span>Missing Start Time.</span>}

                <label>End Date: </label>
                <input type="datetime-local" {...register("endTime", { required: true })} />
                {formState.errors.endTime && <span>Missing End Time.</span>}

                <label>Price: </label>
                <input type="number" step="0.01" {...register("price", { required: true, min: 0 })} />
                {formState.errors.price?.type === "required" && <span>Missing price.</span>}
                {formState.errors.price?.type === "min" && <span>Price can't be negative.</span>}

                <button>Add</button>

            </form>
            <NavLink to="/home"> <BsX className="FloatElement TopRight" /> </NavLink>

        </div>
    );
}

export default AddVacation;
