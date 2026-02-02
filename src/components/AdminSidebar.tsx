import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar, NavItem } from "./Sidebar";
import { Home, Users, Calendar, Settings, LogOut, Monitor, Box, Layout, Briefcase } from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <Sidebar
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="ระบบจัดการห้องประชุม"
      footer={
        <button
          onClick={() => navigate("/")}
          className={`w-full flex items-center ${isOpen ? 'justify-start px-4' : 'justify-center'} py-2.5 text-red-200 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors`}
        >
          <LogOut size={20} />
          {isOpen && <span className="ml-3 font-medium">ออกจากระบบ</span>}
        </button>
      }
    >
      <NavItem 
        icon={<Home size={20} />} 
        label="หน้าหลัก" 
        isActive={location.pathname === '/admin'} 
        isOpen={isOpen}
        onClick={() => handleNavigate('/admin')}
      />

      <div className={`px-4 py-2 text-[10px] font-bold text-indigo-300 uppercase tracking-widest ${!isOpen && 'hidden'}`}>
        จัดการข้อมูลพื้นฐาน
      </div>
      
      <NavItem 
        icon={<Users size={20} />} 
        label="จัดการผู้ใช้" 
        isActive={location.pathname === '/admin/users'} 
        isOpen={isOpen}
        onClick={() => handleNavigate('/admin/users')}
      />
      <NavItem 
        icon={<Briefcase size={20} />} 
        label="จัดการตำแหน่ง/แผนก" 
        isActive={location.pathname === '/admin/positions'} 
        isOpen={isOpen}
        onClick={() => handleNavigate('/admin/positions')}
      />
      <NavItem 
        icon={<Monitor size={20} />} 
        label="จัดการห้องประชุม" 
        isActive={location.pathname === '/admin/rooms'} 
        isOpen={isOpen}
        onClick={() => handleNavigate('/admin/rooms')}
      />
      <NavItem 
        icon={<Layout size={20} />} 
        label="รูปแบบการจัดห้อง" 
        isActive={location.pathname === '/admin/layouts'} 
        isOpen={isOpen}
        onClick={() => handleNavigate('/admin/layouts')}
      />
      <NavItem 
        icon={<Box size={20} />} 
        label="จัดการอุปกรณ์" 
        isActive={location.pathname === '/admin/equipments'} 
        isOpen={isOpen}
        onClick={() => handleNavigate('/admin/equipments')}
      />

      <div className={`px-4 py-2 text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-2 ${!isOpen && 'hidden'}`}>
        การจองและตั้งค่า
      </div>

      <NavItem 
        icon={<Calendar size={20} />} 
        label="จัดการการจอง" 
        isActive={location.pathname === '/admin/bookings'} 
        isOpen={isOpen}
        onClick={() => handleNavigate('/admin/bookings')}
      />
      <NavItem 
        icon={<Settings size={20} />} 
        label="ตั้งค่าระบบ" 
        isActive={location.pathname === '/admin/settings'} 
        isOpen={isOpen}
        onClick={() => handleNavigate('/admin/settings')}
      />
    </Sidebar>
  );
}
