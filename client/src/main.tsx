import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LunchApp } from './LunchApp.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LunchApp />
  </StrictMode>,
)
