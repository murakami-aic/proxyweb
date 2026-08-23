const modulos = import.meta.glob('../assets/home_imagenes/*', {
	eager: true,
	import: 'default',
})

export const home_imagenes = Object.entries(modulos)
	.map(([ruta, url]) => {
		const archivo = ruta.split('/').pop()
		return {
			id: archivo.replace(/\.\w+$/, '').replaceAll('_', '-'),
			url,
			titulo: archivo,
		}
	})
	.sort((a, b) => a.titulo.localeCompare(b.titulo))

// Acceso directo por id: imagenesHome['sara-web-comic'].url
export const imagenesHome = Object.fromEntries(
	home_imagenes.map((img) => [img.id, img])
)

export default home_imagenes
