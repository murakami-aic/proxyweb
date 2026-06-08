import useFetch from '../hooks/useFetch'

function ContentComic({ comicSelect, onPrev, onNext, onBack, hasPrev, hasNext }) {
	const { data: imgData } = useFetch('/api/comic/' + comicSelect.id)
	const imagenes = [...(imgData ?? [])].sort((a, b) => a.fecha - b.fecha)

	return (
		<>
			<div className='flex items-center justify-between mb-3'>
				<button
					onClick={onBack}
					className='border cursor-pointer px-2'
				>
					← Capítulos
				</button>
				<h1 className='text-center flex-1'>{comicSelect.capitulo}. {comicSelect.name}</h1>
				<div className='w-[90px]' />
			</div>

			{imagenes.map((img) => (
				<div key={img.id} className='mb-0.5 px-2'>
					<img
						src={'https://lucesdefalsocontacto.com/' + img.url}
						alt={img.name}
						className='w-full h-auto object-cover'
					/>
				</div>
			))}

			<div className='flex place-content-around mt-3'>
				<button
					onClick={onPrev}
					disabled={!hasPrev}
					className='border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
				>
					Anterior
				</button>
				<button
					onClick={onBack}
					className='border cursor-pointer px-2'
				>
					← Capítulos
				</button>
				<button
					onClick={onNext}
					disabled={!hasNext}
					className='border cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
				>
					Siguiente
				</button>
			</div>
		</>
	)
}

export default ContentComic
