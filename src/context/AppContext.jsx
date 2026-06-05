import { useState } from 'react'
import { AppContext } from './AppContext.js'

export function AppProvider({ children }) {
	const [valor, setValor] = useState(1)

	return (
		<AppContext.Provider value={{ valor, setValor }}>
			{children}
		</AppContext.Provider>
	)
}
