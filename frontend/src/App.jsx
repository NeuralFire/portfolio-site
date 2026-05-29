import { Navigate, Route, Routes } from 'react-router-dom'
import ShellLayout from './components/layout/ShellLayout.jsx'
import AboutPage from './pages/AboutPage.jsx'
import BlogPage from './pages/BlogPage.jsx'
import CaseStudiesPage from './pages/CaseStudiesPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LinksPage from './pages/LinksPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ResumePage from './pages/ResumePage.jsx'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<ShellLayout />}>
        <Route index element={<HomePage />} />
        <Route path="case-studies" element={<CaseStudiesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="resume" element={<ResumePage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="links" element={<LinksPage />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
