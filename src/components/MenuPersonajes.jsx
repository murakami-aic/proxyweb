function MenuPersonajes({ personajes, onSelect }) {
	return (
		<div className='w-full grid grid-cols-2 md:grid-cols-3 gap-1'>
			{personajes.map((p) => (
				<div
					key={p.id}
					onClick={() => onSelect(p)}
					className='cursor-pointer border-1 p-2 hover:brightness-105 transition'
				>
					<img
						src={p.img}
						alt={p.nombre}
						loading='lazy'
						className='w-full aspect-square object-cover border-1'
					/>
					<h2 className='font-bold text-center mt-2 text-base md:text-lg'>{p.nombre}</h2>
				</div>
			))}
		</div>
	)
}

export default MenuPersonajes
