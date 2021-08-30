import { BrowserRouter } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Menu from "../Menu/Menu";
import Routing from "../Routing/Routing";
import "./Layout.css";

function Layout(): JSX.Element {
    return (
        <BrowserRouter>
            <div className="Layout">
                <header>
                    <Header />
                </header>
                <main>
                    <Routing />
                </main>
                <footer>
                    <Footer />
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default Layout;
