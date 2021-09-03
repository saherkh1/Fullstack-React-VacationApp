import { SyntheticEvent, useState } from "react";
import "./TestingSocket.css";
import { io, Socket } from "socket.io-client"
import SocketModel from "../../../Models/SocketModel";
import socketService from "../../../Services/SocketService";

function TestingSocket(): JSX.Element {
    //want to connect and send message when i click
    // const socketObj = new SocketModel();
    // const [message,setMessage] = useState<string>();
    // const textHandler = (args: SyntheticEvent) => {
    //     const message = (args.target as HTMLInputElement).value;
    //     setMessage(message);
        
    // }
    const connect = () => {
        // socketService.connect((msg: SocketModel) => {
        //     const allMessages = [...msg.messages];
        //     allMessages.push(msg.nickname + ": " + msg.message);
        //     socketObj.messages =  allMessages ;
        // });
    }

    const disconnect = () => {
        // socketService.disconnect();
    }

    const send = () => {
        // socketObj.message = message;
        // socketService.send(socketObj);
        // setMessage("");
    }

    return (
        <div className="TestingSocket ">
            {/* <h1>Socket.io chat</h1>
            <hr />

            <button onClick={ }>Connect</button>
            <button onClick={ }>Disconnect</button>

            <br /><br />

            <label>Message:</label>
            <input type="text" onChange={ } value={ } />
            <button onClick={ }>send</button>
            <br /><br />

            <div className="Box">

            </div> */}
        </div>
    );
}

export default TestingSocket;
