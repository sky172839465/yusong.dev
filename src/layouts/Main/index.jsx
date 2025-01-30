import Footer from '../Footer'
import Header from '../Header'

const MainLayout = (props) => {
  const { children } = props
  return (
    <div className='min-h-dvh bg-background'>
      <Header />
      <main className='container mx-auto px-4 py-8'>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
