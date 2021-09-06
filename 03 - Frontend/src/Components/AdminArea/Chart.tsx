import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import store from "../../Redux/Store";
import config from "../../Services/Config";
import jwtAxios from "../../Services/jwtAxios";
import notify from "../../Services/Notify";
import Loading from "../SharedArea/Loading/Loading";
import { VictoryBar, VictoryChart } from "victory";
import { VacationsActionType } from "../../Redux/VacationsState";
import VacationModel from "../../Models/VacationModel";
import ChartDataModel from "../../Models/ChartDataModel";

class ChartData{
    data: ChartDataModel[]= [
        {vacation: 'Papillon', followerCount: 1}
    ];
}
function Chart(): JSX.Element {
    const history = useHistory();
    let chartData = new ChartData(); //= new ChartDataModel();
    const [loading, isLoading] = useState(true);

    useEffect(() => {
        activate();
        console.log("fire!")
    });
    store.subscribe(()=>{
        store.getState().VacationsState.Vacations
        .forEach(element => {
            if(element.followersCount > 0) 
                chartData.data.push({ 
                    vacation: element.description,
                     followerCount: +element.followersCount })
        });
    })
    const activate = async () => { 
        if (!store.getState().authState.user) {
            notify.error("You are not logged in!");
            history.push("/login");
        }
        if (!(store.getState().authState.user.role === "admin")) {
            notify.error("(^///^)");
            history.push("/home");
        }
        if (store.getState().VacationsState.Vacations.length === 0) {
            const response = await jwtAxios.get<VacationModel[]>(config.vacationsUrl);
            store.dispatch({ type: VacationsActionType.VacationsDownloaded, payload: response.data });
        }
        console.log(store.getState().VacationsState.Vacations)
        store.getState().VacationsState.Vacations
            .forEach(element => {
                if(element.followersCount > 0) 
                    chartData.data.push({ 
                        vacation: element.description,
                         followerCount: +element.followersCount })
            });
            console.log(chartData.data);
        isLoading(false) 
    };


    return (

        <div className="AdminArea">
            <h1>Chart</h1>
            {loading ? <Loading />:
            <VictoryChart><VictoryBar 
            data={chartData.data}
            // data accessor for x values
            x="vacation"
            // data accessor for y values
            y="followerCount"
            /></VictoryChart>}
        </div>
    );
}

export default Chart;
