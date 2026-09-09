import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import LoginPage from '@/pages/Login/LoginPage'
import DashboardPage from '@/pages/Dashboard/DashboardPage'
import TicketListPage from '@/pages/Tickets/TicketListPage'
import CreateTicketPage from '@/pages/Tickets/CreateTicketPage'
import TicketDetailPage from '@/pages/Tickets/TicketDetailPage'
import EditTicketPage from '@/pages/Tickets/EditTicketPage'
import UsersPage from '@/pages/Users/UsersPage'
import CategoriesPage from '@/pages/Categories/CategoriesPage'
import ReportsPage from '@/pages/Reports/ReportsPage'
import ProfilePage from '@/pages/Profile/ProfilePage'
import UnauthorizedPage from '@/pages/Unauthorized'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

      <Route path="/tickets" element={<ProtectedRoute><TicketListPage /></ProtectedRoute>} />
      <Route
        path="/tickets/new"
        element={
          <ProtectedRoute allow={['employee', 'admin']}>
            <CreateTicketPage />
          </ProtectedRoute>
        }
      />
      <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} />
      <Route path="/tickets/:id/edit" element={<ProtectedRoute><EditTicketPage /></ProtectedRoute>} />

      <Route
        path="/users"
        element={
          <ProtectedRoute allow={['admin']}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute allow={['admin']}>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute allow={['admin']}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
