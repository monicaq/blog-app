import { Request, Response, Router } from 'express';
import { body} from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middlewares/auth';
import multer from 'multer';
import { uploadImage } from '../utils/cloudinary';

const router = Router();
const prisma = new PrismaClient();

// Middleware para verificar el token
router.use(verifyToken);

// Crear publicación
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.use(verifyToken);
router.post('/', upload.single('image'),[
  body('title').notEmpty().withMessage('El título es requerido'),
  body('content').notEmpty().withMessage('El contenido es requerido'),
  ],  async (req: Request, res: Response) => {
  try {
  const { title, content } = req.body;
  if (!req.file) {
      return res.status(400).json({ error: 'Imagen no proporcionada' });
  }
  const image = await uploadImage(req.file.buffer); // Subir imagen a Cloudinary
  const post = await prisma.post.create({
    data: {
      title,
      content,
      image,
      authorId: req.userId!,
    },
  });
  res.status(201).json(post);
  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Leer publicaciones
router.get('/', async (req, res) => {
  try {
  const posts = await prisma.post.findMany(
    {
      include: {
        author: {
          select: { username: true}
        },
        comments: {
          select: { id: true, content: true, createdAt: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }
  );
  res.json(posts);
  } catch (error) {
    console.error('Error al leer publicaciones:', error);
    res.status(500).json({ error: 'Error del servidor' });
    }
});

// Actualizar publicación
router.put('/:id', upload.single('image'), [
    body('title').optional().notEmpty().withMessage('El título no puede estar vacío'),
    body('content').optional().notEmpty().withMessage('El contenido no puede estar vacío'),
  ], async (req: Request, res: Response) => {
  const postId = Number(req.params.id);
  const { title, content } = req.body;
  const userId = req.userId;
  try {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }
    
    if (post.authorId !== userId) {
      return res.status(403).json({ error: 'No autorizado para editar este post' });
    }

    let imageUrl = post.image; // Valor anterior por defecto
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer);
    }

    const postUpdated = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        image: imageUrl
      }
    });

    res.json(postUpdated);
  } catch (error) {
    console.error('Error al actualizar publicación:', error);
    res.status(500).json({ error: 'Error del servidor' });
  } 
});

// Eliminar publicación
router.delete('/:id', async (req, res) => {
  const postId = Number(req.params.id);
  const userId = req.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({ error: 'No autorizado para eliminar este post' });
    }

    await prisma.post.delete({ where: { id: postId } });

    res.json({ mensaje: 'Publicación eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


export default router;
