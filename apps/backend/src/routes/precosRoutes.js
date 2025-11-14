import express from 'express';
import * as precoController from '../controller/precoController.js';

const router = express.Router();

router.post('/', precoController.criarPreco);
router.get('/jogo/:jogo_id', precoController.buscarPrecosPorJogo);  // ⚠️ Específica antes!
router.get('/', precoController.listarPrecos);
router.get('/:id', precoController.buscarPreco);
router.put('/:id', precoController.atualizarPreco);
router.delete('/:id', precoController.deletarPreco);

export default router;