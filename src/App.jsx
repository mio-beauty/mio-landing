import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import { I18nProvider } from "./i18n/I18nProvider.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <I18nProvider>
      <AppRoutes />
      <Analytics />
    </I18nProvider>
  );
}
