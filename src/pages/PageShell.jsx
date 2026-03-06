export default function PageShell({ title, hint, children }) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.22em] text-neutral-500">
          PAGE
        </p>
        <h1 className="text-balance font-serif text-4xl leading-tight text-neutral-900 sm:text-5xl">
          {title}
        </h1>
        {hint ? (
          <p className="max-w-2xl text-pretty text-base text-neutral-600 sm:text-lg">
            {hint}
          </p>
        ) : null}
      </header>

      <div className="rounded-2xl border border-neutral-900/10 bg-neutral-50 p-6 text-sm text-neutral-700">
        {children || 'Placeholder content. You will fill this page later.'}
      </div>
    </div>
  )
}

