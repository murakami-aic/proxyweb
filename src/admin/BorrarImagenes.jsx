import React, { useEffect, useState } from 'react'

const URL_PREFIX = 'https://lucesdefalsocontacto.com/'

function BorrarImagenes() {

	const [imagenes, setImagenes] = useState([])
	const [seleccionadas, setSeleccionadas] = useState([])
	const [res, setRes] = useState('')

	const cargarImagenes = async () => {
		const r = await fetch('/api/imagenes')
		const data = await r.json()
		setImagenes(data)
	}

	useEffect(() => {
		cargarImagenes()
	}, [])

	const toggleSeleccion = (id) => {
		setSeleccionadas(prev =>
			prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
		)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if(seleccionadas.length === 0) return
		if(!confirm(`Borrar ${seleccionadas.length} imagen(es)?`)) return

		const token = localStorage.getItem('token')

		const resultados = await Promise.all(
			seleccionadas.map(id =>
				fetch(`/api/imagen/${id}`, {
					method: 'DELETE',
					headers: { 'Authorization': `Bearer ${token}` }
				}).then(r => r.json().catch(() => ({ id, ok: r.ok })))
			)
		)
		setRes('msg: ' + JSON.stringify(resultados))
		setSeleccionadas([])
		cargarImagenes()
	}


	return (
		<div className='h-full w-full text-center'>
			<h1 className='text-xl font-bold mb-4'>Borrar imagenes</h1>
			<form onSubmit={handleSubmit} className='flex flex-col items-center'>
				<div className='grid grid-cols-4 w-4/6 gap-2 mb-2'>
					{imagenes.map((img) => {
						const checked = seleccionadas.includes(img.id)
						return (
							<div
								key={img.id}
								onClick={() => toggleSeleccion(img.id)}
								className={`w-full h-auto cursor-pointer border-2 ${checked ? 'border-red-500' : 'border-transparent'}`}
							>
								<img
									src={URL_PREFIX + img.url}
									alt={img.title}
									className={`object-contain aspect-square w-full h-auto ${checked ? 'opacity-50' : ''}`}
								/>
								<p>{img.title}</p>
								<input
									type='checkbox'
									checked={checked}
									onChange={() => toggleSeleccion(img.id)}
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

export default BorrarImagenes
