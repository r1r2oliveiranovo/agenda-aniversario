require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (CSS e JS)
app.use(express.static(path.join(__dirname)));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

const db = mysql.createPool({
    host: 'monorail.proxy.rlwy.net',
    user: 'root',
    password: 'UZlbvXkJRNXxAciCMrjxZjESnVnOOpho',
    database: 'railway',
    port: 49559
});

// Rotas de Páginas
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));

// API: Listar Pessoas
app.get('/api/pessoas', (req, res) => {
    db.query('SELECT * FROM tbPessoas', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));