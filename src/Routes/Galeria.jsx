import imgData from '../assets/imgData'
import { useRef, useEffect, useState } from 'react'
import RightBar from '../components/RightBar'
import useFetch from '../hooks/useFetch'

const Galeria = () => {
  const {data: imgData, loading, error} = useFetch('/api/imagenes')
	const [visible, setVisible] = useState(10)
	const containerRef = useRef(null)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const handleScroll = () => {
			if (container.clientHeight + container.scrollTop >= container.scrollHeight - 200) {
				setVisible(prev => prev + 6)
			}
		}

		container.addEventListener('scroll', handleScroll)

		return () => {
			container.removeEventListener('scroll', handleScroll)
		}
	}, [])

function autoSpan(el) {
  if (!el) return;

  const img = el.querySelector("img");
  if (!img) return;

  const setSpan = () => {
    const height = img.getBoundingClientRect().height;
    const rowHeight = 10; // igual que auto-rows-[10px]
    const span = Math.ceil(height / rowHeight);
    el.style.gridRowEnd = `span ${span}`;
  };

  // Si la imagen ya está cargada (cache)
  if (img.complete) {
    setSpan();
  } else {
    img.onload = setSpan;
  }
}

return (
  <div className="h-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-[10px] bg-gray-200 px-2 py-3 border-1 border-black overflow-y-scroll"ref={containerRef}>
    {imgData.slice(0, visible).map((img) => (

      <div key={img.id} ref={autoSpan} className="bg-white p-2">
        <img
          src={img.url}
          alt={img.title}
          className="w-full h-auto object-cover border-1 border-black"
          />
      </div>

    ))}
  </div>
	)
}

export default Galeria