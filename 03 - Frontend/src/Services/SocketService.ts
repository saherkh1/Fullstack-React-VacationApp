import { VacationsAction } from './../Redux/VacationsState';
import { io, Socket } from 'socket.io-client'; // npm i socket.io-client
import store from "../Redux/Store";

class SocketService {

    private socket: Socket;

    public connect(): void {
        this.socket = io("http://localhost:3001");
        this.socket.on("msg-from-server", msg => store.dispatch(msg));
    }

    public isConnected(): boolean {
         return this.socket?.connected;
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