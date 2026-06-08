import { useEffect, useRef, useState } from 'react'
import useFetch from '../hooks/useFetch'
import { useLocation } from 'react-router-dom'
import ImageModal from '../components/ImageModal'

const breakpoints = [
	{ minWidth: 1536, cols: 3 },
	{ minWidth: 1024, cols: 3 },
	{ minWidth: 640, cols: 2 },
	{ minWidth: 0, cols: 1 },
]

function getColCount() {
	const w = window.innerWidth
	return breakpoints.find(b => w >= b.minWidth).cols
}

const URL_PREFIX = 'https://lucesdefalsocontacto.com/'

const Galeria = () => {
	const location = useLocation()
	const { data: imgData } = useFetch('/api/imagenes')
	const [visible, setVisible] = useState(15)
	const [colCount, setColCount] = useState(getColCount)
	const [selectedIdx, setSelectedIdx] = useState(null)
	const containerRef = useRef(null)

	const isHidden = location.pathname !== '/galeria'

	useEffect(() => {
		const onResize = () => setColCount(getColCount())
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [])

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const handleScroll = () => {
			if (container.clientHeight + container.scrollTop >= container.scrollHeight - 400) {
				setVisible(prev => prev + 6)
			}
		}

		container.addEventListener('scroll', handleScroll)
		return () => container.removeEventListener('scroll', handleScroll)
	}, [])

	useEffect(() => {
		if (isHidden) setSelectedIdx(null)
	}, [isHidden])

	const columns = Array.from({ length: colCount }, () => [])
	imgData.slice(0, visible).forEach((img, i) => {
		columns[i % colCount].push({ img, idx: i })
	})

	const modalImages = imgData.map(img => ({
		id: img.id,
		src: URL_PREFIX + img.url,
		alt: img.title,
	}))

	return (
		<>
			<div
				ref={containerRef}
				className={`h-full min-h-0 px-2 py-3 border-1 overflow-y-scroll ${isHidden ? 'hidden' : ''}`}
			>
				<div className='flex gap-1 md:gap-2'>
					{columns.map((col, ci) => (
						<div key={ci} className='flex-1 min-w-0 flex flex-col gap-1 md:gap-2'>
							{col.map(({ img, idx }) => (
								<img
									key={img.id}
									src={URL_PREFIX + img.url}
									alt={img.title}
									loading='lazy'
									onClick={() => setSelectedIdx(idx)}
									className='w-full h-auto block border-1 cursor-pointer transition hover:brightness-110 hover:outline-2 hover:outline-black'
								/>
							))}
						</div>
					))}
				</div>
			</div>

			{!isHidden && (
				<ImageModal
					images={modalImages}
					currentIdx={selectedIdx}
					onClose={() => setSelectedIdx(null)}
					onIndexChange={setSelectedIdx}
				/>
			)}
		</>
	)
}

export default Galeria
