import { useEffect, useRef, useState } from 'react'
import { createPost, fetchConfig } from '../lib/api'
import { getSavedName, saveName, getSavedAvatar, saveAvatar, getAuthorKey } from '../lib/profile'

const MAX_NAME = 40
const MAX_CONTENT = 5000
const MAX_AVATAR_DIM = 128
const MAX_IMAGE_DIM = 1920
const IMAGE_QUALITY = 0.8

const mb = (bytes) => `${Math.round(bytes / 1024 / 1024)} MB`

const inputClass =
	'w-full border bg-white px-2 py-1 text-sm focus-visible:outline-2 focus-visible:outline-primary-500'

const fileLabelClass =
	'border bg-white px-2 py-1 text-sm cursor-pointer inline-flex items-center gap-1 active:bg-gray-200 focus-within:outline-2 focus-within:outline-primary-500'

const fileToDataUrl = (file) =>
	new Promise((resolve) => {
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result)
		reader.readAsDataURL(file)
	})

/**
 * Comprime una imagen en el navegador: redimensiona a maxDim px (máximo)
 * y exporta a JPEG. Si algo falla, devuelve el archivo original.
 */
async function compressImage(file, maxDim, quality) {
	try {
		const bitmap = await createImageBitmap(file)
		const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
		const w = Math.max(1, Math.round(bitmap.width * scale))
		const h = Math.max(1, Math.round(bitmap.height * scale))
		const canvas = document.createElement('canvas')
		canvas.width = w
		canvas.height = h
		canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h)
		bitmap.close?.()
		const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
		if (blob) return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
	} catch { /* sin soporte de canvas/Bitmap: usar original */ }
	return file
}

/** Comprime la foto de perfil a un cuadrado pequeño (recorte centrado). */
async function compressAvatar(file) {
	try {
		const bitmap = await createImageBitmap(file)
		const side = Math.min(bitmap.width, bitmap.height)
		const sx = (bitmap.width - side) / 2
		const sy = (bitmap.height - side) / 2
		const canvas = document.createElement('canvas')
		canvas.width = MAX_AVATAR_DIM
		canvas.height = MAX_AVATAR_DIM
		canvas.getContext('2d').drawImage(bitmap, sx, sy, side, side, 0, 0, MAX_AVATAR_DIM, MAX_AVATAR_DIM)
		bitmap.close?.()
		const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
		if (blob) return new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
	} catch { /* usar original */ }
	return file
}

/**
 * Formulario para crear publicaciones y respuestas.
 * Recuerda nombre y foto de perfil entre publicaciones (localStorage).
 */
