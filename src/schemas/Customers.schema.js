import joi from "joi"

const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).regex(/^\d+$/).required(),
    cpf: joi.string().min(11).max(11).regex(/^\d+$/).required(),
    birthday: joi.date().required()
})

export default customerSchema