import { db } from "../config/database.js"

export async function listCustomers(req, res) {
    try {

        const list = await db.query(`SELECT * FROM customers;`)

        res.send(list.rows)

    } catch (error) {
        res.status(500).send(error.message)
    }
}