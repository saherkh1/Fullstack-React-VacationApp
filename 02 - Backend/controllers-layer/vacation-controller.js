const express = require("express");
const logic = require("../business-logic-layer/vacation-logic");
const uuid = require("uuid"); // npm i uuid
const vacationModel = require("../models/vacation");
const router = express.Router();

router.get("/vacations", async (request, response) => {
    try {
        const vacations = await logic.getAllVacationAsync();
        response.json(vacations);
    }
    catch(err) {
        response.status(500).send(err.message);
    }
});
router.get("/vacation/image/:imageName",async (request,response)=> {
    try {
        const imageName = request.params.imageName;
        response.sendFile(__dirname + "/images/products/" + imageName);
    }
    catch(err) {
        response.status(500).send(err.message);
    }
});

router.get("/vacations/:vacationId", async (request, response) => {
    try {
        const vacationId = +request.params.vacationId;
        const vacations = await logic.getOneVacationAsync(vacationId);
        response.json(vacations);
    }
    catch(err) {
        response.status(500).send(err.message);
    }
});

router.post("/vacations", async (request, response) => {
    try {
        if(!request.files) {
            response.status(400).send("No image sent");
            return;
        }
        if(!request.files.image) {
            response.status(400).send("The image must be called image");
            return;
        }
        const image = request.files.image; // The name of the image sent from the front.
        const extension = image.name.substr(image.name.lastIndexOf(".")); // ".jpg" or ".png" or ".gif" or...
        const newFileName = uuid.v4() + extension; // "d3388752-7a4f-44d5-992c-bc316c750f7f.jpg"
        image.mv("./images/products" + newFileName); // Move the file into the hard-disk
        request.body.image =  newFileName;
        const vacation = request.body;

        // const addedVacation = await logic.addVacationAsync(vacation, request.files ? request.files.image : null);
        const addedVacation = await logic.addVacationAsync(vacation);
        response.status(201).json(addedVacation);
    }
    catch(err) {
        response.status(500).send(err.message);
    }
});
// make sure that the date is right............................................
router.put("/vacations/:vacationId([0-9]+)",async (request, response) => {
    try {
        // Model:
        const vacationId = +request.params.vacationId;
        request.body.vacationId = vacationId;
        const vacation = new vacationModel(request.body);

        // Validate:
        const errors = vacation.validatePut();
        if (errors) return response.status(400).send(errors);

        // Logic:
        const updatedVacation = await logic.updateFullVacationAsync(vacation);
        if (!updatedVacation) return response.status(404).send(`id ${vacationId} not found`);

        // Success:
        response.json(updatedVacation);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.patch("/vacations/:vacationId([0-9]+)",async (request, response) => {
    try {
        
        // Model:
        const vacationId = +request.params.vacationId;
        request.body.vacationId = vacationId;
        const vacation = new vacationModel(request.body);

        // Validate:
        const errors = vacation.validatePatch();
        if (errors) return response.status(400).send(errors);
        
        console.log(vacation);
        // Logic:
        const updatedVacation = await logic.updatePartialVacationAsync(vacation);
        if (!updatedVacation) return response.status(404).send(`id ${vacationId} not found`);
        
        console.log(updatedVacation);
        // Success:
        response.json(updatedVacation);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

router.delete("/vacations/:vacationId", async (request, response) => {
    try {
        const vacationId = +request.params.vacationId;
        await logic.deleteVacationAsync(vacationId);
        response.sendStatus(204);
    }
    catch(err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;