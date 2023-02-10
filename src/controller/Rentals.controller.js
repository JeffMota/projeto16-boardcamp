import dayjs from "dayjs"
import { db } from "../config/database.js"

export async function listRentals(req, res) {
    try {

        const listRentals = await db.query(`SELECT * FROM rentals;`)
        const listCustomers = await db.query(`SELECT * FROM customers;`)
        const listGames = await db.query(`SELECT * FROM games;`)

        const result = []

        listRentals.rows.map(rent => {

            const custumer = listCustomers.rows.find(cust => cust.id === rent.customerId)
            const game = listGames.rows.find(game => game.id === rent.gameId)

            let aux = {
                ...rent,
                customer: {
                    id: custumer.id,
                    name: custumer.name
                },
                game: {
                    id: game.id,
                    name: game.name
                }
            }

            result.push(aux)
        })

        res.send(result)

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function postRental(req, res) {
    const { customerId, gameId, daysRented } = req.body

    try {
        //Verificando a existência do cliente e do jogo
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId])
        const game = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId])
        if (customer.rows.length === 0 || game.rows.length === 0) return res.sendStatus(400)

        //Verificando estoque
        const alugueis = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1;`, [gameId])
        if (alugueis.rows.length >= game.rows[0].stockTotal) return res.sendStatus(400)

        //Eviando para BD
        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [customerId, gameId, dayjs().format("YYYY/MM/DD"), daysRented, null, daysRented * game.rows[0].pricePerDay, null])

        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error.message)
    }


}