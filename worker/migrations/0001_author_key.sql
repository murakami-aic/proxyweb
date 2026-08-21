-- Migración para bases de datos existentes: soporte de clave de autor
-- (borrar posts propios). Aplicar con:
--   npx wrangler d1 execute foro-luces --remote --file=./migrations/0001_author_key.sql
--   npx wrangler d1 execute foro-luces --local  --file=./migrations/0001_author_key.sql
ALTER TABLE posts ADD COLUMN author_key_hash TEXT;
