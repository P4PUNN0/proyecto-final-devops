import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuth()
  const [myProducts, setMyProducts] = useState([])
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    loadMyProducts()
    loadContacts()
  }, [user])

  const loadMyProducts = () => {
    const products = JSON.parse(localStorage.getItem('techloop_products') || '[]')
    const myItems = products.filter(p => p.seller === user?.email)
    setMyProducts(myItems)
  }

  const loadContacts = () => {
    const allContacts = JSON.parse(localStorage.getItem('techloop_contacts') || '[]')
    const myContacts = allContacts.filter(c => c.sellerEmail === user?.email)
    setContacts(myContacts)
  }

  const handleDelete = (productId) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    const products = JSON.parse(localStorage.getItem('techloop_products') || '[]')
    const updated = products.filter(p => p.id !== productId)
    localStorage.setItem('techloop_products', JSON.stringify(updated))
    loadMyProducts()
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1>Mi Panel</h1>
        <p className="dashboard-subtitle">Gestiona tus productos y contactos</p>

        <section className="dashboard-section">
          <h2>Mis Productos ({myProducts.length})</h2>
          {myProducts.length === 0 ? (
            <div className="empty-state">
              <p>No has publicado productos aún</p>
              <Link to="/publish" className="btn-primary">Publicar equipo</Link>
            </div>
          ) : (
            <div className="products-list">
              {myProducts.map(product => (
                <div key={product.id} className="product-item">
                  <img src={product.image_url} alt={product.name} className="product-thumb" />
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.offer_type} • {product.category} • {product.city}</p>
                    {product.offer_type === 'Venta' && <p className="price">${product.price?.toLocaleString()} MXN</p>}
                  </div>
                  <div className="product-actions">
                    <Link to={`/product/${product.id}`} className="btn-view">Ver</Link>
                    <button onClick={() => handleDelete(product.id)} className="btn-delete">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h2>Contactos Recibidos ({contacts.length})</h2>
          {contacts.length === 0 ? (
            <div className="empty-state">
              <p>No tienes contactos aún. Aparecerán aquí cuando alguien quiera contactarte.</p>
            </div>
          ) : (
            <div className="contacts-list">
              {contacts.map((contact, index) => (
                <div key={index} className="contact-item">
                  <div className="contact-info">
                    <h4>{contact.name}</h4>
                    <p>{contact.email}</p>
                    <p className="contact-message">"{contact.message}"</p>
                    <p className="contact-product">Interesado en: {contact.productName}</p>
                    <p className="contact-date">{new Date(contact.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Dashboard
