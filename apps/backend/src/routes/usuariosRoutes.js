import express from 'express';
import * as usuarioController from '../controller/usuarioController.js';

const router = express.Router();

// Criar usuário
router.post('/', usuarioController.criarUsuario);

// Listar todos os usuários
router.get('/', usuarioController.listarUsuarios);

// Buscar usuário pelo ID
router.get('/:id', usuarioController.buscarUsuario);

// Atualizar usuário pelo ID
router.put('/:id', usuarioController.atualizarUsuario);

// Deletar usuário pelo ID
router.delete('/:id', usuarioController.deletarUsuario);

export default router;
