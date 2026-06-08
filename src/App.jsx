import { Suspense, lazy, useEffect, useState } from 'react'
import { Route, Routes, Link, useLocation } from 'react-router-dom'
import { Home, Personajes } from './routes'
import { LeftBar, RightBar } from './components'
import { Dashboard, Login } from './admin'

const Comic = lazy(() => import('./routes/Comic'))
const Galeria = lazy(() => import('./routes/Galeria'))

const Placeholder = () => (
	<div className='h-full min-h-0 px-2 py-3 border-1 flex items-center justify-center'>
		Cargando…
	</div>
)

function App() {

	const location = useLocation()
	const isAdminRoute = location.pathname.startsWith('/admin')
	const isFullPage = location.pathname === '/comic' || location.pathname === '/galeria'

	const [comicVisited, setComicVisited] = useState(() => location.pathname === '/comic')
	const [galeriaVisited, setGaleriaVisited] = useState(() => location.pathname === '/galeria')

	useEffect(() => {
		if (location.pathname === '/comic') setComicVisited(true)
		if (location.pathname === '/galeria') setGaleriaVisited(true)
	}, [location.pathname])

	if (isAdminRoute) {
		return (
			<Routes>
				<Route path='/admin/login' element={<Login />} />
				<Route path='/admin/dashboard' element={<Dashboard />} />
			</Routes>
		)
	}

	const showComic = comicVisited || location.pathname === '/comic'
	const showGaleria = galeriaVisited || location.pathname === '/galeria'

	const gridCols = isFullPage
		? 'sm:grid-cols-[5fr_2fr]'
		: 'sm:grid-cols-[1fr_5fr_2fr]'

	return (
		<div className='h-screen w-full flex flex-col gap-y-4 items-center p-1'>

			<div className='w-full max-w-[880px] border'>
				<img src='/mockup.jpg' alt='mockup' className='w-full min-h-16 h-[clamp(4rem,9.4vw,6rem)] object-cover' />
				<div className='border-t py-1 w-full grid grid-cols-4 text-center items-center text-sm md:text-base'>
					<Link to='/'>inicio</Link>
					<Link to='/personajes'>personajes</Link>
					<Link to='/comic'>comic</Link>
					<Link to='/galeria'>galeria</Link>
				</div>
			</div>

			<div className={`h-full min-h-0 w-full max-w-[1220px] sm:grid ${gridCols} gap-x-2 md:gap-x-3 lg:gap-x-4`}>

				{!isFullPage && <LeftBar />}

				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/personajes' element={<Personajes />} />
					<Route path='/comic' element={null} />
					<Route path='/galeria' element={null} />
				</Routes>

				{showComic && (
					<Suspense fallback={<Placeholder />}>
						<Comic />
					</Suspense>
				)}
				{showGaleria && (
					<Suspense fallback={<Placeholder />}>
						<Galeria />
					</Suspense>
				)}

				<RightBar />
			</div>

		</div>
	)
}

export default App
