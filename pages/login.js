'use client'
import { useRouter } from 'next/router'
import { useState } from 'react'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in both fields.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const response = await fetch('https://backend-chatbot-khkf.onrender.com/v1/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const responseData = await response.json()
      if (responseData.data) {
        localStorage.setItem('token', responseData.data.token)
        router.push('/')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='wrapper'>
      <div className='return-container' onClick={() => router.push('/')}>
        <svg viewBox='0 0 48 48' width={25} height={25} fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M12.9998 8L6 14L12.9998 21'
            stroke='#000000'
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'></path>
          <path
            d='M6 14H28.9938C35.8768 14 41.7221 19.6204 41.9904 26.5C42.2739 33.7696 36.2671 40 28.9938 40H11.9984'
            stroke='#000000'
            strokeWidth='4'
            strokeLinecap='round'
            strokeLinejoin='round'></path>
        </svg>
        <div style={{ marginLeft: '0.3rem' }}>Return Home</div>
      </div>
      <div className='login-container'>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className='login-form-group'>
            <label className='login-label' htmlFor='email'>
              Email
            </label>
            <input
              className='login-input'
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='login-form-group'>
            <label htmlFor='password'>Password</label>
            <input
              className='login-input'
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className='login-error-message'>{error}</p>}
          <button className='login-button' type='submit' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      <div className='link-button'>
        Don't have an account?{' '}
        <span
          style={{ color: '#007bff', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => router.push('/signup')}>
          Sign up
        </span>
      </div>
    </div>
  )
}

export default LoginPage
