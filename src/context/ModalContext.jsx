import { createContext, useContext, useState, useCallback } from 'react'

const ModalContext = createContext(null)

export function ModalProvider({ children }) {
  const [openModalId, setOpenModalId] = useState(null)

  const openModal = useCallback((id) => {
    setOpenModalId(id)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setOpenModalId(null)
    document.body.style.overflow = ''
  }, [])

  return (
    <ModalContext.Provider value={{ openModalId, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used inside <ModalProvider>')
  return ctx
}
