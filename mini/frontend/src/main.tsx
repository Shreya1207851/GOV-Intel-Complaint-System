import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("App initializing...");
const container = document.getElementById("root");
if (!container) {
  console.error("Root element not found!");
} else {
  console.log("Root element found, mounting app...");
  createRoot(container).render(<App />);
  console.log("App rendered");
}
