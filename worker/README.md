# Foro — API de Cloudflare (plan gratuito)

Worker con **D1** (posts y respuestas) y **R2** (imágenes, audio y fotos de perfil).

## Despliegue paso a paso

1. **Instalar wrangler e iniciar sesión** (desde la raíz del proyecto):

   ```bash
   npm install -g wrangler   # o: npx wrangler
   wrangler login
   ```

2. **Crear los recursos** (una sola vez):

   ```bash
   cd worker
   npx wrangler d1 create foro-luces
   npx wrangler r2 bucket create foro-luces
   ```

   Copia el `database_id` que imprime el comando de D1 y pégalo en `wrangler.jsonc`.

3. **Crear la base de datos** (tablas):

   ```bash
   npx wrangler d1 execute foro-luces --file=./schema.sql --remote
   npx wrangler d1 execute foro-luces --file=./schema.sql --local   # para desarrollo local
   ```

4. **Definir el token de administración** (para borrar publicaciones):

   ```bash
   npx wrangler secret put ADMIN_TOKEN
   ```

   Escribe un valor largo y aleatorio. Guárdalo: lo usarás en el botón "Borrar (admin)" del foro.

5. **Publicar el Worker**:

   ```bash
   npx wrangler deploy
   ```

   Te dará una URL tipo `https://foro-luces.<tu-subdominio>.workers.dev`.

6. **Conectar el frontend**: crea un `.env` en la raíz del proyecto con:

   ```
   VITE_API_URL=https://foro-luces.<tu-subdominio>.workers.dev
   ```

   y vuelve a desplegar la web en Cloudflare Pages.

   > Opción recomendada en producción: en vez de usar el dominio `*.workers.dev`,
   > añade una ruta personalizada en tu dominio (ej. `api.tudominio.com/*` o
   > `tudominio.com/api/*`) desde el panel de Cloudflare → Workers → foro-luces →
   > Dominios y rutas. Así `VITE_API_URL` queda vacío y evitas CORS.

7. **CORS**: en `wrangler.jsonc`, cambia `ALLOWED_ORIGIN` a tu dominio real
   (ej. `"https://tudominio.com"`) para no aceptar peticiones de otros sitios.

## Desarrollo local

```bash
cd worker
npx wrangler dev
```

La API queda en `http://127.0.0.1:8787` (con D1 y R2 locales simulados).
En la raíz del proyecto, configura `.env` con `VITE_API_URL=http://127.0.0.1:8787`
y ejecuta `npm run dev`.

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/threads` | Lista de publicaciones con nº de respuestas |
| GET | `/api/threads/:id` | Publicación + respuestas |
| POST | `/api/threads` | Crear post/respuesta (multipart: `name`, `content`, `parentId?`, `avatar?`, `image?`, `audio?`) |
| DELETE | `/api/threads/:id` | Borrar post y sus respuestas (cabecera `X-Admin-Token`) |
| GET | `/api/files/:key` | Servir archivo de R2 |

## Límites aplicados

- Foto de perfil: 2 MB · Imagen: 5 MB · Audio: 20 MB
- Cuerpo máximo de petición en plan gratis: 100 MB (holgado)
