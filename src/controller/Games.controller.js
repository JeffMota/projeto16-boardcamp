import { db } from "../config/database.js"

export async function listGames(req, res) {
    try {
        const list = await db.query(`SELECT * FROM games;`)

        res.send(list.rows)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function postGames(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body

    try {

        const alreadyExist = await db.query(`SELECT * FROM games WHERE name = $1;`, [name])
        if (alreadyExist.rows.length > 0) return res.sendStatus(409)

        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") values ($1, $2, $3, $4);`, [name, image, stockTotal, pricePerDay])
        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error.message)
    }
}