import VacationModel from "../../../Models/VacationModel";
import "./VacationCard.css";
import { BsFillBellFill ,BsPencil ,BsX } from "react-icons/bs";
import { NavLink } from "react-router-dom";

interface VacationCardProps {
	product: VacationModel;
}

function VacationCard(props: VacationCardProps): JSX.Element {
    const iconStyle: any = {display:'relative',position: 'absolute'};
    const bellStyle: any = {...iconStyle, top: '3px',right: '3px'};
    const bsxStyle: any = {...iconStyle, top: '3px',right: '3px'};
    const pencilStyle: any = {...iconStyle, top: '3px',right: '30px'};
    return (
        <div className="VacationCard">
            <h1>Vacation Card</h1>

            <img src="https://http.cat/201" />
			<div>
                {props.product.description} <br />
                {props.product.destination} <br />
                Price: ${props.product.price} <br />
                Start: {props.product.startTime}<br />
                End: {props.product.endTime}
            </div>
            {/* <NavLink to={"/products/details/" + props.product.id}> */}
                {/* <img src="config.productImagesUrl + props.product.imageName /> */}
            {/* </NavLink> */}
            <NavLink to={"/vacationDetails/" + props.product.vacationId}>
                <BsPencil style={pencilStyle}/>
            </NavLink>
            <BsX style={bsxStyle}/>
            <BsFillBellFill style={bellStyle}/>
            
        </div>
    );
}

export default VacationCard;
