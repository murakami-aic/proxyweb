import { useCallback, useEffect, useState } from 'react'
import ForoForm from '../components/ForoForm'
import ForoPost from '../components/ForoPost'
import { fetchJSON } from '../lib/api'

function Foro() {
	const [threads, setThreads] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [showForm, setShowForm] = useState(false)

	const load = useCallback(async () => {
		try {
			const data = await fetchJSON('/api/threads')
			setThreads(data.threads)
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => { load() }, [load])

	const handleCreated = async (id) => {
		setShowForm(false)
		await load()
		window.location.hash = ''
		if (id) document.getElementById(`post-${id}`)?.scrollIntoView({ block: 'center' })
	}

	const handleDeleted = (id) => {
		setThreads(prev => prev.filter(t => t.id !== id))
	}

	return (
		<div className='flex flex-col gap-y-6 sm:px-4 md:px-10 lg:px-20'>
			<section aria-labelledby='foro-heading' className='border p-5 flex flex-col items-center gap-3 bg-primary-50'>
				<h2 id='foro-heading' className='font-extrabold text-3xl text-center'>Foro</h2>
				<p className='text-pretty text-center max-w-prose'>
					Espacio abierto de la comunidad de Luces de Falso Contacto: comparte tus dibujos,
					música, teorías del cómic o lo que quieras. No necesitas cuenta, solo un nombre.
				</p>
				<button
					type='button'
					onClick={() => setShowForm(prev => !prev)}
					aria-expanded={showForm}
					className='border bg-white px-3 py-1 text-sm cursor-pointer active:bg-gray-200 focus-visible:outline-2 focus-visible:outline-primary-500'
				>
					{showForm ? 'Cerrar formulario' : 'Nueva publicación'}
				</button>
			</section>

			{showForm && <ForoForm onCreated={handleCreated} />}

			<section aria-label='Publicaciones' className='flex flex-col gap-3'>
				{loading && <p className='text-sm text-gray-600'>Cargando publicaciones...</p>}
				{error && <p role='alert' className='text-sm text-red-700 border p-3 bg-white'>{error}</p>}
				{!loading && !error && threads.length === 0 && (
					<p className='text-sm text-gray-700 border p-5 bg-primary-50'>
						Todavía no hay publicaciones. ¡Sé la primera persona en escribir!
					</p>
				)}
				{threads.map(thread => (
					<div key={thread.id} id={`post-${thread.id}`}>
						<ForoPost
							post={thread}
							to={`/foro/${thread.id}`}
							linkText='Ver hilo y responder →'
							onDeleted={handleDeleted}
						/>
					</div>
				))}
			</section>
		</div>
	)
}

export default Foro
