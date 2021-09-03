const Joi = require("joi");
const BaseModel = require("./base-model");

class followedVacation  {

    constructor(followedVacation) {
        this.uuid = followedVacation.uuid;
        this.vacationId = followedVacation.vacationId;
    }

    static #validationSchema = Joi.object({
        uuid: Joi.string().required(),
        vacationId: Joi.number().required(),
    }).error(BaseModel.customErrors);

    validate() {
        const result = followedVacation.#validationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }
}

module.exports = followedVacation;