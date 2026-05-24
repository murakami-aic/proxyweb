import AudioPlayer from "./components/AudioPlayer"
import { Route, Routes, Link, useLocation } from "react-router-dom"
import Home from "./Routes/Home"
import Comic from "./Routes/Comic"
import Galeria from "./Routes/Galeria"
import LeftBar from "./components/LeftBar"
import RightBar from "./components/RightBar"


function App() {

  return (
    <div className="h-screen w-full flex flex-col items-center"  >
    
      <div className="w-[99%] sm:w-9/12 xl:w-3/6 mt-3 border ">
        <img src="/gato.jpg" alt="Film 1" className="w-full h-15 sm:h-20 object-cover border-black" />
        <div className="bg-gray-200 py-1 w-full grid grid-cols-3 text-center items-center border-black">
          <Link to="/">inicio</Link>
          <Link to="/Comic">comic</Link>
          <Link to="/Galeria">galeria</Link>
        </div>
      </div>

      <div className="h-full mx-0.5 sm:mx-auto sm:w-11/12 xl:w-3/5 mt-3 min-h-0 sm:grid sm:grid-cols-[1fr_5fr_2fr] gap-x-1 md:gap-x-4">
        <LeftBar />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/Comic" element={<Comic />}/>
          <Route path="/Galeria" element={<Galeria />}/>
        </Routes>
        <RightBar />
      </div>

    </div>
  )
}

export default App
