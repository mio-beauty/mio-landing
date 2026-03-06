import { Route, Routes } from 'react-router-dom'
import SiteLayout from '../layouts/SiteLayout.jsx'

import CertificatePage from '../pages/Certificate.jsx'
import NotFoundPage from '../pages/NotFound.jsx'
import LandingPage from '../pages/Landing.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<LandingPage />} />

        <Route path="/certificate" element={<CertificatePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
