import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginWithGoogle, loginWithFacebook, loginWithEmail, registerWithEmail } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await loginWithEmail(email, password)
      } else {
        await registerWithEmail(email, password)
      }
      navigate('/marketplace')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      navigate('/marketplace')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook()
      navigate('/marketplace')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="logo">
            <span className="logo-icon">&#x21BB;</span>
            <span className="logo-text">TechLoop</span>
          </Link>
          <h1>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h1>
          <p>{isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta en TechLoop'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="social-buttons">
          <button className="social-btn google" onClick={handleGoogleLogin} disabled={loading}>
            <span className="social-icon">G</span> Continuar con Google
          </button>
          <button className="social-btn facebook" onClick={handleFacebookLogin} disabled={loading}>
            <span className="social-icon">f</span> Continuar con Facebook
          </button>
        </div>

        <div className="divider">
          <span>o</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
          </button>
        </form>

        <div className="toggle-auth">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button onClick={() => { setIsLogin(!isLogin); setError('') }}>
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
