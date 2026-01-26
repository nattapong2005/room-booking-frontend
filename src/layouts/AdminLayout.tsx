import { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === '/admin/users') return 'จัดการผู้ใช้';
    if (location.pathname === '/admin/calendar') return 'ปฏิทินการจอง';
    if (location.pathname === '/admin/settings') return 'ตั้งค่าระบบ';
    return 'แผงควบคุมผู้ดูแลระบบ';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex relative">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-6 sticky top-0 z-20">
          <button 
            onClick={() => setSidebarOpen(true)}
            className={`mr-4 p-2 hover:bg-gray-100 rounded-md md:hidden ${isSidebarOpen ? 'hidden' : 'block'}`}
          >
            <Menu size={20} />
          </button>
          
          <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate">{getPageTitle()}</h1>
          
          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs md:text-sm">
                 AD
               </div>
               <span className="hidden sm:block text-sm font-medium text-gray-700">Admin User</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}