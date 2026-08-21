import { useEffect, useRef, useState } from 'react'
import { createPost } from '../lib/api'

const MAX_NAME = 40
const MAX_CONTENT = 5000
const MAX_AVATAR_MB = 2
const MAX_IMAGE_MB = 5
const MAX_AUDIO_MB = 20

const inputClass =
	'w-full border bg-white px-2 py-1 text-sm focus-visible:outline-2 focus-visible:outline-primary-500'

const fileLabelClass =
	'border bg-white px-2 py-1 text-sm cursor-pointer inline-flex items-center gap-1 active:bg-gray-200 focus-within:outline-2 focus-within:outline-primary-500'

/**
 * Formulario para crear publicaciones y respuestas.
 * Recuerda el nombre entre publicaciones (localStorage).
 */
function ForoForm({ parentId, onCreated }) {
	const [name, setName] = useState(() => localStorage.getItem('foro-name') ?? '')
	const [content, setContent] = useState('')
	const [avatar, setAvatar] = useState(null)
	const [image, setImage] = useState(null)
	const [audio, setAudio] = useState(null)
	const [error, setError] = useState(null)
	const [sending, setSending] = useState(false)
	const formRef = useRef()

	useEffect(() => {
		setName(localStorage.getItem('foro-name') ?? '')
	}, [parentId])

	const validate = () => {
		if (!name.trim()) return 'Pon tu nombre para publicar'
		if (!content.trim()) return 'Escribe un mensaje'
		if (avatar && avatar.size > MAX_AVATAR_MB * 1024 * 1024) return `La foto de perfil supera ${MAX_AVATAR_MB} MB`
		if (image && image.size > MAX_IMAGE_MB * 1024 * 1024) return `La imagen supera ${MAX_IMAGE_MB} MB`
		if (audio && audio.size > MAX_AUDIO_MB * 1024 * 1024) return `El audio supera ${MAX_AUDIO_MB} MB`
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
		if (avatar) form.set('avatar', avatar)
		if (image) form.set('image', image)
		if (audio) form.set('audio', audio)

		setSending(true)
		setError(null)
		try {
			const { id } = await createPost(form)
			localStorage.setItem('foro-name', name.trim())
			setContent('')
			setAvatar(null)
			setImage(null)
			setAudio(null)
			formRef.current?.reset()
			onCreated?.(id)
		} catch (err) {
			setError(err.message)
		} finally {
			setSending(false)
		}
	}

	const selectedFileText = (file) => (file ? file.name : 'Ningún archivo')

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
					<span>Foto de perfil</span>
					<input
						type='file'
						accept='image/jpeg,image/png,image/gif,image/webp,image/avif'
						className='sr-only'
						onChange={(e) => setAvatar(e.target.files[0] ?? null)}
					/>
					<span className='text-gray-600 max-w-[120px] truncate'>{selectedFileText(avatar)}</span>
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
					<span>Imagen</span>
					<input
						type='file'
						accept='image/jpeg,image/png,image/gif,image/webp,image/avif'
						className='sr-only'
						onChange={(e) => setImage(e.target.files[0] ?? null)}
					/>
					<span className='text-gray-600 max-w-[120px] truncate'>{selectedFileText(image)}</span>
				</label>

				<label className={fileLabelClass}>
					<span>Audio</span>
					<input
						type='file'
						accept='audio/mpeg,audio/ogg,audio/wav,audio/webm,audio/mp4,audio/aac'
						className='sr-only'
						onChange={(e) => setAudio(e.target.files[0] ?? null)}
					/>
					<span className='text-gray-600 max-w-[120px] truncate'>{selectedFileText(audio)}</span>
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
				Máximos: perfil {MAX_AVATAR_MB} MB · imagen {MAX_IMAGE_MB} MB · audio {MAX_AUDIO_MB} MB
			</p>
		</form>
	)
}

export default ForoForm
