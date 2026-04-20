require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); // Importante para gerenciar caminhos de arquivos

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÃO PARA SERVIR OS ARQUIVOS FRONT-END ---
// Isso faz o servidor reconhecer as pastas onde estão seu CSS e JS
app.use(express.static(path.join(__dirname))); 
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Configuração da conexão com o Railway
const db = mysql.createPool({
    host: 'monorail.proxy.rlwy.net',
    user: 'root',
    password: 'UZlbvXkJRNXxAciCMrjxZjESnVnOOpho',
    database: 'railway',
    port: 49559,
    waitForConnections: true,
    connectionLimit: 10
});

// Testar a conexão
db.getConnection((err, conn) => {
    if (err) {
        console.error('❌ Erro ao conectar ao Railway:', err.message);
        return;
    }
    console.log('🚀 Conectado ao MySQL do Railway com sucesso!');
    conn.release();
});

// --- ROTAS DO SITE (FRONT-END) ---

// Rota principal: Quando acessar o link do Vercel/Railway, abre o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Rota para a página de registro
app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'registro.html'));
});

// --- ROTAS DA API (BANCO DE DATOS) ---

// Cadastrar uma Pessoa
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

// Listar Pessoas
app.get('/api/pessoas', (req, res) => {
    db.query('SELECT * FROM tbPessoas', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Porta dinâmica (importante para Vercel/Railway)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});