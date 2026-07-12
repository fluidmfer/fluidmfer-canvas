import { useRef, useState, useMemo } from 'react'

// Pure inline SVG Lucide Icons to prevent dependency installation friction
const Icons = {
  FileText: () => <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>,
  Image: () => <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2.5" ry="2.5"/><circle cx="9.25" cy="9.25" r="2.5"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>,
  Download: () => <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
  Trash: () => <svg xmlns="http://w3.org" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  ExternalLink: () => <svg xmlns="http://w3.org" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>,
  Sparkles: () => <svg xmlns="http://w3.org" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/></svg>,
  Loader: () => <svg className="animate-spin" xmlns="http://w3.org" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/><line x1="2" x2="6" y1="12" y2="12"/><line x1="18" x2="22" y1="12" y2="12"/><line x1="4.93" x2="7.76" y1="19.07" y2="16.24"/><line x1="16.24" x2="19.07" y1="7.76" y2="4.93"/></svg>
}

const CANVAS_BG = '#121212'
const ACCENT = '#ff3131'
const TEXT_COLOR = '#e6e6e6'

function generateId() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  let id = ''
  for (let i = 0; i < 21; i++) {
    id += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  return id
}

function generateSeed() {
  return Math.floor(Math.random() * 2147483647)
}

function createBaseElement(type, overrides = {}) {
  return {
    id: generateId(),
    type,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    angle: 0,
    strokeColor: TEXT_COLOR,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: null,
    seed: generateSeed(),
    version: 1,
    versionNonce: generateSeed(),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    ...overrides,
  }
}

