import { Link, Route, Routes } from 'react-router-dom'
import Home from '../Routes/Home'
import Comic from '../Routes/Comic'
import Galeria from '../Routes/Galeria'

const Navbar = () => {
	return (
		<>
			<nav className='flex w-full border-2 border-amber-300 p-1 justify-between items-center'>
				<Link className='flex flex-1 justify-center' to={'/'} >
					<span className=''>Inicio</span>
				</Link>
				<Link className='flex flex-1 justify-center' to={'/comic'} >
					<span className=''>Comic</span>
				</Link>
				<Link className='flex flex-1 justify-center' to={'/galeria'} >
					<span className=''>Galeria</span>
				</Link>
			</nav>
			<Routes>
				<Route path='/' element={<Home/>} />
				<Route path='/comic' element={<Comic/>} />
				<Route path='/galeria' element={<Galeria/>} />
			</Routes>
		</>
	)
}

export default Navbar