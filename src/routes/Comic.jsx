import { Link } from 'react-router-dom'
import { comics } from '../data/comics'

const Comic = () => {
	return (
		<div className='w-full p-2 border'>
			<h1 className='text-2xl font-bold text-center mb-4'>Capítulos</h1>
			<div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
				{comics.map((c) => (
					<Link
						key={c.id}
						to={`/comic/${c.id}`}
						className='cursor-pointer border-1 p-2 bg-white hover:scale-[1.02] transition-transform duration-200 ease-out focus-visible:outline-2 focus-visible:outline-primary-500 motion-reduce:transition-none motion-reduce:hover:scale-100'
					>
						<img
							src={c.portada}
							alt={`Portada de ${c.capitulo}. ${c.name}`}
							loading='lazy'
							width='600'
							height='900'
							className='w-full aspect-[2/3] object-cover border-1'
						/>
						<h2 className='font-bold text-center mt-2 text-base md:text-lg'>
							{c.capitulo}. {c.name}
						</h2>
						<p className='text-center text-xs text-gray-600'>
							<time dateTime={c.fecha}>{c.fecha}</time>
						</p>
					</Link>
				))}
			</div>
		</div>
	)
}

export default Comic
