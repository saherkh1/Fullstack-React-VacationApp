const Joi = require("joi");
const BaseModel = require("./base-model");

class User extends BaseModel {

    constructor(user) {
        super(user.id);
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
    }

    static #validationSchema = Joi.object({
        id: Joi.number().optional().integer().positive(),
        firstName: Joi.string().required().min(2).max(100),
        lastName: Joi.string().required().min(2).max(100),
        username: Joi.string().required().min(4).max(100),
        password: Joi.string().required().min(4).max(100),
    }).error(BaseModel.customErrors);

    
    validate() {
        const result = User.#validationSchema.validate(this, { abortEarly: false });
        return result.error ? result.error.details.map(err => err.message) : null;
    }
}

module.exports = User;