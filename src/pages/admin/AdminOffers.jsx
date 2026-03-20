import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Save, Loader2, Plus, Pencil, Trash2, X, Copy, Eye, EyeOff } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

const emptyOffer = { badge_text: '', title: '', subtitle: '', description: '', old_price: '', new_price: '', image: '', is_active: true };

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchOffers = () => {
    api('/api/content/offers').then(data => { setOffers(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOffers(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing.id) {
        await api(`/api/admin/offers/${editing.id}`, { method: 'PUT', body: editing });
      } else {
        await api('/api/admin/offers', { method: 'POST', body: editing });
      }
      setEditing(null);
      fetchOffers();
    } catch (err) { alert(err.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('წაშალოთ?')) return;
    await api(`/api/admin/offers/${id}`, { method: 'DELETE' });
    fetchOffers();
  };

  const handleDuplicate = (offer) => {
    const { id, ...rest } = offer;
    setEditing({ ...rest, title: `${rest.title} (ასლი)`, is_active: false });
  };

  const handleToggleActive = async (offer) => {
    await api(`/api/admin/offers/${offer.id}`, { method: 'PUT', body: { ...offer, is_active: !offer.is_active } });
    fetchOffers();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">შეთავაზებები</h1>
          <p className="text-gray-500">{offers.length} შეთავაზება · ბოლო აქტიური გამოჩნდება მთავარ გვერდზე</p>
        </div>
        <button onClick={() => setEditing({ ...emptyOffer })} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2">
          <Plus size={18} /> დამატება
        </button>
      </div>

      <div className="space-y-4">
        {offers.map(offer => (
          <div key={offer.id} className={`bg-gray-900 border rounded-2xl overflow-hidden ${offer.is_active ? 'border-green-500/30' : 'border-gray-800'}`}>
            <div className="flex items-center gap-4 p-5">
              {offer.image && <img src={offer.image} alt="" className="w-20 h-14 rounded-xl object-cover bg-gray-800" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-sm truncate">{offer.title || 'შეთავაზება'}</h3>
                  {offer.is_active && <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">აქტიური</span>}
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{offer.subtitle}</p>
                {(offer.old_price || offer.new_price) && (
                  <p className="text-sm mt-1">
                    {offer.old_price && <span className="text-gray-500 line-through mr-2">{offer.old_price}₾</span>}
                    {offer.new_price && <span className="text-purple-400 font-bold">{offer.new_price}₾</span>}
                  </p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => handleToggleActive(offer)} className="text-gray-500 hover:text-yellow-400 p-2" title={offer.is_active ? 'დამალვა' : 'გააქტიურება'}>
                  {offer.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button onClick={() => handleDuplicate(offer)} className="text-gray-500 hover:text-blue-400 p-2" title="დუბლირება"><Copy size={16} /></button>
                <button onClick={() => setEditing({ ...offer })} className="text-gray-500 hover:text-purple-400 p-2" title="რედაქტირება"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(offer.id)} className="text-gray-500 hover:text-red-400 p-2" title="წაშლა"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 overflow-y-auto py-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white">{editing.id ? 'რედაქტირება' : 'ახალი შეთავაზება'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
                <input type="checkbox" checked={editing.is_active} onChange={e => setEditing({ ...editing, is_active: e.target.checked })} className="w-4 h-4 accent-purple-600" />
                <label className="text-sm text-gray-300">აქტიური (მთავარ გვერდზე ჩვენება)</label>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">ბეჯი</label>
                <input value={editing.badge_text || ''} onChange={e => setEditing({ ...editing, badge_text: e.target.value })} placeholder="მაგ: შეთავაზება" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">სათაური *</label>
                <input value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">ქვესათაური</label>
                <input value={editing.subtitle || ''} onChange={e => setEditing({ ...editing, subtitle: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">აღწერა</label>
                <textarea value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">ძველი ფასი</label>
                  <input value={editing.old_price || ''} onChange={e => setEditing({ ...editing, old_price: e.target.value })} placeholder="მაგ: 500" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">ახალი ფასი</label>
                  <input value={editing.new_price || ''} onChange={e => setEditing({ ...editing, new_price: e.target.value })} placeholder="მაგ: 350" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                </div>
              </div>
              <ImageUpload label="სურათი" value={editing.image || ''} onChange={url => setEditing({ ...editing, image: url })} />
            </div>
            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2.5 text-gray-400 hover:text-white">გაუქმება</button>
              <button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} შენახვა
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOffers;
