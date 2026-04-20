require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da conexão com o Railway (usando os dados que você me passou)
const db = mysql.createPool({
    host: 'monorail.proxy.rlwy.net',
    user: 'root',
    password: 'UZlbvXkJRNXxAciCMrjxZjESnVnOOpho',
    database: 'railway',
    port: 49559,
    waitForConnections: true,
    connectionLimit: 10
});

// Testar a conexão assim que o servidor subir
db.getConnection((err, conn) => {
    if (err) {
        console.error('❌ Erro ao conectar ao Railway:', err.message);
        return;
    }
    console.log('🚀 Conectado ao MySQL do Railway com sucesso!');
    conn.release();
});

// Rota para Cadastrar uma Pessoa (Enviada pelo cadastrar-pessoa.html)
app.post('/api/pessoas', (req, res) => {
    const { nome, cpf, nascimento, telefone, pessoa_tipo_id } = req.body;
    const sql = 'INSERT INTO tbPessoas (nome, cpf, nascimento, telefone, pessoa_tipo_id) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [nome, cpf, nascimento, telefone, pessoa_tipo_id], (err, result) => {
        if (err) {
            console.error('Erro ao inserir:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Cadastrado no banco de dados!' });
    });
});

// Rota para Listar Pessoas (Para mostrar na Dashboard)
app.get('/api/pessoas', (req, res) => {
    db.query('SELECT * FROM tbPessoas', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});