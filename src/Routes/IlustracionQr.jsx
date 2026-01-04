import data from '../assets/imgs/imagen.json'
//simular importacion json api imagen/id
function IlustracionQr() {
	return (
		<div className='bg-black'>
			<div className='flex justify-center items-center flex-col h-screen w-screen'>
				<div>
					<img src={data.imagen}/>
					<div className='text-white w-full border-2 border-amber-50'>
						{data.nombre} {data.fecha}
					</div>                
				</div>
			</div>
		</div>

	)
}

export default IlustracionQr