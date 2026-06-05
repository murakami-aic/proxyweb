import { useEffect, useRef, useState } from 'react'
import useFetch from '../hooks/useFetch'


const AudioPlayer = () => {
	const { data: musicData } = useFetch('/api/musica')
	const music = musicData ?? []

	const [isPlaying, setIsPlaying] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [autoplay, setAutoplay] = useState(false)

	const currentMusic = music[currentIndex] ?? null
	const progress = duration ? currentTime / duration : 0
	const URL_PREFIX = 'https://lucesdefalsocontacto.com/'

	const audioElem = useRef()
	const clickRef = useRef()


	const onPlaying = () => {
		const audio = audioElem.current
		if (!audio) return

		setCurrentTime(audio.currentTime)
	}

	const onLoadedMetadata = () => {
		const audio = audioElem.current
		if (!audio) return

		setDuration(audio.duration)
		setCurrentTime(0)
	}

	const formatTime = (seconds) => {
		if (!seconds || isNaN(seconds)) return '0:00'
		const mins = Math.floor(seconds / 60)
		const secs = Math.floor(seconds % 60)
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	useEffect(() => {
		const audio = audioElem.current
		if(!audio) return

		if(isPlaying){
			audio.play().catch(() => {})
		} else{
			audio.pause()
		}
        
	}, [isPlaying, currentMusic])
    

	const playPause = () => setIsPlaying(prev => !prev)

	const skipBack = () => {
		if(!music.length) return
		setCurrentIndex(prev => prev === 0 ? music.length - 1 : prev - 1)
	}

	const skipNext = () => {
		if(!music.length) return
		setCurrentIndex(prev => prev === music.length - 1 ? 0 : prev + 1)
	}

	const checkTime = (e) => {
		const audio = audioElem.current
		if (!audio || !audio.duration) return

		const width = clickRef.current.clientWidth
		const offset = e.nativeEvent.offsetX
		audio.currentTime = (offset / width) * audio.duration
	}

	const toggleAutoplay = () => {
		setAutoplay(prev => !prev)
	}
	const handleSongEnd = () => {
		if(!autoplay) {
			setIsPlaying(false)
			return
		}
		skipNext()
		setIsPlaying(true) 
	}

	return (
		<div className='w-full border-1'>

			<audio
				src={URL_PREFIX + currentMusic?.url }
				ref={audioElem}
				onTimeUpdate={onPlaying}
				onLoadedMetadata={onLoadedMetadata}
				onEnded={handleSongEnd}
			/>

			<div className='flex flex-col items-center m-auto justify-items-center'>
                
				<div className='w-full flex'>
					<img src={URL_PREFIX + currentMusic?.portada} alt={currentMusic?.name} className='w-4/5 aspect-square'/>
					<div className='grid grid-rows-4'>
						<button className='cursor-pointer transition-colors active:bg-gray-200 px-3' onClick={skipBack}>
							<img src='/svg/next.svg' className='w-5 aspect-square' />
						</button>
						<button className={`px-3 cursor-pointer transition-colors ${isPlaying ? 'bg-gray-200' : ''}`} onClick={playPause}>
							<img src={isPlaying ? '/svg/pause.svg' : '/svg/play.svg'} className='w-5 aspect-square' />
						</button>
						<button className='cursor-pointer transition-colors active:bg-gray-200 px-3' onClick={skipNext}>
							<img src='/svg/next.svg' className='transform -scale-x-100 w-5 aspect-square' />
						</button>
						<button className={`px-3 cursor-pointer transition-colors ${autoplay ? 'bg-gray-200' : ''}`} onClick={toggleAutoplay}>
							<img src='/svg/loop.svg' className='w-5 aspect-square' />
						</button>
					</div>
				</div>
            
				<div className='flex content-around w-full lg:col-span-2 lg:col-start-2 items-center border-t-1'>
					<div>{formatTime(currentTime)}</div>

					<div
						className='bg-gray-300 h-2 w-full cursor-pointer ml-2 mr-2 relative'
						onClick={checkTime}
						ref={clickRef}
					>
						<div
							className='bg-gray-600 h-full transition-[width] duration-300 ease-linear'
							style={{ width: `${progress * 100}%` }}
						></div>
					</div>

					<div>{formatTime(duration)}</div>
				</div>
                
				<h3>{currentMusic?.name} - {currentMusic?.artist} </h3>

			</div>
		</div>
	)
}

export default AudioPlayer
