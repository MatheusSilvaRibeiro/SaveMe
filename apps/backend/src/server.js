import express from 'express';
import cors from 'cors';
import usuariosRoutes from './routes/usuariosRoutes.js';
import plataformasRoutes from './routes/plataformasRoutes.js';
import jogosRoutes from './routes/jogosRoutes.js';
import precosRoutes from './routes/precosRoutes.js';

const app = express();

app.use(cors());               // Libera acesso da API para qualquer frontend
app.use(express.json());       // Permite receber JSON no corpo das requisições

// Registra as rotas da API
app.use('/api/usuarios', usuariosRoutes);       // Rotas de usuários
app.use('/api/plataformas', plataformasRoutes); // Rotas de plataformas
app.use('/api/jogos', jogosRoutes);             // Rotas de jogos
app.use('/api/precos', precosRoutes);           // Rotas de preços

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
});
