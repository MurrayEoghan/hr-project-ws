const express = require('express')
const cors = require('cors')
const app = express()
const mysql = require('mysql')
const port = 3001

app.use(cors())
app.use(express.json())

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
})

con.connect((err) => {
    if(err) throw err;
    console.log('Database Connection Established')
})

app.get('/test', (req, res) => {
    res.send('Test OK')
})

app.get('/listings', (req, res) => {
    con.query("SELECT * FROM projectrec.posts", (err, result, fields) => {
        res.send(result)
    })
})

app.post('/user', (req, res) => {
    con.query("SELECT * FROM projectrec.users where uuid=?", [req.body.userId], (err, result) => {
        if(err) throw err
        res.send(result).status(200)
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})