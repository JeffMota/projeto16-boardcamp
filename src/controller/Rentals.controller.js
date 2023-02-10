import { db } from "../config/database.js"

export async function listRentals(req, res) {
    try {

        const listRentals = await db.query(`SELECT * FROM rentals;`)
        const listCustomers = await db.query(`SELECT * FROM customers;`)
        const listGames = await db.query(`SELECT * FROM games;`)

        const result = []

        listRentals.map(rent => {

            const custumer = listCustomers.find(cust => cust.id === rent.customerId)
            const game = listGames.fing(game => game.id === rent.gameId)

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