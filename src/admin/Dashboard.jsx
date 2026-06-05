import React, { useState } from 'react'
import SubirImagenes from './SubirImagenes'
import SubirMusica from './SubirMusica'
import BorrarImagenes from './BorrarImagenes'
import BorrarMusica from './BorrarMusica'
import BorrarComics from './BorrarComics'

const opciones = [
	{ id: 'subir-imagenes', label: 'Subir imagenes', Component: SubirImagenes },
	{ id: 'subir-musica',   label: 'Subir musica',   Component: SubirMusica },
	{ id: 'borrar-imagenes', label: 'Borrar imagenes', Component: BorrarImagenes },
	{ id: 'borrar-musica',  label: 'Borrar musica',  Component: BorrarMusica },
	{ id: 'borrar-comics',  label: 'Borrar comics',  Component: BorrarComics },
]

function Dashboard() {
	const token = localStorage.getItem('token')
	if(!token){
		window.location.href = '/admin/login'
		return
	}

	const [vista, setVista] = useState(opciones[0].id)

	const handleLogout = () => {
		localStorage.removeItem('token')
		window.location.href = '/admin/login'
	}

	const Activo = opciones.find(o => o.id === vista)?.Component

	return (
		<div className='flex h-screen'>
			<nav className='w-48 shrink-0 border-r flex flex-col'>
				<h2 className='font-bold p-2 border-b'>Admin</h2>
				{opciones.map(o => (
					<button
						key={o.id}
						onClick={() => setVista(o.id)}
						className={`text-left px-2 py-1 border-b hover:bg-blue-300 ${vista === o.id ? 'bg-blue-200 font-bold' : ''}`}
					>
						{o.label}
					</button>
				))}
				<button
					onClick={handleLogout}
					className='mt-auto px-2 py-1 border-t hover:bg-red-400'
				>
					Cerrar sesion
				</button>
			</nav>

			<main className='flex-1 overflow-y-auto p-4'>
				{Activo && <Activo/>}
			</main>
		</div>
	)
}

export default Dashboard
