import { useEffect, useRef, useState } from 'react'
import { musica } from '../data/musica'

const AudioPlayer = () => {
	const music = musica

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

	const onProgressKeyDown = (e) => {
		const audio = audioElem.current
		if (!audio || !audio.duration) return
		if (e.key === 'ArrowLeft') {
			audio.currentTime = Math.max(0, audio.currentTime - 5)
			e.preventDefault()
		}
		if (e.key === 'ArrowRight') {
			audio.currentTime = Math.min(audio.duration, audio.currentTime + 5)
			e.preventDefault()
		}
	}

	return (
		<div className='fixed bottom-0 left-0 w-full border px-1 md:px-10 py-1 bg-gray-50 z-40 text-gray-300'>

			<audio
				src={currentMusic?.url}
				ref={audioElem}
				onTimeUpdate={onPlaying}
				onLoadedMetadata={onLoadedMetadata}
				onEnded={handleSongEnd}
				preload='none'
			/>

			<div className='flex gap-1 md:gap-4 justify-center'>

				<div className='flex w-full max-w-[450px] justify-between'>

					<img
						src='/imagenes/gato_reproductor_musica.webp'
						alt=''
						aria-hidden='true'
						width='50'
						className='w-full max-w-[50px] h-auto aspect-auto object-contain'
					/>

					<h3 className='w-full max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap flex justify-center items-center'>
						{currentMusic?.name} - {currentMusic?.artist}
					</h3>

					<div className='flex items-center'>
						<button
							type='button'
							aria-label='Canción anterior'
							className='w-8 aspect-square flex items-center justify-center cursor-pointer active:bg-gray-100 focus-visible:outline-2 focus-visible:outline-primary-500 touch-manipulation'
							onClick={skipBack}
						>
							<img src='/svg/next.svg' alt='' aria-hidden='true' className='w-5 h-5 text-primary-50' />
						</button>

						<button
							type='button'
							aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
							aria-pressed={isPlaying}
							className={`w-8 aspect-square flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-500 touch-manipulation ${isPlaying ? 'bg-gray-100' : ''}`}
							onClick={playPause}
						>
							<img
								src={isPlaying ? '/svg/pause.svg' : '/svg/play.svg'}
								alt=''
								aria-hidden='true'
								className='w-5 h-5'
							/>
						</button>

						<button
							type='button'
							aria-label='Canción siguiente'
							className='w-8 aspect-square flex items-center justify-center cursor-pointer active:bg-gray-100 focus-visible:outline-2 focus-visible:outline-primary-500 touch-manipulation'
							onClick={skipNext}
						>
							<img src='/svg/next.svg' alt='' aria-hidden='true' className='w-5 h-5 rotate-180' />
						</button>

						<button
							type='button'
							aria-label='Reproducción automática'
							aria-pressed={autoplay}
							className={`w-8 aspect-square flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-500 touch-manipulation ${autoplay ? 'bg-gray-200' : ''}`}
							onClick={toggleAutoplay}
						>
							<img src='/svg/loop.svg' alt='' aria-hidden='true' className='w-5 h-5' />
						</button>

					</div>
				</div>

				<div className='hidden sm:flex w-full max-w-[610px] justify-center items-center gap-2'>
					<div className='tabular-nums'>{formatTime(currentTime)}</div>

					<div
						className='bg-gray-300 h-3 w-full cursor-pointer touch-manipulation border'
						onClick={checkTime}
						ref={clickRef}
						role='slider'
						tabIndex={0}
						aria-label='Posición de la canción'
						aria-valuemin={0}
						aria-valuemax={Math.round(duration) || 0}
						aria-valuenow={Math.round(currentTime)}
						aria-valuetext={`${formatTime(currentTime)} de ${formatTime(duration)}`}
						onKeyDown={onProgressKeyDown}
					>
						<div
							className='bg-primary-50 h-full transition-[width] duration-300 ease-linear'
							style={{ width: `${progress * 100}%` }}
						></div>
					</div>

					<div className='tabular-nums'>{formatTime(duration)}</div>
				</div>
			</div>
		</div>
	)
}

export default AudioPlayer
