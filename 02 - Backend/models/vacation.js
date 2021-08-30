const Joi = require("joi");
const BaseModel = require("./base-model");

class vacation {

    constructor(vacation) {
        this.vacationId = vacation.vacationId;
        this.description = vacation.description;
        this.destination = vacation.destination;
        this.image = vacation.image;
        this.startTime = vacation.startTime;
        this.endTime = vacation.endTime;
        this.price = vacation.price;
        this.followersCount = vacation.followersCount;
    }

  
    validatePut() {
        console.log(this);
        const validationSchema = Joi.object({
            vacationId: Joi.number().required().positive(),
            description: Joi.string().required().min(2).max(255),
            destination: Joi.string().required().min(2).max(255),
            image: Joi.string().required(),
            startTime: Joi.date().iso().required(),
            endTime: Joi.date().iso().greater(Joi.ref('startTime')).required(),
            price: Joi.number().required().positive(),
            followersCount: Joi.optional()
        }).error(BaseModel.customErrors);
        const result = validationSchema.validate(this, { abortEarly: false });
        return result.error?.details.map(err => err.message);
    }

    validatePatch() {
        const validationSchema = Joi.object({
            vacationId: Joi.number().required().positive(),
            description: Joi.string().optional().min(2).max(255),
            destination: Joi.string().optional().min(2).max(255),
            image: Joi.string().optional(),
            endTime: Joi.alternatives([Joi.date(),Joi.string().allow('').allow('null').allow(null)]).optional(),
            startTime: Joi.alternatives([Joi.date(),Joi.string().allow('').allow('null').allow(null)]).optional(),
            price: Joi.number().positive(),
            followersCount: Joi.optional()
        }).error(BaseModel.customErrors);
        const result = validationSchema.validate(this, { abortEarly: false });
        return result.error?.details.map(err => err.message);
    }
}

module.exports = vacation;