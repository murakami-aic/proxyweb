import { useEffect, useRef, useState } from 'react'
import useFetch from '../hooks/useFetch'

const URL_PREFIX = 'https://lucesdefalsocontacto.com/'

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
		if (!audio) return

		if (isPlaying) {
			audio.play().catch(() => { })
		} else {
			audio.pause()
		}

	}, [isPlaying, currentMusic])


	const playPause = () => setIsPlaying(prev => !prev)

	const skipBack = () => {
		if (!music.length) return
		setCurrentIndex(prev => prev === 0 ? music.length - 1 : prev - 1)
	}

	const skipNext = () => {
		if (!music.length) return
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
		if (!autoplay) {
			setIsPlaying(false)
			return
		}
		skipNext()
		setIsPlaying(true)
	}

	return (
		<div className='fixed bottom-0 left-0 w-full border px-1 md:px-10 py-1 bg-white'>

			<audio
				src={URL_PREFIX + currentMusic?.url}
				ref={audioElem}
				onTimeUpdate={onPlaying}
				onLoadedMetadata={onLoadedMetadata}
				onEnded={handleSongEnd}
				volume='50%'
			/>

			<div className='flex gap-1 md:gap-4'>

				<div className='flex w-full sm:w-2/5 justify-between sm:justify-around'>

					<img
						src={URL_PREFIX + currentMusic?.portada}
						alt={currentMusic?.name}
						className='h-[50px] aspect-square object-cover'
					/>

					<h3 className=' max-w-150px overflow-hidden flex text-nowrap justify-center items-center'>{currentMusic?.name} - {currentMusic?.artist} </h3>

					<div className='flex items-center'>
						<button
							className='w-10 aspect-square flex items-center justify-center cursor-pointer active:bg-gray-200'
							onClick={skipBack}
						>
							<img src='/svg/next.svg' className='w-5 h-5' />
						</button>

						<button
							className={`w-10 aspect-square flex items-center justify-center cursor-pointer ${isPlaying ? 'bg-gray-200' : ''}`}
							onClick={playPause}
						>
							<img src={'/svg/pause.svg'} className='w-5 h-5' />
						</button>

						<button
							className='w-10 aspect-square flex items-center justify-center cursor-pointer active:bg-gray-200'
							onClick={skipNext}
						>
							<img src='/svg/next.svg' className='w-5 h-5 rotate-180' />
						</button>

						<button
							className={`w-10 aspect-square flex items-center justify-center cursor-pointer ${autoplay ? 'bg-gray-200' : ''}`}
							onClick={toggleAutoplay}
						>
							<img src='/svg/loop.svg' className='w-5 h-5' />
						</button>

					</div>
				</div>

				<div className='hidden sm:flex sm:flex-3/5 justify-center items-center'>
					<div className='' >{formatTime(currentTime)}</div>

					<div
						className='bg-gray-300 h-3 w-full cursor-pointer'
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
			</div>
		</div>
	)
}

export default AudioPlayer
