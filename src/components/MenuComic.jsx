import { mockGaleria } from "../assets/mockGaleria"

function MenuComic({ comics, onSelect }) {
	return (
		<div className='border-b flex justify-center items-center w-full h-full'>

			<button className="">
				<img
					src={mockGaleria[0].url}
					alt="proxy dibujando"
					className="h-[350px] w-[460px]"
				/>
			</button>

		</div>
	)
}

export default MenuComic
