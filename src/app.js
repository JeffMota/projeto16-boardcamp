import express from 'express'
import cors from 'cors'
import gamesRouter from './routes/Games.routes.js'
import customersRouter from './routes/Customers.routes.js'
import rentalsRouter from './routes/Rentals.routes.js'

const server = express()
server.use(cors())
server.use(express.json())

server.use([gamesRouter, customersRouter, rentalsRouter])

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`))