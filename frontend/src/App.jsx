import { Navigate, Route, Routes } from 'react-router-dom'
import ShellLayout from './components/layout/ShellLayout.jsx'
import AboutPage from './pages/AboutPage.jsx'
import BlogPage from './pages/BlogPage.jsx'
import BlogPostPage from './pages/BlogPostPage.jsx'
import CaseStudiesPage from './pages/CaseStudiesPage.jsx'
import CaseStudyPage from './pages/CaseStudyPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ResumePage from './pages/ResumePage.jsx'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<ShellLayout />}>
        <Route index element={<HomePage />} />
        <Route path="case-studies" element={<CaseStudiesPage />} />
        <Route path="case-studies/:caseStudyId" element={<CaseStudyPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="resume" element={<ResumePage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:postId" element={<BlogPostPage />} />
        <Route path="links" element={<Navigate to="/contact" replace />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
