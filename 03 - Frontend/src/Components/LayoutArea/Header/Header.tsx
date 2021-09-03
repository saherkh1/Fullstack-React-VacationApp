import "./Header.css";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import store from "../../../Redux/Store";

function Header(): JSX.Element {
    const [logged,isLogged] = useState(false);

    useEffect(() => {
        activate();
    });
    const activate = ()=> isLogged(store.getState().authState.user !== null);
    if(logged) return (
        <div className="Header">
            
            <Navbar bg="light" expand="lg">
                <Container className="rtl">
                    <Navbar.Brand href="/home">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Nav>
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto ">
                            <Nav.Link href="/home">Home</Nav.Link>
                            <NavDropdown title="Menu" id="basic-nav-dropdown" className="center">
                                <NavDropdown.Item href="/home">Vacations</NavDropdown.Item>
                                <NavDropdown.Item href="/login">followed vacations</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="/logout">logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        
                    </Navbar.Collapse>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    );
    else return (
        <div className="Header">
            
            <Navbar bg="light" expand="lg">
                <Container className="rtl">
                    <Navbar.Brand href="/home">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Nav>
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto ">
                            <Nav.Link href="home">Home</Nav.Link>
                            <NavDropdown title="Menu" id="basic-nav-dropdown" className="center">
                                <NavDropdown.Item href="/home">Vacations</NavDropdown.Item>
                                <NavDropdown.Item href="/login">login</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="/register">register</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        
                    </Navbar.Collapse>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    );
}

export default Header;
