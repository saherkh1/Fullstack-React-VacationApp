import { VacationsActionType, VacationsAction } from "../../../Redux/VacationsState";
import { FollowedVacationActionType } from "../../../Redux/FollowedVacationState";
import FollowedVacationModel from "../../../Models/FollowedVacationModel";
import { BsBellFill, BsBell, BsPencil, BsX } from "react-icons/bs";
import socketService from "../../../Services/SocketService";
import VacationModel from "../../../Models/VacationModel";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notify";
import config from "../../../Services/Config";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import store from "../../../Redux/Store";
import { Badge } from "react-bootstrap";
import "./VacationCard.css";

interface VacationCardProps {
    vacation: VacationModel;
}

function VacationCard(props: VacationCardProps): JSX.Element {
    const [admin, isAdmin] = useState(false);
    const [follow, setFollow] = useState(false);
    let followedVacation;

    useEffect(() => {
        activate();
    });

    const isFollowing = () =>
        store.getState().FollowedVacationState.followedVacations
            .find(value => value.vacationId === props.vacation.vacationId && value.uuid === store.getState().authState.user.uuid) !== undefined


    const activate = async () => {
        try {
            //check and set user and then get the role
            if (store.getState().authState.user?.role === "admin")
                isAdmin(true);

            // get followed from server and dispatch 
            if (store.getState().FollowedVacationState.followedVacations.length === 0) {
                const response = await jwtAxios.get<FollowedVacationModel[]>(config.followUrl + store.getState().authState.user.uuid);
                store.dispatch({ type: FollowedVacationActionType.FollowedDownload, payload: response.data });
            }

            //set followed
            setFollow(isFollowing);
        }
        catch (err) {
            notify.error(err);
        }
    }

    const followHandler = async () => {
        try {
            followedVacation = store.getState().FollowedVacationState?.followedVacations?.find(value => value.vacationId === props.vacation.vacationId && value.uuid === store.getState().authState.user.uuid);
            let newPayload = null;
            if (followedVacation?.followId) { // logic for un follow
                newPayload = { ...props.vacation, followersCount: ((+props.vacation.followersCount) - 1) }
                await jwtAxios.delete(config.followUrl + followedVacation.followId + "/" + followedVacation.vacationId);
                store.dispatch({ type: FollowedVacationActionType.UnFollowed, payload: followedVacation.vacationId });
            }
            else { // logic for  follow
                newPayload = { ...props.vacation, followersCount: props.vacation.followersCount + 1 }
                let payload = { uuid: store.getState().authState.user.uuid, vacationId: props.vacation.vacationId }
                const response = await jwtAxios.post(config.followUrl, payload);
                store.dispatch({ type: FollowedVacationActionType.Followed, payload: response.data });
            }
            setFollow(isFollowing);
            if (newPayload) {
                const vacationsAction: VacationsAction = { type: VacationsActionType.VacationUpdated, payload: newPayload };
                store.dispatch(vacationsAction);
                socketService.send(vacationsAction);
            }
        }
        catch (err) {
            notify.error(err);
        }
    }

    const deleteHandler = async () => {
        try {
            await jwtAxios.delete(config.vacationsUrl + props.vacation.vacationId);
            const vacationsAction: VacationsAction = { type: VacationsActionType.VacationDeleted, payload: props.vacation.vacationId };
            store.dispatch(vacationsAction);
            admin && socketService.send(vacationsAction);
        }
        catch (err) {
            notify.error(err);
        }
    }
    return (
        <div className="VacationCard">

            <img src={config.vacationImagesUrl + props.vacation.image} alt={props.vacation.destination} />
            <div>
                {props.vacation.description} <br />
                {props.vacation.destination} <br />
                Price: ${props.vacation.price} <br />
                Start: {new Date(props.vacation.startTime).toLocaleString()}<br />
                End: {new Date(props.vacation.endTime).toLocaleString()}
            </div>
            <NavLink to={"/vacationDetails/" + props.vacation.vacationId}>
                <BsPencil className="FloatElement TopRightSlightLeft" />
            </NavLink>
            {admin ? <NavLink to="#"><BsX onClick={deleteHandler} className="FloatElement TopRight" /></NavLink>
                : follow ? <BsBellFill onClick={followHandler} className="FloatElement TopRight" />
                    : <BsBell onClick={followHandler} className="FloatElement TopRight" />}
            {<Badge className="FloatElement BottomRight" bg="secondary">{props.vacation.followersCount}</Badge>}

        </div>
    );
}

export default VacationCard;
