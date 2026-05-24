import React from 'react'
import AudioPlayer from '../components/AudioPlayer'
import cocheImg from '../assets/coche.jpg'
import RightBar from '../components/RightBar'
import LeftBar from '../components/LeftBar'

function Home() {
  return (
    <div className="p-2 bg-gray-200 border-1 border-black">

      <div className="bg-white px-2 py-3 h-full flex flex-col gap-2">
        <div className=" bg-gray-200 border-1 border-gray-400 px-3.5 py-2 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.35),inset_2px_-2px_6px_rgba(0,0,0,0.25)]">
          <img src='img.jpg' alt="Film 1" className="mr-2 float-start max-w-30 max-h-30 object-cover aspect-square"/>
          <p className='text-sm indent-4 '>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis error veniam voluptatem dolore earum harum! Similique excepturi recusandae accusamus quisquam officiis, voluptatibus ab quaerat iure totam! Aut, nulla odio. Tempore.
          </p>
        </div>
        <div className="bg-gray-200 border-1 border-black">Content 3</div>
        <div className="bg-gray-200 border-1 border-blackg">Content 32</div>   
        <div className="bg-gray-200 border-1 border-black">
          Content1
        </div>   
        <div className="bg-gray-200 border-1 border-black">Content 5</div>   
      </div>

    </div> 
  )
}

export default Home