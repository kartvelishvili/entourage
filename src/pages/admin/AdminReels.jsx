import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X, Save, Facebook } from 'lucide-react';

const AdminReels = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchItems = async () => {
    const data = await api('/api/content/reels');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    try {
      if (editing.id) {
        await api(`/api/admin/reels/${editing.id}`, { method: 'PUT', body: editing });
      } else {
        await api('/api/admin/reels', { method: 'POST', body: editing });
      }
      setEditing(null);
      fetchItems();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('წაშალოთ?')) return;
    await api(`/api/admin/reels/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  const getFbEmbedUrl = (url) => {
    if (!url) return '';
    const normalized = url.replace(/\/?$/, '/');
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(normalized)}&width=267&height=476&show_text=false&t=0`;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">ფეისბუქ ვიდეოები / Reels</h1>
          <p className="text-gray-500">{items.length} ვიდეო — ჩასვით Facebook ვიდეოს ლინკი</p>
        </div>
        <button onClick={() => setEditing({ title: '', description: '', thumbnail: '', video_url: '' })} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2">
          <Plus size={18} /> დამატება
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="aspect-[9/12] bg-gray-800">
              {item.video_url ? (
                <iframe
                  src={getFbEmbedUrl(item.video_url)}
                  className="w-full h-full"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                  title={item.title || 'Preview'}
                />
              ) : item.thumbnail ? (
                <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="p-4">
              <h3 className="text-white font-medium text-sm">{item.title || 'ვიდეო'}</h3>
              <p className="text-gray-500 text-xs mt-1 truncate">{item.video_url}</p>
              <div className="flex gap-2 mt-3">
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
              <h2 className="text-lg font-bold text-white">{editing.id ? 'რედაქტირება' : 'ახალი ვიდეო'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block flex items-center gap-2">
                  <Facebook size={14} className="text-blue-500" />
                  Facebook ვიდეოს ლინკი *
                </label>
                <input
                  value={editing.video_url || ''}
                  onChange={e => setEditing({ ...editing, video_url: e.target.value })}
                  placeholder="https://www.facebook.com/reel/..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none"
                />
                <p className="text-xs text-gray-600 mt-1">მაგალითად: https://www.facebook.com/reel/123456789 ან https://www.facebook.com/watch?v=123456789</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">სათაური (არასავალდებულო)</label>
                <input value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">აღწერა (არასავალდებულო)</label>
                <input value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>

              {editing.video_url && (
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">პრევიუ</label>
                  <div className="aspect-[9/12] rounded-xl overflow-hidden bg-gray-800 max-h-64">
                    <iframe
                      src={getFbEmbedUrl(editing.video_url)}
                      className="w-full h-full"
                      style={{ border: 'none', overflow: 'hidden' }}
                      scrolling="no"
                      frameBorder="0"
                      allowFullScreen
                      title="Preview"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2.5 text-gray-400 hover:text-white">გაუქმება</button>
              <button onClick={handleSave} disabled={!editing.video_url} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"><Save size={18} /> შენახვა</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReels;
