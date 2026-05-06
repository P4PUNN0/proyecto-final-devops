import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

function Header() {
  const [showCategories, setShowCategories] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">&#x21BB;</span>
          <span className="logo-text">TechLoop</span>
        </Link>

        <nav className="nav-links">
          <Link to="/marketplace" className="nav-link">Marketplace</Link>
          {user && <Link to="/publish" className="nav-link">Publicar</Link>}
          {user && <Link to="/dashboard" className="nav-link">Mi Panel</Link>}

          <div className="dropdown" onMouseEnter={() => setShowCategories(true)} onMouseLeave={() => setShowCategories(false)}>
            <button className="nav-link dropdown-btn">Categorías &#x25BC;</button>
            {showCategories && (
              <div className="dropdown-menu">
                <Link to="/marketplace?category=Laptops" className="dropdown-item">Laptops</Link>
                <Link to="/marketplace?category=Componentes" className="dropdown-item">Componentes</Link>
                <Link to="/marketplace?category=Periféricos" className="dropdown-item">Periféricos</Link>
                <Link to="/marketplace?category=Consolas" className="dropdown-item">Consolas</Link>
                <Link to="/marketplace?category=Gadgets" className="dropdown-item">Gadgets</Link>
              </div>
            )}
          </div>
        </nav>

        <div className="user-section">
          {user ? (
            <>
              <div className="user-avatar">{user.email?.[0]?.toUpperCase() || 'U'}</div>
              <span className="user-name">{user.displayName || user.email?.split('@')[0] || 'Usuario'}</span>
              <button onClick={logout} className="logout-btn">Salir</button>
            </>
          ) : (
            <Link to="/login" className="login-link">Iniciar Sesión</Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
