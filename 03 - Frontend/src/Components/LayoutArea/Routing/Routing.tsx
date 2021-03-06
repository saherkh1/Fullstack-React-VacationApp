import { Redirect, Route, Switch } from "react-router";
import Chart from "../../AdminArea/Chart";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import Register from "../../AuthArea/Register/Register";
import AddVacation from "../../VacationsArea/AddVacation/AddVacation";
import VacationDetails from "../../VacationsArea/VacationDetails/VacationDetails";
import VacationsList from "../../VacationsArea/VacationsList/VacationsList";
import PageNotFound from "../PageNotFound/PageNotFound";
import "./Routing.css";

function Routing(): JSX.Element {
    return (
        <div className="Routing">

            <Switch>

            <Route path="/register" component={Register} exact />
                <Route path="/login" component={Login} exact />
                <Route path="/logout" component={Logout} exact />
                <Route path="/home" component={VacationsList} exact />
                <Route path="/addVacation" component={AddVacation} exact />
                <Route path="/chart" component={Chart} exact />
                <Route path="/vacationDetails/:id([0-9]+)" component={VacationDetails} exact />
                {/* <Route path="/products" component={ProductList} exact /> */}
                {/* <Route path="/products/details/:id([0-9]+)" component={ProductDetails} exact /> */}
                {/* <Route path="/products/new" component={AddProduct} exact /> */}
                <Redirect from="/" to="/home" exact />
                <Route component={PageNotFound} />
                
            </Switch>

        </div>
    );
}

export default Routing;
