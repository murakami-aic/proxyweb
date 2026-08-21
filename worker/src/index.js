/**
 * API del foro para Cloudflare Workers (plan gratuito).
 *
 * Endpoints:
 *   GET    /api/threads          -> lista de publicaciones (con nº de respuestas)
 *   GET    /api/threads/:id      -> publicación + sus respuestas
 *   POST   /api/threads          -> crear publicación o respuesta (multipart/form-data)
 *   DELETE /api/threads/:id      -> borrar publicación (requiere cabecera X-Admin-Token)
 *   GET    /api/files/:key       -> servir archivo de R2 (imagen/audio)
 *
 * Campos del formulario POST:
 *   name      (texto, requerido)      nombre del autor
 *   content   (texto, requerido)      mensaje
 *   parentId  (texto, opcional)       id de la publicación padre (respuesta)
 *   avatar    (archivo, opcional)     foto de perfil (imagen <= 2 MB)
 *   image     (archivo, opcional)     imagen adjunta (<= 5 MB)
 *   audio     (archivo, opcional)     audio adjunto (<= 20 MB)
 */

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' }

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
const AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav', 'audio/webm', 'audio/mp4', 'audio/aac']

const uuid = () => crypto.randomUUID()

function corsHeaders(env) {
	return {
		'access-control-allow-origin': env.ALLOWED_ORIGIN || '*',
		'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
		'access-control-allow-headers': 'content-type, x-admin-token',
		'access-control-max-age': '86400',
		vary: 'origin',
	}
}

const json = (env, data, status = 200) =>
	new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...corsHeaders(env) } })

const badRequest = (env, message) => json(env, { error: message }, 400)
const notFound = (env) => json(env, { error: 'No encontrado' }, 404)

async function isAuthorized(request, env) {
	const token = request.headers.get('x-admin-token')
	return typeof env.ADMIN_TOKEN === 'string' && token === env.ADMIN_TOKEN
}

/** Sube un archivo a R2 si supera las validaciones. Devuelve la url o null. */
async function uploadFile(env, file, kind) {
	const max =
		kind === 'avatar' ? 2 * 1024 * 1024 :
			kind === 'image' ? Number(env.MAX_IMAGE_SIZE) || 5 * 1024 * 1024 :
				Number(env.MAX_AUDIO_SIZE) || 20 * 1024 * 1024

	if (file.size === 0) return null
	if (file.size > max) throw new Error(`El archivo "${file.name}" supera el máximo de ${Math.round(max / 1024 / 1024)} MB`)

	const validTypes = kind === 'audio' ? AUDIO_TYPES : IMAGE_TYPES
	if (!validTypes.includes(file.type)) throw new Error(`Tipo de archivo no permitido: ${file.type || 'desconocido'}`)

	const ext = (file.name.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '')
	const key = `${kind}s/${uuid()}${ext ? '.' + ext : ''}`
	await env.FILES.put(key, file.body ?? file, {
		httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
	})
	return `/api/files/${key}`
}

/** Obtiene las urls de los adjuntos de varios posts en una sola consulta. */
async function attachmentsFor(env, postIds) {
	const urls = {}
	if (postIds.length === 0) return urls
	const placeholders = postIds.map(() => '?').join(',')
	const { results } = await env.DB.prepare(
		`SELECT post_id, type, url FROM attachments WHERE post_id IN (${placeholders})`
	).bind(...postIds).all()
	for (const row of results) {
		;(urls[row.post_id] ??= []).push({ type: row.type, url: row.url })
	}
	return urls
}

async function listThreads(env) {
	const { results: posts } = await env.DB.prepare(`
		SELECT p.id, p.parent_id, p.name, p.avatar_url, p.content, p.created_at,
		       (SELECT COUNT(*) FROM posts r WHERE r.parent_id = p.id) AS reply_count
		FROM posts p
		WHERE p.parent_id IS NULL
		ORDER BY p.created_at DESC
		LIMIT 100
	`).all()
	const urls = await attachmentsFor(env, posts.map(p => p.id))
	return posts.map(p => ({ ...p, attachments: urls[p.id] ?? [] }))
}

async function getThread(env, id) {
	const post = await env.DB.prepare(
		'SELECT id, parent_id, name, avatar_url, content, created_at FROM posts WHERE id = ?'
	).first(id)
	if (!post) return null

	const { results: replies } = await env.DB.prepare(
		'SELECT id, name, avatar_url, content, created_at FROM posts WHERE parent_id = ? ORDER BY created_at ASC LIMIT 500'
	).bind(id).all()

	const urls = await attachmentsFor(env, [id, ...replies.map(r => r.id)])
	return {
		...post,
		attachments: urls[id] ?? [],
		replies: replies.map(r => ({ ...r, attachments: urls[r.id] ?? [] })),
	}
}

