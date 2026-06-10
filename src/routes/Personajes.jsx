import { useState } from 'react'
import MenuPersonajes from '../components/MenuPersonajes'
import ContentPersonaje from '../components/ContentPersonaje'

const personajes = [
	{
		id: 1,
		nombre: 'idem',
		descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis error veniam voluptatem dolore earum harum! Similique excepturi recusandae accusamus quisquam officiis.',
		img: 'https://picsum.photos/seed/p1/240',
		galeria: [
			{ id: 1, url: 'https://picsum.photos/seed/p1g1/400/300' },
			{ id: 2, url: 'https://picsum.photos/seed/p1g2/400/300' },
			{ id: 3, url: 'https://picsum.photos/seed/p1g3/400/300' },
			{ id: 4, url: 'https://picsum.photos/seed/p1g4/400/300' },
		],
	},
	{
		id: 2,
		nombre: 'enim',
		descripcion: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
		img: 'https://picsum.photos/seed/p2/240',
		galeria: [
			{ id: 1, url: 'https://picsum.photos/seed/p2g1/400/300' },
			{ id: 2, url: 'https://picsum.photos/seed/p2g2/400/300' },
			{ id: 3, url: 'https://picsum.photos/seed/p2g3/400/300' },
		],
	},
	{
		id: 3,
		nombre: 'veniam',
		descripcion: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus.',
		img: 'https://picsum.photos/seed/p3/240',
		galeria: [
			{ id: 1, url: 'https://picsum.photos/seed/p3g1/400/300' },
			{ id: 2, url: 'https://picsum.photos/seed/p3g2/400/300' },
			{ id: 3, url: 'https://picsum.photos/seed/p3g3/400/300' },
			{ id: 4, url: 'https://picsum.photos/seed/p3g4/400/300' },
			{ id: 5, url: 'https://picsum.photos/seed/p3g5/400/300' },
		],
	},
	{
		id: 4,
		nombre: 'sunt',
		descripcion: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias.',
		img: 'https://picsum.photos/seed/p4/240',
		galeria: [
			{ id: 1, url: 'https://picsum.photos/seed/p4g1/400/300' },
			{ id: 2, url: 'https://picsum.photos/seed/p4g2/400/300' },
		],
	},
	{
		id: 5,
		nombre: 'audit',
		descripcion: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
		img: 'https://picsum.photos/seed/p5/240',
		galeria: [
			{ id: 1, url: 'https://picsum.photos/seed/p5g1/400/300' },
			{ id: 2, url: 'https://picsum.photos/seed/p5g2/400/300' },
			{ id: 3, url: 'https://picsum.photos/seed/p5g3/400/300' },
		],
	},
]

function Personajes() {
	const [currentIdx, setCurrentIdx] = useState(null)

	const isMenu = currentIdx === null

	const handleSelect = (p) => {
		const idx = personajes.findIndex(x => x.id === p.id)
		if (idx !== -1) setCurrentIdx(idx)
	}

	return (
		<div className='w-full p-2 border'>
			{isMenu && (
				<MenuPersonajes personajes={personajes} onSelect={handleSelect} />
			)}
			{!isMenu && (
				<ContentPersonaje
					personaje={personajes[currentIdx]}
					onPrev={() => setCurrentIdx(i => i - 1)}
					onNext={() => setCurrentIdx(i => i + 1)}
					onBack={() => setCurrentIdx(null)}
					hasPrev={currentIdx > 0}
					hasNext={currentIdx < personajes.length - 1}
				/>
			)}
		</div>
	)
}

export default Personajes
