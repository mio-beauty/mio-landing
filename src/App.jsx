import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import { I18nProvider } from "./i18n/I18nProvider.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import SeoHead from "./components/SeoHead.jsx";

export default function App() {
  return (
    <I18nProvider>
      <SeoHead />
      <AppRoutes />
      <Analytics />
    </I18nProvider>
  );
}
