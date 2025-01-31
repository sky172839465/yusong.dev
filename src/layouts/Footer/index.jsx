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
            YUSONG.TW All rights reserved.
          </p>
          {/* <nav className='mt-4 md:mt-0'>
            <ul className='flex space-x-4'>
              <li>
                <a href='/privacy' className='hover:text-primary'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href='/terms' className='hover:text-primary'>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href='/contact' className='hover:text-primary'>
                  Contact Us
                </a>
              </li>
            </ul>
          </nav> */}
        </div>
      </div>
    </footer>
  )
}

export default Footer
