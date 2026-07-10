import { useRef, useState } from 'react'

const CANVAS_BG = '#121212'
const ACCENT = '#ff3131'
const STROKE = '#e6e6e6'

function makeId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  let out = ''
  for (let i = 0; i < 21; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

function randInt() {
  return Math.floor(Math.random() * 2 ** 31)
}

export default function App() {
  const [mainText, setMainText] = useState('')
  const [imageData, setImageData] = useState(null)
  const [status, setStatus] = useState('')
  const fileInputRef = useRef(null)

  function handleImageChange(event) {
    const file = event.target.files && event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const dataURL = reader.result
      const img = new Image()
      img.onload = () => {
        setImageData({
          dataURL,
          mimeType: file.type || 'image/png',
          width: img.naturalWidth || 400,
          height: img.naturalHeight || 300,
          name: file.name || 'reference',
        })
        setStatus('reference image loaded')
      }
      img.src = dataURL
    }
    reader.readAsDataURL(file)
  }

  function clearImage() {
    setImageData(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setStatus('reference image removed')
  }

  function buildScene() {
    const elements = []
    const files = {}
    return {
      type: 'excalidraw',
      version: 2,
      source: 'https://excalidraw.com',
      elements,
      appState: {
        gridSize: null,
        viewBackgroundColor: CANVAS_BG,
      },
      files,
    }
  }

  function handleDownload() {
    const scene = buildScene()
    const json = JSON.stringify(scene, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'diagram.excalidraw'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)

    setStatus('.excalidraw file downloaded')
  }

  return (
    <div className="min-h-screen bg-canvas text-neutral-200">
      <header className="border-b border-edge px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: ACCENT }} />
            <h1 className="text-lg font-semibold tracking-tight">Excalidraw Bot Dashboard</h1>
          </div>
          <span className="text-xs text-neutral-500">dark · single mode</span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-2">
        <section className="flex flex-col gap-6">
          <div className="rounded-2xl border border-edge bg-surface p-5">
            <label className="mb-2 block text-sm font-medium text-neutral-300">Main content</label>
            <p className="mb-3 text-xs text-neutral-500">type a description or paste written content for the diagram.</p>
            <textarea
              value={mainText}
              onChange={(e) => setMainText(e.target.value)}
              rows={10}
              placeholder="e.g. a flow from user -> api gateway -> auth service -> database..."
              className="w-full resize-y rounded-xl border border-edge bg-surface-2 p-3 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="rounded-2xl border border-edge bg-surface p-5">
            <label className="mb-2 block text-sm font-medium text-neutral-300">Reference image</label>
            <p className="mb-3 text-xs text-neutral-500">upload an image you saw elsewhere so the ai can model the layout or style after it.</p>
            <div
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-edge bg-surface-2 px-4 py-8 text-center transition-colors hover:border-accent"
            >
              {imageData ? (
                <img src={imageData.dataURL} alt="reference preview" className="max-h-48 rounded-lg object-contain" />
              ) : (
                <>
                  <span className="mb-2 text-2xl leading-none" style={{ color: ACCENT }}>+</span>
                  <span className="text-sm text-neutral-400">click to upload a reference image</span>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            {imageData && (
              <div className="mt-3 flex items-center justify-between">
                <span className="truncate text-xs text-neutral-500">{imageData.name}</span>
                <button onClick={clearImage} className="rounded-lg border border-edge px-3 py-1 text-xs text-neutral-300 transition-colors hover:border-accent hover:text-white">remove</button>
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="relative flex-1 overflow-hidden rounded-2xl border border-edge">
            <div className="relative h-full min-h-[420px] w-full" style={{ backgroundColor: CANVAS_BG }}>
              <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#2b2b2b 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
              <div className="relative h-full w-full overflow-auto p-6">
                {mainText.trim() ? (
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm text-neutral-200">{mainText}</pre>
                ) : (
                  <span className="text-sm text-neutral-600">your workspace canvas — content preview appears here</span>
                )}
                {imageData && <img src={imageData.dataURL} alt="reference on canvas" className="mt-4 max-h-56 rounded-lg border border-edge object-contain" />}
              </div>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 left-3 select-none rounded-md px-2 py-1 text-xs font-medium tracking-wide transition-colors"
                style={{ color: ACCENT }}
              >
                @fluidmfer
              </a>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="w-full rounded-xl px-5 py-3 text-center text-sm font-semibold text-white shadow-lg transition-transform active:scale-[0.99]"
            style={{ backgroundColor: ACCENT }}
          >
            Download .excalidraw File
          </button>
          {status && <p className="text-center text-xs text-neutral-500">{status}</p>}
        </section>
      </main>
    </div>
  )
}
