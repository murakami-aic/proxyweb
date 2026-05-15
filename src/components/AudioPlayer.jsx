import { useEffect, useRef, useState } from "react"
import songsData from '../assets/audios'

const AudioPlayer = () => {

    const [songs, setSongs] = useState(songsData)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentSong, setCurrentSong] = useState(songsData[0])
    const [timeBar, setTimeBar] = useState("00:00")
    const [autoplay, setAutoplay] = useState(false)


    const audioElem = useRef()
    const clickRef = useRef()

    const duracionTotal = currentSong.length ?? 0
    const porcentaje = currentSong.progress ?? 0
    const minutes = Math.floor(duracionTotal / 60)
    const seconds = Math.trunc(duracionTotal % 60).toString().padStart(2, '0')

    const onPlaying = () => {
        const cTime = audioElem.current.currentTime
        setCurrentSong({
            ...currentSong,
            progress: (cTime / currentSong.length) * 100
        })
    }

    useEffect(() => {
        const segundosActuales = (porcentaje / 100) * duracionTotal
        const minutos = Math.floor(segundosActuales / 60)
        const segundos = Math.floor(segundosActuales % 60).toString().padStart(2, '0')
        setTimeBar(`${minutos}:${segundos}`)

        const audio = audioElem.current

        const handleloadedData = () => {
            audio.currentTime = 0
            if (isPlaying) {
                audio.play().catch((e) => console.log(e))
            }
        }
        audio.addEventListener("loadeddata", handleloadedData)
        return () => {
            audio.removeEventListener("loadeddata", handleloadedData)
        }
    }, [porcentaje, isPlaying])
    

    useEffect(() => {
        if (isPlaying) {
            audioElem.current.play()
        } else {
            audioElem.current.pause()
        }
    }, [isPlaying])

    const playPause = () => {
        setIsPlaying(prev => !prev)
    }

    const skipBack = () => {
        audioElem.current.pause()
        const index = songs.findIndex(song => song.title === currentSong.title)
        setCurrentSong(index === 0 ? songs[songs.length - 1] : songs[index - 1])
    }

    const skipNext = () => {
        audioElem.current.pause()
        const index = songs.findIndex(song => song.title === currentSong.title)
        setCurrentSong(index === songs.length - 1 ? songs[0] : songs[index + 1])
    }

    const checkTime = (e) => {
        let width = clickRef.current.clientWidth
        const offset = e.nativeEvent.offsetX
        const divprogress = offset / width * 100
        audioElem.current.currentTime = divprogress / 100 * currentSong.length
    }

    const toggleAutoplay = () => {
        setAutoplay(prev => !prev)
    }
    const handleSongEnd = () => {
        playPause()
        if (!autoplay) return
        const index = songs.findIndex(song => song.title === currentSong.title)

        if (index === songs.length - 1) {
            setCurrentSong(songs[0])
        } else {
            setCurrentSong(songs[index + 1])
        }
        setIsPlaying(true) 
    }

    return (
        <div className="bg-main p-3 w-full fixed bottom-0 left-0 right-0 z-50">

            <audio
                src={currentSong.url}
                ref={audioElem}
                onTimeUpdate={onPlaying}
                onEnded={handleSongEnd}
            />

            <div className='grid lg:grid-cols-4 items-center m-auto justify-items-center w-4/5'>
                
                <div className='col-start-1'>
                    <button className='bg-white p-1' onClick={skipBack}>Back</button>
                    <button className='bg-white p-1 ml-1 mr-1' onClick={playPause}>
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button className='bg-white p-1' onClick={skipNext}>Next</button>
                    <button className='bg-white ml-5 p-1' onClick={toggleAutoplay}>
                        {autoplay ? "Autoplay ON" : "Autoplay OFF"}
                    </button>
                </div>

                <div className='flex content-around w-full lg:col-span-2 lg:col-start-2 items-center'>
                    <div>{timeBar}</div>

                    <div
                        className='bg-pbar h-2 w-full cursor-pointer ml-2 mr-2 relative'
                        onClick={checkTime}
                        ref={clickRef}
                    >
                        <div
                            className='bg-blue-700 h-full w-0 transition-[width] duration-300 ease-linear'
                            style={{ width: `${porcentaje}%` }}
                        ></div>
                    </div>

                    <div>{duracionTotal === 0 ? '0:00' : `${minutes}:${seconds}`}</div>
                </div>
                
                <h3>{currentSong.title}</h3>

            </div>
        </div>
    )
}

export default AudioPlayer
