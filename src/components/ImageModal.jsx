import { useEffect, useRef } from 'react'

function ImageModal({ images, currentIdx, onClose, onIndexChange }) {
	const dialogRef = useRef(null)
	const closeBtnRef = useRef(null)

	useEffect(() => {
		if (currentIdx === null) return

		const previouslyFocused = document.activeElement
		closeBtnRef.current?.focus()

		const focusable = () =>
			dialogRef.current
				? Array.from(dialogRef.current.querySelectorAll(
					'button, [href], [tabindex]:not([tabindex="-1"])'
				)).filter(el => !el.hasAttribute('disabled'))
				: []

		const handler = (e) => {
			if (e.key === 'Escape') {
				onClose()
				return
			}
			if (e.key === 'ArrowLeft' && currentIdx > 0) {
				onIndexChange(currentIdx - 1)
				return
			}
			if (e.key === 'ArrowRight' && currentIdx < images.length - 1) {
				onIndexChange(currentIdx + 1)
				return
			}
			if (e.key === 'Tab') {
				const items = focusable()
				if (items.length === 0) return
				const first = items[0]
				const last = items[items.length - 1]
				if (e.shiftKey && document.activeElement === first) {
					last.focus()
					e.preventDefault()
				} else if (!e.shiftKey && document.activeElement === last) {
					first.focus()
					e.preventDefault()
				}
			}
		}

		document.body.style.overflow = 'hidden'
		window.addEventListener('keydown', handler)
		return () => {
			document.body.style.overflow = ''
			window.removeEventListener('keydown', handler)
			if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
				previouslyFocused.focus()
			}
		}
	}, [currentIdx, images.length, onClose, onIndexChange])

	if (currentIdx === null) return null

	const current = images[currentIdx]
	if (!current) return null

	const hasPrev = currentIdx > 0
	const hasNext = currentIdx < images.length - 1

	return (
		<div
			ref={dialogRef}
			role='dialog'
			aria-modal='true'
			aria-label={`Imagen ${currentIdx + 1} de ${images.length}: ${current.alt}`}
			className='fixed inset-0 z-50 bg-black/70 flex items-center justify-center overscroll-contain touch-manipulation'
			onClick={onClose}
		>
			<img
				src={current.src}
				alt={current.alt}
				width='800'
				height='600'
				className='max-w-[90vw] max-h-[80vh] object-contain'
				onClick={(e) => e.stopPropagation()}
			/>

			<button
				ref={closeBtnRef}
				type='button'
				onClick={onClose}
				aria-label='Cerrar'
				className='absolute top-4 right-4 border-1 px-3 py-1 cursor-pointer text-lg leading-none bg-white hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-primary-500'
			>
				×
			</button>

			<div
				className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 items-center'
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type='button'
					onClick={() => onIndexChange(currentIdx - 1)}
					disabled={!hasPrev}
					aria-label='Imagen anterior'
					className='border-1 px-3 py-1 cursor-pointer bg-white hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-primary-500 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation'
				>
					← Anterior
				</button>
				<span className='text-white text-sm tabular-nums'>
					{currentIdx + 1} / {images.length}
				</span>
				<button
					type='button'
					onClick={() => onIndexChange(currentIdx + 1)}
					disabled={!hasNext}
					aria-label='Imagen siguiente'
					className='border-1 px-3 py-1 cursor-pointer bg-white hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-primary-500 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation'
				>
					Siguiente →
				</button>
			</div>
		</div>
	)
}

export default ImageModal
