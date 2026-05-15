const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// 1. Configura o CORS para aceitar seu link da Vercel
app.use(cors({
    origin: 'https://agenda-aniversario-blush.vercel.app',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));

app.use(express.json());

// 2. Conexão com o Banco de Dados (Configurada para o Railway)
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
        return;
    }
    console.log('Conectado ao MySQL do Railway com sucesso!');
});

// 3. Rota de Login
app.post('/login', (req, res) => {
    const { login, senha } = req.body;
    const sql = "SELECT * FROM tbUsuarios WHERE login = ? AND senha = ?";
    
    db.query(sql, [login, senha], (err, data) => {
        if (err) return res.status(500).json({ message: "Erro no banco" });
        if (data.length > 0) {
            return res.json({ message: "Sucesso", user: data[0] });
        } else {
            return res.status(401).json({ message: "Login ou senha incorretos" });
        }
    });
});

// 4. Rota para Listar Usuários (Para o seu CRUD da Savir Sistemas)
app.get('/usuarios', (req, res) => {
    const sql = "SELECT id, nome, email, perfil FROM tbUsuarios_Sistema";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// 5. Porta dinâmica para o Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});