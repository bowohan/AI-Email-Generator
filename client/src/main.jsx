import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import Navigation from './components/Navigation'
import ProtectedRoute from './components/ProtectedRoute'
import EmailGenerator from './pages/EmailGenerator.jsx'
import EmailList from './pages/EmailList.jsx'
import EmailDetail from './pages/EmailDetail.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <EmailGenerator />
            </ProtectedRoute>
          } />
          <Route path="/generator" element={
            <ProtectedRoute>
              <EmailGenerator />
            </ProtectedRoute>
          } />
          <Route path="/emails" element={
            <ProtectedRoute>
              <EmailList />
            </ProtectedRoute>
          } />
          <Route path="/email/:id" element={
            <ProtectedRoute>
              <EmailDetail />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
