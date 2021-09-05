const express = require("express");
const logic = require("../business-logic-layer/vacation-logic");
const uuid = require("uuid"); // npm i uuid
const vacationModel = require("../models/vacation");
const errorsHelper = require("../helpers/errors-helper");
const verifyLoggedIn = require("../middleware/auth-verify");
const router = express.Router();
const path = require('path');
const locations = require("../helpers/locations");
var fs = require('fs');

router.get("/", verifyLoggedIn,async (request, response) => {
    try {
        const vacations = await logic.getAllVacationAsync();
        response.json(vacations);
    }
    catch (err) {
        errorsHelper.internalServerError(response,err);
    }
});


router.get("/:vacationId([0-9]+)",verifyLoggedIn, async (request, response) => {
    try {
        const vacationId = +request.params.vacationId;
        const vacation = await logic.getOneVacationAsync(vacationId);
        response.json(vacation);
    }
    catch (err) {
        errorsHelper.internalServerError(response,err);
    }
});

router.post("/",verifyLoggedIn, async (request, response) => {
    try {
        if (!request.files) {
            errorsHelper.badRequestError(response,"No image sent");
            return;
        }
        if (!request.files.image) {
            errorsHelper.badRequestError(response,"The image must be called image");
            return;
        }
        
        const image = request.files.image; // The name of the image sent from the front.
        const extension = image.name.substr(image.name.lastIndexOf(".")); // ".jpg" or ".png" or ".gif" or...
        const newFileName = uuid.v4() + extension; // "d3388752-7a4f-44d5-992c-bc316c750f7f.jpg"
        image.mv("./images/products/" + newFileName); // Move the file into the hard-disk
        request.body.image = newFileName;
        const vacation = new vacationModel(request.body);
        
        const err = vacation.validatePost();
        if (err) return errorsHelper.badRequestError(response,err);

        const addedVacation = await logic.addVacationAsync(vacation);
        response.status(201).json(addedVacation);
    }
    catch (err) {
        errorsHelper.internalServerError(response,err);
    }
});
router.put("/:vacationId([0-9]+)",verifyLoggedIn, async (request, response) => {
    try {
        // Model:
        const vacationId = +request.params.vacationId;
        request.body.vacationId = vacationId;
        const vacation = new vacationModel(request.body);

        // Validate:
        const errors = vacation.validatePut();
        if (errors) return errorsHelper.badRequestError(response,err);

        // Logic:
        const updatedVacation = await logic.updateFullVacationAsync(vacation);
        if (!updatedVacation) return response.status(404).send(`id ${vacationId} not found`);

        // Success:
        response.json(updatedVacation);
    }
    catch (err) {
        errorsHelper.internalServerError(response,err);
    }
});

router.patch("/:vacationId([0-9]+)",verifyLoggedIn, async (request, response) => {
    try {
        // Model:
        const vacationId = +request.params.vacationId;
        request.body.vacationId = vacationId;
        const vacation = new vacationModel(request.body);
        
        // Validate:
        const errors = vacation.validatePatch();
        if (errors) return errorsHelper.badRequestError(response,errors);
        const vacationToBeUpdated = await logic.PartialVacationUpdateHelperAsync(vacation);
        if (!vacationToBeUpdated) return response.status(404).send(`id ${vacationId} not found`);
        
        const newVacation = new vacationModel(vacationToBeUpdated);
        const err = newVacation.validatePut();
        if (err) return errorsHelper.badRequestError(response,err);

        const updatedVacation = await logic.updateFullVacationAsync(vacationToBeUpdated)
        

        // Success:
        response.json(updatedVacation);
    }
    catch (err) {
        errorsHelper.internalServerError(response,err);
    }
});

router.delete("/:vacationId",verifyLoggedIn, async (request, response) => {
    try {
        const vacationId = +request.params.vacationId;
        const oldImageName = await logic.deleteVacationAsync(vacationId);

        //delete the old image
        fs.unlinkSync(locations.getProductImageFile(oldImageName));
        
        response.sendStatus(204);
    }
    catch (err) {
        errorsHelper.internalServerError(response,err);
    }
});

router.get("/images/:imageName", async (request, response) => {
    try {
        const imageName = request.params.imageName;
        response.sendFile(path.join(__dirname, '../images/products/', imageName));
    }
    catch (err) {
        errorsHelper.internalServerError(response,err);
    }
});


module.exports = router;