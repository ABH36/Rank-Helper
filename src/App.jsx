import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import PageLoader from './components/common/PageLoader'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Hide loader once DOM is fully painted (~first frame after mount)
    const id = requestAnimationFrame(() => {
      setTimeout(() => setLoading(false), 900)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <ThemeProvider>
      <PageLoader visible={loading} />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
