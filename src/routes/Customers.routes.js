import { Router } from "express";
import { listCustomers, getCustomerById } from "../controller/Customers.controller.js";

const customersRouter = Router()

customersRouter.get('/customers', listCustomers)
customersRouter.get('/customers/:id', getCustomerById)

export default customersRouter