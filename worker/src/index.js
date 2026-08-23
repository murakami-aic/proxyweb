/**
 * API del foro para Cloudflare Workers (plan gratuito).
 *
 * Endpoints:
 *   GET    /api/config           -> límites y tipos aceptados (fuente única de verdad)
 *   GET    /api/threads          -> lista de publicaciones (con nº de respuestas y "owner")
 *   GET    /api/threads/:id      -> publicación + sus respuestas (con "owner")
 *   POST   /api/threads          -> crear publicación o respuesta (multipart/form-data)
 *   DELETE /api/threads/:id      -> borrar publicación (X-Admin-Token o X-Author-Key)
 *   GET    /api/files/:key       -> servir archivo de R2 (imagen/audio)
 *
 * Cabeceras:
 *   X-Admin-Token  -> token secreto del administrador (borra cualquier post)
 *   X-Author-Key   -> clave de autor generada por el navegador (borrar posts propios)
 *
 * Campos del formulario POST:
 *   name      (texto, requerido)        nombre del autor
 *   content   (texto, requerido)        mensaje
 *   parentId  (texto, opcional)         id de la publicación padre (respuesta)
 *   avatar    (archivo, opcional)       foto de perfil (imagen <= 1 MB)
 *   images    (archivos, opcional, repetible) imágenes (<= 5 MB cada una, máx N)
 *   audio     (archivo, opcional)       audio (<= 8 MB)
 */

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' }

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
const AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav', 'audio/webm', 'audio/mp4', 'audio/aac']

const uuid = () => crypto.randomUUID()

async function sha256Hex(text) {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
	return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')
}

function getLimits(env) {
	return {
		maxAvatarSize: Number(env.MAX_AVATAR_SIZE) || 1048576,
		maxImageSize: Number(env.MAX_IMAGE_SIZE) || 5242880,
		maxAudioSize: Number(env.MAX_AUDIO_SIZE) || 8388608,
		maxImages: Number(env.MAX_IMAGES) || 5,
		maxTotalSize: Number(env.MAX_TOTAL_SIZE) || 62914560,
	}
}

function corsHeaders(request, env) {
	const allowed = (env.ALLOWED_ORIGIN || '*')
		.split(',')
		.map(s => s.trim())
		.filter(Boolean)
	const origin = request.headers.get('origin')
	let allowOrigin = null
	if (allowed.includes('*')) {
		allowOrigin = '*'
	} else if (origin && allowed.includes(origin)) {
		allowOrigin = origin
	}
	const headers = {
		'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
		'access-control-allow-headers': 'content-type, x-admin-token, x-author-key',
		'access-control-max-age': '86400',
		vary: 'origin',
	}
	if (allowOrigin) headers['access-control-allow-origin'] = allowOrigin
	return headers
}

const json = (request, env, data, status = 200) =>
	new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...corsHeaders(request, env) } })

const badRequest = (request, env, message) => json(request, env, { error: message }, 400)
const notFound = (request, env) => json(request, env, { error: 'No encontrado' }, 404)

async function isAuthorized(request, env) {
	const token = request.headers.get('x-admin-token')
	return typeof env.ADMIN_TOKEN === 'string' && token === env.ADMIN_TOKEN
}

/** Devuelve el hash SHA-256 de la clave de autor de la petición (o null). */
async function authorKeyHash(request) {
	const key = request.headers.get('x-author-key')
	if (!key || key.length > 200) return null
	return sha256Hex(key)
}

