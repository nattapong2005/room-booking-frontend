import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Sidebar({ isOpen, setIsOpen, title, children, footer }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-20 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'
        } bg-indigo-900 text-white transition-all duration-300 flex flex-col fixed h-full left-0 top-0 z-30 shadow-xl`}
      >
        <div className="p-4 flex items-center justify-between border-b border-indigo-800 h-16">
          {(isOpen || !isOpen) && (
            <span className={`font-bold text-lg truncate ${!isOpen && 'md:hidden'}`}>
              {isOpen ? title : title.substring(0, 2).toUpperCase()}
            </span>
          )}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-indigo-800 rounded-md transition-colors"
          >
            {isOpen ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight className="hidden md:block" size={20} />
            )}
          </button>
        </div>

        <nav className={`flex-1 py-2 px-3 space-y-2 overflow-y-auto overflow-x-hidden ${!isOpen ? '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' : ''}`}>
          {children}
        </nav>

        {footer && (
          <div className="p-4 border-t border-indigo-800">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}

interface NavItemProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
}

export function NavItem({ icon, label, isActive, isOpen, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center ${isOpen ? 'justify-start px-4' : 'justify-center'} py-3 rounded-lg transition-all duration-200 group relative
      ${isActive 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
      }`}
    >
      <span className={`${isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'}`}>
        {icon}
      </span>
      {isOpen && (
        <span className="ml-3 font-medium whitespace-nowrap overflow-hidden transition-all duration-300">
          {label}
        </span>
      )}
      {!isOpen && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </button>
  );
}
