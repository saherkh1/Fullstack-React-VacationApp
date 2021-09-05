import axios from "axios";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { BsX } from "react-icons/bs";
import { matchPath, NavLink, useHistory, useParams } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import { VacationsAction, VacationsActionType } from "../../../Redux/VacationsState";
import config from "../../../Services/Config";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notify";
import socketService from "../../../Services/SocketService";
import "./VacationDetails.css";

interface RouteProps {
    id: string;
}

function VacationDetails(): JSX.Element {
    const history = useHistory();
    const [vacation, setVacation] = useState<VacationModel>();
    const [admin, isAdmin] = useState(false);

    // const bsxStyle: any = {display:'relative',position: 'absolute', top: '3px',right: '3px'};
    const routeProps = useParams<RouteProps>();
    const { register, handleSubmit } = useForm<VacationModel>();


    // const [isLogged,setLogged] = useState(false);
    // const  setLoggedIn = async () => await setLogged(true);
    useEffect(() => {
        activate();

    });
    async function activate() {
        try {
            if (!store.getState().authState.user) history.push("/login");
            else if (store.getState().authState.user.role === "admin") isAdmin(true);
            if (store.getState().VacationsState.Vacations.length === 0) {
                const response = await jwtAxios.get<VacationModel[]>(config.vacationsUrl);
                store.dispatch({ type: VacationsActionType.VacationsDownloaded, payload: response.data });
            }
            setVacation(store.getState().VacationsState.Vacations.find(oneVacation => oneVacation.vacationId === +routeProps.id));
            // console.log(vacation);
        } catch (err) {
            notify.error(err)
        }
    }
    async function send(Vacation: VacationModel) {
        try {
            // Convert product object into FormData object: 
            // (handelDate(Vacation.startTime.toLocaleString()))
            const myFormData = new FormData();
            myFormData.append("destination", Vacation.destination.toString());
            myFormData.append("description", Vacation.description.toString());
            myFormData.append("price", Vacation.price.toString());
            myFormData.append("startTime", handelDate(Vacation.startTime.toLocaleString()));
            myFormData.append("endTime", handelDate(Vacation.endTime.toLocaleString()));
            myFormData.append("image", Vacation.image.item(0));

            const response = await jwtAxios.patch<VacationModel>(config.vacationsUrl + routeProps.id, myFormData);
            const foundVacation = store.getState().VacationsState.Vacations.find(oneVacation => oneVacation.vacationId === +routeProps.id);
            setVacation(foundVacation);

            // store.dispatch();
            const vacationsAction: VacationsAction = { type: VacationsActionType.VacationUpdated, payload: response.data };
            store.dispatch(vacationsAction);
            admin && socketService.send(vacationsAction);
            notify.success("Vacation has been Updated.");

            history.push("/home");
        }
        catch (err) {
            notify.error(err);
        }
    }
    const handelDate = (date: string) => {
        if (!date) return null;
        let newDate = date.split(',');
        const newTime = newDate[1];
        newDate = newDate[0].split('/');
        const final = newDate[2] + "-" + newDate[1] + "-" + newDate[0] + newTime;
        if (!newDate || !newTime || !final) return null;
        return final
    }
    return (
        <div className="VacationDetails">
            <h1>Vacation Details</h1>
            {vacation === undefined ? <>  <br></br>there is nothing to show</> : <Form onSubmit={handleSubmit(send)}>

                <Form.Label>Destination: </Form.Label>
                <Form.Control type="text" plaintext={!admin} readOnly={!admin} defaultValue={vacation.destination}  {...register("destination")} />

                <Form.Label>Description: </Form.Label>
                <Form.Control type="text" plaintext={!admin} readOnly={!admin} defaultValue={vacation.description}   {...register("description")} />

                {admin && <><Form.Label>Image: </Form.Label>
                    <Form.Control type="file" plaintext={!admin} readOnly={!admin} accept="image/*" {...register("image")} /></>}
                {!admin && <img src={config.vacationImagesUrl + vacation.image} alt={vacation.destination} />}

                <Form.Label>Start Date: </Form.Label>
                <Form.Control type="dateTime" plaintext={!admin} readOnly={!admin} defaultValue={new Date(vacation.startTime).toLocaleString()} {...register("startTime")} />

                <Form.Label>End Date: </Form.Label>
                <Form.Control type="dateTime" plaintext={!admin} readOnly={!admin} defaultValue={new Date(vacation.endTime).toLocaleString()} {...register("endTime")} />

                <Form.Label>Price: </Form.Label>
                <Form.Control type="number" plaintext={!admin} readOnly={!admin} defaultValue={vacation.price} step="0.01" {...register("price")} />

                {admin && <button>update</button>}


                <NavLink to="/home">Back to List</NavLink>
            </Form>}
        </div>
    );
}

export default VacationDetails;
