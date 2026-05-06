import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/api'
import './Marketplace.css'

const mexicanStates = [
  'Todas', 'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua',
  'Coahuila', 'Colima', 'Ciudad de México', 'Durango', 'Estado de México', 'Guanajuato',
  'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León',
  'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
]

function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('Todo')
  const [selectedCity, setSelectedCity] = useState('Todas')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'Todas')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const types = ['Todo', 'Venta', 'Intercambio', 'Donación']
  const categories = ['Todas', 'Laptops', 'Componentes', 'Periféricos', 'Consolas', 'Gadgets']

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    if (selectedCategory !== 'Todas') {
      setSearchParams({ category: selectedCategory })
    } else {
      setSearchParams({})
    }
  }, [selectedCategory])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      const localProducts = JSON.parse(localStorage.getItem('techloop_products') || '[]')
      const allProducts = [...(data.products || []), ...localProducts]
      setProducts(allProducts)
    } catch (error) {
      console.error('Error loading products:', error)
      const localProducts = JSON.parse(localStorage.getItem('techloop_products') || '[]')
      setProducts(localProducts)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(search.toLowerCase()) ||
                         product.name?.toLowerCase().includes(search.toLowerCase()) ||
                         product.description?.toLowerCase().includes(search.toLowerCase())
    const matchesType = selectedType === 'Todo' || product.offer_type === selectedType || product.type === selectedType
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory
    const matchesCity = selectedCity === 'Todas' || product.city === selectedCity
    return matchesSearch && matchesType && matchesCategory && matchesCity
  })

  return (
    <div className="marketplace">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">Electrónica Circular</span>
          <h1 className="hero-title">Dale una segunda vida al hardware</h1>
          <p className="hero-subtitle">Compra, vende, intercambia o dona equipos electrónicos y contribuye al futuro sostenible</p>
          <Link to="/publish" className="hero-btn">Publicar equipo</Link>
        </div>
      </section>

      <section className="search-section">
        <div className="search-bar">
          <span className="search-icon">&#x1F50D;</span>
          <input
            type="text"
            placeholder="Buscar laptops, teclados, GPUs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="filters-section">
        <div className="filter-group">
          <span className="filter-label">Tipo de oferta:</span>
          <div className="filter-pills">
            {types.map(type => (
              <button
                key={type}
                className={`pill ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Categorías:</span>
          <div className="filter-pills">
            {categories.map(cat => (
              <button
                key={cat}
                className={`pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Ciudad:</span>
          <select className="city-filter" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            {mexicanStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </section>

      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : filteredProducts.length > 0 ? (
        <section className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">&#x1F4E6;</span>
          <h3>No hay productos disponibles</h3>
          <p>
            {selectedCategory !== 'Todas' ? `No hay productos en la categoría "${selectedCategory}"` :
             selectedCity !== 'Todas' ? `No hay productos en ${selectedCity}` :
             selectedType !== 'Todo' ? `No hay productos de tipo "${selectedType}"` :
             search ? `No hay resultados para "${search}"` :
             '¡Sé el primero en publicar un producto!'}
          </p>
          <Link to="/publish" className="hero-btn">Publicar equipo</Link>
        </div>
      )}
    </div>
  )
}

export default Marketplace
