const Joi = require('joi');

const createIntentSchema = Joi.object({
    id: Joi.string().guid().required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z]).{3,30}$')),
    login: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    age: Joi.number().integer().min(4).max(130),
    isDeleted: Joi.boolean().required()
});

const updateIntentSchema = Joi.object({
    password: Joi.string().pattern(new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z]).{3,30}$')),
    login: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    age: Joi.number().integer().min(4).max(130),
    isDeleted: Joi.boolean().required()
});

function validateCreateRequest(input) {
    const { error } = createIntentSchema.validate(input, { abortEarly: false });
    return error;
}

function validateUpdateRequest(input) {
    const { error } = updateIntentSchema.validate(input, { abortEarly: false });
    return error;
}

module.exports = {
    validateCreateRequest,
    validateUpdateRequest,
    schema: createIntentSchema
};
