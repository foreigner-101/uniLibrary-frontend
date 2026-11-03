import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Universities from './pages/Universities.jsx';
import Faculties from './pages/Faculties.jsx';
import Programmes from './pages/Programmes.jsx';
import Levels from './pages/Levels.jsx';
import Semesters from './pages/Semesters.jsx';
import Courses from './pages/Courses.jsx';
import Resources from './pages/Resources.jsx';
import Search from './pages/Search.jsx';
import Favorites from './pages/Favorites.jsx';
import Profile from './pages/Profile.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageStructure from './pages/admin/ManageStructure.jsx';
import ManageResources from './pages/admin/ManageResources.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import { ProtectedRoute, AdminRoute, SuperAdminRoute } from './routes/ProtectedRoute.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/universities" element={<Universities />} />
        <Route path="/universities/:universityId" element={<Faculties />} />
        <Route path="/faculties/:facultyId" element={<Programmes />} />
        <Route path="/programmes/:programmeId" element={<Levels />} />
        <Route path="/levels/:levelId" element={<Semesters />} />
        <Route path="/semesters/:semesterId" element={<Courses />} />
        <Route path="/courses/:courseId" element={<Resources />} />

        <Route path="/search" element={<Search />} />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          <Route index element={<ManageStructure />} />
          <Route path="structure" element={<ManageStructure />} />
          <Route path="resources" element={<ManageResources />} />
          <Route
            path="users"
            element={
              <SuperAdminRoute>
                <ManageUsers />
              </SuperAdminRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}