function ForoForm({ parentId, onCreated }) {
	const [name, setName] = useState('')
	const [content, setContent] = useState('')
	const [avatarFile, setAvatarFile] = useState(null)
	const [avatarPreview, setAvatarPreview] = useState(null)
	const [images, setImages] = useState([])
	const [audio, setAudio] = useState(null)
	const [error, setError] = useState(null)
	const [sending, setSending] = useState(false)
	const [config, setConfig] = useState(null)
	const formRef = useRef()

	useEffect(() => {
		// Asegura que exista la clave de autor antes de publicar
		getAuthorKey()
		setName(getSavedName())
		const saved = getSavedAvatar()
		if (saved) setAvatarPreview(saved)
		fetchConfig().then(setConfig)
	}, [parentId])

	const handleAvatarChange = async (e) => {
		const file = e.target.files?.[0]
		if (!file) return
		if (file.size > (config?.maxAvatarSize ?? 1048576)) {
			setError(`La foto de perfil supera ${mb(config?.maxAvatarSize ?? 1048576)}`)
			return
		}
		const compressed = await compressAvatar(file)
		setAvatarFile(compressed)
		setAvatarPreview(URL.createObjectURL(compressed))
	}

	const handleImagesChange = async (e) => {
		const files = [...(e.target.files ?? [])]
		if (!files.length) return
		const maxImages = config?.maxImages ?? 5
		if (files.length > maxImages) {
			setError(`Máximo ${maxImages} imágenes por publicación`)
			return
		}
		const maxSize = config?.maxImageSize ?? 5242880
		if (files.some(f => f.size > maxSize)) {
			setError(`Cada imagen debe pesar menos de ${mb(maxSize)}`)
			return
		}
		setError(null)
		setImages(await Promise.all(files.map(f => compressImage(f, MAX_IMAGE_DIM, IMAGE_QUALITY))))
	}

	const validate = () => {
		if (!name.trim()) return 'Pon tu nombre para publicar'
		if (!content.trim()) return 'Escribe un mensaje'
		const maxAudio = config?.maxAudioSize ?? 8388608
		if (audio && audio.size > maxAudio) return `El audio supera ${mb(maxAudio)}`
		return null
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		const validationError = validate()
		if (validationError) {
			setError(validationError)
			return
		}

		const form = new FormData()
		form.set('name', name.trim().slice(0, MAX_NAME))
		form.set('content', content.trim().slice(0, MAX_CONTENT))
		if (parentId) form.set('parentId', parentId)

		let sentAvatar = avatarFile
		if (!sentAvatar) {
			// Reutiliza el avatar guardado en localStorage como archivo
			const saved = getSavedAvatar()
			if (saved) {
				try {
					const blob = await (await fetch(saved)).blob()
					sentAvatar = new File([blob], 'avatar.jpg', { type: blob.type || 'image/jpeg' })
				} catch { /* ignorar */ }
			}
		}
		if (sentAvatar) form.set('avatar', sentAvatar)
		for (const image of images) form.append('images', image)
		if (audio) form.set('audio', audio)

		setSending(true)
		setError(null)
		try {
			const { id } = await createPost(form)
			saveName(name.trim())
			if (sentAvatar) saveAvatar(await fileToDataUrl(sentAvatar))
			setContent('')
			setImages([])
			setAudio(null)
			formRef.current?.reset()
			onCreated?.(id)
		} catch (err) {
			setError(err.message)
		} finally {
			setSending(false)
		}
	}

	return (
		<form ref={formRef} onSubmit={handleSubmit} className='flex flex-col gap-2 border p-3 bg-primary-100'>
			<p className='text-sm font-semibold'>
				{parentId ? 'Responder en el hilo' : 'Nueva publicación'}
			</p>

			<div className='flex flex-wrap gap-2 items-center'>
				<label className='sr-only' htmlFor={`name-${parentId ?? 'new'}`}>Nombre</label>
				<input
					id={`name-${parentId ?? 'new'}`}
					type='text'
					value={name}
					maxLength={MAX_NAME}
					required
					placeholder='Tu nombre'
					onChange={(e) => setName(e.target.value)}
					className={`${inputClass} max-w-[200px] flex-1`}
				/>

				<label className={fileLabelClass}>
					{avatarPreview ? (
						<img
							src={avatarPreview}
							alt=''
							aria-hidden='true'
							width='24'
							height='24'
							className='w-6 h-6 aspect-square object-cover border'
						/>
					) : (
						<span>Foto de perfil</span>
					)}
					<input
						type='file'
						accept='image/jpeg,image/png,image/gif,image/webp,image/avif'
						className='sr-only'
						onChange={handleAvatarChange}
					/>
					<span className='text-gray-600 text-xs'>
						{avatarFile ? 'Nueva foto' : avatarPreview ? 'Cambiada al publicar' : 'Elegir foto'}
					</span>
				</label>
			</div>

			<label className='sr-only' htmlFor={`content-${parentId ?? 'new'}`}>Mensaje</label>
			<textarea
				id={`content-${parentId ?? 'new'}`}
				value={content}
				maxLength={MAX_CONTENT}
				required
				rows={4}
				placeholder={parentId ? 'Escribe tu respuesta...' : '¿Qué quieres contar?'}
				onChange={(e) => setContent(e.target.value)}
				className={inputClass}
			/>

			<div className='flex flex-wrap gap-2'>
				<label className={fileLabelClass}>
					<span>Imágenes ({images.length}/{config?.maxImages ?? 5})</span>
					<input
						type='file'
						accept='image/jpeg,image/png,image/gif,image/webp,image/avif'
						className='sr-only'
						multiple
						onChange={handleImagesChange}
					/>
					{images.length > 0 && (
						<span className='text-gray-600 max-w-[120px] truncate'>
							{images.map(f => f.name).join(', ')}
						</span>
					)}
				</label>

				<label className={fileLabelClass}>
					<span>Audio</span>
					<input
						type='file'
						accept='audio/mpeg,audio/ogg,audio/wav,audio/webm,audio/mp4,audio/aac'
						className='sr-only'
						onChange={(e) => setAudio(e.target.files[0] ?? null)}
					/>
					<span className='text-gray-600 max-w-[120px] truncate'>{audio ? audio.name : ''}</span>
				</label>
			</div>

			{error && <p role='alert' className='text-sm text-red-700'>{error}</p>}

			<button
				type='submit'
				disabled={sending}
				className='self-start border bg-white px-3 py-1 text-sm cursor-pointer active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-primary-500'
			>
				{sending ? 'Publicando...' : 'Publicar'}
			</button>

			<p className='text-xs text-gray-600'>
				Perfil {mb(config?.maxAvatarSize ?? 1048576)} · imagen {mb(config?.maxImageSize ?? 5242880)} ·
				audio {mb(config?.maxAudioSize ?? 8388608)} · máx {config?.maxImages ?? 5} imágenes.
				Las imágenes se comprimen en tu navegador antes de subir.
			</p>
		</form>
	)
}

export default ForoForm
