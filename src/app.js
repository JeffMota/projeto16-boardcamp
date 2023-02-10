import express from 'express'
import cors from 'cors'

const server = express()
server.use(cors())
server.use(express.json())

server.get('/', (req, res) => {
    res.send('OK')
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`))