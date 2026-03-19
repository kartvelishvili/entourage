import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';

const AdminBookings = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const data = await api('/api/admin/bookings');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleStatus = async (id, status) => {
    await api(`/api/admin/bookings/${id}`, { method: 'PUT', body: { status } });
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm('წაშალოთ?')) return;
    await api(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">ჯავშნები</h1>
        <p className="text-gray-500">{items.length} ჯავშანი სულ</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">ჯავშნები არ არის</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase border-b border-gray-800">
                  <th className="text-left px-6 py-3">სახელი</th>
                  <th className="text-left px-6 py-3">ტელეფონი</th>
                  <th className="text-left px-6 py-3">ელ.ფოსტა</th>
                  <th className="text-left px-6 py-3">პროცედურა</th>
                  <th className="text-left px-6 py-3">ექიმი</th>
                  <th className="text-left px-6 py-3">თარიღი</th>
                  <th className="text-left px-6 py-3">სტატუსი</th>
                  <th className="text-right px-6 py-3">მოქმედება</th>
                </tr>
              </thead>
              <tbody>
                {items.map(b => (
                  <tr key={b.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="px-6 py-4 text-white text-sm">{b.name}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{b.phone}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{b.email || '-'}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{b.procedure_name || '-'}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{b.doctor || '-'}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{b.date || '-'} {b.time || ''}</td>
                    <td className="px-6 py-4">
                      <select
                        value={b.status}
                        onChange={e => handleStatus(b.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-lg font-medium outline-none cursor-pointer ${
                          b.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                          b.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                          b.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                          'bg-gray-500/10 text-gray-400'
                        }`}
                      >
                        <option value="pending">მოლოდინში</option>
                        <option value="confirmed">დადასტურებული</option>
                        <option value="cancelled">გაუქმებული</option>
                        <option value="completed">დასრულებული</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(b.id)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 size={16} /></button>
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

export default AdminBookings;
