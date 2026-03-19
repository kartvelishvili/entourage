import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

const emptyMember = { slug: '', name: '', role: '', specialization: '', image: '' };

const AdminTeam = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchItems = async () => {
    const data = await api('/api/content/team');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    try {
      if (editing.id) {
        await api(`/api/admin/team/${editing.id}`, { method: 'PUT', body: editing });
      } else {
        await api('/api/admin/team', { method: 'POST', body: editing });
      }
      setEditing(null);
      fetchItems();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('წაშალოთ?')) return;
    await api(`/api/admin/team/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">გუნდი</h1>
          <p className="text-gray-500">{items.length} წევრი</p>
        </div>
        <button onClick={() => setEditing({ ...emptyMember })} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2">
          <Plus size={18} /> დამატება
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 mb-4">
              {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
            </div>
            <h3 className="text-white font-bold">{item.name}</h3>
            <p className="text-purple-400 text-sm">{item.role}</p>
            <p className="text-gray-500 text-xs mt-1">{item.specialization}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setEditing({ ...item })} className="text-gray-500 hover:text-purple-400 p-1"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white">{editing.id ? 'რედაქტირება' : 'ახალი წევრი'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: 'slug', label: 'Slug' },
                { key: 'name', label: 'სახელი' },
                { key: 'role', label: 'როლი' },
                { key: 'specialization', label: 'სპეციალიზაცია' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm text-gray-400 mb-1 block">{f.label}</label>
                  <input value={editing[f.key] || ''} onChange={e => setEditing({ ...editing, [f.key]: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                </div>
              ))}
              <ImageUpload label="სურათი" value={editing.image || ''} onChange={url => setEditing({ ...editing, image: url })} />
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2.5 text-gray-400 hover:text-white">გაუქმება</button>
              <button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2"><Save size={18} /> შენახვა</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeam;
