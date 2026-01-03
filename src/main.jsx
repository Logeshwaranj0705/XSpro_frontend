import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "leaflet/dist/leaflet.css";

<script
  type="module"
  src="https://unpkg.com/@splinetool/viewer@1.12.5/build/spline-viewer.js"
  async
></script>

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
  