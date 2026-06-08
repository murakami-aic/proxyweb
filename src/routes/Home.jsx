import React from 'react'
import AudioPlayer from '../components/AudioPlayer'
import RightBar from '../components/RightBar'
import LeftBar from '../components/LeftBar'

function Home() {
	return (
		<div className='p-2 border-1'>

			<div className='px-2 py-3 h-full flex flex-col gap-2'>
				<div className='border-1 px-3.5 py-2'>
					<img src='img.jpg' alt='Film 1' className='mr-2 float-start max-w-30 max-h-30 object-cover aspect-square'/>
					<p className='text-sm'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis error veniam voluptatem dolore earum harum! Similique excepturi recusandae accusamus quisquam officiis, voluptatibus ab quaerat iure totam! Aut, nulla odio. Tempore.
					</p>
				</div>
				<div className='border-1'>Content 3</div>
				<div className='border-1'>Content 32</div>
				<div className='border-1'>
          Content1
				</div>
				<div className='border-1'>Content 5</div>
			</div>

		</div> 
	)
}
                                                      
export default Home