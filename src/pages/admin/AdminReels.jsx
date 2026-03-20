import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X, Save, Code, Play } from 'lucide-react';

// Extract iframe src from embed code, or return as-is if it's already a URL
const extractSrc = (input) => {
  if (!input) return '';
  const trimmed = input.trim();
  // If it's already a URL (starts with http), return as-is
  if (trimmed.startsWith('http')) return trimmed;
  // Try to extract src from iframe embed code
  const match = trimmed.match(/src=["']([^"']+)["']/);
  return match ? match[1] : trimmed;
};

const AdminReels = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [embedInput, setEmbedInput] = useState('');

  const fetchItems = async () => {
    const data = await api('/api/content/reels');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    try {
      // Extract src from embed code before saving
      const dataToSave = { ...editing, video_url: extractSrc(embedInput || editing.video_url) };
      if (editing.id) {
        await api(`/api/admin/reels/${editing.id}`, { method: 'PUT', body: dataToSave });
      } else {
        await api('/api/admin/reels', { method: 'POST', body: dataToSave });
      }
      setEditing(null);
      setEmbedInput('');
      fetchItems();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('წაშალოთ?')) return;
    await api(`/api/admin/reels/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  const openEdit = (item) => {
    setEditing({ ...item });
    setEmbedInput(item?.video_url || '');
  };

  const openNew = () => {
    setEditing({ title: '', description: '', thumbnail: '', video_url: '' });
    setEmbedInput('');
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">ვიდეოები / Reels</h1>
          <p className="text-gray-500">{items.length} ვიდეო</p>
        </div>
        <button onClick={openNew} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2">
          <Plus size={18} /> დამატება
        </button>
      </div>

      <div className="bg-gray-800/50 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-blue-400 text-sm font-medium mb-2">როგორ დაამატოთ ვიდეო:</h3>
        <ol className="text-gray-400 text-xs space-y-1 list-decimal list-inside">
          <li>Facebook-ზე გახსენით ვიდეო/რილსი და დააჭირეთ <span className="text-white">... → Embed</span></li>
          <li>დააკოპირეთ მთლიანი <code className="text-purple-400">&lt;iframe ...&gt;</code> კოდი</li>
          <li>ჩასვით ქვემოთ "ემბედ კოდი" ველში</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="aspect-[9/12] bg-gray-800">
              {item.video_url ? (
                <iframe
                  src={item.video_url}
                  className="w-full h-full"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                  title={item.title || 'Preview'}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <Play size={40} />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-white font-medium text-sm">{item.title || 'ვიდეო'}</h3>
              <p className="text-gray-500 text-xs mt-1 truncate">{item.video_url?.substring(0, 50)}...</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(item)} className="text-gray-500 hover:text-purple-400 p-1"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 overflow-y-auto py-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white">{editing.id ? 'რედაქტირება' : 'ახალი ვიდეო'}</h2>
              <button onClick={() => { setEditing(null); setEmbedInput(''); }} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                  <Code size={14} className="text-purple-400" />
                  ემბედ კოდი *
                </label>
                <textarea
                  value={embedInput}
                  onChange={e => setEmbedInput(e.target.value)}
                  placeholder='<iframe src="https://www.facebook.com/plugins/video.php?..." ...></iframe>'
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none font-mono resize-none"
                />
                <p className="text-xs text-gray-600 mt-1">Facebook ვიდეოზე დააჭირეთ ... → Embed → დააკოპირეთ iframe კოდი და ჩასვით აქ</p>
                {embedInput && extractSrc(embedInput) && (
                  <p className="text-xs text-green-500 mt-1">✓ URL ამოღებულია: {extractSrc(embedInput).substring(0, 70)}...</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">სათაური (არასავალდებულო)</label>
                <input value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">აღწერა (არასავალდებულო)</label>
                <input value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>

              {extractSrc(embedInput) && (
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">პრევიუ</label>
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-800">
                    <iframe
                      src={extractSrc(embedInput)}
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
              <button onClick={() => { setEditing(null); setEmbedInput(''); }} className="px-4 py-2.5 text-gray-400 hover:text-white">გაუქმება</button>
              <button onClick={handleSave} disabled={!extractSrc(embedInput)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"><Save size={18} /> შენახვა</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReels;
