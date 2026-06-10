import { mockGaleria } from "../assets/mockGaleria"
function Home() {

	console.log(mockGaleria)

	return (
		<div className='flex flex-col gap-y-4 sm:px-4 md:px-10 lg:px-20 mb-20'>
			<div className="border h-[140px]">

			</div>

			<div className="border flex flex-col items-center gap-1 p-5">
				<h2 className="font-extrabold text-3xl">Sobre el WebComic</h2>
				<img src={mockGaleria[1].url} alt="imagen comic" className="max-w-[360px] aspect-square object-cover" />
				<div>
					<h3 className="text-xl font-semibold">Te imaginas que el destino te de una segunda oportunidad tras morir?</h3>
					<p className="">
						Sarah en su nueva vida se propone encontrar a su amigo Bill quien fue secuestrado, esta vez acompañada del Destino, con la condicion de evitar que la infeccion de la Plaga afecte el orden natural de la humanidad.
						Ahora Sarah y Destino son los unicos que pueden evitar que los humanos se corrompan en horribles monstruos.
					</p>
				</div>
			</div>

			<div className="border p-5">
				<img src={mockGaleria[2].url} alt="imagen comic" className="h-[140px] aspect-square ml-3 float-right" />

				<p>
					Soy una criatura que trabaja sin presiones, por que ademas de hacer el proyecto, trabajo, estudio y vivo.
					Recuerden que solo soy yo quien se encarga de todo el trabajo creativo, como guiones, storyboads, ilustraciones paneles, animacines y ademas el comic!
					ASI QUE!
					para que no pierda calidad mi trabajo y darles todo esto con todo el amor y cariño que se merecen, actualizare CADA K KIFRA, seguramente cada mes.
					Siempre puedes estar
					al. tanto de todo el contenido y
					comunicarte directamente en mis redes, GRACIAS :D
				</p>

			</div>

			<div className="border p-5">
				<div className="grid grid-cols-4 gap-2">
					<div className="flex flex-col place-content-between">
						<img src={mockGaleria[3].url} alt="imagen 1" className="" />
						<p>Siguiendo y compartiendo!!<br />LO MAS IMPORTANTE</p>
					</div>
					<div className="flex flex-col place-content-between">
						<img src={mockGaleria[2].url} alt="imagen 1" className="" />
						<p>Compra un ka-fesito o dona en Patreon</p>
					</div>
					<div className="flex flex-col place-content-between">
						<img src={mockGaleria[5].url} alt="imagen 1" className="" />
						<p>COMENTA Y CREA COMUNIDAD <br />MANDAME UN COMENTARIO</p>
					</div>
					<div className="flex flex-col place-content-between">
						<img src={mockGaleria[0].url} alt="imagen 1" className="" />
						<p>Mirando mis animaciones</p>
					</div>
				</div>
			</div>

			<div className="border p-5">
				parte colaboradores!
			</div>
		</div>
	)
}

export default Home