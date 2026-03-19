import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { CalendarCheck, MessageSquare, GraduationCap, Layers, Users, Clock } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </div>
    {sub && <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-800">{sub}</p>}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    api('/api/admin/stats').then(setStats).catch(() => {});
    api('/api/admin/bookings').then(data => setRecentBookings(data.slice(0, 5))).catch(() => {});
  }, []);

  if (!stats) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">დეშბორდი</h1>
        <p className="text-gray-500">საიტის მართვის მიმოხილვა</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard icon={CalendarCheck} label="ჯავშნები" value={stats.bookings.total} sub={`${stats.bookings.pending} მოლოდინში`} color="bg-blue-500/10 text-blue-400" />
        <StatCard icon={MessageSquare} label="შეტყობინებები" value={stats.messages.total} sub={`${stats.messages.unread} წაუკითხავი`} color="bg-green-500/10 text-green-400" />
        <StatCard icon={GraduationCap} label="რეგისტრაციები" value={stats.registrations.total} color="bg-pink-500/10 text-pink-400" />
        <StatCard icon={Layers} label="პროცედურები" value={stats.procedures.total} color="bg-purple-500/10 text-purple-400" />
        <StatCard icon={Users} label="გუნდის წევრები" value={stats.team.total} color="bg-orange-500/10 text-orange-400" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">ბოლო ჯავშნები</h2>
          <Clock size={16} className="text-gray-500" />
        </div>
        {recentBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">ჯავშნები არ არის</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase border-b border-gray-800">
                  <th className="text-left px-6 py-3">სახელი</th>
                  <th className="text-left px-6 py-3">ტელეფონი</th>
                  <th className="text-left px-6 py-3">პროცედურა</th>
                  <th className="text-left px-6 py-3">თარიღი</th>
                  <th className="text-left px-6 py-3">სტატუსი</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-6 py-4 text-white text-sm">{b.name}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{b.phone}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{b.procedure_name || '-'}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{b.date || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        b.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                        b.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>{b.status === 'pending' ? 'მოლოდინში' : b.status === 'confirmed' ? 'დადასტურებული' : b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
