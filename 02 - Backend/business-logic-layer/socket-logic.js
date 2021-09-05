const io = require("socket.io");

function init(listener) {

    const socketsManager = io(listener, { cors: { origin: "http://localhost:3000"}}); 
    //..................................................... add it to locations

    // .on subscribes to a subject "connection"
    socketsManager.sockets.on("connection", socket => {
        
        console.log("A client has been connected.");

        socket.on("msg-from-client", msg => {
            console.log("A client sent a message: ", msg);
            socket.broadcast.emit("msg-from-server", msg);
        });

        socket.on("disconnect", () => {
            console.log("A client has been disconnected");
        });

    });

}

module.exports = {
    init
}