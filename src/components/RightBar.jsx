import AudioPlayer from './AudioPlayer'

function RightBar() {
	return (
		<div className='hidden sm:block border'>
			<div className='p-1'>
				<AudioPlayer />
			</div>
		</div>
	)
}

export default RightBar