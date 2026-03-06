import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-4xl text-neutral-900">404</h1>
      <p className="text-neutral-600">Page not found.</p>
      <Link
        to="/"
        className="inline-flex rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        Go home
      </Link>
    </div>
  )
}

