import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' })
  const [contactSent, setContactSent] = useState(false)

  useEffect(() => {
    const localProducts = JSON.parse(localStorage.getItem('techloop_products') || '[]')
    const found = localProducts.find(p => p.id === parseInt(id))
    if (found) {
      setProduct(found)
    }
  }, [id])

  const handleContactSubmit = (e) => {
    e.preventDefault()

    const contactInfo = {
      ...contactData,
      productId: product.id,
      productName: product.title || product.name,
      sellerEmail: product.seller,
      date: new Date().toISOString()
    }

    const contacts = JSON.parse(localStorage.getItem('techloop_contacts') || '[]')
    contacts.push(contactInfo)
    localStorage.setItem('techloop_contacts', JSON.stringify(contacts))

    setContactSent(true)
    setShowContactForm(false)
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="detail-container">
          <Link to="/marketplace" className="back-link">← Volver al marketplace</Link>
          <p className="error-message">Producto no encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <div className="detail-container">
        <Link to="/marketplace" className="back-link">← Volver al marketplace</Link>

        <div className="detail-grid">
          <div className="detail-image">
            <img src={product.image_url || product.image} alt={product.title || product.name} />
          </div>

          <div className="detail-info">
            <div className="detail-badges">
              <span className="badge type-badge">{product.offer_type || product.type}</span>
              <span className="badge condition-badge">{product.condition}</span>
            </div>

            <h1 className="detail-title">{product.title || product.name}</h1>

            <div className="detail-price">
              {product.offer_type === 'Venta' ? `$${product.price?.toLocaleString()} MXN` :
               product.offer_type === 'Intercambio' ? 'Disponible para intercambio' : 'Gratis (Donación)'}
            </div>

            <div className="detail-meta">
              <div className="meta-item">
                <span className="meta-label">Categoría:</span>
                <span>{product.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Marca:</span>
                <span>{product.brand}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Modelo:</span>
                <span>{product.model}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Ciudad:</span>
                <span>📍 {product.city}</span>
              </div>
              {product.contact && (
                <div className="meta-item">
                  <span className="meta-label">Contacto:</span>
                  <span>{product.contact}</span>
                </div>
              )}
            </div>

            <div className="detail-description">
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>

            <div className="seller-info">
              <h3>Publicado por</h3>
              <div className="seller-card">
                <div className="seller-avatar">{(product.seller || 'U')[0]?.toUpperCase()}</div>
                <div>
                  <p className="seller-name">{product.seller}</p>
                  <p className="seller-date">Publicado el {new Date(product.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="detail-actions">
              {user && user.email !== product.seller && (
                <>
                  {contactSent ? (
                    <div className="contact-success">✓ Mensaje enviado al vendedor</div>
                  ) : (
                    <button className="btn-contact" onClick={() => setShowContactForm(true)}>
                      Contactar al vendedor
                    </button>
                  )}
                </>
              )}
              <button className="btn-save">♡ Guardar</button>
            </div>

            {showContactForm && (
              <div className="contact-form-overlay" onClick={() => setShowContactForm(false)}>
                <div className="contact-form" onClick={(e) => e.stopPropagation()}>
                  <h3>Contactar al vendedor</h3>
                  <form onSubmit={handleContactSubmit}>
                    <div className="form-group">
                      <label>Tu nombre</label>
                      <input
                        type="text"
                        value={contactData.name}
                        onChange={(e) => setContactData({...contactData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Tu email</label>
                      <input
                        type="email"
                        value={contactData.email}
                        onChange={(e) => setContactData({...contactData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Mensaje</label>
                      <textarea
                        value={contactData.message}
                        onChange={(e) => setContactData({...contactData, message: e.target.value})}
                        placeholder="Hola, me interesa tu producto..."
                        rows="4"
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button type="button" className="btn-cancel" onClick={() => setShowContactForm(false)}>Cancelar</button>
                      <button type="submit" className="btn-submit">Enviar mensaje</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
