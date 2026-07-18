import "./App.css";
import AppRoutes from "./routes/AppRoutes.jsx";
import { Analytics } from "@vercel/analytics/next";

export default function App() {
  return (
    <>
      <AppRoutes />
      <Analytics />
    </>
  );
}
