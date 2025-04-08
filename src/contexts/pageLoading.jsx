import { createContext, useContext, useState, useRef } from 'react'

const PageLoadingContext = createContext()

 
export const PageLoadingProvider = ({ children, loading }) => {
  return (
    <PageLoadingContext.Provider value={{ loading }}>
      {children}
    </PageLoadingContext.Provider>
  )
}

/* eslint-disable react-refresh/only-export-components */
export const usePageLoading = () => {
  return useContext(PageLoadingContext)
}

/* eslint-disable react-refresh/only-export-components */
export const usePageLoaded = () => {
  const { loading } = useContext(PageLoadingContext)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loading || loaded) {
      return
    }
    
    setLoaded(true)
  }, [loading])

  return { loading: loading && !loaded }
}
