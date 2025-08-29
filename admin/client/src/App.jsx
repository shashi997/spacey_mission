import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import ProtectedRoute from './components/ProtectedRoute';
import Users from './pages/Users';
import Lessons from './pages/Lessons';
import LessonEditor from './pages/LessonEditor';
import LessonDesigns from './pages/LessonDesigns';
import LessonDesigner from './pages/LessonDesigner';


function App() {

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<Users />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="lesson-designs" element={<LessonDesigns />} />
          <Route path="lessons/new" element={<LessonEditor />} />
          <Route path="lessons/edit/:lessonId" element={<LessonEditor />} />
          <Route path="lesson-designs/design/:lessonId" element={<LessonDesigner />} />
        </Route>
      </Route>

      {/* Redirect root to login for simplicity */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
