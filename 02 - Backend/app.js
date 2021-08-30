global.config = require(process.env.NODE_ENV === "production" ? "./config-prod.json" : "./config-dev.json");
const express = require("express");
const expressFileUpload = require("express-fileupload"); // npm i express-fileupload
const cors = require("cors");
const vacationController = require("./controllers-layer/vacation-controller");
const authController = require("./controllers-layer/auth-controller");
const expressRateLimit = require("express-rate-limit");
const expressSession = require("express-session");
const server = express();
 

server.use("/api/", expressRateLimit({
    windowMs: 1000, // time window
    max: 2, // max requests allowed in that time window from the same user
    message: "Are you a hacker?" // Error message.
}));

server.use(expressSession({
    name: "captchaCookie", // Cookie name
    secret: "KittensAreCute", // Encryption key of the session id
    resave: true, // Start counting session time from each request
    saveUninitialized: false // ???
}));

server.use(express.json());
server.use(expressFileUpload()); // Insert the uploaded file into request.files object
server.use(cors());
server.use("/api", vacationController);
server.use("/api/auth", authController);
server.use("*", (request, response) => response.status(404).send("Route Not Found"));

server.listen(3001, () => console.log("Listening..."));
