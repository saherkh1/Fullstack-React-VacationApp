const logic = require("../business-logic-layer/vacation-logic");
const getImageAsync = require("../middleware/image-handler");
const errorsHelper = require("../helpers/errors-helper");
const verifier = require("../middleware/auth-verify");
const vacationModel = require("../models/vacation");
const locations = require("../helpers/locations");
const express = require("express");
const router = express.Router();
const path = require('path');
const deleteOldImage = require("../helpers/image-helper");

//get all vacations
router.get("/", verifier.verifyLoggedIn, async (request, response) => {
    try {
        const vacations = await logic.getAllVacationAsync();
        console.log("get all vacations",vacations)
        response.json(vacations);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

//get only one vacation
router.get("/:vacationId([0-9]+)", verifier.verifyLoggedIn, async (request, response) => {
    try {
        const vacationId = +request.params.vacationId;
        const vacation = await logic.getOneVacationAsync(vacationId);
        response.json(vacation);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

//Add new vacation
router.post("/", verifier.verifyLoggedIn,verifier.verifyAdmin,getImageAsync , async (request, response) => {
    try {
        const vacation = new vacationModel(request.body);

        const err = vacation.validatePost();
        if (err) return errorsHelper.badRequestError(response, err);

        const addedVacation = await logic.addVacationAsync(vacation);
        response.status(201).json(addedVacation);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

//Update all fields of a vacation
router.put("/:vacationId([0-9]+)", verifier.verifyLoggedIn,verifier.verifyAdmin,getImageAsync, async (request, response) => {
    try {
        // Model:
        const vacationId = +request.params.vacationId;
        request.body.vacationId = vacationId;
        const vacation = new vacationModel(request.body);

        // Validate:
        const errors = vacation.validatePut();
        if (errors) return errorsHelper.badRequestError(response, err);

        // Logic:
        const updatedVacation = await logic.updateFullVacationAsync(vacation);
        if (!updatedVacation) return response.status(404).send(`id ${vacationId} not found`);

        // Success:
        response.json(updatedVacation);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

//Update some of the fields of a vacation
router.patch("/:vacationId([0-9]+)", verifier.verifyLoggedIn,verifier.verifyAdmin,getImageAsync, async (request, response) => {
    try {
        // Model:
        const vacationId = +request.params.vacationId;
        request.body.vacationId = vacationId;
        const vacation = new vacationModel(request.body);

        // Validate:
        const errors = vacation.validatePatch();
        if (errors) return errorsHelper.badRequestError(response, errors);
        const vacationToBeUpdated = await logic.PartialVacationUpdateHelperAsync(vacation);
        if (!vacationToBeUpdated) return response.status(404).send(`id ${vacationId} not found`);

        const newVacation = new vacationModel(vacationToBeUpdated);
        const err = newVacation.validatePut();
        if (err) return errorsHelper.badRequestError(response, err);

        const updatedVacation = await logic.updateFullVacationAsync(vacationToBeUpdated)

        // Success:
        response.json(updatedVacation);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

//Delete a vacation
router.delete("/:vacationId", verifier.verifyLoggedIn,verifier.verifyAdmin, async (request, response) => {
    try {
        const vacationId = +request.params.vacationId;
        const oldImageName = await logic.deleteVacationAsync(vacationId);

        //delete the old image
        deleteOldImage(oldImageName);

        response.sendStatus(204);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

//Get an image 
router.get("/images/:imageName", async (request, response) => {
    try {
        const imageName = request.params.imageName;
        response.sendFile(locations.getProductImageFile(imageName));
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});


module.exports = router;