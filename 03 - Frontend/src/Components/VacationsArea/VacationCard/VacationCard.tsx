import VacationModel from "../../../Models/VacationModel";
import "./VacationCard.css";
import { BsBellFill, BsBell, BsPencil, BsX } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import config from "../../../Services/Config";
import { useEffect, useState } from "react";
import socketService from "../../../Services/SocketService";
import store from "../../../Redux/Store";
import { FollowedVacationActionType } from "../../../Redux/FollowedVacationState";
import UserModel from "../../../Models/UserModel";
import jwtAxios from "../../../Services/jwtAxios";
import FollowedVacationModel from "../../../Models/FollowedVacationModel";
import axios from "axios";
import notify from "../../../Services/Notify";

interface VacationCardProps {
    vacation: VacationModel;
}

function VacationCard(props: VacationCardProps): JSX.Element {
    const [admin, isAdmin] = useState(false);
    const [follow, setFollow] = useState(false);
    let followedVacation ;
    // const [following, isFollowing] = useState(false);
    // const [user, setUser] = useState<UserModel>();

    useEffect(() => {
        activate();
        
    });
    const isFollowing = ()=>{
        return store.getState().FollowedVacationState.followedVacations
        .find(value => value.vacationId === props.vacation.vacationId && value.uuid === store.getState().authState.user.uuid) !== undefined
    }
    const activate = async () => {
        console.log(props.vacation.vacationId,"i am in activate")
        try {
            //check and set user and then get the role
            if (store.getState().authState.user?.role === "admin")
                isAdmin(true);

            // get followed from server and dispatch 
            if (store.getState().FollowedVacationState.followedVacations.length === 0) {
                const response = await jwtAxios.get<FollowedVacationModel[]>(config.followUrl + store.getState().authState.user.uuid);
                store.dispatch({ type: FollowedVacationActionType.FollowedDownload, payload: response.data });
                console.log("i dispatched them", response.data);
            }

            //set followed
            setFollow(isFollowing);

        }
        catch (err) {
            notify.error(err);
        }
    }
    const unFollowHandler = async () => {
        console.log(props.vacation.vacationId,"i am in unFollowHandler")

        try {
            followedVacation = store.getState().FollowedVacationState?.followedVacations?.find(value => value.vacationId === props.vacation.vacationId && value.uuid === store.getState().authState.user.uuid);
            if (followedVacation?.followId) { // logic for un follow
                await jwtAxios.delete(config.followUrl + followedVacation.followId+"/"+followedVacation.vacationId);
                store.dispatch({ type: FollowedVacationActionType.UnFollowed, payload: followedVacation });
                console.log("dispatching removal of ", followedVacation);
                setFollow(isFollowing);
            }
        }
        catch (err) {
            console.log("error", follow)
            notify.error(err);
        }
    }

    const followHandler = async () => {
        console.log(props.vacation.vacationId, "i am in followHandler")
        try {
            followedVacation = store.getState().FollowedVacationState?.followedVacations?.find(value => value.vacationId === props.vacation.vacationId && value.uuid === store.getState().authState.user.uuid);
            if (!(followedVacation?.followId)) { // logic for  follow
                let payload = { uuid: store.getState().authState.user.uuid, vacationId: props.vacation.vacationId }
                const response = await jwtAxios.post(config.followUrl, payload);
                store.dispatch({ type: FollowedVacationActionType.Followed, payload: response.data });
                console.log("dispatching added value ", response.data);
                setFollow(isFollowing);
            }
        }
        catch (err) {
            console.log("error", follow)
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
            {/* {admin && <BsX className="FloatElement TopRight" />}
            {!admin && following && <BsBellFill onClick={followHandler} className="FloatElement TopRight" />}
            {!admin && !following && <BsBell onClick={followHandler} className="FloatElement TopRight" />} */}
            {admin ? <BsX className="FloatElement TopRight" />
             : follow  ? <BsBellFill onClick={unFollowHandler} className="FloatElement TopRight" />
             : <BsBell onClick={followHandler} className="FloatElement TopRight" />}

        </div>
    );
}

export default VacationCard;
