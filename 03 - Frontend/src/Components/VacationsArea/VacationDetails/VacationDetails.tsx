import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsX } from "react-icons/bs";
import { matchPath, NavLink, useHistory, useLocation, useParams } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import { VacationsActionType } from "../../../Redux/VacationsState";
import config from "../../../Services/Config";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notify";
import "./VacationDetails.css";

interface RouteProps{
    id: string;
}

function VacationDetails(): JSX.Element {
    const history = useHistory();
    const [vacation, setVacation]= useState<VacationModel>();
    // const bsxStyle: any = {display:'relative',position: 'absolute', top: '3px',right: '3px'};
    const routeProps = useParams<RouteProps>();
    const { register, handleSubmit } = useForm<VacationModel>();
    

    // const [isLogged,setLogged] = useState(false);
    // const  setLoggedIn = async () => await setLogged(true);
    useEffect(() => {
        // if (store.getState().authState.user) setLoggedIn();
        activate();
        
    });
      async function activate() {

        if (store.getState().VacationsState.Vacations.length === 0) {
            const response = await axios.get<VacationModel[]>(config.vacationsUrl);
            store.dispatch({ type: VacationsActionType.VacationsDownloaded, payload: response.data });
        }
        setVacation(store.getState().VacationsState.Vacations.find(oneVacation => oneVacation.vacationId === +routeProps.id));
        console.log("vacation = " + vacation);
    }
    async function send(Vacation: VacationModel) {
        try {
            // Convert product object into FormData object: 
            (handelDate(Vacation.startTime.toLocaleString()))
            const myFormData = new FormData();
            myFormData.append("destination", Vacation.destination.toString());
            myFormData.append("description", Vacation.description.toString());
            myFormData.append("price", Vacation.price.toString());
            myFormData.append("startTime", Vacation.startTime.toLocaleString().replace(',',''));
            myFormData.append("endTime",Vacation.endTime.toLocaleString().replace(',',''));
            myFormData.append("image", Vacation.image.item(0));

            // POST to the server the FormData object:
            // const headers = { "authorization": "Bearer " + store.getState().authState.user?.token };
            const response = await axios.patch<VacationModel>(config.vacationsUrl + routeProps.id, myFormData );
            // const response = await jwtAxios.patch<VacationModel>(config.vacationsUrl + routeProps.id, myFormData);
            const foundVacation = store.getState().VacationsState.Vacations.find(oneVacation => oneVacation.vacationId === +routeProps.id);
            // console.log(foundVacation);
            console.log(response);
            console.log(foundVacation);
            setVacation(foundVacation);

            // Add the added product to Redux (response.data is the added product which backend sends us back): 
            store.dispatch({ type: VacationsActionType.VacationUpdated, payload: response.data });

            // Success message: 
            notify.success("Vacation has been Updated.");

            // Navigate to "/products" route: 
            history.push("/home");
        }
        catch (err) {
            notify.error(err);
        }
    }
const handelDate = (date : string) => {
    let newDate = date.split(',');
    const newTime = newDate[1];
    newDate = newDate[0].split('/');
    const final = newDate[2]+"-"+newDate[1]+"-"+newDate[0]+newTime;
    return final
}
    return (
        <div className="VacationDetails">
            <h1>Vacation Details</h1>
            {vacation === undefined ? <>there is nothing to show</>:<form onSubmit={handleSubmit(send)}>

                <label>Destination: </label>
                <input type="text" {...register("destination")}/>

                <label>Description: </label>
                <input type="text" {...register("description")}/>
 
                <label>Image: </label>
                <input type="file"   accept="image/*" {...register("image")}/>

                <label>Start Date: </label>
                <input type="dateTime"  {...register("startTime")} />

                <label>End Date: </label>
                <input type="dateTime" {...register("endTime")}/>

                <label>Price: </label>
                <input type="number"  step="0.01" {...register("price")}/>

                <button>update</button>

                <NavLink to="/home">Back to List</NavLink>
            </form>}
        </div>
    );
}

export default VacationDetails;
