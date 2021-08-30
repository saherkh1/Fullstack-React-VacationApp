import axios from "axios";
import { Component } from "react";
import { NavLink } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import { VacationsActionType } from "../../../Redux/VacationsState";
import config from "../../../Services/Config";
import Loading from "../../SharedArea/Loading/Loading";
import VacationCard from "../VacationCard/VacationCard";
import "./VacationsList.css";


interface VacationListState {
    vacations: VacationModel[];
}

class VacationsList extends Component<{}, VacationListState> {

    public constructor(props: {}) {
        super(props);
        this.state = { vacations: [] };
    }

    public async componentDidMount() {
        try {

            if (store.getState().VacationsState.Vacations.length === 0) {
                const response = await axios.get<VacationModel[]>(config.vacationsUrl);
                store.dispatch({ type: VacationsActionType.VacationsDownloaded, payload: response.data });
            }
            this.setState({ vacations: store.getState().VacationsState.Vacations });
            
        }
        catch (err) {
            console.log(err);
        }
    }

    public render(): JSX.Element {
        return (
            <div className="ProductList">

                { this.state.vacations.length === 0 && <Loading /> }

                <NavLink to="/addVacation">New Product</NavLink>

                {this.state.vacations.map(oneVacation => <VacationCard key={oneVacation.vacationId} product={oneVacation} />)}

            </div>
        );
    }
}

export default VacationsList;
