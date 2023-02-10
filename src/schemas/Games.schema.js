import joi from "joi"

export const gamesSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().uri(),
    stockTotal: joi.number().min(1).required(),
    pricePerDay: joi.number().min(1).required()
})