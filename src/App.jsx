import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

const MAX_SIZE = 5000

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })
}

function App() {
  const [sourceUrl, setSourceUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isWorking, setIsWorking] = useState(false)
  const [error, setError] = useState('')
  const [resultUrl, setResultUrl] = useState('')
  const [original, setOriginal] = useState({ width: 0, height: 0 })
  const [settings, setSettings] = useState({
    width: 1200,
    height: 1200,
    quality: 86,
    format: 'jpeg',
    keepRatio: true,
  })

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl)
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [sourceUrl, resultUrl])

  async function initializeImage(file) {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file.')
      return
    }

    try {
      setError('')
      if (sourceUrl) URL.revokeObjectURL(sourceUrl)
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl)
        setResultUrl('')
      }

      const objectUrl = URL.createObjectURL(file)
      const image = await loadImage(objectUrl)

      setSourceUrl(objectUrl)
      setFileName(file.name.replace(/\.[^/.]+$/, ''))
      setOriginal({ width: image.naturalWidth, height: image.naturalHeight })
      setSettings((prev) => ({
        ...prev,
        width: clamp(image.naturalWidth, 1, MAX_SIZE),
        height: clamp(image.naturalHeight, 1, MAX_SIZE),
      }))
    } catch {
      setError('Could not read this image. Try another file.')
    }
  }

  function onFileInput(event) {
    const [file] = event.target.files || []
    if (file) initializeImage(file)
  }

  function onDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    const [file] = event.dataTransfer.files || []
    if (file) initializeImage(file)
  }

  function updateDimension(field, value) {
    const nextValue = clamp(Number(value) || 1, 1, MAX_SIZE)

    if (!settings.keepRatio || !original.width || !original.height) {
      setSettings((prev) => ({ ...prev, [field]: nextValue }))
      return
    }

    if (field === 'width') {
      const ratioHeight = Math.round((nextValue / original.width) * original.height)
      setSettings((prev) => ({ ...prev, width: nextValue, height: clamp(ratioHeight, 1, MAX_SIZE) }))
      return
    }

    const ratioWidth = Math.round((nextValue / original.height) * original.width)
    setSettings((prev) => ({ ...prev, height: nextValue, width: clamp(ratioWidth, 1, MAX_SIZE) }))
  }

  async function resizeImage() {
    if (!sourceUrl) return

    try {
      setIsWorking(true)
      setError('')

      const image = await loadImage(sourceUrl)
      const canvas = document.createElement('canvas')
      canvas.width = clamp(settings.width, 1, MAX_SIZE)
      canvas.height = clamp(settings.height, 1, MAX_SIZE)

      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas is unavailable')

      context.imageSmoothingQuality = 'high'
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      const mimeType = `image/${settings.format}`
      const qualityValue = settings.format === 'png' ? undefined : settings.quality / 100

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((nextBlob) => {
          if (!nextBlob) reject(new Error('Resize failed'))
          else resolve(nextBlob)
        }, mimeType, qualityValue)
      })

      if (resultUrl) URL.revokeObjectURL(resultUrl)
      setResultUrl(URL.createObjectURL(blob))
    } catch {
      setError('Resize failed. Please try again with a different size or format.')
    } finally {
      setIsWorking(false)
    }
  }

  useEffect(() => {
    if (!sourceUrl) return
    const timer = setTimeout(() => {
      resizeImage()
    }, 220)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceUrl, settings.width, settings.height, settings.quality, settings.format])

  function downloadImage() {
    if (!resultUrl) return
    const link = document.createElement('a')
    link.href = resultUrl
    link.download = `${fileName || 'resized-image'}-${settings.width}x${settings.height}.${settings.format}`
    link.click()
  }

  const detailText = useMemo(() => {
    if (!original.width || !original.height) return 'Upload a JPG, PNG, or WEBP image'
    return `Original ${original.width} × ${original.height}`
  }, [original.height, original.width])

  return (
    <main className="page-shell">
      <div className="backdrop" aria-hidden="true" />
      <section className="hero">
        <p className="eyebrow">Image Resizer Studio</p>
        <h1>Resize, optimize, and export in seconds.</h1>
        <p className="subtitle">Interactive controls with instant preview and smooth animation.</p>
        <p className="subtitle">
          Need legal details? <Link to="/privacy-policy">Read Privacy Policy</Link>
        </p>
      </section>

      <section className="workspace">
        <article
          className={`panel upload ${isDragging ? 'dragging' : ''}`}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <input id="file-input" type="file" accept="image/*" onChange={onFileInput} hidden />
          <label htmlFor="file-input" className="upload-zone">
            <span className="upload-title">Drop image here or click to browse</span>
            <span className="upload-meta">{detailText}</span>
          </label>

          <div className="controls-grid">
            <label>
              Width
              <input
                type="number"
                min="1"
                max={MAX_SIZE}
                value={settings.width}
                onChange={(event) => updateDimension('width', event.target.value)}
              />
            </label>
            <label>
              Height
              <input
                type="number"
                min="1"
                max={MAX_SIZE}
                value={settings.height}
                onChange={(event) => updateDimension('height', event.target.value)}
              />
            </label>
            <label>
              Format
              <select
                value={settings.format}
                onChange={(event) => setSettings((prev) => ({ ...prev, format: event.target.value }))}
              >
                <option value="jpeg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WEBP</option>
              </select>
            </label>
            <label>
              Quality {settings.quality}%
              <input
                type="range"
                min="30"
                max="100"
                value={settings.quality}
                disabled={settings.format === 'png'}
                onChange={(event) => setSettings((prev) => ({ ...prev, quality: Number(event.target.value) }))}
              />
            </label>
          </div>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={settings.keepRatio}
              onChange={(event) => setSettings((prev) => ({ ...prev, keepRatio: event.target.checked }))}
            />
            Keep aspect ratio
          </label>

          <div className="actions">
            <button className="primary" type="button" onClick={resizeImage} disabled={!sourceUrl || isWorking}>
              {isWorking ? 'Processing...' : 'Apply Resize'}
            </button>
            <button className="secondary" type="button" onClick={downloadImage} disabled={!resultUrl}>
              Download Image
            </button>
          </div>

          {error ? <p className="error">{error}</p> : null}
        </article>

        <article className="panel preview">
          {resultUrl ? (
            <img src={resultUrl} alt="Resized preview" className="preview-image" />
          ) : (
            <div className="preview-placeholder">Preview appears here after upload</div>
          )}
        </article>
      </section>
    </main>
  )
}

export default App
