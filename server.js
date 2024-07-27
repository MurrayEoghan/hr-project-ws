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

app.post('/listings', (req, res) => {
    let recs = []
    con.query("SELECT * FROM projectrec.posts ORDER BY ID LIMIT ? OFFSET ? ", [req.body.limit, req.body.offset], (err, result) => {
        if (err) throw err
        recs = result
    })
    con.query("SELECT COUNT(*) as listingCount FROM projectrec.posts", (err, result, fields) => {
        if(err) throw err
        res.send({count: result[0].listingCount, listings: recs})
    })
})

app.post('/user', (req, res) => {
    if(req.body.username === undefined && req.body.password === undefined) {
        con.query("SELECT * FROM projectrec.users where uuid=?", [req.body.userId], (err, result) => {
            if(err) throw err
            res.send(result).status(200)
        })
    } else {
        con.query("SELECT * FROM projectrec.users where username = ? AND password = ?", [req.body.username, req.body.password], (err, result) => {
            if (err || result.length === 0) {
                res.send('User Not Found').status(404)
            } else {
                res.send(result).status(200)
            }
        })
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})