import express from 'express';
import * as jogoController from '../controller/jogoController.js';

const router = express.Router();

router.post('/', jogoController.criarJogo);
router.get('/', jogoController.listarJogos);
router.get('/:id', jogoController.buscarJogo);
router.put('/:id', jogoController.atualizarJogo);
router.delete('/:id', jogoController.deletarJogo);

export default router;