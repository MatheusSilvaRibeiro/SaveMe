import express from 'express';
import * as precoController from '../controller/precoController.js';

const router = express.Router();

// Cria um novo preço
router.post('/', precoController.criarPreco);

// Busca todos os preços de um jogo específico
router.get('/jogo/:jogo_id', precoController.buscarPrecosPorJogo);

// Lista todos os preços
router.get('/', precoController.listarPrecos);

// Busca um preço pelo ID
router.get('/:id', precoController.buscarPreco);

// Atualiza um preço existente
router.put('/:id', precoController.atualizarPreco);

// Deleta um preço pelo ID
router.delete('/:id', precoController.deletarPreco);

export default router;
