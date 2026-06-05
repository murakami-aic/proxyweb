import React, { useEffect, useState } from 'react'

export default function useFetch(url) {
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() =>{
		let ignore = false

		async function load() {
			try {
				const res = await fetch(url)
				if(!res.ok) throw new Error('Error en la peticion')
                
				const json = await res.json()
				if(!ignore) setData(json)
			} catch (error) {
				if(!ignore) setError(error)
			} finally {
				if(!ignore) setLoading(false)
			}
		}
		load()
		return() => {ignore = true}
	}, [url])
    
	return { data, loading, error }
}
