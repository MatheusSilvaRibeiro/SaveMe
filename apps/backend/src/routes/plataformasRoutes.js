import express from 'express';
import * as plataformaController from '../controller/plataformaController.js';

const router = express.Router();

// Cria uma nova plataforma
router.post('/', plataformaController.criarPlataforma);

// Lista todas as plataformas
router.get('/', plataformaController.listarPlataformas);

// Busca uma plataforma pelo ID
router.get('/:id', plataformaController.buscarPlataforma);

// Atualiza uma plataforma existente
router.put('/:id', plataformaController.atualizarPlataforma);

// Deleta uma plataforma pelo ID
router.delete('/:id', plataformaController.deletarPlataforma);

export default router;
