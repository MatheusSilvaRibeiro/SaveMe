import express from 'express';
import * as jogoController from '../controller/jogoController.js';

const router = express.Router();

// Cria um novo jogo
router.post('/', jogoController.criarJogo);

// Lista todos os jogos
router.get('/', jogoController.listarJogos);

// Busca um jogo pelo ID
router.get('/:id', jogoController.buscarJogo);

// Atualiza um jogo existente
router.put('/:id', jogoController.atualizarJogo);

// Deleta um jogo pelo ID
router.delete('/:id', jogoController.deletarJogo);

export default router;
