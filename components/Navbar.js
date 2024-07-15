import Link from 'next/link'
function Navbar() {
  return (
    <div className='navbar'>
      <img className='navbar-logo' src='/logo.png' alt='Logo' />
      <div className='navbar-login-btn'>
        <Link href='/login'>Login</Link>
      </div>
    </div>
  )
}

export default Navbar
