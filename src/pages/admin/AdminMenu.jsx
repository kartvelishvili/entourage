import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Trash2, Save, Loader2, ChevronUp, ChevronDown, Eye, EyeOff, Sparkles, ExternalLink } from 'lucide-react';

const iconOptions = ['', 'Calendar', 'GraduationCap', 'Home', 'Users', 'Phone', 'Mail', 'Star', 'Heart', 'Camera', 'Play', 'Tag', 'Search', 'Settings', 'Info', 'FileText', 'MapPin', 'Clock', 'Award', 'Gift'];

const AdminMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchItems = async () => {
    const data = await api('/api/admin/nav-items');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    await api('/api/admin/nav-items', {
      method: 'POST',
      body: { label: 'ახალი გვერდი', path: '/new', icon: '', is_visible: true, is_special: false, is_cta: false },
    });
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm('წაშალოთ ეს მენიუს ელემენტი?')) return;
    await api(`/api/admin/nav-items/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  const handleToggleVisible = async (item) => {
    await api(`/api/admin/nav-items/${item.id}`, {
      method: 'PUT',
      body: { ...item, is_visible: !item.is_visible },
    });
    fetchItems();
  };

  const handleToggleSpecial = async (item) => {
    await api(`/api/admin/nav-items/${item.id}`, {
      method: 'PUT',
      body: { ...item, is_special: !item.is_special },
    });
    fetchItems();
  };

  const handleToggleCta = async (item) => {
    await api(`/api/admin/nav-items/${item.id}`, {
      method: 'PUT',
      body: { ...item, is_cta: !item.is_cta },
    });
    fetchItems();
  };

  const handleToggleNewTab = async (item) => {
    await api(`/api/admin/nav-items/${item.id}`, {
      method: 'PUT',
      body: { ...item, open_in_new_tab: !item.open_in_new_tab },
    });
    fetchItems();
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setItems(newItems);
    const orders = newItems.map((item, i) => ({ id: item.id, sort_order: i }));
    await api('/api/admin/nav-items/reorder', { method: 'PUT', body: { orders } });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ label: item.label, path: item.path, icon: item.icon || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (item) => {
    setSaving(true);
    await api(`/api/admin/nav-items/${item.id}`, {
      method: 'PUT',
      body: { ...item, label: editForm.label, path: editForm.path, icon: editForm.icon },
    });
    setEditingId(null);
    setEditForm({});
    await fetchItems();
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">მენიუს მართვა</h1>
        <p className="text-gray-500">ნავიგაციის ელემენტების რედაქტირება, გათიშვა, წაშლა და გადაადგილება</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">მენიუს ელემენტები</h2>
            <p className="text-gray-500 text-sm mt-0.5">{items.length} ელემენტი</p>
          </div>
          <button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 text-sm">
            <Plus size={16} /> ახალი ელემენტი
          </button>
        </div>

        <div className="p-6 space-y-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`border rounded-xl p-4 transition-colors ${
                item.is_visible
                  ? 'bg-gray-800/50 border-gray-700/50'
                  : 'bg-gray-800/20 border-gray-700/30 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Reorder */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => handleMove(i, -1)}
                    disabled={i === 0}
                    className="text-gray-500 hover:text-white disabled:opacity-20 transition-colors p-1 rounded hover:bg-gray-700/50"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <span className="text-gray-600 text-xs font-mono text-center">{i + 1}</span>
                  <button
                    onClick={() => handleMove(i, 1)}
                    disabled={i === items.length - 1}
                    className="text-gray-500 hover:text-white disabled:opacity-20 transition-colors p-1 rounded hover:bg-gray-700/50"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {editingId === item.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">სახელი</label>
                          <input
                            type="text"
                            value={editForm.label}
                            onChange={e => setEditForm(f => ({ ...f, label: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">ბმული (path)</label>
                          <input
                            type="text"
                            value={editForm.path}
                            onChange={e => setEditForm(f => ({ ...f, path: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">აიქონი</label>
                          <select
                            value={editForm.icon}
                            onChange={e => setEditForm(f => ({ ...f, icon: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                          >
                            {iconOptions.map(ic => (
                              <option key={ic} value={ic}>{ic || '— არ არის —'}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(item)}
                          disabled={saving}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                          შენახვა
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-1.5 rounded-lg text-sm font-medium"
                        >
                          გაუქმება
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startEdit(item)}
                        className="text-left hover:text-purple-400 transition-colors group"
                      >
                        <span className="text-white font-medium text-sm group-hover:text-purple-400">{item.label}</span>
                        <span className="text-gray-500 text-xs ml-2">{item.path}</span>
                        {item.icon && <span className="text-gray-600 text-xs ml-2">🔹 {item.icon}</span>}
                      </button>

                      {/* Status badges */}
                      <div className="flex items-center gap-1.5 ml-auto mr-2 flex-shrink-0">
                        {item.is_special && (
                          <span className="bg-pink-500/20 text-pink-400 text-xs px-2 py-0.5 rounded-full">სპეციალური</span>
                        )}
                        {item.is_cta && (
                          <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded-full">CTA ღილაკი</span>
                        )}
                        {item.open_in_new_tab && (
                          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">ახალ ტაბში</span>
                        )}
                        {!item.is_visible && (
                          <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full">დამალული</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {editingId !== item.id && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggleVisible(item)}
                      title={item.is_visible ? 'დამალვა' : 'ჩვენება'}
                      className={`p-2 rounded-lg transition-colors ${
                        item.is_visible ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-600 hover:bg-gray-700/50'
                      }`}
                    >
                      {item.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => handleToggleSpecial(item)}
                      title={item.is_special ? 'სპეციალურის გათიშვა' : 'სპეციალურის ჩართვა'}
                      className={`p-2 rounded-lg transition-colors ${
                        item.is_special ? 'text-pink-400 hover:bg-pink-500/10' : 'text-gray-600 hover:bg-gray-700/50'
                      }`}
                    >
                      <Sparkles size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleCta(item)}
                      title={item.is_cta ? 'CTA ღილაკის გათიშვა' : 'CTA ღილაკად გადაქცევა'}
                      className={`p-2 rounded-lg transition-colors text-xs font-bold ${
                        item.is_cta ? 'text-purple-400 hover:bg-purple-500/10' : 'text-gray-600 hover:bg-gray-700/50'
                      }`}
                    >
                      CTA
                    </button>
                    <button
                      onClick={() => handleToggleNewTab(item)}
                      title={item.open_in_new_tab ? 'იმავე ტაბში გახსნა' : 'ახალ ტაბში გახსნა'}
                      className={`p-2 rounded-lg transition-colors ${
                        item.open_in_new_tab ? 'text-blue-400 hover:bg-blue-500/10' : 'text-gray-600 hover:bg-gray-700/50'
                      }`}
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-700/50 transition-colors text-xs font-medium"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              მენიუ ცარიელია. დაამატეთ ახალი ელემენტი.
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-400 mb-3">ლეგენდა</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <Eye size={14} className="text-green-400" /> <span>ხილვადობა — აჩვენეთ/დამალეთ მენიუს ელემენტი</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Sparkles size={14} className="text-pink-400" /> <span>სპეციალური — გამორჩეული სტილი (მაგ. ვარდისფერი)</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-purple-400 font-bold text-xs">CTA</span> <span>CTA ღილაკი — გამოსარჩევი ღილაკის სტილი</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <ExternalLink size={14} className="text-blue-400" /> <span>ახალ ტაბში — ბმულის ახალ ფანჯარაში გახსნა</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
