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
		<div className='flex flex-col gap-1'>

			<div className='flex items-center justify-between'>
				<button
					type='button'
					onClick={onBack}
					className='border cursor-pointer px-2 py-0.5 hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-primary-500 touch-manipulation'
				>
					← Personajes
				</button>
				<h1 className='text-center flex-1 text-lg md:text-xl font-bold'>{personaje.nombre}</h1>
				<div className='w-[110px]' />
			</div>

			<div className='flex flex-col sm:flex-row gap-3 border-1 px-2 sm:px-3 md:px-3.5 py-2'>
				<img
					src={personaje.img}
					alt={`Retrato de ${personaje.nombre}`}
					width='192'
					height='192'
					className='w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover aspect-square shrink-0 border-1 self-center sm:self-start'
				/>
				<p className='text-sm'>{personaje.descripcion}</p>
			</div>

			<h2 className='font-bold border-b'>Galería</h2>
			{galeria.length > 0 ? (
				<div className='flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scroll-px-2'>
					{galeria.map((img, i) => (
						<button
							key={img.id}
							type='button'
							onClick={() => setSelectedIdx(i)}
							aria-label={`Ver imagen ${i + 1} de la galería de ${personaje.nombre}`}
							className='snap-start shrink-0 p-0 bg-white border-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-500 touch-manipulation'
						>
							<img
								src={img.url}
								alt={img.alt ?? personaje.nombre}
								loading='lazy'
								width='320'
								height='240'
								className='h-32 sm:h-40 md:h-48 w-auto object-cover block'
							/>
						</button>
					))}
				</div>
			) : (
				<p className='text-sm italic'>Sin imágenes</p>
			)}

			<div className='flex justify-between mt-2'>
				<button
					type='button'
					onClick={onPrev}
					disabled={!hasPrev}
					className='border cursor-pointer px-3 py-0.5 hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-primary-500 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation'
				>
					← Anterior
				</button>
				<button
					type='button'
					onClick={onNext}
					disabled={!hasNext}
					className='border cursor-pointer px-3 py-0.5 hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-primary-500 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation'
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
