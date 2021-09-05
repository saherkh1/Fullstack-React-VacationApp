import VacationModel from "../../../Models/VacationModel";
import "./VacationCard.css";
import { BsBellFill, BsBell, BsPencil, BsX } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import config from "../../../Services/Config";
import { useEffect, useState } from "react";
import socketService from "../../../Services/SocketService";
import store from "../../../Redux/Store";
import { FollowedVacationActionType } from "../../../Redux/FollowedVacationState";
import jwtAxios from "../../../Services/jwtAxios";
import FollowedVacationModel from "../../../Models/FollowedVacationModel";
import notify from "../../../Services/Notify";
import { VacationsActionType, VacationsAction } from "../../../Redux/VacationsState";
import { Badge } from "react-bootstrap";

interface VacationCardProps {
    vacation: VacationModel;
}

function VacationCard(props: VacationCardProps): JSX.Element {
    const [admin, isAdmin] = useState(false);
    const [follow, setFollow] = useState(false);
    let followedVacation;
    // const [following, isFollowing] = useState(false);
    // const [user, setUser] = useState<UserModel>();

    useEffect(() => {
        activate();

    });
    const isFollowing = () => {
        return store.getState().FollowedVacationState.followedVacations
            .find(value => value.vacationId === props.vacation.vacationId && value.uuid === store.getState().authState.user.uuid) !== undefined
    }
    const activate = async () => {
        // console.log(props.vacation.vacationId, "i am in activate")
        try {
            //check and set user and then get the role
            if (store.getState().authState.user?.role === "admin")
                isAdmin(true);

            // get followed from server and dispatch 
            if (store.getState().FollowedVacationState.followedVacations.length === 0) {
                const response = await jwtAxios.get<FollowedVacationModel[]>(config.followUrl + store.getState().authState.user.uuid);
                store.dispatch({ type: FollowedVacationActionType.FollowedDownload, payload: response.data });
                // console.log("i dispatched them", response.data);
            }

            //set followed
            setFollow(isFollowing);

        }
        catch (err) {
            notify.error(err);
        }
    }
    const followHandler = async () => {
        // console.log(props.vacation.vacationId, "i am in unFollowHandler")
        try {
            followedVacation = store.getState().FollowedVacationState?.followedVacations?.find(value => value.vacationId === props.vacation.vacationId && value.uuid === store.getState().authState.user.uuid);
            let newPayload = null;
            if (followedVacation?.followId) { // logic for un follow
                newPayload  = {...props.vacation, followersCount: ((+props.vacation.followersCount)-1)   }
                await jwtAxios.delete(config.followUrl + followedVacation.followId + "/" + followedVacation.vacationId);
                store.dispatch({ type: FollowedVacationActionType.UnFollowed, payload: followedVacation.vacationId });
                // console.log("dispatching removal of ", followedVacation);
                setFollow(isFollowing);
            }
            else { // logic for  follow
                newPayload  = {...props.vacation, followersCount:props.vacation.followersCount+1   }
                let payload = { uuid: store.getState().authState.user.uuid, vacationId: props.vacation.vacationId }
                const response = await jwtAxios.post(config.followUrl, payload);
                store.dispatch({ type: FollowedVacationActionType.Followed, payload: response.data });
                // console.log("dispatching added value ", response.data);
                setFollow(isFollowing);
            }
            if (newPayload) {
                // console.log(newPayload)
                // console.log("adding the new follow cont  ");
                const vacationsAction: VacationsAction = { type: VacationsActionType.VacationUpdated, payload: newPayload };
                store.dispatch(vacationsAction);
                socketService.send(vacationsAction);
            }
        }
        catch (err) {
            console.log("error", follow)
            notify.error(err);
        }
    }

    // const followHandler = async () => {
    //     console.log(props.vacation.vacationId, "i am in followHandler")
    //     try {
    //         followedVacation = store.getState().FollowedVacationState?.followedVacations?.find(value => value.vacationId === props.vacation.vacationId && value.uuid === store.getState().authState.user.uuid);
    //         if (!(followedVacation?.followId)) { // logic for  follow
    //             let payload = { uuid: store.getState().authState.user.uuid, vacationId: props.vacation.vacationId }
    //             const response = await jwtAxios.post(config.followUrl, payload);
    //             store.dispatch({ type: FollowedVacationActionType.Followed, payload: response.data });
    //             console.log("dispatching added value ", response.data);
    //             setFollow(isFollowing);
    //         }
    //     }
    //     catch (err) {
    //         console.log("error", follow)
    //         notify.error(err);
    //     }
    // }
    const deleteHandler = async () => {
        await jwtAxios.delete(config.vacationsUrl + props.vacation.vacationId);
        const vacationsAction: VacationsAction = { type: VacationsActionType.VacationDeleted, payload: props.vacation.vacationId };
        store.dispatch(vacationsAction);
        admin && socketService.send(vacationsAction);
        // console.log(response.status === 204);
        // console.log(response);
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
