import { useEffect, useMemo, useState } from 'react'
import ImageModal from '../components/ImageModal'

const TOTAL_IMAGENES = 20

// Placeholder: los datos de imágenes ya no vienen de '../data/imagenes' (eliminado)
const imagenes = Array.from({ length: TOTAL_IMAGENES }, (_, i) => ({
	id: `img-${i + 1}`,
	title: `Imagen ${i + 1}`,
	url: '/urlfalsa.png',
}))

const breakpoints = [
	{ minWidth: 1536, cols: 3 },
	{ minWidth: 1024, cols: 3 },
	{ minWidth: 640, cols: 2 },
	{ minWidth: 0, cols: 1 },
]

function getColCount() {
	if (typeof window === 'undefined') return 1
	return breakpoints.find(b => window.innerWidth >= b.minWidth).cols
}

const SCROLL_THRESHOLD_PX = 400
const SCROLL_THROTTLE_MS = 200
const INITIAL_VISIBLE = 15
const PAGE_INCREMENT = 6

const Galeria = () => {
	const imgData = imagenes
	const [visible, setVisible] = useState(INITIAL_VISIBLE)
	const [colCount, setColCount] = useState(1)
	const [selectedIdx, setSelectedIdx] = useState(null)

	useEffect(() => {
		setColCount(getColCount())
		const onResize = () => setColCount(getColCount())
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [])

	useEffect(() => {
		let lastRun = 0
		let scheduled = false

		const checkScroll = () => {
			lastRun = Date.now()
			scheduled = false
			const scrollY = window.scrollY
			const height = document.documentElement.scrollHeight - window.innerHeight
			if (height - scrollY < SCROLL_THRESHOLD_PX) {
				setVisible(prev => prev + PAGE_INCREMENT)
			}
		}

		const onScroll = () => {
			const now = Date.now()
			if (now - lastRun >= SCROLL_THROTTLE_MS) {
				checkScroll()
			} else if (!scheduled) {
				scheduled = true
				setTimeout(checkScroll, SCROLL_THROTTLE_MS - (now - lastRun))
			}
		}

		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	const columns = useMemo(() => {
		const cols = Array.from({ length: colCount }, () => [])
		imgData.slice(0, visible).forEach((img, i) => {
			cols[i % colCount].push({ img, idx: i })
		})
		return cols
	}, [colCount, visible, imgData])

	const modalImages = useMemo(
		() => imgData.map(img => ({ id: img.id, src: img.url, alt: img.title })),
		[imgData]
	)

	return (
		<>
			<div className='px-2 py-3 border-1'>
				<div className='flex gap-1 md:gap-2'>
					{columns.map((col, ci) => (
						<div key={ci} className='flex-1 min-w-0 flex flex-col gap-1 md:gap-2'>
							{col.map(({ img, idx }) => (
								<button
									key={img.id}
									type='button'
									onClick={() => setSelectedIdx(idx)}
									aria-label={`Ver imagen: ${img.title}`}
									className='block w-full p-0 border-1 bg-white cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-500 touch-manipulation'
								>
									<img
										src={img.url}
										alt={img.title}
										loading='lazy'
										width='800'
										height='600'
										className='w-full h-auto block transition-transform duration-200 ease-out hover:scale-[1.02] motion-reduce:transition-none'
									/>
								</button>
							))}
						</div>
					))}
				</div>
			</div>

			<ImageModal
				images={modalImages}
				currentIdx={selectedIdx}
				onClose={() => setSelectedIdx(null)}
				onIndexChange={setSelectedIdx}
			/>
		</>
	)
}

export default Galeria
