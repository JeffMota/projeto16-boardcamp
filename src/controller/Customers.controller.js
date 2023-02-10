import { db } from "../config/database.js"

//Listar todos os clientes
export async function listCustomers(req, res) {
    try {

        const list = await db.query(`SELECT * FROM customers;`)

        res.send(list.rows)

    } catch (error) {
        res.status(500).send(error.message)
    }
}

//Buscar por id
export async function getCustomerById(req, res) {
    const id = req.params.id

    try {

        const list = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id])

        if (list.rows.length === 0) return res.sendStatus(404)

        res.send(list.rows[0])

    } catch (error) {
        res.status(500).send(error.message)
    }
}

//Cadastrar cliente
export async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body

    try {
        const alreadyExist = await db.query(`SELECT * FROM customers WHERE name = $1;`, [name])
        if (alreadyExist.rows > 0) return res.sendStatus(409)

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
            [name, phone, cpf, birthday])

        res.sendStatus(201)

    } catch (error) {
        res.status(500).send(error.message)
    }
}