const comicInfo = {
	titulo: 'Luces de Falso Contacto',
	descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis error veniam voluptatem dolore earum harum! Similique excepturi recusandae accusamus quisquam officiis, voluptatibus ab quaerat iure totam.',
	portada: 'https://picsum.photos/seed/portada/400/600',
}

function MenuComic({ comics, onSelect }) {
	return (
		<div className='flex flex-col md:flex-row h-full gap-x-2'>

			<div className='flex flex-col gap-2 md:w-2/5 lg:w-1/3 md:shrink-0'>
				<img
					src={comicInfo.portada}
					alt={comicInfo.titulo}
					className=' aspect-[2/3] object-cover'
				/>
				<h1 className='font-bold text-base md:text-lg'>{comicInfo.titulo}</h1>
				<p className='text-sm'>{comicInfo.descripcion}</p>
			</div>

			<div className='flex flex-col flex-1 min-w-0'>
				<h2 className='font-bold mb-1 text-base md:text-lg'>Capítulos</h2>
				<div className='flex flex-col'>
					{comics.map((data) => (
						<div
							onClick={() => onSelect(data)}
							key={data.id}
							className='py-0.5 px-1 border-b hover:bg-gray-300 cursor-pointer flex justify-between items-center gap-2'
						>
							<span className='truncate'>
								{data.capitulo}. {data.name}
							</span>
							{data.fecha && (
								<span className='text-xs shrink-0'>
									{data.fecha}
								</span>
							)}
						</div>
					))}
				</div>
			</div>

		</div>
	)
}

export default MenuComic
