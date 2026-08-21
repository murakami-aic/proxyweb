const API_URL = import.meta.env.VITE_API_URL ?? ''

const fullUrl = (path) => `${API_URL}${path}`

/** Cabeceras comunes: siempre viaja la clave de autor (si existe). */
const authHeaders = (extra = {}) => {
	const headers = { ...extra }
	const key = localStorage.getItem('foro-author-key')
	if (key) headers['x-author-key'] = key
	return headers
}

export async function fetchJSON(path) {
	const res = await fetch(fullUrl(path), { headers: authHeaders() })
	if (!res.ok) throw new Error('Error al cargar datos del foro')
	return res.json()
}

let configPromise = null
/** Límites de la API (cacheados). Fuente única de verdad: el Worker. */
export const fetchConfig = () => {
	if (!configPromise) {
		configPromise = fetch(fullUrl('/api/config'))
			.then(async (res) => {
				if (!res.ok) throw new Error('config')
				return res.json()
			})
			.catch(() => ({
				// Valores por defecto (idénticos al Worker) si /api/config no responde
				maxAvatarSize: 1048576,
				maxImageSize: 5242880,
				maxAudioSize: 8388608,
				maxImages: 5,
				maxTotalSize: 62914560,
			}))
	}
	return configPromise
}

export async function createPost(formData) {
	const res = await fetch(fullUrl('/api/threads'), {
		method: 'POST',
		headers: authHeaders(),
		body: formData,
	})
	const data = await res.json().catch(() => ({}))
	if (!res.ok) throw new Error(data.error || 'Error al publicar')
	return data
}

/** Borra un post: con token de admin (cualquiera) o con la clave de autor (propios). */
export async function deletePost(id, adminToken) {
	const headers = authHeaders()
	if (adminToken) headers['x-admin-token'] = adminToken
	const res = await fetch(fullUrl(`/api/threads/${id}`), { method: 'DELETE', headers })
	if (!res.ok) throw new Error('No se pudo borrar la publicación')
}

export const fileUrl = (url) => `${API_URL}${url}`
