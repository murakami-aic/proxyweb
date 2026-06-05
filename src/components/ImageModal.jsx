import { useEffect } from 'react'

function ImageModal({ images, currentIdx, onClose, onIndexChange }) {

	useEffect(() => {
		if (currentIdx === null) return
		const handler = (e) => {
			if (e.key === 'Escape') onClose()
			if (e.key === 'ArrowLeft' && currentIdx > 0) onIndexChange(currentIdx - 1)
			if (e.key === 'ArrowRight' && currentIdx < images.length - 1) onIndexChange(currentIdx + 1)
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [currentIdx, images.length, onClose, onIndexChange])

	if (currentIdx === null) return null

	const current = images[currentIdx]
	if (!current) return null

	const hasPrev = currentIdx > 0
	const hasNext = currentIdx < images.length - 1

	return (
		<div
			className='fixed inset-0 z-50 bg-black/70 flex items-center justify-center'
			onClick={onClose}
		>
			<img
				src={current.src}
				alt={current.alt}
				className='max-w-[90vw] max-h-[80vh] object-contain'
				onClick={(e) => e.stopPropagation()}
			/>

			<button
				onClick={onClose}
				aria-label='Cerrar'
				className='absolute top-4 right-4 border-1 px-3 py-1 cursor-pointer text-lg leading-none hover:bg-gray-200'
			>
				×
			</button>

			<div
				className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={() => onIndexChange(currentIdx - 1)}
					disabled={!hasPrev}
					className='border-1 px-3 py-1 cursor-pointer hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed'
				>
					← Anterior
				</button>
				<button
					onClick={() => onIndexChange(currentIdx + 1)}
					disabled={!hasNext}
					className='border-1 px-3 py-1 cursor-pointer hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed'
				>
					Siguiente →
				</button>
			</div>
		</div>
	)
}

export default ImageModal
