import { useEffect, useState } from "react"
import imgData from '../assets/imgData'

function CharacterList() {

    const [data, setData] = useState([])

    useEffect(() => {
        setData(imgData)
    }, [])

    return (
        <div className='md:bg-main mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center p-5 md:p-10 mb-20'>
            {data.map(item => (
                <div className="bg-second p-3 m-3 mb-5 md:mb-10 md:m-2 text-center">
                    <img type="img/gif" src={item.url} alt={item.title} />
                    <h3 className="pt-3 text-xl md:text-2xl">{item.title}</h3>
                </div>  
            ))}
        </div>
    );
}

export default CharacterList;