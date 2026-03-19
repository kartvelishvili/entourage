import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

const AdminFAQ = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchItems = async () => {
    const data = await api('/api/content/faqs');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    try {
      if (editing.id) {
        await api(`/api/admin/faqs/${editing.id}`, { method: 'PUT', body: editing });
      } else {
        await api('/api/admin/faqs', { method: 'POST', body: editing });
      }
      setEditing(null);
      fetchItems();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('წაშალოთ?')) return;
    await api(`/api/admin/faqs/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">ხშირად დასმული კითხვები</h1>
          <p className="text-gray-500">{items.length} კითხვა</p>
        </div>
        <button onClick={() => setEditing({ question: '', answer: '' })} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2">
          <Plus size={18} /> დამატება
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-white font-medium mb-2">{item.question}</p>
                <p className="text-gray-400 text-sm">{item.answer}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setEditing({ ...item })} className="text-gray-500 hover:text-purple-400 p-1"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white">{editing.id ? 'რედაქტირება' : 'ახალი კითხვა'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">კითხვა</label>
                <input value={editing.question} onChange={e => setEditing({ ...editing, question: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">პასუხი</label>
                <textarea value={editing.answer} onChange={e => setEditing({ ...editing, answer: e.target.value })} rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none resize-none" />
              </div>
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

export default AdminFAQ;
