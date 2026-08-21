const API_URL = import.meta.env.VITE_API_URL ?? ''

const fullUrl = (path) => `${API_URL}${path}`

export async function fetchJSON(path) {
	const res = await fetch(fullUrl(path))
	if (!res.ok) throw new Error('Error al cargar datos del foro')
	return res.json()
}

export async function createPost(formData) {
	const res = await fetch(fullUrl('/api/threads'), { method: 'POST', body: formData })
	const data = await res.json().catch(() => ({}))
	if (!res.ok) throw new Error(data.error || 'Error al publicar')
	return data
}

export async function deletePost(id, adminToken) {
	const res = await fetch(fullUrl(`/api/threads/${id}`), {
		method: 'DELETE',
		headers: { 'x-admin-token': adminToken },
	})
	if (!res.ok) throw new Error('No se pudo borrar la publicación')
}

export const fileUrl = (url) => `${API_URL}${url}`
