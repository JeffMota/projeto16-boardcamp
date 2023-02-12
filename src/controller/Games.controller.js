import { db } from "../config/database.js"

export async function listGames(req, res) {
    const name = req.query.name

    try {
        const list = await db.query(`SELECT * FROM games;`)

        const filtered = []

        if (name) {
            list.rows.map(game => {
                const init = (game.name.slice(0, name.length)).toLowerCase()
                if (name === init) filtered.push(game)
            })
            return res.send(filtered)
        }

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