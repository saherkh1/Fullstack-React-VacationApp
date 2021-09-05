const express = require("express");
const followedVacationModel = require("../models/followedVacation");
const logic = require("../business-logic-layer/followedVacation-logic");
const errorsHelper = require("../helpers/errors-helper")
const router = express.Router();

router.get("/:uuid", async (request, response) => {
    try {
        const uuid = request.params.uuid;
        const followedVacations = await logic.getFollowedVacationAsync(uuid);
        response.status(200).json(followedVacations);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

router.get("/", async (request, response) => {
    try {
        
        const followModel = new followedVacationModel(request.body);
        const errors = followModel.validate();
        if (errors) return errorsHelper.badRequestError(response, errors);
        
        const addedFollow = await logic.isFollowingAsync(followModel);
        
        response.status(204);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

router.post("/", async (request, response) => {
    try {
        const followModel = new followedVacationModel(request.body);
        const errors = followModel.validate();
        if (errors) return errorsHelper.badRequestError(response, errors);
        
        const addedFollow = await logic.addFollowerAsync(followModel);
        
        response.status(201).json(addedFollow);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});

//for testing
router.get("/count/:vacationId", async (request, response) => {
    try {
        console.log("follow count is invoked")

        const vacationId = +request.params.vacationId;
        
        const addedFollow = await logic.getVacationFollowCountAsync(vacationId);
        
        response.status(200).json(addedFollow);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});
router.delete("/:followId/:vacationId", async (request, response) => {
    try {
        const followId = +request.params.followId;
        const vacationId = +request.params.vacationId;
        console.log(followId)
        await logic.deleteFollowerAsync(followId,vacationId);
        response.sendStatus(204);
    }
    catch (err) {
        errorsHelper.internalServerError(response, err);
    }
});
module.exports = router;