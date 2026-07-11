</div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <Icons.Sparkles />
            <span>4K optimized canvas</span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-8 py-10 lg:grid-cols-2">
        {/* left column: inputs */}
        <section className="flex flex-col gap-6">
          {/* main content text area */}
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

          {/* reference image upload zone */}
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

        {/* right column: workspace canvas */}
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
