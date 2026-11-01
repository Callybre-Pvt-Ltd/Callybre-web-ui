import { createContext, useContext, useState } from 'react'

const AppReadyContext = createContext(false)

export function AppReadyProvider({ children }) {
  const [ready, setReady] = useState(false)
  return (
    <AppReadyContext.Provider value={{ ready, setReady }}>
      {children}
    </AppReadyContext.Provider>
  )
}

export function useAppReady() {
  return useContext(AppReadyContext)
}
