// index.js (versão ES module)
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'saveme',
  password: 'ads21',
  port: 5432
});

pool.connect()
  .then(() => console.log('🟢 Conectado ao PostgreSQL!'))
  .catch(err => console.error('🔴 Erro ao conectar ao banco:', err));

app.get('/', (req, res) => {
  res.send('API rodando...');
});

app.post('/usuarios', async (req, res) => {
  try {
    const { nome, usuario, email, senha } = req.body;
    const hash = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      'INSERT INTO usuario (nome, usuario, email, senha) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, usuario, email, hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
});

app.listen(3000, () => console.log('🚀 Servidor rodando em http://localhost:3000'));
