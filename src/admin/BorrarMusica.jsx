import React, { useEffect, useState } from 'react'

function BorrarMusica() {

	const [musica, setMusica] = useState([])
	const [seleccionadas, setSeleccionadas] = useState([])
	const [res, setRes] = useState('')

	const cargarMusica = async () => {
		const r = await fetch('/api/musica')
		const data = await r.json()
		setMusica(data)
	}

	useEffect(() => {
		cargarMusica()
	}, [])

	const toggleSeleccion = (id) => {
		setSeleccionadas(prev =>
			prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
		)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if(seleccionadas.length === 0) return
		if(!confirm(`Borrar ${seleccionadas.length} cancion(es)?`)) return

		const token = localStorage.getItem('token')

		const resultados = await Promise.all(
			seleccionadas.map(id =>
				fetch(`/api/musica/${id}`, {
					method: 'DELETE',
					headers: { 'Authorization': `Bearer ${token}` }
				}).then(r => r.json().catch(() => ({ id, ok: r.ok })))
			)
		)
		setRes('msg: ' + JSON.stringify(resultados))
		setSeleccionadas([])
		cargarMusica()
	}


	return (
		<div className='h-full w-full text-center'>
			<h1 className='text-xl font-bold mb-4'>Borrar musica</h1>
			<form onSubmit={handleSubmit} className='flex flex-col items-center'>
				<div className='grid grid-cols-4 w-4/6 gap-2 mb-2'>
					{musica.map((song) => {
						const checked = seleccionadas.includes(song.id)
						return (
							<div
								key={song.id}
								onClick={() => toggleSeleccion(song.id)}
								className={`w-full h-auto cursor-pointer border-2 p-1 ${checked ? 'border-red-500' : 'border-transparent'}`}
							>
								{song.img && (
									<img
										src={song.img}
										alt={song.title}
										className={`object-contain aspect-square w-full h-auto ${checked ? 'opacity-50' : ''}`}
									/>
								)}
								<p>{song.title}</p>
								<audio
									src={song.url}
									controls
									onClick={(e) => e.stopPropagation()}
									className='w-full'
								/>
								<input
									type='checkbox'
									checked={checked}
									onChange={() => toggleSeleccion(song.id)}
								/>
							</div>
						)
					})}
				</div>

				<button
					type='submit'
					disabled={seleccionadas.length === 0}
					className='border px-1 hover:bg-red-400 disabled:opacity-50'
				>
                Borrar seleccionadas ({seleccionadas.length})
				</button>
			</form>

			{res && <p className='mt-4'>{res}</p>}
		</div>
	)
}

export default BorrarMusica
