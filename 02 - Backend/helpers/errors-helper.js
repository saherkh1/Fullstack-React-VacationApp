function internalServerError(response, err) {

    if(global.config.isDevelopment) {
        console.log(err.message);
        response.status(500).send(err.message);
        return;
    }

    response.status(500).send("Some error, please try again.");
}

function badRequestError(response, err) {

    if(global.config.isDevelopment) {
        console.log(err);
        response.status(400).send(err);
        return;
    }

    return response.status(400).send("Bad Request, try deferent values");
}
module.exports = {
    internalServerError,
    badRequestError

};