import VacationsList from "../../VacationsArea/VacationsList/VacationsList";
import "./Home.css";

function Home(): JSX.Element {
    return (
        <div className="Home">
                <h1>home</h1>
                <VacationsList></VacationsList>
        </div>
    );
}

export default Home;
