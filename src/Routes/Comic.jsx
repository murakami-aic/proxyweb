import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import ContentComic from '../components/ContentComic'
import MenuComic from '../components/MenuComic'
import useFetch from '../hooks/useFetch'

const Comic = () => {
	const location = useLocation()
	const { data: comics } = useFetch('/api/comics')
	const [currentIdx, setCurrentIdx] = useState(null)

	const isMenu = currentIdx === null
	const isHidden = location.pathname !== '/comic'

	const handleSelect = (comic) => {
		const idx = comics.findIndex(c => c.id === comic.id)
		if (idx !== -1) setCurrentIdx(idx)
	}

	return (
		<div className={`h-full min-h-0 px-2 py-3 border-1 overflow-y-auto ${isHidden ? 'hidden' : ''}`}>
			{isMenu && <MenuComic comics={comics} onSelect={handleSelect} />}
			{!isMenu && (
				<ContentComic
					comicSelect={comics[currentIdx]}
					onPrev={() => setCurrentIdx(i => i - 1)}
					onNext={() => setCurrentIdx(i => i + 1)}
					onBack={() => setCurrentIdx(null)}
					hasPrev={currentIdx > 0}
					hasNext={currentIdx < comics.length - 1}
				/>
			)}
		</div>
	)
}

export default Comic
