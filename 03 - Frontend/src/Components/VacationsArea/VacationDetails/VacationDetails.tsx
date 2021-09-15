
import { getISOUserFriendlyString } from "../../../Services/DateService";
import { NavLink, useHistory, useParams } from "react-router-dom";
import socketService from "../../../Services/SocketService";
import VacationModel from "../../../Models/VacationModel";
import config from "../../../Services/Config";
import notify from "../../../Services/Notify";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import "./VacationDetails.css";
import {
    getVacation,
    updateVacationWithFormDataAsync,
} from "../../../Services/vacationService";
import {
    isItTheAdminUser,
    isUserLoggedIn,
} from "../../../Services/UserService";

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
    let isMounted: boolean;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        isMounted = true;
        activate();
        return () => { isMounted = false };
    });

    async function activate() {
        try {
            if (!(isUserLoggedIn())) history.push("/login");
            else if (isItTheAdminUser) { isAdmin(true) }
            if (vacation?.vacationId === undefined) {
                isMounted && setVacation(getVacation(+routeProps.id));
            }
        } catch (err) {
            notify.error(err);
        }
    }
    async function send(Vacation: VacationModel) {
        try {
            const myFormData = new FormData();
            myFormData.append("destination", Vacation.destination.toString());
            myFormData.append("description", Vacation.description.toString());
            myFormData.append("price", Vacation.price.toString());
            myFormData.append("startTime", Vacation.startTime.toString());
            myFormData.append("endTime", Vacation.endTime.toString());
            myFormData.append("image", Vacation.image.item(0));

            const vacationsAction = await updateVacationWithFormDataAsync(myFormData, vacation.vacationId);
            setVacation(vacationsAction.payload)
            admin && socketService.send(vacationsAction);
            notify.success("Vacation has been Updated.");

            history.push("/home");
        } catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="VacationDetails">
            <h1>Vacation Details</h1>
            {vacation?.vacationId === undefined ? (
                <>
                    <h3>nothing to show</h3>
                </>
            ) : (
                <Form onSubmit={handleSubmit(send)}>
                    <Form.Label>Destination: </Form.Label>
                        <Form.Control
                            type="text"
                            plaintext={!admin}
                            readOnly={!admin}
                            defaultValue={vacation.destination}
                            {...register("destination")}
                        />

                    <Form.Label>Description: </Form.Label>
                        <Form.Control
                            type="text"
                            plaintext={!admin}
                            readOnly={!admin}
                            defaultValue={vacation.description}
                            {...register("description")}
                        />

                        {admin && (
                            <>
                                <Form.Label>Image: </Form.Label>
                                <Form.Control
                                    type="file"
                                    plaintext={!admin}
                                    readOnly={!admin}
                                    accept="image/*"
                                    {...register("image")}
                                />
                            </>
                        )}
                        {!admin && (
                            <img
                                src={config.vacationImagesUrl + vacation.image}
                                alt={vacation.destination}
                            />
                        )}

                    <Form.Label>Start Date: </Form.Label>
                        <Form.Control
                            type="text"
                            plaintext={!admin}
                            readOnly={!admin}
                            defaultValue={getISOUserFriendlyString(vacation.startTime)}
                            {...register("startTime", { valueAsDate: true })}
                        />

                    <Form.Label>End Date: </Form.Label>
                        <Form.Control
                            type="text"
                            plaintext={!admin}
                            readOnly={!admin}
                            defaultValue={getISOUserFriendlyString(vacation.endTime)}
                            {...register("endTime", { valueAsDate: true })}
                        />

                    <Form.Label>Price: </Form.Label>
                        <Form.Control
                            type="number"
                            plaintext={!admin}
                            readOnly={!admin}
                            defaultValue={vacation.price}
                            step="0.01"
                            {...register("price")}
                        />

                    {admin && <button>update</button>}

                    <NavLink to="/home">Back to List</NavLink>
                </Form>
            )}
        </div>
    );
}

export default VacationDetails;
