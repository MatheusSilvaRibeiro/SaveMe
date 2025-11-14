import express from 'express';
import cors from 'cors';
import usuariosRoutes from './routes/usuariosRoutes.js';
import plataformasRoutes from './routes/plataformasRoutes.js';
import jogosRoutes from './routes/jogosRoutes.js';
import precosRoutes from './routes/precosRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rotas do SaveMe Games
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/plataformas', plataformasRoutes);
app.use('/api/jogos', jogosRoutes);
app.use('/api/precos', precosRoutes);

app.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
});