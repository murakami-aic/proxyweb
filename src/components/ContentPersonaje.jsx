import { useState } from 'react'
import ImageModal from './ImageModal'

function ContentPersonaje({ personaje, onPrev, onNext, onBack, hasPrev, hasNext }) {
	const [selectedIdx, setSelectedIdx] = useState(null)

	const galeria = personaje.galeria ?? []
	const modalImages = galeria.map(img => ({
		id: img.id,
		src: img.url,
		alt: img.alt ?? personaje.nombre,
	}))

	return (
		<div className='flex flex-col gap-3'>

			<div className='flex items-center justify-between'>
				<button
					onClick={onBack}
					className='border cursor-pointer px-2 py-0.5 hover:bg-gray-200'
				>
					← Personajes
				</button>
				<h1 className='text-center flex-1 text-lg md:text-xl font-bold'>{personaje.nombre}</h1>
				<div className='w-[110px]' />
			</div>

			<div className='flex flex-col sm:flex-row gap-3 border-1 px-2 sm:px-3 md:px-3.5 py-2'>
				<img
					src={personaje.img}
					alt={personaje.nombre}
					className='w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover aspect-square shrink-0 border-1 self-center sm:self-start'
				/>
				<p className='text-sm'>{personaje.descripcion}</p>
			</div>

			<h2 className='font-bold border-b'>Galería</h2>
			<div className='flex gap-2 overflow-x-auto pb-2'>
				{galeria.length > 0 ? (
					galeria.map((img, i) => (
						<img
							key={img.id}
							src={img.url}
							alt={img.alt ?? personaje.nombre}
							loading='lazy'
							onClick={() => setSelectedIdx(i)}
							className='h-32 sm:h-40 md:h-48 w-auto object-cover shrink-0 border-1 cursor-pointer transition hover:brightness-110 hover:outline-2 hover:outline-black'
						/>
					))
				) : (
					<p className='text-sm italic'>Sin imágenes</p>
				)}
			</div>

			<div className='flex justify-between mt-2'>
				<button
					onClick={onPrev}
					disabled={!hasPrev}
					className='border cursor-pointer px-3 py-0.5 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed'
				>
					← Anterior
				</button>
				<button
					onClick={onNext}
					disabled={!hasNext}
					className='border cursor-pointer px-3 py-0.5 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed'
				>
					Siguiente →
				</button>
			</div>

			<ImageModal
				images={modalImages}
				currentIdx={selectedIdx}
				onClose={() => setSelectedIdx(null)}
				onIndexChange={setSelectedIdx}
			/>

		</div>
	)
}

export default ContentPersonaje
