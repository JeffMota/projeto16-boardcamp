import { Router } from "express";
import { deleteRentals, listRentals, postRental, returnRental } from "../controller/Rentals.controller.js";
import validateSchema from "../middleware/validateSchema.js"
import { rentalSchema } from "../schemas/Rentals.schema.js";

const rentalsRouter = Router()

rentalsRouter.get('/rentals', listRentals)
rentalsRouter.post('/rentals', validateSchema(rentalSchema), postRental)
rentalsRouter.post('/rentals/:id/return', returnRental)
rentalsRouter.delete('/rentals/:id', deleteRentals)

export default rentalsRouter