import Layout from '../../layouts/Main/index'

const DemoLayout = (props) => {
  const { children } = props
  return (
    <Layout>
      <div className='bg-black text-center leading-10 text-white'>
        custom layout
      </div>
      {children}
    </Layout>
  )
}

export default DemoLayout