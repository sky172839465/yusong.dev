import MainLayout from '../layouts/Main'

const Layout = (props) => {
  const { children } = props
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}

export default Layout