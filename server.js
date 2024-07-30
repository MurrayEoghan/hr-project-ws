const express = require('express')
const cors = require('cors')
const moment = require('moment')
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
        res.status(200).send({count: result[0].listingCount, listings: recs})
    })
})

app.post('/user', (req, res) => {
    if(req.body.username === undefined && req.body.password === undefined) {
        con.query("SELECT * FROM projectrec.users where uuid=?", [req.body.userId], (err, result) => {
            if(err) throw err
            res.status(200).send(result)
        })
    } else {
        con.query("SELECT * FROM projectrec.users where username = ? AND password = ?", [req.body.username, req.body.password], (err, result) => {
            if (err || result.length === 0) {
                res.status(404).send('User Not Found')
            } else {
                res.status(200).send(result)
            }
        })
    }
})

app.post('/signup', (req, res) => {
    
    con.query('SELECT * FROM projectrec.users WHERE username=? OR email=?', [req.body.username, req.body.email], (err, result) => {
        if(result.length === 0){
            con.query('INSERT INTO projectrec.users (username, email, password, premium, joined, jobtitle, company, fname, lname, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [req.body.username, req.body.email, req.body.password, 0, moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), req.body.jobTitle, req.body.company, req.body.fname, req.body.lname, req.body.phone],
            (err, result) => {
                if(err) throw err
                res.sendStatus(204)
            })
        } else {
            res.sendStatus(409)
        }
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})