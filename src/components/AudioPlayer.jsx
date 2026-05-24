import { useEffect, useRef, useState } from "react"
import useFetch from "../hooks/useFetch"


const AudioPlayer = () => {
    const {data: musicData, loading, error} = useFetch('/api/musica')

    const [songs, setSongs] = useState([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentSong, setCurrentSong] = useState([])
    const [timeBar, setTimeBar] = useState("00:00")
    const [autoplay, setAutoplay] = useState(false)


    const audioElem = useRef()
    const clickRef = useRef()

    const duracionTotal = 0
    const porcentaje = 0
    const minutes = 0
    const seconds = 0

    const onPlaying = () => {
        const cTime = audioElem.current.currentTime
        setCurrentSong({
            ...currentSong,
            progress: (cTime / currentSong.duracion) * 100
        })
    }

    useEffect(() => {
        if(musicData && musicData.length > 0){
            setSongs[musicData]
            setCurrentSong[musicData[0]]
            duracionTotal = currentSong.duracion ?? 0
            porcentaje = currentSong.progress ?? 0
            minutes = Math.floor(duracionTotal / 60)
            seconds = Math.trunc(duracionTotal % 60).toString().padStart(2, '0')
        }
    }, [musicData])

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
        <div className="w-full bg-gray-200 border-1 border-gray-400">

            <audio
                src={currentSong.url}
                ref={audioElem}
                onTimeUpdate={onPlaying}
                onEnded={handleSongEnd}
            />

            <div className='flex flex-col items-center m-auto justify-items-center'>
                
                <div className="w-full flex flex-row">
                    <img src={currentSong.cover} alt={currentSong.title} className='w-full aspect-square'/>
                    <div className='grid grid-rows-4'>
                        <button className='bg-white cursor-pointer transition-colors active:bg-gray-200 px-3' onClick={skipBack}>
                            <img src='/svg/next.svg' className="w-5 aspect-square" />
                        </button>
                        <button className={`px-3 cursor-pointer transition-colors ${isPlaying ? "bg-gray-200" : "bg-white"}`} onClick={playPause}>
                            <img src={isPlaying ? '/svg/pause.svg' : '/svg/play.svg'} className="w-5 aspect-square" />
                        </button>
                        <button className='bg-white cursor-pointer transition-colors active:bg-gray-200 px-3' onClick={skipNext}>
                            <img src='/svg/next.svg' className="transform -scale-x-100 w-5 aspect-square" />
                        </button>
                        <button className={`px-3 cursor-pointer transition-colors ${autoplay ? "bg-gray-200" : "bg-white"}`} onClick={toggleAutoplay}>
                            <img src='/svg/loop.svg' className="w-5 aspect-square" />
                        </button>
                    </div>
                </div>
            
                <div className='flex content-around w-full lg:col-span-2 lg:col-start-2 items-center border-t-1 border-gray-400'>
                    <div>{timeBar}</div>

                    <div
                        className='bg-gray-400 h-2 w-full cursor-pointer ml-2 mr-2 relative'
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
