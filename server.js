const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Configuração da conexão usando as variáveis da Railway
const db = mysql.createConnection({
    host: process.env.MYSQLHOST || 'viaduct.proxy.rlwy.net',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE || 'railway',
    port: process.env.MYSQLPORT || 25251
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao banco de dados da Railway!');
});

// Rota de Login
app.post('/login', (req, res) => {
    const { login, senha } = req.body;
    const query = "SELECT * FROM tbUsuarios WHERE login = ? AND senha = ?";

    db.query(query, [login, senha], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length > 0) {
            res.status(200).send({ message: "Login realizado com sucesso!", user: results[0] });
        } else {
            res.status(401).send({ message: "Usuário ou senha incorretos." });
        }
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando!");
});