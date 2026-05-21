import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AzureAuthProvider } from './components/auth/AzureAuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AzureAuthProvider>
      <App />
    </AzureAuthProvider>
  </StrictMode>,
)
