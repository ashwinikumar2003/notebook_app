import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import NoteState from './context/notes/noteState.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <React.StrictMode>
  <NoteState>
    <App />
  </NoteState>
  </React.StrictMode>
  </BrowserRouter>
)