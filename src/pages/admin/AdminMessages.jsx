import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Trash2, Mail, MailOpen } from 'lucide-react';

const AdminMessages = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const data = await api('/api/admin/messages');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleRead = async (id) => {
    await api(`/api/admin/messages/${id}/read`, { method: 'PUT' });
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm('წაშალოთ?')) return;
    await api(`/api/admin/messages/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">შეტყობინებები</h1>
        <p className="text-gray-500">{items.filter(m => !m.is_read).length} წაუკითხავი / {items.length} სულ</p>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center text-gray-500">შეტყობინებები არ არის</div>
        ) : items.map(m => (
          <div key={m.id} className={`bg-gray-900 border rounded-2xl p-5 ${m.is_read ? 'border-gray-800' : 'border-purple-500/30 bg-purple-500/5'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {!m.is_read && <span className="w-2 h-2 bg-purple-500 rounded-full" />}
                  <span className="text-white font-medium">{m.name}</span>
                  <span className="text-gray-500 text-sm">{m.phone}</span>
                  {m.email && <span className="text-gray-600 text-sm">{m.email}</span>}
                </div>
                <p className="text-gray-400 text-sm">{m.message}</p>
                <p className="text-gray-600 text-xs mt-2">{new Date(m.created_at).toLocaleString('ka-GE')}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {!m.is_read && (
                  <button onClick={() => handleRead(m.id)} className="text-gray-500 hover:text-green-400 p-1" title="წაკითხულად მონიშვნა"><MailOpen size={16} /></button>
                )}
                <button onClick={() => handleDelete(m.id)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMessages;
