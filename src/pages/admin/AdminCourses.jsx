import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

const AdminCourses = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchMentors = async () => {
    const data = await api('/api/content/mentors');
    setMentors(data);
    setLoading(false);
  };

  useEffect(() => { fetchMentors(); }, []);

  const handleSave = async () => {
    try {
      if (editing.id) {
        await api(`/api/admin/mentors/${editing.id}`, { method: 'PUT', body: editing });
      } else {
        await api('/api/admin/mentors', { method: 'POST', body: editing });
      }
      setEditing(null);
      fetchMentors();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('წაშალოთ?')) return;
    await api(`/api/admin/mentors/${id}`, { method: 'DELETE' });
    fetchMentors();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">კურსი / მენტორები</h1>
        <p className="text-gray-500">კურსის ტექსტები იცვლება პარამეტრებიდან, აქ მენტორების მართვაა</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">მენტორები</h2>
          <button onClick={() => setEditing({ name: '', role: '', image: '' })} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 text-sm">
            <Plus size={16} /> დამატება
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map(m => (
            <div key={m.id} className="flex items-center gap-4 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-800 shrink-0">
                {m.image && <img src={m.image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm truncate">{m.name}</h3>
                <p className="text-purple-400 text-xs">{m.role}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing({ ...m })} className="text-gray-500 hover:text-purple-400 p-1"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(m.id)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white">{editing.id ? 'რედაქტირება' : 'ახალი მენტორი'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: 'name', label: 'სახელი' },
                { key: 'role', label: 'როლი' },
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

export default AdminCourses;
