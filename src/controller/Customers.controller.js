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
        const alreadyExist = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf])
        if (alreadyExist.rows.length > 0) return res.sendStatus(409)

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
            [name, phone, cpf, birthday])

        res.sendStatus(201)

    } catch (error) {
        res.status(500).send(error.message)
    }
}

//Atualizat cliente
export async function updateCustomer(req, res) {
    const id = req.params.id
    const { name, phone, cpf, birthday } = req.body

    try {
        const alreadyExist = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf])
        if (alreadyExist.rows.length > 0) return res.sendStatus(409)

        await db.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5;`,
            [name, phone, cpf, birthday, id])

        res.sendStatus(200)

    } catch (error) {
        res.status(500).send(error.message)
    }
}