/** Sube un archivo a R2 si supera las validaciones. Devuelve la url o null. */
async function uploadFile(env, file, kind, limits) {
	const max =
		kind === 'avatar' ? limits.maxAvatarSize :
			kind === 'image' ? limits.maxImageSize :
				limits.maxAudioSize

	if (file.size === 0) return null
	if (file.size > max) throw new Error(`El archivo "${file.name}" supera el máximo de ${Math.round(max / 1024 / 1024)} MB`)

	const validTypes = kind === 'audio' ? AUDIO_TYPES : IMAGE_TYPES
	if (!validTypes.includes(file.type)) throw new Error(`Tipo de archivo no permitido: ${file.type || 'desconocido'}`)

	const ext = (file.name.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '')
	const key = `${kind === 'avatar' ? 'avatars' : kind + 's'}/${uuid()}${ext ? '.' + ext : ''}`
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

async function listThreads(env, request) {
	const keyHash = await authorKeyHash(request)
	const { results: posts } = await env.DB.prepare(`
		SELECT p.id, p.parent_id, p.name, p.avatar_url, p.content, p.created_at,
		       (SELECT COUNT(*) FROM posts r WHERE r.parent_id = p.id) AS reply_count,
		       (p.author_key_hash IS NOT NULL AND p.author_key_hash = ?) AS owner
		FROM posts p
		WHERE p.parent_id IS NULL
		ORDER BY p.created_at DESC
		LIMIT 100
	`).bind(keyHash).all()
	const urls = await attachmentsFor(env, posts.map(p => p.id))
	return posts.map(p => ({ ...p, attachments: urls[p.id] ?? [] }))
}

async function getThread(env, request, id) {
	const keyHash = await authorKeyHash(request)
	const post = await env.DB.prepare(`
		SELECT id, parent_id, name, avatar_url, content, created_at,
		       (author_key_hash IS NOT NULL AND author_key_hash = ?) AS owner
		FROM posts WHERE id = ?
	`).bind(keyHash, id).first()
	if (!post) return null

	const { results: replies } = await env.DB.prepare(`
		SELECT id, name, avatar_url, content, created_at,
		       (author_key_hash IS NOT NULL AND author_key_hash = ?) AS owner
		FROM posts WHERE parent_id = ? ORDER BY created_at ASC LIMIT 500
	`).bind(keyHash, id).all()

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
		return badRequest(request, env, 'Se esperaba multipart/form-data')
	}

	const limits = getLimits(env)
	const name = (form.get('name') ?? '').toString().trim().slice(0, 40)
	const content = (form.get('content') ?? '').toString().trim().slice(0, 5000)
	const parentId = (form.get('parentId') ?? '').toString().trim() || null

	if (!name) return badRequest(request, env, 'El nombre es obligatorio')
	if (!content) return badRequest(request, env, 'El mensaje es obligatorio')
	if (parentId && !(await env.DB.prepare('SELECT id FROM posts WHERE id = ?').bind(parentId).first())) {
		return badRequest(request, env, 'La publicación a responder no existe')
	}

	try {
		const avatar = form.get('avatar')
		const avatarFile = avatar instanceof File && avatar.size > 0 ? avatar : null

		const imageFiles = form
			.getAll('images')
			.filter(f => f instanceof File && f.size > 0)
			.slice(0, limits.maxImages)

		const audio = form.get('audio')
		const audioFile = audio instanceof File && audio.size > 0 ? audio : null

		const totalSize =
			(avatarFile?.size ?? 0) +
			imageFiles.reduce((sum, f) => sum + f.size, 0) +
			(audioFile?.size ?? 0)
		if (totalSize > limits.maxTotalSize) {
			return badRequest(request, env, `La publicación supera el máximo total de ${Math.round(limits.maxTotalSize / 1024 / 1024)} MB`)
		}

		const attachments = []
		const avatarUrl = avatarFile ? await uploadFile(env, avatarFile, 'avatar', limits) : null
		for (const image of imageFiles) {
			const url = await uploadFile(env, image, 'image', limits)
			if (url) attachments.push({ type: 'image', url })
		}
		if (audioFile) {
			const url = await uploadFile(env, audioFile, 'audio', limits)
			if (url) attachments.push({ type: 'audio', url })
		}

		const keyHash = await authorKeyHash(request)
		const id = uuid()
		const createdAt = Date.now()

		const stmts = [
			env.DB.prepare(
				'INSERT INTO posts (id, parent_id, name, avatar_url, content, created_at, author_key_hash) VALUES (?, ?, ?, ?, ?, ?, ?)'
			).bind(id, parentId, name, avatarUrl, content, createdAt, keyHash),
			...attachments.map(a =>
				env.DB.prepare(
					'INSERT INTO attachments (id, post_id, type, url) VALUES (?, ?, ?, ?)'
				).bind(uuid(), id, a.type, a.url)
			),
		]
		await env.DB.batch(stmts)

		return json(request, env, { id }, 201)
	} catch (err) {
		return badRequest(request, env, err.message || 'Error al subir el archivo')
	}
}

async function deletePost(env, request, id) {
	// Autorización: admin (cualquier post) o autor (solo posts propios)
	if (!(await isAuthorized(request, env))) {
		const key = request.headers.get('x-author-key')
		const row = key
			? await env.DB.prepare('SELECT author_key_hash FROM posts WHERE id = ?').bind(id).first()
			: null
		const owns = row?.author_key_hash && key && row.author_key_hash === (await sha256Hex(key))
		if (!owns) return json(request, env, { error: 'No autorizado' }, 401)
	}

	// Los adjuntos viven en R2; se listan antes del CASCADE
	const files = []
	const { results: rootAttachments } = await env.DB.prepare('SELECT url FROM attachments WHERE post_id = ?').bind(id).all()
	files.push(...rootAttachments)
	const { results: replies } = await env.DB.prepare('SELECT id FROM posts WHERE parent_id = ?').bind(id).all()
	for (const r of replies) {
		const { results: ra } = await env.DB.prepare('SELECT url FROM attachments WHERE post_id = ?').bind(r.id).all()
		files.push(...ra)
	}

	await env.DB.prepare('DELETE FROM posts WHERE id = ? OR parent_id = ?').bind(id, id).run()

	// Borrado best-effort de R2 (si falla, no bloquea la respuesta)
	await Promise.allSettled(
		files
			.map(a => a.url.replace('/api/files/', ''))
			.filter(Boolean)
			.map(key => env.FILES.delete(key))
	)
	return json(request, env, { ok: true })
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
			return new Response(null, { status: 204, headers: corsHeaders(request, env) })
		}

		const url = new URL(request.url)
		const parts = url.pathname.split('/').filter(Boolean) // ['api', ...]

		try {
			if (parts[0] !== 'api') return notFound(request, env)

			if (parts[1] === 'config' && parts.length === 2 && request.method === 'GET') {
				const limits = getLimits(env)
				return json(request, env, { ...limits, acceptedImageTypes: IMAGE_TYPES, acceptedAudioTypes: AUDIO_TYPES })
			}

			if (parts[1] === 'files' && parts.length >= 3 && request.method === 'GET') {
				return serveFile(env, parts.slice(2).join('/'))
			}

			if (parts[1] === 'threads') {
				if (parts.length === 2) {
					if (request.method === 'GET') return json(request, env, { threads: await listThreads(env, request) })
					if (request.method === 'POST') return createPost(env, request)
				}
				if (parts.length === 3) {
					if (request.method === 'GET') {
						const thread = await getThread(env, request, parts[2])
						return thread ? json(request, env, thread) : notFound(request, env)
					}
					if (request.method === 'DELETE') {
						return deletePost(env, request, parts[2])
					}
				}
			}

			return notFound(request, env)
		} catch (err) {
			return json(request, env, { error: 'Error interno', detail: err.message }, 500)
		}
	},
}
