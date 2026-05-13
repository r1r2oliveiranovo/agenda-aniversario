const express = require('express');
const cors = require('cors'); // 1. Importa o CORS
const mysql = require('mysql2');
const app = express();

// 2. Configura o CORS para aceitar seu link da Vercel
app.use(cors({
    origin: 'https://agenda-aniversario-blush.vercel.app', // Seu link da Vercel
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// Exemplo da sua rota de login (verifique se os nomes das colunas batem com o seu SQL)
app.post('/login', (req, res) => {
    const { login, senha } = req.body;
    const sql = "SELECT * FROM tbUsuarios WHERE login = ? AND senha = ?";
    
    // Supondo que sua conexão se chama 'db'
    db.query(sql, [login, senha], (err, data) => {
        if (err) return res.status(500).json({ message: "Erro no banco" });
        if (data.length > 0) {
            return res.json({ message: "Sucesso" });
        } else {
            return res.status(401).json({ message: "Login ou senha incorretos" });
        }
    });
});

// A porta deve ser dinâmica para o Railway funcionar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});