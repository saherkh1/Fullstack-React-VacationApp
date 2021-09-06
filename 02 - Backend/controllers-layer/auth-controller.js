const express = require("express");
const UserModel = require("../models/user");
const CredentialsModel = require("../models/credentials");
const authLogic = require("../business-logic-layer/auth-logic");
const errorsHelper = require("../helpers/errors-helper")
const router = express.Router();

// Register: 
router.post("/register", async (request, response) => {
    try {
        const user = new UserModel(request.body);
        const errors = user.validate();
        if (errors) return errorsHelper.badRequestError(response, errors);
        if (await authLogic.isUsernameTaken(user.username)) return response.status(400).send(`Username "${user.username}" already taken.`);

        const addedUser = await authLogic.registerAsync(user);

        response.status(201).json(addedUser);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

// Login: 
router.post("/login", async (request, response) => {
    try {
        const credentials = new CredentialsModel(request.body);

        const errors = credentials.validate();
        if (errors) return errorsHelper.badRequestError(response, err);

        const loggedInUser = await authLogic.loginAsync(credentials);
        if (!loggedInUser) return response.status(401).send("Incorrect username or password.");

        response.json(loggedInUser);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

module.exports = router;