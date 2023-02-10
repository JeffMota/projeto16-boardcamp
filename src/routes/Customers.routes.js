import { Router } from "express";
import { listCustomers, getCustomerById, postCustomer } from "../controller/Customers.controller.js";
import validateSchema from "../middleware/validateSchema.js";
import customerSchema from "../schemas/Customers.schema.js";

const customersRouter = Router()

customersRouter.get('/customers', listCustomers)
customersRouter.get('/customers/:id', getCustomerById)
customersRouter.post('/customers', validateSchema(customerSchema), postCustomer)

export default customersRouter