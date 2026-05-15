import video from '../assets/anCompress.mp4'
import './BackgroundAnimated.css'

function BackgroundAnimated() {
    return (
        <>
            <div className='absolute object-cover bg-blue-900 h-screen opacity-90 mix-blend-overlay -z-2'/>   

            <video
                playsInline
                autoPlay
                loop
                muted
                className='fixed'
            >
                <source src={video} type='video/mp4'/>
            </video>

        </>

    );
}

export default BackgroundAnimated;