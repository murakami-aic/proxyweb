import { mockGaleria } from "../assets/mockGaleria"

const Comic = () => {

	return (
		<div className='border-b flex justify-center items-center h-full'>

			<button className="">
				<img
					src={mockGaleria[0].url}
					alt="proxy dibujando"
					className="w-[240px]"
				/>
			</button>

		</div>
	)
}

export default Comic
