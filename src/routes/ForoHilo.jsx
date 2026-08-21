import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ForoForm from '../components/ForoForm'
import ForoPost from '../components/ForoPost'
import { fetchJSON } from '../lib/api'

function ForoHilo() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [thread, setThread] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const load = useCallback(async () => {
		try {
			const data = await fetchJSON(`/api/threads/${id}`)
			setThread(data)
			setError(null)
		} catch {
			setError('No se pudo cargar el hilo. Puede que haya sido borrado.')
		} finally {
			setLoading(false)
		}
	}, [id])

	useEffect(() => { load() }, [load])

	const handleCreated = () => load()

	// Si se borra la publicación raíz (por su autor o por el admin), vuelve al foro
	const handleDeleted = (deletedId) => {
		if (deletedId === thread?.id) {
			navigate('/foro', { replace: true })
			return
		}
		setThread(prev => prev ? { ...prev, replies: prev.replies.filter(r => r.id !== deletedId) } : prev)
	}

	if (loading) {
		return <p className='text-sm text-gray-600 sm:px-4 md:px-10 lg:px-20 mt-6'>Cargando hilo...</p>
	}

	if (error) {
		return (
			<div className='flex flex-col gap-3 items-start mt-6 sm:px-4 md:px-10 lg:px-20'>
				<p role='alert' className='text-sm text-red-700 border p-3 bg-white'>{error}</p>
				<Link to='/foro' className='text-sm underline focus-visible:outline-2 focus-visible:outline-primary-500'>
					← Volver al foro
				</Link>
			</div>
		)
	}

	return (
		<div className='flex flex-col gap-y-6 sm:px-4 md:px-10 lg:px-20'>
			<Link
				to='/foro'
				className='text-sm self-start underline focus-visible:outline-2 focus-visible:outline-primary-500'
			>
				← Volver al foro
			</Link>

			<section aria-label='Publicación original'>
				<ForoPost post={thread} onDeleted={handleDeleted} />
			</section>

			<section aria-labelledby='replies-heading' className='flex flex-col gap-3'>
				<h2 id='replies-heading' className='font-bold text-xl'>
					Respuestas {thread.replies.length > 0 && `(${thread.replies.length})`}
				</h2>

				{thread.replies.length === 0 && (
					<p className='text-sm text-gray-700'>Todavía no hay respuestas. ¡Anímate a responder!</p>
				)}

				{thread.replies.map(reply => (
					<ForoPost key={reply.id} post={reply} onDeleted={handleDeleted} />
				))}
			</section>

			<ForoForm parentId={thread.id} onCreated={handleCreated} />
		</div>
	)
}

export default ForoHilo
