import data from '../assets/imgs/imagen.json'
//simular importacion json api imagen/id
function IlustracionQr() {
	return (
		<div className='bg-gray-900'>
			<div className='flex justify-center items-center flex-col h-screen w-screen'>
				<div>
					<img src={data.imagen}/>
					<div className='text-gray-100 w-full border-2 border-gray-400'>
						{data.nombre} {data.fecha}
					</div>                
				</div>
			</div>
		</div>

	)
}

export default IlustracionQr