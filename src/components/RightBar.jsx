import React from 'react'
import AudioPlayer from './AudioPlayer'

function RightBar() {
  return (
    <div className="hidden sm:block bg-gray-200 border-1 border-black p-2">
        <div className='bg-white px-2 py-3'>
            <AudioPlayer />  
        </div>
    </div>  
  )
}

export default RightBar