import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

// Middleware para verificar el token
router.use(verifyToken);

// Crear comentario
router.post('/', [
  body('content').notEmpty().withMessage('El contenido es requerido'),
  body('postId').isInt().withMessage('El ID de la publicación es requerido'),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content, postId } = req.body;
  const authorId = req.userId;
  if (!authorId) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: req.userId!, // ID del usuario autenticado
    },
  });

  res.status(201).json(comment);
});

// Leer comentarios de una publicación
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const comments = await prisma.comment.findMany({
    where: { postId: Number(postId) },
  });
  res.json(comments);
});

// Actualizar comentario
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const comment = await prisma.comment.update({
    where: { id: Number(id) },
    data: { content },
  });

  res.json(comment);
});

// Eliminar comentario
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await prisma.comment.delete({
    where: { id: Number(id) },
  });

  res.status(204).send();
});

export default router;
