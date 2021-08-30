
import "./Logo.css";
import logoImage from "../../../Assets/Images/logo.jpg";
import { Component } from "react";

// // Functional Component:
// function Logo(): JSX.Element {
//     return (
//         <div className="Logo">
// 			<img src={logoImage} />
//         </div>
//     );
// }

// Class Component:
class Logo extends Component { // Component is a base class for all our CC

    // Overriding render function:
    public render(): JSX.Element {
        return (
            <div className="Logo">
                <img src={logoImage} />
            </div>
        );
    }
    
}

export default Logo;
