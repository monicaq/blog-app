# BlogApp API - Node.js, Express, Prisma & TypeScript

Este proyecto es una API REST desarrollada con Node.js, Express y TypeScript para la gestión de usuarios, publicaciones y comentarios. Incluye autenticación con JWT, subida de imágenes a Cloudinary y conexión a base de datos MySQL mediante Prisma ORM.

## Requisitos

- Node.js v18 o superior
- MySQL corriendo localmente
- Cuenta de [Cloudinary](https://cloudinary.com/)
- Postman (opcional para pruebas)
- Git (opcional para clonar)

1️- Clonar el proyecto
git clone https://github.com/MonicaQuezada/blog-app.git
cd blog-app
npm install

2- Configurar variables de entorno

Crear un archivo '.env' en la raíz del proyecto con el siguiente contenido:

DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nombre_basedatos"
JWT_SECRET="clave_secreta_segura"
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"

## Scripts útiles

| Comando                      | Descripción                              |
|-----------------------------|------------------------------------------|
| `npm run dev`               | Inicia el servidor en modo desarrollo    |
| `npm run build`             | Compila el proyecto a JavaScript         |
| `npx prisma generate`       | Genera cliente Prisma                    |
| `npx prisma migrate dev`    | Ejecuta las migraciones en la base de datos |
| `npx prisma studio`         | Abre el panel visual para explorar la BD |

## Migraciones con Prisma

1- Generar las tablas y cliente Prisma:
npx prisma generate
npx prisma migrate dev --name init


## Autenticación y Rutas Protegidas

Esta API utiliza **JWT** para proteger ciertas rutas.  
Para acceder a ellas, primero debes:

1- Registrarte

POST /api/auth/register
Body JSON:
{
  "username": "Monica Quezada",
  "password": "123456"
}

2- Iniciar sesión

POST /api/auth/login
Body JSON:
{
  "username": "Monica Quezada",
  "password": "123456"
}


**Respuesta:**

{
  "token": "eyJhbGciOiJIUzI1..."
}


3- Enviar token en rutas protegidas

Agregar en los headers de tus requests:

Authorization: Bearer TU_TOKEN

## Rutas y pruebas (con Postman)

Todas las rutas protegidas requieren token JWT.

### Publicaciones

| Método | Ruta            | Descripción                           |
|--------|------------------|---------------------------------------|
| POST   | `/api/posts`     | Crear publicación (requiere imagen)  |
| GET    | `/api/posts`     | Obtener todas las publicaciones      |
| PUT    | `/api/posts/:id` | Actualizar publicación (incluye imagen opcional) |
| DELETE | `/api/posts/:id` | Eliminar publicación                 |

**Nota:** Para crear una publicación, enviar los campos `title`, `content` y un archivo `image` como **form-data**.

### Comentarios

| Método | Ruta                  | Descripción                         |
|--------|------------------------|-------------------------------------|
| POST   | `/api/comments`        | Crear comentario                    |
| GET    | `/api/comments/:idpost`| Ver comentarios de una publicación  |

## Autor

**Mónica Quezada**  
Este proyecto fue desarrollado como parte de una prueba técnica y como práctica integral de back-end moderno en Node.js + TypeScript.
