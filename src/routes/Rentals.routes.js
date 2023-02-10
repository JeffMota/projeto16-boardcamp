import { Router } from "express";
import { listRentals, postRental } from "../controller/Rentals.controller.js";
import validateSchema from "../middleware/validateSchema.js"
import { rentalSchema } from "../schemas/Rentals.schema.js";

const rentalsRouter = Router()

rentalsRouter.get('/rentals', listRentals)
rentalsRouter.post('/rentals', validateSchema(rentalSchema), postRental)

export default rentalsRouter