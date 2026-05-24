import React, { useEffect, useState } from 'react'
import useFetch from '../hooks/useFetch'

const Comic = () => {
	const capitulo = 1
	const {data: comicData, loading, error} = useFetch('/api/comic/'+capitulo)

	return (
		<div className='h-full bg-gray-200 border py-3 px-2 border-black overflow-y-scroll'>
			<div className='bg-white border py-2 border-gray-400'>
				{[...comicData]
				.sort((a, b) => a.fecha - b.fecha)
				.map((img) => (

					<div key={img.id} className="bg-white mb-0.5 px-2">
						<img
						src={img.url}
						alt={img.name}
						className="w-full h-auto object-cover"
						/>
					</div>
				))}				
			</div>
		</div>
	)
}

export default Comic