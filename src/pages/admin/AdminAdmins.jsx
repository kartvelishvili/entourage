import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Trash2, X, Save, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminAdmins = () => {
  const { admin: currentAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const fetchItems = async () => {
    const data = await api('/api/admin/admins');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    setError('');
    try {
      await api('/api/admin/admins', { method: 'POST', body: newAdmin });
      setNewAdmin({ username: '', password: '' });
      setShowAdd(false);
      fetchItems();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('წაშალოთ ეს ადმინისტრატორი?')) return;
    try {
      await api(`/api/admin/admins/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">ადმინისტრატორები</h1>
          <p className="text-gray-500">{items.length} ადმინისტრატორი</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2">
          <Plus size={18} /> ახალი ადმინი
        </button>
      </div>

      <div className="space-y-3">
        {items.map(a => (
          <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400">
                <Shield size={20} />
              </div>
              <div>
                <span className="text-white font-medium">{a.username}</span>
                {a.id === currentAdmin.id && <span className="text-xs text-purple-400 ml-2">(თქვენ)</span>}
                <p className="text-gray-600 text-xs mt-0.5">{new Date(a.created_at).toLocaleDateString('ka-GE')}</p>
              </div>
            </div>
            {a.id !== currentAdmin.id && (
              <button onClick={() => handleDelete(a.id)} className="text-gray-500 hover:text-red-400 p-2"><Trash2 size={18} /></button>
            )}
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white">ახალი ადმინისტრატორი</h2>
              <button onClick={() => { setShowAdd(false); setError(''); }} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm">{error}</div>}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">მომხმარებელი</label>
                <input value={newAdmin.username} onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">პაროლი (მინ. 6 სიმბოლო)</label>
                <input type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
              <button onClick={() => { setShowAdd(false); setError(''); }} className="px-4 py-2.5 text-gray-400 hover:text-white">გაუქმება</button>
              <button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2"><Save size={18} /> შექმნა</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdmins;
