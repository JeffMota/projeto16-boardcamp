import { Router } from "express";
import { listGames, postGames } from "../controller/Games.controller.js";
import validateSchema from "../middleware/validateSchema.js";
import { gamesSchema } from "../schemas/Games.schema.js";

const gamesRouter = Router()

gamesRouter.get('/games', listGames)
gamesRouter.post('/games', validateSchema(gamesSchema), postGames)

export default gamesRouter