


// App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';

import { HomePage } from './pages/HomePage/HomePage';
import { RegisterPage } from './components/RegisterPage/RegisterPage';
import { LoginPage } from './components/LoginPage/LoginPage';
import { BookingPage } from './components/BookingPage/BookingPage';
import { AdminPage } from './components/AdminPage/AdminPage';

// Компонент-обёртка для защиты админки
// const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
//   const userId = localStorage.getItem('userId');
//   const role = localStorage.getItem('role');

//   // Если нет userId ИЛИ роль не admin → редирект на /login
//   if (!userId || role !== 'admin') {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// };

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/admin" element={<AdminPage />} />

      {/* Защита вынесена сюда: компонент AdminPage теперь чистый и не делает редиректов */}
      {/* <Route
        path="/admin"
         element={
          <ProtectedAdminRoute>
            <AdminPage />
          </ProtectedAdminRoute>
         }
      /> */}
    </Routes>
  );
}
export default App