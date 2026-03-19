import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Save, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchOffers = () => {
    api('/api/content/offers').then(data => { setOffers(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (id, key, value) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, [key]: value } : o));
  };

  const handleSave = async (offer) => {
    setSaving(true);
    try {
      await api(`/api/admin/offers/${offer.id}`, { method: 'PUT', body: offer });
      fetchOffers();
    } catch (err) { alert(err.message); }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">შეთავაზებები</h1>
        <p className="text-gray-500">მიმდინარე აქცია და შეთავაზება</p>
      </div>

      {offers.map(offer => (
        <div key={offer.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">შეთავაზება #{offer.id}</h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={offer.is_active} onChange={e => handleChange(offer.id, 'is_active', e.target.checked)} className="w-4 h-4 accent-purple-600" />
                <span className={offer.is_active ? 'text-green-400' : 'text-gray-500'}>{offer.is_active ? 'აქტიური' : 'გათიშული'}</span>
              </label>
              <button onClick={() => handleSave(offer)} disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 text-sm disabled:opacity-50">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} შენახვა
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">ბეჯი</label>
                <input value={offer.badge_text || ''} onChange={e => handleChange(offer.id, 'badge_text', e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>
              <ImageUpload label="სურათი" value={offer.image || ''} onChange={url => handleChange(offer.id, 'image', url)} />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">სათაური</label>
              <input value={offer.title || ''} onChange={e => handleChange(offer.id, 'title', e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">ქვესათაური</label>
              <input value={offer.subtitle || ''} onChange={e => handleChange(offer.id, 'subtitle', e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">აღწერა</label>
              <textarea value={offer.description || ''} onChange={e => handleChange(offer.id, 'description', e.target.value)} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">ძველი ფასი</label>
                <input value={offer.old_price || ''} onChange={e => handleChange(offer.id, 'old_price', e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">ახალი ფასი</label>
                <input value={offer.new_price || ''} onChange={e => handleChange(offer.id, 'new_price', e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOffers;
