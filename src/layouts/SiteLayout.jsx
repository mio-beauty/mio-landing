import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer.jsx'

export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
