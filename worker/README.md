# Foro — API integrada en el Worker `proxyweb`

El foro **no es un Worker independiente**: vive dentro del mismo Worker que sirve
la web estática (`proxyweb`). La configuración está en el `wrangler.jsonc` de la
**raíz** del proyecto:

- `main` → `./worker/src/index.js` (el código del foro)
- `assets.run_worker_first: ["/api/*"]` → las rutas `/api/*` van al foro y el resto
  se sirve como estático (mismo dominio, sin CORS)
- Bindings: **D1** (`DB`, base `foro-luces`) y **R2** (`FILES`, bucket `foro-luces`)
- Secreto **ADMIN_TOKEN**

## Despliegue

Automático: cada push a `main` dispara **Workers Builds**, que ejecuta
`npm run build` + `npx wrangler deploy`.

Manual (opcional), desde la raíz del proyecto:

```bash
npm run build
npx wrangler deploy
```

## Base de datos (solo la primera vez, o tras recrearla)

```bash
npx wrangler d1 create foro-luces            # copiar database_id al wrangler.jsonc raíz
npx wrangler r2 bucket create foro-luces
npx wrangler d1 execute foro-luces --file=./worker/schema.sql --remote
```

## Secreto de administración

```bash
npx wrangler secret put ADMIN_TOKEN
```

Valor largo y aleatorio. Se usa en el botón "Borrar (admin)" del foro.

## Desarrollo local

Desde la raíz del proyecto:

```bash
npm run build        # generar dist/
npx wrangler dev     # sirve web + API con D1 y R2 locales simulados
```

La aplicación completa queda en `http://127.0.0.1:8787`.

Para desarrollar solo el frontend con recarga en caliente (`npm run dev`),
apunta el `.env` a un Worker local o remoto:

```
VITE_API_URL=http://127.0.0.1:8787   # si tienes `wrangler dev` corriendo
```

Vacío = peticiones relativas `/api/...` al mismo origen (comportamiento de producción).

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/config` | Límites de tamaño y tipos aceptados |
| GET | `/api/threads` | Lista de publicaciones con nº de respuestas y `owner` |
| GET | `/api/threads/:id` | Publicación + respuestas (con `owner`) |
| POST | `/api/threads` | Crear post/respuesta (multipart: `name`, `content`, `parentId?`, `avatar?`, `images?` (repetible), `audio?`). Cabeceras opcionales: `X-Admin-Token`, `X-Author-Key` |
| DELETE | `/api/threads/:id` | Borrar post y sus respuestas (cabecera `X-Admin-Token` para borrar cualquiera, o `X-Author-Key` para borrar solo posts propios) |
| GET | `/api/files/:key` | Servir archivo de R2 |

## Límites aplicados

- Foto de perfil: 1 MB · Imagen: 5 MB (máx 5 por post) · Audio: 8 MB · Total por post: 60 MB
- Las imágenes se comprimen **en el navegador** antes de subir (canvas, máx 1920 px).
- Los límites viven en las `vars` del `wrangler.jsonc` raíz y el frontend los consulta
  en `GET /api/config`.

## Borrado de posts

- **Admin**: token secreto (`ADMIN_TOKEN`) vía `X-Admin-Token`. Borra cualquier post.
- **Autor**: cada navegador genera una clave aleatoria (`foro-author-key` en localStorage)
  que se envía como `X-Author-Key`. El Worker guarda solo su hash SHA-256
  (`posts.author_key_hash`) y permite borrar posts creados con esa clave.
