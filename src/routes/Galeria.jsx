import { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch'
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
	const { data: imgData } = useFetch('/api/imagenes')
	const [visible, setVisible] = useState(15)
	const [colCount, setColCount] = useState(getColCount)
	const [selectedIdx, setSelectedIdx] = useState(null)

	useEffect(() => {
		const onResize = () => setColCount(getColCount())
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [])

	const handleScroll = () => {
		const scrollY = window.scrollY
		const height = document.documentElement.scrollHeight - window.innerHeight
		if (height - scrollY < 400) {
			setVisible(prev => prev + 6)
		}
	}

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

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
			<div className='px-2 py-3 border-1'>
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
