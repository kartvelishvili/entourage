import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Trash2, Save, Loader2, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

const heroTextFields = [
  { key: 'hero.badge', label: 'ბეჯი' },
  { key: 'hero.title_line1', label: 'სათაური ხაზი 1' },
  { key: 'hero.title_line2', label: 'სათაური ხაზი 2' },
  { key: 'hero.subtitle', label: 'ქვესათაური', type: 'textarea' },
  { key: 'hero.cta_primary', label: 'ძირითადი ღილაკი' },
  { key: 'hero.cta_secondary', label: 'მეორადი ღილაკი' },
];

const AdminHero = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchData = async () => {
    const [slidesData, settingsData] = await Promise.all([
      api('/api/content/hero-slides'),
      api('/api/content/settings'),
    ]);
    setSlides(slidesData);
    setSettings(settingsData);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddSlide = async () => {
    await api('/api/admin/hero-slides', { method: 'POST', body: { image: '' } });
    fetchData();
  };

  const handleUpdateSlide = async (id, image) => {
    await api(`/api/admin/hero-slides/${id}`, { method: 'PUT', body: { image } });
  };

  const handleDeleteSlide = async (id) => {
    if (!confirm('წაშალოთ ეს სლაიდი?')) return;
    await api(`/api/admin/hero-slides/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleMoveSlide = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    const newSlides = [...slides];
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    setSlides(newSlides);
    const orders = newSlides.map((s, i) => ({ id: s.id, sort_order: i }));
    await api('/api/admin/hero-slides/reorder', { method: 'PUT', body: { orders } });
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const heroSettings = {};
      heroTextFields.forEach(f => { heroSettings[f.key] = settings[f.key] || ''; });
      await api('/api/admin/settings', { method: 'PUT', body: heroSettings });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { alert(err.message); }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Hero სექცია</h1>
        <p className="text-gray-500">მთავარი გვერდის სლაიდშოუ და ტექსტები</p>
      </div>

      {/* Hero Text Settings */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">ტექსტები</h2>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium text-sm transition-colors ${
              saved ? 'bg-green-600 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
            } disabled:opacity-50`}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saved ? 'შენახულია ✓' : 'შენახვა'}
          </button>
        </div>
        <div className="p-6 space-y-5">
          {heroTextFields.map(field => (
            <div key={field.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <label className="text-sm text-gray-400 pt-2.5 font-medium">
                {field.label}
                <span className="text-gray-600 block text-xs mt-0.5">{field.key}</span>
              </label>
              <div className="md:col-span-2">
                {field.type === 'textarea' ? (
                  <textarea
                    value={settings[field.key] || ''}
                    onChange={e => handleSettingChange(field.key, e.target.value)}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none transition-colors resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={settings[field.key] || ''}
                    onChange={e => handleSettingChange(field.key, e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none transition-colors"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Slides */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">სლაიდები</h2>
            <p className="text-gray-500 text-sm mt-0.5">{slides.length} სლაიდი — გადაათრიეთ ზემოთ/ქვემოთ თანმიმდევრობის შესაცვლელად</p>
          </div>
          <button onClick={handleAddSlide} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 text-sm">
            <Plus size={16} /> ახალი სლაიდი
          </button>
        </div>

        <div className="p-6 space-y-4">
          {slides.map((slide, i) => (
            <div key={slide.id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="flex items-start gap-4">
                {/* Reorder buttons */}
                <div className="flex flex-col gap-1 pt-1">
                  <button
                    onClick={() => handleMoveSlide(i, -1)}
                    disabled={i === 0}
                    className="text-gray-500 hover:text-white disabled:opacity-20 disabled:hover:text-gray-500 transition-colors p-1 rounded-lg hover:bg-gray-700/50"
                  >
                    <ChevronUp size={18} />
                  </button>
                  <span className="text-gray-600 text-xs font-mono text-center">{i + 1}</span>
                  <button
                    onClick={() => handleMoveSlide(i, 1)}
                    disabled={i === slides.length - 1}
                    className="text-gray-500 hover:text-white disabled:opacity-20 disabled:hover:text-gray-500 transition-colors p-1 rounded-lg hover:bg-gray-700/50"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>

                {/* Preview */}
                <div className="w-40 h-24 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                  {slide.image ? (
                    <img src={slide.image} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">ატვირთეთ სურათი</div>
                  )}
                </div>

                {/* Upload */}
                <div className="flex-1 min-w-0">
                  <ImageUpload
                    value={slide.image}
                    onChange={url => {
                      const updated = slides.map(s => s.id === slide.id ? { ...s, image: url } : s);
                      setSlides(updated);
                      handleUpdateSlide(slide.id, url);
                    }}
                  />
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {slides.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">სლაიდები არ არის</p>
              <button onClick={handleAddSlide} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm">
                <Plus size={16} className="inline mr-2" />პირველი სლაიდის დამატება
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHero;
