import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { uploadImage } from '../services/api'
import './Publish.css'

const movementTypes = [
  { id: 'Venta', icon: '&#x1F4B0;', title: 'Venta', desc: 'Vende tu equipo a precio justo' },
  { id: 'Intercambio', icon: '&#x1F504;', title: 'Intercambio', desc: 'Intercambia por otro equipo' },
  { id: 'Donación', icon: '&#x1F381;', title: 'Donación', desc: 'Dona tu equipo a quien lo necesite' }
]

const categories = ['Laptops', 'Componentes', 'Periféricos', 'Consolas', 'Gadgets']
const conditions = ['Nuevo', 'Usado', 'Para refaccionar']
const mexicanStates = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua',
  'Coahuila', 'Colima', 'Ciudad de México', 'Durango', 'Estado de México', 'Guanajuato',
  'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León',
  'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
]

function Publish() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedType, setSelectedType] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    condition: '',
    brand: '',
    model: '',
    description: '',
    city: '',
    price: '',
    contact: ''
  })
  const [image, setImage] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!image) {
      setError('Debes subir una imagen del producto')
      return
    }

    try {
      setUploading(true)

      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onload = async () => {
        const imageUrl = reader.result

        const productData = {
          id: Date.now(),
          ...formData,
          offer_type: selectedType,
          price: selectedType === 'Venta' ? parseFloat(formData.price) : 0,
          image_url: imageUrl,
          seller: user?.email || 'Anonymous',
          created_at: new Date().toISOString()
        }

        const existingProducts = JSON.parse(localStorage.getItem('techloop_products') || '[]')
        existingProducts.push(productData)
        localStorage.setItem('techloop_products', JSON.stringify(existingProducts))

        alert('Equipo publicado exitosamente!')
        navigate('/marketplace')
        setUploading(false)
      }
    } catch (err) {
      setError('Error al publicar: ' + err.message)
      setUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        setImage(file)
        setError('')
      } else {
        setError('Por favor, sube solo archivos de imagen (JPG, PNG, GIF, WEBP, etc.)')
      }
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith('image/')) {
        setImage(file)
        setError('')
      } else {
        setError('Por favor, sube solo archivos de imagen (JPG, PNG, GIF, WEBP, etc.)')
      }
    }
  }

  return (
    <div className="publish-page">
      <div className="publish-container">
        <Link to="/marketplace" className="back-link">&#x2190; Volver al marketplace</Link>

        <div className="publish-header">
          <h1>Publicar equipo</h1>
          <p>Completa la información para listar tu equipo en el marketplace</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <section className="movement-types">
          <h2>Tipo de movimiento</h2>
          <div className="type-cards">
            {movementTypes.map(type => (
              <div
                key={type.id}
                className={`type-card ${selectedType === type.id ? 'selected' : ''}`}
                onClick={() => setSelectedType(type.id)}
              >
                <span className="type-icon" dangerouslySetInnerHTML={{ __html: type.icon }} />
                <h3>{type.title}</h3>
                <p>{type.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <form className="publish-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del producto *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoría *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Seleccionar...</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Estado *</label>
              <select name="condition" value={formData.condition} onChange={handleChange} required>
                <option value="">Seleccionar...</option>
                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Marca *</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Modelo *</label>
              <input type="text" name="model" value={formData.model} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required />
          </div>

          {selectedType === 'Venta' && (
            <div className="form-group">
              <label>Precio (MXN) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>
          )}

          <div className="form-group">
            <label>Ciudad *</label>
            <select name="city" value={formData.city} onChange={handleChange} required>
              <option value="">Seleccionar estado...</option>
              {mexicanStates.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Contacto (teléfono o red social)</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Ej: 5512345678 o @usuario" />
          </div>

          <div
            className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <span className="upload-icon">&#x1F4E4;</span>
            <p>Sube una foto de tu equipo</p>
            <span className="upload-hint">Arrastra y suelta o haz clic para seleccionar</span>
            <p className="upload-formats">Formatos: JPG, PNG, GIF, WEBP, SVG, BMP, etc.</p>
            <input type="file" id="fileInput" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
          </div>

          {image && (
            <div className="image-preview">
              <img src={URL.createObjectURL(image)} alt="Preview" />
              <p className="file-name">Archivo: {image.name} ({(image.size / 1024).toFixed(2)} KB)</p>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/marketplace')}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={!selectedType || uploading}>
              {uploading ? 'Publicando...' : 'Publicar ahora'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Publish
