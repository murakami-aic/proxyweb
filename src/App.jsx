import { Route, Routes, NavLink, Navigate, useLocation } from 'react-router-dom'
import { Home, Personajes, Comic, Galeria } from './routes'
import ComicDetail from './routes/ComicDetail'
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

			<div className='border-x flex gap-3.5 flex-col w-full px-2 max-w-[900px] flex-1 min-h-0 pb-20'>

				<div className={`w-full overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-in-out motion-reduce:transition-none ${
					location.pathname === '/' ? 'max-h-[15rem] opacity-100 mt-3.5' : 'max-h-0 opacity-0 mt-0'
				}`}>
					<img
						src='https://picsum.photos/seed/lucesbanner/1200/400'
						alt='Luces de falso contacto'
						width='1200'
						height='400'
						fetchPriority='high'
						className='border w-full min-h-16 h-[clamp(9rem,20vw,15rem)] object-cover'
					/>
				</div>
				<nav className={`sticky top-0 z-10 bg-white py-1 w-full grid grid-cols-4 text-center items-center text-sm md:text-base border-b transition-[margin] duration-300 motion-reduce:transition-none ${
					location.pathname === '/' ? 'mt-3.5' : 'mt-0'
				}`}>
					<NavLink to='/' end className={navLinkClass}>inicio</NavLink>
					<NavLink to='/personajes' className={({ isActive }) => `border-x ${navLinkClass({ isActive })}`}>personajes</NavLink>
					<NavLink to='/comic' end className={({ isActive }) => `border-r ${navLinkClass({ isActive })}`}>comic</NavLink>
					<NavLink to='/galeria' className={navLinkClass}>galeria</NavLink>
				</nav>

				<main id='main' className='w-full flex-1 min-h-0 flex flex-col' tabIndex={-1}>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/personajes' element={<Personajes />} />
						<Route path='/comic' element={<Comic />} />
						<Route path='/comic/:id' element={<ComicDetail />} />
						<Route path='/galeria' element={<Galeria />} />
						<Route path='*' element={<Navigate to='/' replace />} />
					</Routes>
				</main>

			</div>
			<AudioPlayer/>
		</div>
	)
}

export default App