async function createPost(env, request) {
	let form
	try {
		form = await request.formData()
	} catch {
		return badRequest(env, 'Se esperaba multipart/form-data')
	}

	const name = (form.get('name') ?? '').toString().trim().slice(0, 40)
	const content = (form.get('content') ?? '').toString().trim().slice(0, 5000)
	const parentId = (form.get('parentId') ?? '').toString().trim() || null

	if (!name) return badRequest(env, 'El nombre es obligatorio')
	if (!content) return badRequest(env, 'El mensaje es obligatorio')
	if (parentId && !(await env.DB.prepare('SELECT id FROM posts WHERE id = ?').first(parentId))) {
		return badRequest(env, 'La publicación a responder no existe')
	}

	try {
		const attachments = []

		const avatar = form.get('avatar')
		const avatarUrl = avatar instanceof File ? await uploadFile(env, avatar, 'avatar') : null

		const image = form.get('image')
		if (image instanceof File) {
			const url = await uploadFile(env, image, 'image')
			if (url) attachments.push({ type: 'image', url })
		}

		const audio = form.get('audio')
		if (audio instanceof File) {
			const url = await uploadFile(env, audio, 'audio')
			if (url) attachments.push({ type: 'audio', url })
		}

		const id = uuid()
		const createdAt = Date.now()

		// Inserta post y adjuntos en una transacción
		const stmts = [
			env.DB.prepare(
				'INSERT INTO posts (id, parent_id, name, avatar_url, content, created_at) VALUES (?, ?, ?, ?, ?, ?)'
			).bind(id, parentId, name, avatarUrl, content, createdAt),
			...attachments.map(a =>
				env.DB.prepare(
					'INSERT INTO attachments (id, post_id, type, url) VALUES (?, ?, ?, ?)'
				).bind(uuid(), id, a.type, a.url)
			),
		]
		await env.DB.batch(stmts)

		return json(env, { id }, 201)
	} catch (err) {
		return badRequest(env, err.message || 'Error al subir el archivo')
	}
}

async function deletePost(env, id) {
	// Los adjuntos viven en R2; se listan antes del CASCADE
	const { results } = await env.DB.prepare('SELECT url FROM attachments WHERE post_id IN (?)').bind(id).all()
	const { results: replies } = await env.DB.prepare('SELECT id FROM posts WHERE parent_id = ?').bind(id).all()
	for (const r of replies) {
		const { results: ra } = await env.DB.prepare('SELECT url FROM attachments WHERE post_id = ?').bind(r.id).all()
		results.push(...ra)
	}

	await env.DB.prepare('DELETE FROM posts WHERE id = ? OR parent_id = ?').bind(id, id).run()

	// Borrado best-effort de R2 (si falla, no bloquea la respuesta)
	await Promise.allSettled(
		results
			.map(a => a.url.replace('/api/files/', ''))
			.filter(Boolean)
			.map(key => env.FILES.delete(key))
	)
	return json(env, { ok: true })
}

async function serveFile(env, key) {
	const safeKey = key.replace(/\.\.[\\/]/g, '') // evita path traversal
	const object = await env.FILES.get(safeKey)
	if (!object) return new Response('No encontrado', { status: 404 })
	const headers = new Headers()
	object.writeHttpMetadata(headers)
	headers.set('etag', object.httpEtag)
	headers.set('cache-control', 'public, max-age=31536000, immutable')
	return new Response(object.body, { headers })
}

export default {
	async fetch(request, env) {
		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: corsHeaders(env) })
		}

		const url = new URL(request.url)
		const parts = url.pathname.split('/').filter(Boolean) // ['api', 'threads', ...]

		try {
			if (parts[0] !== 'api') return notFound(env)

			if (parts[1] === 'files' && parts.length === 3 && request.method === 'GET') {
				return serveFile(env, parts[2])
			}

			if (parts[1] === 'threads') {
				if (parts.length === 2) {
					if (request.method === 'GET') return json(env, { threads: await listThreads(env) })
					if (request.method === 'POST') return createPost(env, request)
				}
				if (parts.length === 3) {
					if (request.method === 'GET') {
						const thread = await getThread(env, parts[2])
						return thread ? json(env, thread) : notFound(env)
					}
					if (request.method === 'DELETE') {
						if (!(await isAuthorized(request, env))) {
							return json(env, { error: 'No autorizado' }, 401)
						}
						return deletePost(env, parts[2])
					}
				}
			}

			return notFound(env)
		} catch (err) {
			return json(env, { error: 'Error interno', detail: err.message }, 500)
		}
	},
}
