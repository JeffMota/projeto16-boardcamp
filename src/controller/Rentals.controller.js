import dayjs from "dayjs"
import { db } from "../config/database.js"

//Listar todos os alugueis
export async function listRentals(req, res) {
    const customerId = req.query.customerId
    const gameId = req.query.gameId

    try {

        const unformatList = await db.query(
            `
            SELECT rentals.*, 
            customers.name AS customer_name, 
            customers.id AS customer_id, 
            games.name AS game_name, 
            games.id AS game_id 
            FROM rentals JOIN customers ON rentals."customerId" = customers.id 
            JOIN games ON rentals."gameId" = games.id;
            `
        )

        const formatedList = unformatList.rows.map(rent => {
            return {
                id: rent.id,
                customerId: rent.customerId,
                gameId: rent.gameId,
                rentDate: rent.rentDate,
                daysRented: rent.daysRented,
                returnDate: rent.returnDate,
                originalPrice: rent.originalPrice,
                delayFee: rent.delayFee,
                customer: {
                    id: rent.customer_id,
                    name: rent.customer_name
                },
                game: {
                    id: rent.game_id,
                    name: rent.game_name
                }
            }
        })

        const filtered = []

        if (customerId) {
            formatedList.map(elm => {
                if (elm.customerId == customerId) filtered.push(elm)
            })
            return res.send(filtered)
        }
        if (gameId) {
            formatedList.map(elm => {
                if (elm.gameId == gameId) filtered.push(elm)
            })
            return res.send(filtered)
        }

        res.send(formatedList)

    } catch (error) {
        res.status(500).send(error.message)
    }
}

//Registrar aluguel
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

//Retorno do aluguel
export async function returnRental(req, res) {
    const id = req.params.id

    try {

        const rent = await db.query('SELECT * FROM rentals WHERE id = $1;', [id])
        if (rent.rows.length == 0) return res.sendStatus(404) //Se não encontrar o aluguel
        if (rent.rows[0].returnDate !== null) return res.sendStatus(400) //Se o aluguel já foi devolvido

        await db.query(`UPDATE rentals SET "returnDate" = $1 WHERE id = $2;`, [dayjs().format('YYYY/MM/DD'), id])

        const diference = Date.now() - (rent.rows[0].rentDate).getTime()
        const timeInDays = Math.floor(diference / (1000 * 3600 * 24))

        if (timeInDays > rent.rows[0].daysRented) {

            const dif = timeInDays - rent.rows[0].daysRented
            const gamePrice = rent.rows[0].originalPrice / rent.rows[0].daysRented
            const pricePerDelay = dif * gamePrice

            await db.query(`UPDATE rentals SET "delayFee" = $1 WHERE id = $2;`, [pricePerDelay, id])

        } else {
            await db.query(`UPDATE rentals SET "delayFee" = 000 WHERE id = $1;`, [id])
        }

        res.sendStatus(200)

    } catch (error) {
        res.status(500).send(error.message)
    }

}

//Deletar aluguel
export async function deleteRentals(req, res) {
    const id = req.params.id
    try {

        const rental = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id])
        if (rental.rows.length === 0) return res.sendStatus(404)

        if (rental.rows[0].returnDate === null) return res.sendStatus(400)

        await db.query(`DELETE FROM rentals WHERE id = $1;`, [id])

        res.sendStatus(200)

    } catch (error) {
        res.status(500).send(error.message)
    }
}