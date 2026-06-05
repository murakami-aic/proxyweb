import React from 'react'
import AudioPlayer from './AudioPlayer'

function RightBar() {
	return (
		<div className='hidden sm:block border-1 p-2'>
			<div className='px-2 py-3'>
				<AudioPlayer />  
			</div>
		</div>  
	)
}

export default RightBar