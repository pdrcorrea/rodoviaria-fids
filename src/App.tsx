import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { DataProvider } from '@/context/DataContext'
import LoginPage from '@/pages/LoginPage'
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminUsers from '@/pages/admin/AdminUsers'
import AdminLines from '@/pages/admin/AdminLines'
import PublicPanel from '@/pages/PublicPanel'
import OperatorPage from '@/pages/OperatorPage'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/painel" element={<PublicPanel />} />
          <Route
            path="/operador"
            element={
              <ProtectedRoute>
                <OperatorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="usuarios" element={<AdminUsers />} />
            <Route path="linhas" element={<AdminLines />} />
          </Route>
          <Route path="*" element={<Navigate to="/painel" replace />} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  )
}
