import { BrowserRouter, Route, Routes, useNavigate } from 'react-router'
import { HomePage } from './features/HomePage.tsx'
import { AppLayout } from './AppLayout.tsx'
import { UserDetailPage } from './features/users/UserDetailPage.tsx'
import { useEffect } from 'react'

interface NoMatchProps {
  redirect: string
}

const NoMatch = ({ redirect }: NoMatchProps) => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(redirect, { replace: true })
  }, [navigate, redirect])

  return null
}

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/users/:userId" element={<UserDetailPage />} />
        <Route path="*" element={<NoMatch redirect="/" />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
