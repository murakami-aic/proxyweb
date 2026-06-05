import React, { useState } from 'react'

function Login() {

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const handleLogin = async (e) => {
		e.preventDefault()

		const res = await fetch('/api/login', {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify({ email, password })
		})

		const data = await res.json()

		if(data.error){
			setError(data.error)
			return
		}

		localStorage.setItem('token', data.token)
		window.location.href = '/admin/dashboard'
	}


	return (
		<div className='h-screen w-full md:w-1/6  content-center text-center justify-center mx-auto'>
			<h1>Login</h1>
			<form onSubmit={handleLogin} className='flex flex-col gap-2'>
				<input
					type='email'
					placeholder='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className='border'
				/>
				<input
					type='password'
					placeholder='password'
					value={password}
					onChange={(e)=> setPassword(e.target.value)}
					className='border'
				/>
				<button type='submit' > <a>Enviar</a> </button>
			</form>
			{error && <p>{error}</p>}
		</div>
	)
}

export default Login