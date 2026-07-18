import "./App.css";
import AppRoutes from "./routes/AppRoutes.jsx";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <>
      <AppRoutes />
      <Analytics />
    </>
  );
}
