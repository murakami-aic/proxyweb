import BackgroundAnimated from "./components/BackgroundAnimated"
import AudioPlayer from "./components/AudioPlayer"

function App() {
  return (
    <div className="flex justify-items-center justify-center">

      <div className="grid justify-items-center w-11/12 max-w-5xl">
        <div className='bg-main w-full mt-4'>
          <h1 className="text-5xl text-center p-5">
              :3
          </h1>

        </div>
        <AudioPlayer/>
        <BackgroundAnimated/>
      </div>

    </div>
  )
}

export default App
