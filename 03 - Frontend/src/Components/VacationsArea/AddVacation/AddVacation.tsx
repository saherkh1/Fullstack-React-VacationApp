import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import { VacationsActionType } from "../../../Redux/VacationsState";
import config from "../../../Services/Config";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notify";
import { BsX } from "react-icons/bs";
import "./AddVacation.css";
import axios from "axios";


function AddVacation(): JSX.Element {
    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<VacationModel>();
    // const bsxStyle: any = { display: 'relative', position: 'absolute', top: '3px', right: '3px' };

    // If you are not logged in:
    useEffect(() => {
        if (!store.getState().authState.user) {
            notify.error("You are not logged in!");
            history.push("/login");
        }
    });

    async function send(Vacation: VacationModel) {
        try {
            console.log(Vacation);
            console.log("destination "+Vacation.destination);
            console.log("description "+Vacation.description.toString());
            console.log("price "+Vacation.price);
            console.log("startTime "+Vacation.startTime.toString());
            console.log("endTime "+Vacation.endTime.toString());
            console.log("image "+Vacation.image.item(0));

            // Convert product object into FormData object: 
            let myFormData = new FormData();
            myFormData.append("destination", Vacation.destination);
            myFormData.append("description", Vacation.description);
            myFormData.append("price", Vacation.price.toString());
            myFormData.append("startTime", Vacation.startTime.toString());
            myFormData.append("endTime", Vacation.endTime.toString());
            myFormData.append("image", Vacation.image.item(0));
          
            // POST to the server the FormData object:
            // const headers = { "authorization": "Bearer " + store.getState().authState.user?.token };
            // const headers = { "Content-Type": "multipart/form-data" };
            const response = await axios.post<VacationModel>(config.vacationsUrl, myFormData);
            // const response = await jwtAxios.post<VacationModel>(config.vacationsUrl, myFormData);
            console.log("response: ",response);

            // Add the added product to Redux (response.data is the added product which backend sends us back): 
            // store.dispatch({ type: VacationsActionType.VacationAdded, payload: response.data });

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

                {/* <BsX style={bsxStyle} /> */}

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
        </div>
    );
}

export default AddVacation;
