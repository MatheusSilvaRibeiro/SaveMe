import express from 'express';
import * as plataformaController from '../controller/plataformaController.js';

const router = express.Router();

// ⚠️ REMOVE o '/plataformas' daqui! Ele vem do server.js
router.post('/', plataformaController.criarPlataforma);
router.get('/', plataformaController.listarPlataformas);
router.get('/:id', plataformaController.buscarPlataforma);
router.put('/:id', plataformaController.atualizarPlataforma);
router.delete('/:id', plataformaController.deletarPlataforma);

export default router;