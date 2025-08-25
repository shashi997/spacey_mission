import React from 'react'
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import { SignUpForm, LoginForm } from './features/authentication';
import DashboardIndexPage from './pages/DashboardIndexPage';
import PrivateRoute from './components/PrivateRoute';
import MyLessonsPage from './pages/MyLessonsPage';

const App = () => {
  return (
    <div className='App'>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/signup' element={<SignUpForm />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<DashboardIndexPage />} />
            <Route path="my-lessons" element={<MyLessonsPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App