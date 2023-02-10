import { Router } from "express";
import { listCustomers, getCustomerById, postCustomer, updateCustomer } from "../controller/Customers.controller.js";
import validateSchema from "../middleware/validateSchema.js";
import customerSchema from "../schemas/Customers.schema.js";

const customersRouter = Router()

customersRouter.get('/customers', listCustomers)
customersRouter.get('/customers/:id', getCustomerById)
customersRouter.post('/customers', validateSchema(customerSchema), postCustomer)
customersRouter.put('/customers/:id', validateSchema(customerSchema), updateCustomer)

export default customersRouter