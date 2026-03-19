import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Settings, Image, Layers, Users, HelpCircle,
  Camera, Play, Tag, GraduationCap, CalendarCheck, MessageSquare,
  Shield, LogOut, Menu, X, ChevronRight, List
} from 'lucide-react';

const navItems = [
  { to: '/panali', icon: LayoutDashboard, label: 'დეშბორდი', end: true },
  { to: '/panali/settings', icon: Settings, label: 'პარამეტრები' },
  { to: '/panali/hero', icon: Image, label: 'Hero სლაიდები' },
  { to: '/panali/procedures', icon: Layers, label: 'პროცედურები' },
  { to: '/panali/team', icon: Users, label: 'გუნდი' },
  { to: '/panali/faq', icon: HelpCircle, label: 'FAQ' },
  { to: '/panali/results', icon: Camera, label: 'შედეგები' },
  { to: '/panali/reels', icon: Play, label: 'ვიდეოები' },
  { to: '/panali/offers', icon: Tag, label: 'შეთავაზებები' },
  { to: '/panali/courses', icon: GraduationCap, label: 'კურსი / მენტორები' },
  { to: '/panali/bookings', icon: CalendarCheck, label: 'ჯავშნები' },
  { to: '/panali/messages', icon: MessageSquare, label: 'შეტყობინებები' },
  { to: '/panali/menu', icon: List, label: 'მენიუ' },
  { to: '/panali/admins', icon: Shield, label: 'ადმინისტრატორები' },
];

const AdminLayout = () => {
  const { admin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!admin) return <Navigate to="/panali/login" replace />;

  const handleLogout = () => {
    logout();
    navigate('/panali/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center text-white font-serif font-bold text-lg">E</div>
            <span className="text-white font-bold text-lg">Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">
              {admin.username[0].toUpperCase()}
            </div>
            <span className="text-sm text-gray-300 font-medium">{admin.username}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors w-full">
            <LogOut size={16} /> გასვლა
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="ml-auto text-sm text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-1">
            საიტის ნახვა <ChevronRight size={14} />
          </a>
        </header>

        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default AdminLayout;
