import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

const emptyProc = { slug: '', category: 'injection', name: '', description: '', image: '', is_popular: false, popular_name: '', popular_description: '', popular_image: '', detail_description: '', benefits: [], steps: [], video_url: '', duration: '', price_from: '' };

const AdminProcedures = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [benefitInput, setBenefitInput] = useState('');
  const [stepInput, setStepInput] = useState('');

  const fetchItems = async () => {
    const data = await api('/api/content/procedures');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    try {
      if (editing.id) {
        await api(`/api/admin/procedures/${editing.id}`, { method: 'PUT', body: editing });
      } else {
        await api('/api/admin/procedures', { method: 'POST', body: editing });
      }
      setEditing(null);
      fetchItems();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('წაშალოთ?')) return;
    await api(`/api/admin/procedures/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  const openEdit = (item) => {
    const benefits = typeof item.benefits === 'string' ? JSON.parse(item.benefits) : (item.benefits || []);
    const steps = typeof item.steps === 'string' ? JSON.parse(item.steps) : (item.steps || []);
    setEditing({ ...item, benefits, steps });
    setBenefitInput('');
    setStepInput('');
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">პროცედურები</h1>
          <p className="text-gray-500">{items.length} პროცედურა</p>
        </div>
        <button onClick={() => { setEditing({ ...emptyProc }); setBenefitInput(''); setStepInput(''); }} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2">
          <Plus size={18} /> დამატება
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 uppercase border-b border-gray-800">
                <th className="text-left px-6 py-3">სურათი</th>
                <th className="text-left px-6 py-3">სახელი</th>
                <th className="text-left px-6 py-3">კატეგორია</th>
                <th className="text-left px-6 py-3">Slug</th>
                <th className="text-left px-6 py-3">პოპულარული</th>
                <th className="text-right px-6 py-3">მოქმედება</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-6 py-3"><div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-800">{item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}</div></td>
                  <td className="px-6 py-3 text-white text-sm font-medium">{item.name}</td>
                  <td className="px-6 py-3 text-gray-400 text-sm">{item.category}</td>
                  <td className="px-6 py-3 text-gray-500 text-xs font-mono">{item.slug}</td>
                  <td className="px-6 py-3">{item.is_popular && <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full">✓</span>}</td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => openEdit(item)} className="text-gray-500 hover:text-purple-400 p-1"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400 p-1 ml-2"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white">{editing.id ? 'რედაქტირება' : 'ახალი პროცედურა'}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Slug *</label>
                  <input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">კატეგორია *</label>
                  <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none">
                    <option value="injection">ინექციური</option>
                    <option value="care">კანის მოვლა</option>
                    <option value="modeling">მოდელირება</option>
                    <option value="laser">ლაზერული</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">სახელი *</label>
                <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">აღწერა</label>
                <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={2} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">ხანგრძლივობა</label>
                  <input value={editing.duration || ''} onChange={e => setEditing({ ...editing, duration: e.target.value })} placeholder="მაგ: 30-60 წუთი" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">ფასი (დან)</label>
                  <input value={editing.price_from || ''} onChange={e => setEditing({ ...editing, price_from: e.target.value })} placeholder="მაგ: 150₾" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                </div>
              </div>

              <ImageUpload label="სურათი" value={editing.image} onChange={url => setEditing({ ...editing, image: url })} />

              <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
                <input type="checkbox" checked={editing.is_popular} onChange={e => setEditing({ ...editing, is_popular: e.target.checked })} className="w-4 h-4 accent-purple-600" />
                <label className="text-sm text-gray-300">პოპულარულ პროცედურებში ჩვენება</label>
              </div>

              {editing.is_popular && (
                <div className="grid grid-cols-1 gap-4 border border-purple-500/20 rounded-xl p-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">პოპულარული სახელი</label>
                    <input value={editing.popular_name || ''} onChange={e => setEditing({ ...editing, popular_name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">პოპულარული აღწერა</label>
                    <input value={editing.popular_description || ''} onChange={e => setEditing({ ...editing, popular_description: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
                  </div>
                  <ImageUpload label="პოპულარული სურათი" value={editing.popular_image || ''} onChange={url => setEditing({ ...editing, popular_image: url })} />
                </div>
              )}

              <div>
                <label className="text-sm text-gray-400 mb-1 block">დეტალური აღწერა</label>
                <textarea value={editing.detail_description || ''} onChange={e => setEditing({ ...editing, detail_description: e.target.value })} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none resize-none" />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">ვიდეო URL</label>
                <input value={editing.video_url || ''} onChange={e => setEditing({ ...editing, video_url: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none" />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">უპირატესობები</label>
                <div className="flex gap-2 mb-2">
                  <input value={benefitInput} onChange={e => setBenefitInput(e.target.value)} placeholder="დამატება..." className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none" onKeyDown={e => { if (e.key === 'Enter' && benefitInput.trim()) { setEditing({ ...editing, benefits: [...editing.benefits, benefitInput.trim()] }); setBenefitInput(''); }}} />
                  <button onClick={() => { if (benefitInput.trim()) { setEditing({ ...editing, benefits: [...editing.benefits, benefitInput.trim()] }); setBenefitInput(''); }}} className="bg-gray-800 text-gray-400 hover:text-white px-3 rounded-lg"><Plus size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editing.benefits.map((b, i) => (
                    <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-lg text-sm flex items-center gap-2">{b}<button onClick={() => setEditing({ ...editing, benefits: editing.benefits.filter((_, j) => j !== i) })} className="text-gray-500 hover:text-red-400"><X size={14} /></button></span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">ეტაპები</label>
                <div className="flex gap-2 mb-2">
                  <input value={stepInput} onChange={e => setStepInput(e.target.value)} placeholder="დამატება..." className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none" onKeyDown={e => { if (e.key === 'Enter' && stepInput.trim()) { setEditing({ ...editing, steps: [...editing.steps, stepInput.trim()] }); setStepInput(''); }}} />
                  <button onClick={() => { if (stepInput.trim()) { setEditing({ ...editing, steps: [...editing.steps, stepInput.trim()] }); setStepInput(''); }}} className="bg-gray-800 text-gray-400 hover:text-white px-3 rounded-lg"><Plus size={16} /></button>
                </div>
                <div className="space-y-1">
                  {editing.steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg text-sm text-gray-300">
                      <span className="text-gray-500 font-mono">{i + 1}.</span>{s}
                      <button onClick={() => setEditing({ ...editing, steps: editing.steps.filter((_, j) => j !== i) })} className="ml-auto text-gray-500 hover:text-red-400"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2.5 text-gray-400 hover:text-white transition-colors">გაუქმება</button>
              <button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2"><Save size={18} /> შენახვა</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProcedures;
