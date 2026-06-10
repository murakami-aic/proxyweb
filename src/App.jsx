import { Route, Routes, Link, Navigate, useLocation } from 'react-router-dom'
import { Home, Personajes, Comic, Galeria } from './routes'
import { Dashboard, Login } from './admin'

function App() {

	const location = useLocation()
	const isAdminRoute = location.pathname.startsWith('/admin')

	if (isAdminRoute) {
		return (
			<Routes>
				<Route path='/admin/login' element={<Login />} />
				<Route path='/admin/dashboard' element={<Dashboard />} />
				<Route path='*' element={<Navigate to='/admin/login' replace />} />
			</Routes>
		)
	}

	return (
		<div className='w-full min-h-screen flex flex-col items-center px-1'>

			<div className='border-x flex flex-col w-full px-2 max-w-[900px] flex-1'>

				<div className='w-full mt-12'>
					<img src='/lucesdefalsocontacto.jpg' alt='Luces de falso contacto' className='hidden border w-full min-h-16 h-[clamp(9rem,20vw,15rem)] object-cover' />
					<div className='mt-12 py-1 w-full grid grid-cols-4 text-center items-center text-sm md:text-base'>
						<Link to='/'>inicio</Link>
						<Link className='border-x' to='/personajes'>personajes</Link>
						<Link className='border-r' to='/comic'>comic</Link>
						<Link to='/galeria'>galeria</Link>
					</div>
				</div>

				<div className='w-full mt-12 flex-1'>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/personajes' element={<Personajes />} />
						<Route path='/comic' element={<Comic />} />
						<Route path='/galeria' element={<Galeria />} />
						<Route path='*' element={<Navigate to='/' replace />} />
					</Routes>
				</div>

			</div>

		</div>
	)
}

export default App
