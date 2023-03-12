import express from "express";
import { config } from "dotenv"
import { connection } from "./database";
const app = express()
app.use(express.json())

config()

app.get("/", (req: any, res: any) => {
    const { name, idade } = req.body
    connection.query(
        'SELECT * FROM excel.planCUB',
        (error, results, fields) => {
            connection.end()
            if (error) { return res.status(400).json(error) }
            return res.status(200).json({ message: "Tabela CUB", results })
        }
    )
})
app.get("/cub", (req: any, res: any) => {
    const { standard, year, month } = req.body
    console.log(req.body)
    connection.query(
        'SELECT * FROM excel.planCUB WHERE PADRÃO=? AND ANO=? AND MÊS=?',
        [standard, year, month],
        (error, results, fields) => {
            connection.end()
            if (error) { return res.status(400).json(error) }
            return res.status(200).json({ message: "Tabela CUB", results })
        }
    )
})

app.listen(4000, () => { console.log("Servidor Rodando") })

connection.connect(err => {
    if (err) {
        console.log("Erro ao conectar com o banco de dados:")
        console.log(err)
        return
    }
    console.log("AWS RDS Conectado")
})