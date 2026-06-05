import React, { useState } from 'react'

function SubirImagenes() {

	const [esComic, setEsComic] = useState(false)
	const [imagenes, setImagenes] = useState([])
	const [nombres, setNombres] = useState([])
	const [capitulo, setCapitulo] = useState('')
	const [nombreComic, setNombreComic] = useState('')
	const [sinopsis, setSinopsis] = useState('')
	const [res, setRes] = useState('')

	const handleFiles = (e) => {
		const files = Array.from(e.target.files)
		setImagenes(files)
		setNombres(files.map(() => ''))
	}

	const handleNombreChange = (i, value) => {
		const copia = [...nombres]
		copia[i] = value
		setNombres(copia)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
        
		const formData = new FormData()
		const token = localStorage.getItem('token')

		if(esComic){
			formData.append('esComic', esComic)
			formData.append('capitulo', capitulo)
			formData.append('nombreComic', nombreComic)
			formData.append('sinopsis', sinopsis)
		}

		imagenes.forEach((img, i) => {
			formData.append('imagen[]', img)
			formData.append('nombre[]', nombres[i])
		})

		const res = await fetch('/api/imagenes/subir', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`
			},
			body: formData
		})
		const data = await res.json()
		setRes('msg: ' + JSON.stringify(data))
	}


	return (
		<div className='h-full w-full text-center'>
			<h1 className='text-xl font-bold mb-4'>Subir nuevo capitulo</h1>
			<p>Es un comic?</p>
			<input
				type='checkbox'
				checked={esComic}
				onChange={(e) => setEsComic(e.target.checked)}
			/>
			<form onSubmit={handleSubmit} className='flex flex-col items-center'>
				{esComic && ( 
					<div className='w-1/6 flex flex-col gap-1 mb-2'>
						<input 
							type='text'
							placeholder='Nombre del capitulo'
							value={nombreComic}
							onChange={(e) => setNombreComic(e.target.value)}
							className='border w-full px-1'
						/>

						<input 
							type='number'
							placeholder='Número de capítulo'
							value={capitulo}
							onChange={(e) => setCapitulo(e.target.value)}
							className='border w-full px-1'
						/>

						<textarea
							placeholder='Sinopsis'
							value={sinopsis}
							onChange={(e) => setSinopsis(e.target.value)}
							className='border w-full px-1'
						/>
        
					</div>
				)}
				<input 
					type='file'
					multiple
					onChange={handleFiles}
					className='border px-1 hover:bg-blue-300'
				/>
				<div className='grid grid-cols-4 w-4/6 gap-2 mb-2'>
					{imagenes.map((img, i) => (
						<div key={i} className='w-full h-auto'>
							<img src={URL.createObjectURL(img)} className='object-contain aspect-square w-full h-auto'/>
							<p>{i}</p>
							<input 
								type='text'
								placeholder='Nombre'
								value={nombres[i]}
								onChange={(e) => handleNombreChange(i, e.target.value)}
								className='border px-1'
							/>
						</div>
					))}
				</div>

				<button 
					type='submit'
					className='border px-1 hover:bg-red-400'
				>
                Subir capitulo
				</button>
			</form>

			{res && <p className='mt-4'>{res}</p>}
		</div>
	)
}

export default SubirImagenes