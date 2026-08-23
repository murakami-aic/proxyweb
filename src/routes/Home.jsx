import { Link } from 'react-router-dom'
import { imagenesHome } from '../data/home_imagenes'

const supportItems = [
	{ id: 'share', img: 'sigue-y-comparte', text: 'Siguiendo y compartiendo!!' },
	{ id: 'donate', img: 'compra-cafesito', text: 'Compra un ka-fesito o dona en Patreon' },
	{ id: 'comment', img: 'compartir-comunidad', text: 'Comenta y crea comunidad' },
	{ id: 'watch', img: 'mira-animaciones', text: 'Mirando mis animaciones' },
]

function Home() {
	return (
		<div className='flex flex-col gap-y-6 sm:px-4 md:px-10 lg:px-20'>
			<section className='border p-5 flex flex-col items-center gap-3 bg-primary-50'>
				<h2 className='font-extrabold text-3xl text-center'>Sobre el WebComic</h2>
				<img
					src={imagenesHome['sara-web-comic'].url}
					alt='Ilustración de Sarah y el Destino'
					width='360'
					height='360'
					className='max-w-[360px] w-full aspect-square object-cover'
				/>
				<div className='space-y-2'>
					<h3 className='text-xl font-semibold text-balance'>
						¿Te imaginas que el destino te dé una segunda oportunidad tras morir?
					</h3>
					<p className='text-pretty'>
						Sarah en su nueva vida se propone encontrar a su amigo Bill, quien fue secuestrado,
						acompañada del Destino, con la condición de evitar que la infección de la Plaga
						afecte el orden natural de la humanidad.
					</p>
					<p className='text-pretty'>
						Ahora Sarah y el Destino son los únicos que pueden evitar que los humanos
						se corrompan en horribles monstruos.
					</p>
				</div>
			</section>

			<section className='border p-5 bg-primary-50'>
				<div className='sm:float-right sm:ml-4 sm:mb-2'>
					<img
						src={imagenesHome['sobre-web-comic'].url}
						alt='Proxy dibujando'
						width='140'
						height='140'
						className='w-[140px] aspect-square object-cover'
					/>
				</div>
				<p className='text-pretty'>
					Soy una criatura que trabaja sin presiones, porque además de hacer el proyecto,
					trabajo, estudio y vivo. Recuerden que solo soy yo quien se encarga de todo el
					trabajo creativo: guiones, storyboards, ilustraciones, paneles, animaciones
					y además el cómic.
				</p>
				<p className='text-pretty mt-3'>
					¡Así que! Para no perder calidad en mi trabajo y darles todo esto con el
					amor y cariño que se merecen, actualizaré cada kifra, seguramente cada mes.
					Siempre puedes estar al tanto de todo el contenido y comunicarte directamente
					en mis redes. ¡Gracias! :D
				</p>
				<div className='clear-both' />
			</section>

			<section aria-labelledby='support-heading' className='border p-5 bg-primary-50'>
				<h2 id='support-heading' className='font-bold text-xl mb-3'>
					Apoya el cómic
				</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
					{supportItems.map((item) => (
						<article
							key={item.id}
							className='flex flex-col gap-2 p-2'
						>
							<img
								src={imagenesHome[item.img].url}
								alt=''
								aria-hidden='true'
								width='400'
								height='400'
								loading='lazy'
								className='w-full aspect-square object-contain'
							/>
							<p className='text-sm'>{item.text}</p>
						</article>
					))}
				</div>
			</section>

			<section aria-labelledby='collab-heading' className='border p-5 bg-primary-50'>
				<h2 id='collab-heading' className='font-bold text-xl mb-2'>Colaboradores</h2>
				<p className='text-sm text-gray-700'>
					Próximamente más información sobre colaboradores del cómic.
				</p>
				<p className='mt-3'>
					<Link
						to='/home'
						className='underline focus-visible:outline-2 focus-visible:outline-primary-500'
					>
						Conoce a los personajes
					</Link>
				</p>
			</section>
		</div>
	)
}

export default Home
