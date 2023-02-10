import { Router } from "express";
import { listCustomers } from "../controller/Customers.controller.js";

const customersRouter = Router()

customersRouter.get('/customers', listCustomers)

export default customersRouter