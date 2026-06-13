import { useParams, Link, Navigate } from 'react-router-dom'
import { comics } from '../data/comics'

const ComicDetail = () => {
	const { id } = useParams()
	const idx = comics.findIndex(c => c.id === Number(id))

	if (idx === -1) return <Navigate to='/comic' replace />

	const comic = comics[idx]
	const imagenes = [...comic.paginas].sort((a, b) => a.fecha - b.fecha)

	const hasPrev = idx > 0
	const hasNext = idx < comics.length - 1

	return (
		<>
			<div className='flex items-center justify-between mb-3'>
				<Link
					to='/comic'
					className='border cursor-pointer px-2 py-0.5 hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-primary-500'
				>
					← Capítulos
				</Link>
				<h1 className='text-center flex-1 text-lg md:text-xl font-bold'>
					{comic.capitulo}. {comic.name}
				</h1>
				<div className='w-[110px]' />
			</div>

			{imagenes.map((img) => (
				<div key={img.id} className='mb-0.5 px-2'>
					<img
						src={img.url}
						alt={img.name}
						loading='lazy'
						width='800'
						height='1200'
						className='w-full h-auto object-cover'
					/>
				</div>
			))}

			<div className='flex place-content-around mt-3 mb-6'>
				{hasPrev ? (
					<Link
						to={`/comic/${comics[idx - 1].id}`}
						rel='prev'
						className='border cursor-pointer px-3 py-0.5 hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-primary-500'
					>
						← Anterior
					</Link>
				) : (
					<span className='border px-3 py-0.5 opacity-40 cursor-not-allowed' aria-disabled='true'>
						← Anterior
					</span>
				)}
				<Link
					to='/comic'
					className='border cursor-pointer px-3 py-0.5 hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-primary-500'
				>
					← Capítulos
				</Link>
				{hasNext ? (
					<Link
						to={`/comic/${comics[idx + 1].id}`}
						rel='next'
						className='border cursor-pointer px-3 py-0.5 hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-primary-500'
					>
						Siguiente →
					</Link>
				) : (
					<span className='border px-3 py-0.5 opacity-40 cursor-not-allowed' aria-disabled='true'>
						Siguiente →
					</span>
				)}
			</div>
		</>
	)
}

export default ComicDetail
