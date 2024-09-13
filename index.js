const express = require('express');
const mysql = require('mysql');
var path = require('path');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());

//conn
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'express-api'
});

//connect ke database
conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
});


// return view => CRUD fullstack
app.get('/', async (req, res) => {
    await conn.query('SELECT * FROM posts', (err, results) => {
        res.render('index', {
            posts: results
        });
    });
});

// return JSON => CRUD API / Backend
app.get('/posts', async (req, res) => {
    await conn.query('SELECT * FROM posts', (err, results) => {
        res.status(200).json(results);
    });
});




app.get('/posts/:id', async (req, res) => {
    const {id} = req.params;
    await conn.query('SELECT * FROM posts WHERE id = '+ id +'', (err, results) => {
        if (err) {
            throw err;
        };
        res.status(200).json(results);
    });
});

app.post('/posts', async (req, res) => {
    const {title, content} = req.body;
    await conn.query('INSERT INTO posts (title, content) VALUES ("'+ title +'", "'+ content +'")', (err, results) => {
        res.json({
            status: 200,
            message: "Add data successfully",
            data: req.body
        });
    })
});

app.put('/posts/:id', async (req, res) => {
    const {id} = req.params;
    const {title, content} = req.body;
    await conn.query('UPDATE posts SET title="'+ title +'", content="'+ content +'" WHERE id = '+ id +' ', (err, results) => {
        res.json({
            status: 200,
            message: "Update data successfully",
            data: req.body
        });
    })
});

app.delete('/posts/:id', async (req, res) => {
    const {id} = req.params;
    await conn.query('DELETE FROM posts WHERE id = '+ id +' ', (err, results) => {
        res.json({
            status: 200,
            message: "delete data successfully",
            data: req.body
        });
    })
});

app.listen(3000, () => {
    console.log('App running in port 3000');
});