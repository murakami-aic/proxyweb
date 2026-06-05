import React, { useState } from 'react'

function SubirMusica() {

	const [audios, setAudios] = useState([])
	const [titulos, setTitulos] = useState([])
	const [author, setAuthor] = useState([])

	const [portadas, setPortadas] = useState([])
	const [res, setRes] = useState('')

	const handleFiles = (e) => {
		const files = Array.from(e.target.files)
		setAudios(files)
		setTitulos(files.map(() => ''))
		setAuthor(files.map(() => ''))
		setPortadas(files.map(() => null))
	}

	const handleTituloChange = (i, value) => {
		const copia = [...titulos]
		copia[i] = value
		setTitulos(copia)
	}

	const handleAuthorChange = (i, value) => {
		const copia = [...author]
		copia[i] = value
		setAuthor(copia)
	}

	const handlePortadaChange = (i, file) => {
		const copia = [...portadas]
		copia[i] = file
		setPortadas(copia)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		const formData = new FormData()
		const token = localStorage.getItem('token')

		audios.forEach((audio, i) => {
			formData.append('audio[]', audio)
			formData.append('titulo[]', titulos[i])
			formData.append('author[]', author[i])
			if(portadas[i]) formData.append('portada[]', portadas[i])
		})

		const res = await fetch('/api/musica/subir', {
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
			<h1 className='text-xl font-bold mb-4'>Subir nueva musica</h1>
			<form onSubmit={handleSubmit} className='flex flex-col items-center'>
				<input
					type='file'
					accept='audio/*'
					multiple
					onChange={handleFiles}
					className='border px-1 hover:bg-blue-300'
				/>
				<div className='grid grid-cols-4 w-4/6 gap-2 mb-2'>
					{audios.map((audio, i) => (
						<div key={i} className='w-full h-auto flex flex-col gap-1'>
							<audio
								src={URL.createObjectURL(audio)}
								controls
								className='w-full'
							/>
							<p>{i} - {audio.name}</p>
							<input
								type='text'
								placeholder='Titulo'
								value={titulos[i]}
								onChange={(e) => handleTituloChange(i, e.target.value)}
								className='border px-1'
							/>
							<input
								type='text'
								placeholder='Autor'
								value={author[i]}
								onChange={(e) => handleAuthorChange(i, e.target.value)}
								className='border px-1'
							/>
							<input
								type='file'
								accept='image/*'
								onChange={(e) => handlePortadaChange(i, e.target.files[0])}
								className='border px-1'
							/>
							{portadas[i] && (
								<img
									src={URL.createObjectURL(portadas[i])}
									className='object-contain aspect-square w-full h-auto'
								/>
							)}
						</div>
					))}
				</div>

				<button
					type='submit'
					className='border px-1 hover:bg-red-400'
				>
                Subir musica
				</button>
			</form>

			{res && <p className='mt-4'>{res}</p>}
		</div>
	)
}

export default SubirMusica
