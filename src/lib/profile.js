/**
 * Perfil local del usuario (sin login): nombre, foto y clave de autor.
 * Todo vive en localStorage de este navegador/dispositivo.
 */

const NAME_KEY = 'foro-name'
const AVATAR_KEY = 'foro-avatar'
const AUTHOR_KEY = 'foro-author-key'

export const getSavedName = () => localStorage.getItem(NAME_KEY) ?? ''
export const saveName = (name) => localStorage.setItem(NAME_KEY, name)

export const getSavedAvatar = () => localStorage.getItem(AVATAR_KEY)
export const saveAvatar = (dataUrl) => localStorage.setItem(AVATAR_KEY, dataUrl)

export const clearProfile = () => {
	localStorage.removeItem(NAME_KEY)
	localStorage.removeItem(AVATAR_KEY)
}

/** Clave de autor: se crea una vez y se reutiliza para poder borrar posts propios. */
export const getAuthorKey = () => {
	let key = localStorage.getItem(AUTHOR_KEY)
	if (!key) {
		key = crypto.randomUUID()
		localStorage.setItem(AUTHOR_KEY, key)
	}
	return key
}
