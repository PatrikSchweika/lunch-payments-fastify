import { BrowserRouter, Route, Routes, useNavigate } from 'react-router'
import { HomePage } from './pages/HomePage.tsx'
import { AppLayout } from './AppLayout.tsx'
import { UserDetailPage } from './pages/users/UserDetailPage.tsx'
import { useEffect } from 'react'

const NoMatch = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/', { replace: true })
  }, [navigate])

  return null
}

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="users/:userId" element={<UserDetailPage />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