export default function App() {
  const [mainText, setMainText] = useState('')
  const [imageData, setImageData] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [successLogs, setSuccessLogs] = useState([])

  const fileInputRef = useRef(null)

  const lineCount = useMemo(() => mainText.split('\n').filter(l => l.trim()).length, [mainText])

  function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setValidationError('')
    setIsProcessing(true)

    const reader = new FileReader()
    reader.onload = () => {
      const dataURL = reader.result
      const img = new Image()
      img.onload = () => {
        setImageData({
          dataURL,
          mimeType: file.type || 'image/png',
          width: img.naturalWidth || 600,
          height: img.naturalHeight || 450,
          name: file.name
        })
        setIsProcessing(false)
        addLog(`Successfully loaded reference styling layout asset: "${file.name}"`)
      }
      img.onerror = () => {
        setValidationError('Failed to parse uploaded asset dimensions.')
        setIsProcessing(false)
      }
      img.src = dataURL
    }
    reader.readAsDataURL(file)
  }

  function removeImage(e) {
    e.stopPropagation()
    setImageData(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    addLog('Reference styling element removed.')
  }

  function addLog(msg) {
    setSuccessLogs(prev => [ `[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 4) ])
  }

  function verifyAndAssembleDocument() {
    setValidationError('')
    const cleanText = mainText.trim()

    if (!cleanText && !imageData) {
      throw new Error('Canvas assembly rejected: Document data arrays cannot be empty.')
    }

    const elements = []
    const files = {}
    let currentX = 100
    let currentY = 100

    if (cleanText) {
      const fontSize = 20
      const lineHeight = 25
      const lines = cleanText.split('\n')

      let maxLineLength = 0
      lines.forEach(l => { if (l.length > maxLineLength) maxLineLength = l.length })

      const computedWidth = Math.max(200, maxLineLength * 11)
      const computedHeight = lines.length * lineHeight

      const textElement = createBaseElement('text', {
        x: currentX,
        y: currentY,
        width: computedWidth,
        height: computedHeight,
        text: cleanText,
        fontSize,
        fontFamily: 1,
        textAlign: 'left',
        verticalAlign: 'top',
        originalText: cleanText,
        lineHeight: 1.25
      })

      elements.push(textElement)
      currentX += computedWidth + 80
    }

    if (imageData) {
      const fileId = generateId()
      const maxDisplayDimension = 500
      let renderWidth = imageData.width
      let renderHeight = imageData.height

      if (renderWidth > maxDisplayDimension || renderHeight > maxDisplayDimension) {
        const ratio = Math.min(maxDisplayDimension / renderWidth, maxDisplayDimension / renderHeight)
        renderWidth = Math.round(renderWidth * ratio)
        renderHeight = Math.round(renderHeight * ratio)
      }

      const imageElement = createBaseElement('image', {
        x: currentX,
        y: currentY,
        width: renderWidth,
        height: renderHeight,
        fileId,
        status: 'pending',
        scale: [1, 1]
      })

      elements.push(imageElement)

      files[fileId] = {
        id: fileId,
        mimeType: imageData.mimeType,
        dataURL: imageData.dataURL,
        created: Date.now(),
        lastRetrieved: Date.now()
      }
    }

    if (elements.length === 0) {
      throw new Error('Data collection compiled clean but schema transformation produced 0 structural elements.')
    }

    return {
      type: 'excalidraw',
      version: 2,
      source: 'https://excalidraw.com',
      elements,
      appState: {
        gridSize: null,
        viewBackgroundColor: CANVAS_BG,
      },
      files
    }
  }

  function executeExportStream() {
    try {
      setIsProcessing(true)
      const documentPayload = verifyAndAssembleDocument()
      const jsonString = JSON.stringify(documentPayload, null, 2)
      const payloadBufferBytes = new Blob([jsonString], { type: 'application/json' }).size

      if (payloadBufferBytes < 150) {
        throw new Error(`Data transmission validation anomaly caught: payload size of ${payloadBufferBytes} bytes indicates a corrupt schema context window.`)
      }

      const finalBlob = new Blob([jsonString], { type: 'application/vnd.excalidraw+json' })
      const blobURL = URL.createObjectURL(finalBlob)

      const downloadAnchor = document.createElement('a')
      downloadAnchor.href = blobURL
      downloadAnchor.download = `canvas-${Date.now()}.excalidraw`

      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()

      document.body.removeChild(downloadAnchor)
      URL.revokeObjectURL(blobURL)

      addLog(`Exported successfully. Compiled size: ${(payloadBufferBytes / 1024).toFixed(2)} KB.`)
    } catch (error) {
      setValidationError(error.message || 'An unhandled pipeline error occurred during execution.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 antialiased selection:bg-red-500/20 selection:text-[#ff3131]">
      <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0c0c0e]/70 backdrop-blur-xl px-8 py-4">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff3131] to-red-700 shadow-md shadow-red-600/20">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-white">Excalidraw Engine</h1>
              <p className="text-[10px] text-zinc-500 font-mono">v2.0.4 · PRODUCTION_BUILD</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <Icons.Sparkles />
            <span>4K optimized canvas</span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-8 py-10 lg:grid-cols-2">
        <section className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0e]/60 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <Icons.FileText />
              <label className="text-sm font-medium text-zinc-200">Main content</label>
              <span className="ml-auto text-[11px] text-zinc-600">{lineCount} lines</span>
            </div>
            <textarea
              value={mainText}
              onChange={(e) => setMainText(e.target.value)}
              rows={10}
              placeholder="type a description or paste written content..."
              className="w-full resize-y rounded-xl border border-white/[0.06] bg-black/40 p-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-[#ff3131]/60 focus:outline-none focus:ring-1 focus:ring-[#ff3131]/40"
            />
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0e]/60 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <Icons.Image />
              <label className="text-sm font-medium text-zinc-200">Reference layout</label>
            </div>
            <p className="mb-3 text-[12px] text-zinc-500">
              upload an image you saw elsewhere so the layout or style gets modeled after it.
            </p>

            <div
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/[0.08] bg-black/30 px-4 py-8 text-center transition-colors hover:border-[#ff3131]/50"
            >
              {imageData ? (
                <>
                  <img
                    src={imageData.dataURL}
                    alt="reference preview"
                    className="max-h-48 rounded-lg object-contain"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute right-2 top-2 flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-[11px] text-zinc-300 hover:border-[#ff3131]/50 hover:text-white"
                  >
                    <Icons.Trash /> remove
                  </button>
                </>
              ) : (
                <>
                  <span className="mb-2 text-[#ff3131]">
                    <Icons.Sparkles />
                  </span>
                  <span className="text-sm text-zinc-400">click to upload a reference image</span>
                  <span className="mt-1 text-[11px] text-zinc-600">png, jpg, gif, webp</span>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/[0.06]">
            <div
              className="relative h-full min-h-[440px] w-full"
              style={{ backgroundColor: CANVAS_BG }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage: 'radial-gradient(#242424 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="relative h-full w-full overflow-auto p-6">
                {mainText.trim() ? (
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm text-zinc-200">
                    {mainText}
                  </pre>
                ) : (
                  <span className="text-sm text-zinc-600">
                    your workspace canvas — content preview appears here
                  </span>
                )}

                {imageData && (
                  <img
                    src={imageData.dataURL}
                    alt="reference on canvas"
                    className="mt-4 max-h-56 rounded-lg border border-white/[0.06] object-contain"
                  />
                )}
              </div>

              <a
                href="https://x.com/fluidmfer"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 left-3 select-none rounded-md px-2 py-1 text-xs font-medium tracking-wide text-[#ff3131] transition-colors hover:text-[#ff4a4a]"
              >
                @fluidmfer
              </a>
            </div>
          </div>

          {validationError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {validationError}
            </div>
          )}

          <button
            onClick={executeExportStream}
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff3131] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-transform hover:bg-[#ff4a4a] active:scale-[0.99] disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <Icons.Loader /> Compiling...
              </>
            ) : (
              <>
                <Icons.Download /> Download .excalidraw File
              </>
            )}
          </button>

          {successLogs.length > 0 && (
            <div className="rounded-xl border border-white/[0.06] bg-[#0c0c0e]/60 p-4 text-[11px] text-zinc-500">
              {successLogs.map((log, i) => (
                <div key={i} className="truncate">{log}</div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
