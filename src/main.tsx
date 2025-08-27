import * as THREE from "three";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

Object.defineProperty(window, "THREE", { value: THREE });
Object.defineProperty(window, "T", { value: THREE });

createRoot(document.getElementById("root")!).render(<App />);
