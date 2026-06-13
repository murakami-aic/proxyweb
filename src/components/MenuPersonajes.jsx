function MenuPersonajes({ personajes, onSelect }) {
	return (
		<div className='w-full grid grid-cols-2 md:grid-cols-3 gap-1'>
			{personajes.map((p) => (
				<button
					key={p.id}
					type='button'
					onClick={() => onSelect(p)}
					aria-label={`Ver detalles de ${p.nombre}`}
					className='cursor-pointer border-1 p-2 text-left bg-white hover:scale-[1.02] transition-transform duration-200 ease-out focus-visible:outline-2 focus-visible:outline-primary-500 motion-reduce:transition-none motion-reduce:hover:scale-100'
				>
					<img
						src={p.img}
						alt={p.nombre}
						loading='lazy'
						width='240'
						height='240'
						className='w-full aspect-square object-cover border-1'
					/>
					<h2 className='font-bold text-center mt-2 text-base md:text-lg'>{p.nombre}</h2>
				</button>
			))}
		</div>
	)
}

export default MenuPersonajes
