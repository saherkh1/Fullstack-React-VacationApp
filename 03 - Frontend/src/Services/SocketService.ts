import { VacationsAction } from './../Redux/VacationsState';
import { io, Socket } from 'socket.io-client'; // npm i socket.io-client

class SocketService {

    private socket: Socket;

    public connect(/*displayMessage: Function*/): void {
        this.socket = io("http://localhost:3001");
        // this.socket.on("msg-from-server", msg => displayMessage(msg));
    }

    public disconnect(): void {
        this.socket.disconnect();
    }

    public send(vacationAction : VacationsAction) {
        this.socket.emit("msg-from-client", vacationAction);
    }
}

const socketService = new SocketService();

export default socketService;