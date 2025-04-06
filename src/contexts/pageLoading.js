import { createContext, useContext } from 'react'

const PageLoadingContext = createContext()

export const PageLoadingProvider = ({ children, loading }) => {
  return (
    <PageLoadingContext.Provider value={{ loading }}>
      {children}
    </PageLoadingContext.Provider>
  )
}

export const usePageLoading = () => {
  return useContext(PageLoadingContext)
}
