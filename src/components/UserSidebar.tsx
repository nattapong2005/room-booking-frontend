import { useNavigate } from "react-router-dom";
import { Sidebar, NavItem } from "./Sidebar";
import { Search, PlusCircle, History, Edit, UserCog } from "lucide-react";

interface UserSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab: number;
  setActiveTab: (tabIndex: number) => void;
}

export default function UserSidebar({ isOpen, setIsOpen, activeTab, setActiveTab }: UserSidebarProps) {
  const navigate = useNavigate();

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <Sidebar
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="ระบบจองห้องประชุม"
      footer={
        <button
          onClick={() => navigate("/admin")}
          className={`w-full flex items-center ${isOpen ? 'justify-start px-4' : 'justify-center'} py-2.5 text-indigo-200 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors`}
        >
          <UserCog size={20} />
          {isOpen && <span className="ml-3 font-medium">เข้าสู่ระบบเจ้าหน้าที่</span>}
        </button>
      }
    >
      <NavItem 
        icon={<Search size={20} />} 
        label="ตรวจสอบสถานะ" 
        isActive={activeTab === 0} 
        isOpen={isOpen}
        onClick={() => handleTabChange(0)}
      />
      <NavItem 
        icon={<PlusCircle size={20} />} 
        label="จองห้องประชุม" 
        isActive={activeTab === 1} 
        isOpen={isOpen}
        onClick={() => handleTabChange(1)}
      />
      <NavItem 
        icon={<History size={20} />} 
        label="ประวัติการจอง" 
        isActive={activeTab === 2} 
        isOpen={isOpen}
        onClick={() => handleTabChange(2)}
      />
      <NavItem 
        icon={<Edit size={20} />} 
        label="แก้ไข/ยกเลิก" 
        isActive={activeTab === 3} 
        isOpen={isOpen}
        onClick={() => handleTabChange(3)}
      />
    </Sidebar>
  );
}
