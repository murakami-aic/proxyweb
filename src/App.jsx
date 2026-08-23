import { Route, Routes, NavLink, Navigate, useLocation } from 'react-router-dom'
import { Home, Personajes, Comic, ComicDetail, Galeria, Foro, ForoHilo } from './routes'
import AudioPlayer from './components/AudioPlayer'

const navLinkClass = ({ isActive }) =>
	`px-1 py-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 ${isActive ? 'font-bold underline underline-offset-4' : ''}`

function App() {

	const location = useLocation()

	return (
		<div className='w-full min-h-screen flex flex-col items-center px-1'>

			<a
				href='#main'
				className='sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-2 focus:py-1 focus:border'
			>
				Saltar al contenido
			</a>

			<div className='border-x flex gap-3.5 flex-col w-full px-2 max-w-[900px] flex-1 min-h-0 pb-20 bg-main'>

				<div className={`w-full overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-in-out motion-reduce:transition-none ${location.pathname === '/' ? 'max-h-[20rem] opacity-100 mt-3.5' : 'max-h-0 opacity-0 mt-0'
				}`}>
					<img
						src='/imagenes/titulo.webp'
						alt='Luces de falso contacto'
						width='1200'
						height='400'
						fetchPriority='high'
						className='border w-full'
					/>
				</div>
				<nav className={`sticky top-0 z-10 bg-primary-400 text-primary-50 py-1 w-full grid grid-cols-5 text-center items-center text-sm md:text-base border-b transition-[margin] duration-300 motion-reduce:transition-none ${location.pathname === '/' ? 'mt-3.5' : 'mt-0'
				}`}>
					<NavLink to='/' end className={navLinkClass}>inicio</NavLink>
					<NavLink to='/foro' className={navLinkClass}>foro</NavLink>
				</nav>

				<main id='main' className='w-full flex-1 min-h-0 flex flex-col' tabIndex={-1}>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/personajes' element={<Personajes />} />
						<Route path='/comic' element={<Comic />} />
						<Route path='/comic/:id' element={<ComicDetail />} />
						<Route path='/galeria' element={<Galeria />} />
						<Route path='/foro' element={<Foro />} />
						<Route path='/foro/:id' element={<ForoHilo />} />
						<Route path='*' element={<Navigate to='/' replace />} />
					</Routes>
				</main>

			</div>
			<AudioPlayer />
		</div>
	)
}

export default App
