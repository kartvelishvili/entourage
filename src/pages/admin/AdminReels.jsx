import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X, Save, Code, Play, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';

// Sanitize: extract full <iframe> tag only (security)
const sanitizeIframe = (input) => {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/<iframe[^>]*src=["'][^"']+["'][^>]*><\/iframe>/i);
  return match ? match[0] : '';
};

const hasIframe = (input) => {
  if (!input) return false;
  return /<iframe[^>]*src=["'][^"']+["'][^>]*>/i.test(input.trim());
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
      const iframeHtml = sanitizeIframe(embedInput);
      if (!iframeHtml) { alert('გთხოვთ ჩასვათ სწორი <iframe> ემბედ კოდი'); return; }
      const dataToSave = { ...editing, video_url: iframeHtml };
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

  const moveItem = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const a = items[index];
    const b = items[newIndex];
    await api('/api/admin/reels/reorder', {
      method: 'PUT',
      body: { items: [{ id: a.id, sort_order: b.sort_order }, { id: b.id, sort_order: a.sort_order }] }
    });
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
          <p className="text-gray-500">{items.length} ვიდეო · მთავარ გვერდზე ჩანს ყველა, გადაალაგეთ ისრებით</p>
        </div>
        <button onClick={openNew} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2">
          <Plus size={18} /> დამატება
        </button>
      </div>

      <div className="bg-gray-800/50 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-blue-400 text-sm font-medium mb-2">როგორ დაამატოთ ვიდეო:</h3>
        <ol className="text-gray-400 text-xs space-y-1 list-decimal list-inside">
          <li>Facebook-ზე გახსენით ვიდეო/რილსი</li>
          <li>დააჭირეთ <span className="text-white">... (3 წერტილი) → Embed</span></li>
          <li>დააკოპირეთ მთლიანი <code className="text-purple-400">&lt;iframe ...&gt;&lt;/iframe&gt;</code> კოდი</li>
          <li>ჩასვით ქვემოთ "ემბედ კოდი" ველში და შეინახეთ</li>
        </ol>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex">
            {/* Reorder controls */}
            <div className="flex flex-col items-center justify-center px-3 border-r border-gray-800 gap-1 bg-gray-800/30">
              <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="text-gray-500 hover:text-purple-400 disabled:opacity-20 disabled:hover:text-gray-500 p-1"><ChevronUp size={18} /></button>
              <span className="text-gray-600 text-xs font-mono">{index + 1}</span>
              <button onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} className="text-gray-500 hover:text-purple-400 disabled:opacity-20 disabled:hover:text-gray-500 p-1"><ChevronDown size={18} /></button>
            </div>
            {/* Thumbnail */}
            <div className="w-24 h-32 bg-gray-800 shrink-0 [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!border-none [&_iframe]:pointer-events-none">
              {item.video_url ? (
                <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: item.video_url }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600"><Play size={20} /></div>
              )}
            </div>
            {/* Info */}
            <div className="flex-1 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium text-sm">{item.title || 'ვიდეო'}</h3>
                {item.description && <p className="text-gray-500 text-xs mt-1">{item.description}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(item)} className="text-gray-500 hover:text-purple-400 p-2"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400 p-2"><Trash2 size={16} /></button>
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
                  placeholder='Facebook ვიდეოზე დააჭირეთ ... → Embed და ჩასვით <iframe> კოდი აქ'
                  rows={5}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none font-mono resize-none"
                />
                {embedInput && hasIframe(embedInput) && (
                  <p className="text-xs text-green-500 mt-1">✓ iframe კოდი ამოცნობილია!</p>
                )}
                {embedInput && !hasIframe(embedInput) && (
                  <p className="text-xs text-red-400 mt-1">✗ სწორი &lt;iframe&gt; კოდი ვერ მოიძებნა</p>
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

              {hasIframe(embedInput) && (
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">პრევიუ</label>
                  <div
                    className="rounded-xl overflow-hidden bg-gray-800 [&_iframe]:!w-full [&_iframe]:!h-[300px] [&_iframe]:!border-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeIframe(embedInput) }}
                  />
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
              <button onClick={() => { setEditing(null); setEmbedInput(''); }} className="px-4 py-2.5 text-gray-400 hover:text-white">გაუქმება</button>
              <button onClick={handleSave} disabled={!hasIframe(embedInput)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"><Save size={18} /> შენახვა</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReels;
