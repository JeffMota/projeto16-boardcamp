import express from 'express'
import cors from 'cors'
import gamesRouter from './routes/Games.routes.js'

const server = express()
server.use(cors())
server.use(express.json())

server.use(gamesRouter)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`))