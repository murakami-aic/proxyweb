import { Link } from 'react-router-dom'
import { imagenesHome } from '../data/home_imagenes'

const supportItems = [
	{ id: 'share', img: 'sigue-y-comparte', text: 'Siguiendo y compartiendo!!' },
	{ id: 'donate', img: 'compra-cafesito', text: 'Invítame un ko-fi o dona en Patreon' },
	{ id: 'comment', img: 'compartir-comunidad', text: 'Comenta y crea comunidad' },
	{ id: 'watch', img: 'mira-animaciones', text: 'Mirando mis animaciones' },
]

function Home() {
	return (
		<div className='flex flex-col gap-y-6 sm:px-4 md:px-10 lg:px-20'>
			<section className='flex flex-col items-center gap-3'>
				<h2>WebComic</h2>
				<img
					src={imagenesHome['sara-web-comic'].url}
					alt='Ilustración de Sarah y el Destino'
					className='max-w-[320px] w-full aspect-square object-cover'
				/>
				<div className='text-primary-50'>
					<h3>
						¿Te imaginas que el destino te dé una segunda oportunidad tras morir?
					</h3>
					<p className='mb-3'>
						Sarah en su nueva vida se propone encontrar a su amigo Bill, quien fue secuestrado,
						acompañada del Destino, con la condición de evitar que la infección de la Plaga
						afecte el orden natural de la humanidad.
					</p>
					<p>
						Ahora Sarah y el Destino son los únicos que pueden evitar que los humanos
						se corrompan en horribles monstruos.
					</p>
				</div>
			</section>

			<section className='border p-5 bg-gray-50 text-gray-300'>
				<div className='sm:float-right sm:ml-4 sm:mb-2'>
					<img
						src={imagenesHome['sobre-web-comic'].url}
						alt='Proxy dibujando'
						width='140'
						className='w-[140px] aspect-auto object-cover'
					/>
				</div>
				<p className='mb-3'>
					Soy una criatura que trabaja sin presiones porque además de hacer el proyecto;
					trabajo, estudio y vivo. Recuerden que solo soy yo quien se encarga de todo el
					proceso creativo: guiones, storyboards, ilustraciones, paneles, animaciones
					y el cómic.
				</p>
				<p>
					¡Así que! Para no perder calidad en mi trabajo y darles esto con todo el
					amor y cariño que se merecen, probablemente actualizaré cada mes.
					Siempre puedes estar al tanto de todo el contenido y comunicarte directamente
					en mis redes. ¡Gracias! :D
				</p>
				<div />
			</section>

			<section aria-labelledby='support-heading' className=''>
				<h2 id='support-heading' className='mb-3'>
					Apoya el cómic
				</h2>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-gray-300 '>
					{supportItems.map((item) => (
						<article
							key={item.id}
							className='flex flex-col gap-2 justify-end cursor-pointer bg-gray-50  p-2'
						>
							<img
								src={imagenesHome[item.img].url}
								alt=''
								aria-hidden='true'
								width='400'
								height='400'
								loading='lazy'
								className='max-h-[150px] aspect-auto object-contain'
							/>
							<p>{item.text}</p>
						</article>
					))}
				</div>
			</section>

			<section aria-labelledby='collab-heading' className=''>
				<h2 id='collab-heading' className='mb-3'>Colaboradores</h2>
				<p>
					Próximamente más información sobre colaboradores del cómic.
				</p>
				<p>
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
