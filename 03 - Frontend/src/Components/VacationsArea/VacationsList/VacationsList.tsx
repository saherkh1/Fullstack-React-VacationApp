import { Component } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { NavLink, Redirect } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import { VacationsActionType } from "../../../Redux/VacationsState";
import config from "../../../Services/Config";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notify";
import socketService from "../../../Services/SocketService";
import Loading from "../../SharedArea/Loading/Loading";
import VacationCard from "../VacationCard/VacationCard";
import "./VacationsList.css";


interface VacationListState {
    vacations: VacationModel[];
    redirect: boolean;
    admin: boolean;
}

class VacationsList extends Component<{}, VacationListState> {

    public constructor(props: {}) {
        super(props);
        this.state = { vacations: [], redirect: false, admin: false };
    }

    public async componentDidMount() {
        try {
            socketService.connect();
            if (!store.getState().authState.user) this.setState({ redirect: true })
            else {
                const user = store.getState().authState.user;
                if (user.role === "admin") this.setState({ admin: true });

                if (store.getState().VacationsState.Vacations.length === 0) {
                    const response = await jwtAxios.get<VacationModel[]>(config.vacationsUrl);
                    store.dispatch({ type: VacationsActionType.VacationsDownloaded, payload: response.data });
                }
                this.setState({ vacations: store.getState().VacationsState.Vacations });
            }
        }
        catch (err) {
            notify.error(err);
        }
    }

    public componentWillUnmount() {
    }
    public render(): JSX.Element {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/login'></Redirect>;
        }
        return (
            <div className="ProductList">

                {this.state.vacations.length === 0 && <Loading />}

                {this.state.admin && <NavLink to="/addVacation"><BsFillPlusCircleFill /></NavLink>}

                {this.state.vacations.map(oneVacation => <VacationCard key={oneVacation.vacationId} vacation={oneVacation} />)}

            </div>
        );
    }
}

export default VacationsList;
