export const formatDate = (ms) =>
	new Date(ms).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' })
