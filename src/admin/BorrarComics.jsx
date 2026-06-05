import React, { useEffect, useState } from 'react'

function BorrarComics() {

	const [comics, setComics] = useState([])
	const [seleccionados, setSeleccionados] = useState([])
	const [res, setRes] = useState('')

	const cargarComics = async () => {
		const r = await fetch('/api/comics')
		const data = await r.json()
		setComics(data)
	}

	useEffect(() => {
		cargarComics()
	}, [])

	const toggleSeleccion = (id) => {
		setSeleccionados(prev =>
			prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
		)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if(seleccionados.length === 0) return
		if(!confirm(`Borrar ${seleccionados.length} capitulo(s)?`)) return

		const token = localStorage.getItem('token')

		const resultados = await Promise.all(
			seleccionados.map(id =>
				fetch(`/api/comic/${id}`, {
					method: 'DELETE',
					headers: { 'Authorization': `Bearer ${token}` }
				}).then(r => r.json().catch(() => ({ id, ok: r.ok })))
			)
		)
		setRes('msg: ' + JSON.stringify(resultados))
		setSeleccionados([])
		cargarComics()
	}


	return (
		<div className='h-full w-full text-center'>
			<h1 className='text-xl font-bold mb-4'>Borrar comics</h1>
			<form onSubmit={handleSubmit} className='flex flex-col items-center'>
				<div className='flex flex-col w-4/6 gap-1 mb-2'>
					{comics.map((c) => {
						const checked = seleccionados.includes(c.id)
						return (
							<div
								key={c.id}
								onClick={() => toggleSeleccion(c.id)}
								className={`py-1 px-2 border-b hover:bg-gray-300 cursor-pointer flex justify-between items-center gap-2 ${checked ? 'bg-red-200' : ''}`}
							>
								<input
									type='checkbox'
									checked={checked}
									onChange={() => toggleSeleccion(c.id)}
									onClick={(e) => e.stopPropagation()}
								/>
								<span className='truncate flex-1 text-left'>
									{c.capitulo}. {c.name}
								</span>
								{c.fecha && (
									<span className='text-xs shrink-0'>
										{c.fecha}
									</span>
								)}
							</div>
						)
					})}
				</div>

				<button
					type='submit'
					disabled={seleccionados.length === 0}
					className='border px-1 hover:bg-red-400 disabled:opacity-50'
				>
                Borrar seleccionados ({seleccionados.length})
				</button>
			</form>

			{res && <p className='mt-4'>{res}</p>}
		</div>
	)
}

export default BorrarComics
