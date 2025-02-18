const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className='flex-none border-t bg-background'
    >
      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col items-center justify-between md:flex-row'>
          <p>
            &copy;
            {currentYear}
            {' '}
            {/* YUSONG.TW All rights reserved. */}
            YUSONG.TW 保留所有權利。
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
