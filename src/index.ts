import express from "express";
import { config } from "dotenv"
import { connection } from "./database";
const app = express()
app.use(express.json())

config()

app.listen(4000, () => { console.log("Servidor Rodando") })

connection.connect(err => {
    if (err) {
        console.log("Erro ao conectar com o banco de dados:")
        console.log(err)
        return
    }
    console.log("AWS RDS Conectado")
})

app.post("/reference", (req: any, res: any) => {
    interface Data { id: string }
    const data: Data[] = []
    for (let year = 2020; year <= 2022; year++) {
        for (let month = 1; month <= 12; month++) {
            const id = `${month.toString().padStart(2, '0')}/${year}`;
            data.push({ id });
        }
    }

    connection.query(
        'INSERT INTO reference (id) VALUES ?',
        [data.map(item => [item.id])],
        (error, result, field) => {
            connection.end()
            if (error) { return res.status(400).json(error) }
            return res.status(200).json({ message: "OK", data })
        }
    )
})


app.get("/reference", (req: any, res: any) => {
    connection.query(
        'SELECT * FROM `api-cub`.reference',
        (error, results, fields) => {
            connection.end()
            if (error) { return res.status(400).json(error) }
            return res.status(200).json({ message: "Tabela reference:", results })
        }
    )
})

app.get("/R1-A", (req: any, res: any) => {
    connection.query(
        'SELECT * FROM `api-cub`.`R1-A`',
        (error, results, fields) => {
            connection.end()
            if (error) { return res.status(400).json(error) }
            return res.status(200).json({ message: "Tabela R1-A", results })
        }
    )
})

app.get("/byref", (req: any, res: any) => {
    const { reference, standard } = req.body
/*     console.log(id) */
    connection.query(
        `SELECT *
        FROM \`api-cub\`.\`${standard}\`
        WHERE reference_id = ?`,
        [reference],
        (error, results, fields) => {
            connection.end()
            if (error) { return res.status(400).json(error) }
            return res.status(200).json({ message: "Dados", results })
        }
    )
})

app.get("/join", (req: any, res: any) => {
    const { reference } = req.body
/*     console.log(id) */
    connection.query(
        `SELECT *
        FROM \`api-cub\`.\`R1-A\`
        INNER JOIN \`api-cub\`.\`R1-B\`
        ON \`api-cub\`.\`R1-A\`.reference_id = \`api-cub\`.\`R1-B\`.reference_id
        WHERE \`api-cub\`.\`R1-A\`.reference_id =?`,
        [reference],
        (error, results, fields) => {
            connection.end()
            if (error) { return res.status(400).json(error) }
            /* return res.status(200).json({ message: "Dados", results }) */
            return res.send(results)
        }
    )
})
//a biblioteca mysql ao realizar consulta com inner join não considera colunas com nome iguais presentes em tabelas

app.get("/excel", (req: any, res: any) => {
    const { reference } = req.body
/*     console.log(id) */
    connection.query(
        `SELECT *
        FROM excel.table1
        INNER JOIN excel.table2
        ON excel.table1.id_client = excel.table2.id_client
        WHERE excel.table1.id_client =?`,
        [reference],
        (error, results, fields) => {
            connection.end()
            if (error) { return res.status(400).json(error) }
            /* return res.status(200).json({ message: "Dados", results }) */
            return res.send(results)
        }
    )
})
app.get("/excel", (req: any, res: any) => {
    const { reference } = req.body
/*     console.log(id) */
    connection.query(
        `SELECT *
        FROM excel.table1
        INNER JOIN excel.table2
        ON excel.table1.id_client = excel.table2.id_client
        WHERE excel.table1.id_client =?`,
        [reference],
        (error, results, fields) => {
            connection.end()
            if (error) { return res.status(400).json(error) }
            /* return res.status(200).json({ message: "Dados", results }) */
            return res.send(results)
        }
    )
})

/* app.get("/", (req: any, res: any) => {
    const { name, idade } = req.body
    connection.query(
        'SELECT * FROM excel.planCUB',
        (error, results, fields) => {
            connection.end()
            if (error) { return res.status(400).json(error) }
            return res.status(200).json({ message: "Tabela CUB", results })
        }
    )
}) */

/* app.get("/cub", (req: any, res: any) => {
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
}) */

/* app.post("/add", (req: any, res: any) => {
    const { standard, year, month, global, mdo, mat, adm } = req.body
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
}) */

/* app.post("/add-reference", (req: any, res: any) => {
    const { reference, standard, global, mdo, mat, adm } = req.body
    console.log(req.body)
    connection.query(
        'INSERT INTO date WHERE reference=?',
        [reference],
        (error, result, field) => {
            connection.end()
            if (error) { return res.status(400).json({error, message:"Erro ao inserir referência"}) }
            const id_reference = result.insertId
            connection.query(
                'INSERT INTO values (id_reference, standard, global, mdo, mat, adm) VALUES (?,?,?,?,?,?)',
                [id_reference, standard, global, mdo, mat, adm],
                (errors, results, fields)=>{
                    connection.end()
                    if (errors) { return res.status(400).json({errors, message:"Erro ao inserir valores"}) }

                    return res.status(200).json({ message: "Nova referência e valores inseridos corretamente", results })
                }
            )

        }
    )
}) */
