import { Link } from 'react-router-dom'
import './ProductCard.css'

function ProductCard({ product }) {
  const typeColors = {
    'Venta': '#4CAF50',
    'Intercambio': '#2196F3',
    'Donación': '#FF9800'
  }

  const conditionColors = {
    'Nuevo': '#4CAF50',
    'Usado': '#FF9800',
    'Para refaccionar': '#F44336'
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="card-image">
        <img src={product.image_url || product.image} alt={product.title} />
        <div className="card-badges">
          <span className="badge type-badge" style={{ backgroundColor: typeColors[product.type] }}>
            {product.type}
          </span>
          <span className="badge condition-badge" style={{ backgroundColor: conditionColors[product.condition] }}>
            {product.condition}
          </span>
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{product.title}</h3>
        <p className="card-description">{product.description}</p>
        <div className="card-footer">
          <span className="card-price">
            {product.type === 'Venta' ? `$${product.price.toLocaleString()}` :
             product.type === 'Intercambio' ? 'Por intercambio' : 'Gratis'}
          </span>
          <span className="card-city">&#x1F4CD; {product.city}</span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
