import Footer from '../Footer'
import Header from '../Header'

const MainLayout = (props) => {
  const { children } = props
  return (
    <div className='flex min-h-dvh flex-col bg-background'>
      <Header />
      <main className='container mx-auto grow px-4 py-8'>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
