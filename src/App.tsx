import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import UserManagement from "./admin/UserManagement";
import RoomManagement from "./admin/RoomManagement";
import RoomForm from "./admin/RoomForm";
import EquipmentManagement from "./admin/EquipmentManagement";
import PositionManagement from "./admin/PositionManagement";
import LayoutManagement from "./admin/LayoutManagement";
import Settings from "./admin/Settings";
import BookingManagement from "./admin/BookingManagement";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Public Route */}
      <Route path="/" element={<UserLayout />} />

      {/* Protected Routes for Admin only */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="positions" element={<PositionManagement />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="rooms/new" element={<RoomForm />} />
          <Route path="rooms/:id" element={<RoomForm />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="layouts" element={<LayoutManagement />} />
          <Route path="equipments" element={<EquipmentManagement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
