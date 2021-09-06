import { VacationsAction, VacationsActionType, } from "../../../Redux/VacationsState";
import { getISOUserFriendlyString } from "../../../Services/DateService";
import { NavLink, useHistory, useParams } from "react-router-dom";
import socketService from "../../../Services/SocketService";
import VacationModel from "../../../Models/VacationModel";
import jwtAxios from "../../../Services/jwtAxios";
import config from "../../../Services/Config";
import notify from "../../../Services/Notify";
import store from "../../../Redux/Store";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import "./VacationDetails.css";
import { getVacationAsync, isVacationsInStore } from "../../../Services/vacationService";
import { isItTheAdminUser, isUserLoggedIn } from "../../../Services/UserService";

interface RouteProps {
    id: string;
}



function VacationDetails(): JSX.Element {
    const { register, handleSubmit } = useForm<VacationModel>();
    let [vacation, setVacation] = useState<VacationModel>(null);
    const [admin, isAdmin] = useState(false);
    // const [loading, isLoading] = useState(true);
    const routeProps = useParams<RouteProps>();
    const history = useHistory();

    useEffect(() => {
        activate();
        console.log("fire!")
    });

    async function activate() {
        try {
            if (!isUserLoggedIn())
                history.push("/login")
            else if (isItTheAdminUser)
                isAdmin(true);
            if (vacation?.vacationId === undefined)
                setVacation(getVacationAsync(+routeProps.id))

            //     setVacation(response.data.find(oneVacation => oneVacation.vacationId === +routeProps.id));
            // if (!isUserLoggedIn()) history.push("/login");
            // else if (isItTheAdminUser) isAdmin(true);
            //there is no store vacations

            // if (store.getState().VacationsState.Vacations.length === 0) {
            //     const response = await jwtAxios.get<VacationModel[]>(config.vacationsUrl);
            //     store.dispatch({ type: VacationsActionType.VacationsDownloaded, payload: response.data });
            //     setVacation({ ...response.data.find(oneVacation => oneVacation.vacationId === +routeProps.id) });
            //     console.log("1:I got the vacation", vacation)
            // }
            //there is a store vacations
            // else
            //there is no local vacation, but it exist in the store
            // if (!vacation) {
            //     setVacation({ ...store.getState().VacationsState.Vacations.find(oneVacation => oneVacation.vacationId === +routeProps.id) });
            //     console.log("I got the vacation");
            //     // vacation = { ...store.getState().VacationsState.Vacations.find(oneVacation => oneVacation.vacationId === +routeProps.id) };
            // }
            //there is no local storage vacation


            // console.log("activate",vacation);
            // console.log("the time", store.getState().VacationsState.Vacations)   
        } catch (err) {
            notify.error(err)
        }
    }
    async function send(Vacation: VacationModel) {
        try {
            // console.log(Vacation.startTime === "" )
            // const start = dateHandler(Vacation.startTime.toLocaleString())
            // const end = dateHandler(Vacation.endTime.toLocaleString())
            // validateStartEndTime(Vacation.startTime, Vacation.endTime);
            const myFormData = new FormData();
            myFormData.append("destination", Vacation.destination.toString());
            myFormData.append("description", Vacation.description.toString());
            myFormData.append("price", Vacation.price.toString());
            myFormData.append("startTime", Vacation.startTime.toString());
            myFormData.append("endTime", Vacation.endTime.toString());
            myFormData.append("image", Vacation.image.item(0));

            const response = await jwtAxios.patch<VacationModel>(config.vacationsUrl + routeProps.id, myFormData);
            //const foundVacation = store.getState().VacationsState.Vacations.find(oneVacation => oneVacation.vacationId === +routeProps.id);
            //setVacation(foundVacation);
            const vacationsAction: VacationsAction = { type: VacationsActionType.VacationUpdated, payload: response.data };
            store.dispatch(vacationsAction);
            // vacation = { ...store.getState().VacationsState.Vacations.find(oneVacation => oneVacation.vacationId === +routeProps.id) };
            setVacation({ ...store.getState().VacationsState.Vacations.find(oneVacation => oneVacation.vacationId === +routeProps.id) });
            admin && socketService.send(vacationsAction);
            notify.success("Vacation has been Updated.");

            history.push("/home");
        }
        catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="VacationDetails">
            <h1>Vacation Details</h1>
            {vacation?.vacationId === undefined
                ? <><h3>nothing to show</h3></>
                : <Form onSubmit={handleSubmit(send)}>

                    <Form.Label>Destination: </Form.Label>
                    <Form.Control type="text" plaintext={!admin} readOnly={!admin} defaultValue={vacation.destination} {...register("destination")} />

                    <Form.Label>Description: </Form.Label>
                    <Form.Control type="text" plaintext={!admin} readOnly={!admin} defaultValue={vacation.description} {...register("description")} />

                    {admin && <><Form.Label>Image: </Form.Label>
                        <Form.Control type="file" plaintext={!admin} readOnly={!admin} accept="image/*" {...register("image")} /></>}
                    {!admin && <img src={config.vacationImagesUrl + vacation.image} alt={vacation.destination} />}

                    <Form.Label>Start Date: </Form.Label>
                    <Form.Control type="text" plaintext={!admin} readOnly={!admin} defaultValue={getISOUserFriendlyString(vacation.startTime)}
                        {...register("startTime", { valueAsDate: true, })} />

                    <Form.Label>End Date: </Form.Label>
                    <Form.Control type="text" plaintext={!admin} readOnly={!admin} defaultValue={getISOUserFriendlyString(vacation.endTime)}
                        {...register("endTime", { valueAsDate: true, })} />

                    <Form.Label>Price: </Form.Label>
                    <Form.Control type="number" plaintext={!admin} readOnly={!admin} defaultValue={vacation.price} step="0.01" {...register("price")} />

                    {admin && <button>update</button>}

                    <NavLink to="/home">Back to List</NavLink>
                </Form>}
        </div>
    )
}

export default VacationDetails;
