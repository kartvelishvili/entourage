import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Save, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

const settingsGroups = [
  {
    title: 'მცურავი ღილაკი',
    keys: [
      { key: 'sticky_button.enabled', label: 'ჩართული', type: 'toggle' },
      { key: 'sticky_button.link', label: 'ლინკი (მაგ: /contact)' },
    ],
  },
  {
    title: 'ზოგადი',
    keys: [
      { key: 'site.title', label: 'საიტის სახელი' },
      { key: 'site.tagline', label: 'ტეგლაინი' },
      { key: 'site.meta_title', label: 'Meta Title' },
      { key: 'site.meta_description', label: 'Meta Description', type: 'textarea' },
      { key: 'site.logo', label: 'საიტის ლოგო', type: 'image' },
    ],
  },
  {
    title: 'ფუტერი',
    keys: [
      { key: 'footer.tagline', label: 'ტეგლაინი (ლოგოს ქვეშ)', type: 'textarea' },
      { key: 'footer.copyright', label: 'Copyright ტექსტი' },
      { key: 'footer.facebook_url', label: 'Facebook URL' },
      { key: 'footer.instagram_url', label: 'Instagram URL' },
      { key: 'footer.tiktok_url', label: 'TikTok URL' },
      { key: 'footer.creator_logo', label: 'შემქმნელის ლოგო', type: 'image' },
      { key: 'footer.creator_url', label: 'შემქმნელის საიტის ლინკი' },
      { key: 'footer.creator_name', label: 'შემქმნელის სახელი' },
      { key: 'footer.creator_logo_height', label: 'ლოგოს სიმაღლე (px)', type: 'number' },
    ],
  },
  {
    title: 'SEO — მთავარი',
    keys: [
      { key: 'seo.home.title', label: 'Meta Title' },
      { key: 'seo.home.description', label: 'Meta Description', type: 'textarea' },
      { key: 'seo.home.keywords', label: 'Keywords' },
    ],
  },
  {
    title: 'SEO — პროცედურები',
    keys: [
      { key: 'seo.procedures.title', label: 'Meta Title' },
      { key: 'seo.procedures.description', label: 'Meta Description', type: 'textarea' },
      { key: 'seo.procedures.keywords', label: 'Keywords' },
    ],
  },
  {
    title: 'SEO — შედეგები',
    keys: [
      { key: 'seo.results.title', label: 'Meta Title' },
      { key: 'seo.results.description', label: 'Meta Description', type: 'textarea' },
      { key: 'seo.results.keywords', label: 'Keywords' },
    ],
  },
  {
    title: 'SEO — კურსები',
    keys: [
      { key: 'seo.courses.title', label: 'Meta Title' },
      { key: 'seo.courses.description', label: 'Meta Description', type: 'textarea' },
      { key: 'seo.courses.keywords', label: 'Keywords' },
    ],
  },
  {
    title: 'SEO — გუნდი',
    keys: [
      { key: 'seo.team.title', label: 'Meta Title' },
      { key: 'seo.team.description', label: 'Meta Description', type: 'textarea' },
      { key: 'seo.team.keywords', label: 'Keywords' },
    ],
  },
  {
    title: 'SEO — კონტაქტი',
    keys: [
      { key: 'seo.contact.title', label: 'Meta Title' },
      { key: 'seo.contact.description', label: 'Meta Description', type: 'textarea' },
      { key: 'seo.contact.keywords', label: 'Keywords' },
    ],
  },
  {
    title: 'SEO — დაჯავშნა',
    keys: [
      { key: 'seo.booking.title', label: 'Meta Title' },
      { key: 'seo.booking.description', label: 'Meta Description', type: 'textarea' },
      { key: 'seo.booking.keywords', label: 'Keywords' },
    ],
  },
  {
    title: 'საკონტაქტო',
    keys: [
      { key: 'contact.phone', label: 'ტელეფონი' },
      { key: 'contact.email', label: 'ელ. ფოსტა' },
      { key: 'contact.address', label: 'მისამართი' },
      { key: 'contact.city', label: 'ქალაქი' },
      { key: 'contact.hours', label: 'სამუშაო საათები' },
      { key: 'contact.map_embed', label: 'Google Maps Embed URL', type: 'textarea' },
    ],
  },
  {
    title: 'Hero სექცია',
    keys: [
      { key: 'hero.badge', label: 'ბეჯი' },
      { key: 'hero.title_line1', label: 'სათაური ხაზი 1' },
      { key: 'hero.title_line2', label: 'სათაური ხაზი 2' },
      { key: 'hero.subtitle', label: 'ქვესათაური', type: 'textarea' },
      { key: 'hero.cta_primary', label: 'ძირითადი ღილაკი' },
      { key: 'hero.cta_secondary', label: 'მეორადი ღილაკი' },
    ],
  },
  {
    title: 'დამფუძნებელი',
    keys: [
      { key: 'founder.label', label: 'ლეიბლი' },
      { key: 'founder.name', label: 'სახელი' },
      { key: 'founder.image', label: 'სურათი', type: 'image' },
      { key: 'founder.quote', label: 'ციტატა', type: 'textarea' },
      { key: 'founder.stat1_value', label: 'სტატისტიკა 1 მნიშვნელობა' },
      { key: 'founder.stat1_label', label: 'სტატისტიკა 1 ლეიბლი' },
      { key: 'founder.stat2_value', label: 'სტატისტიკა 2 მნიშვნელობა' },
      { key: 'founder.stat2_label', label: 'სტატისტიკა 2 ლეიბლი' },
    ],
  },
  {
    title: 'რატომ Entourage',
    keys: [
      { key: 'why.badge', label: 'ბეჯი' },
      { key: 'why.title', label: 'სათაური' },
      { key: 'why.title_highlight', label: 'სათაური (ჰაილაით)' },
      { key: 'why.subtitle', label: 'ქვესათაური', type: 'textarea' },
      { key: 'why.cta_title', label: 'CTA სათაური' },
      { key: 'why.cta_text', label: 'CTA ტექსტი', type: 'textarea' },
      { key: 'why.feature1_title', label: 'ფიჩერი 1 სათაური' },
      { key: 'why.feature1_desc', label: 'ფიჩერი 1 აღწერა', type: 'textarea' },
      { key: 'why.feature2_title', label: 'ფიჩერი 2 სათაური' },
      { key: 'why.feature2_desc', label: 'ფიჩერი 2 აღწერა', type: 'textarea' },
      { key: 'why.feature3_title', label: 'ფიჩერი 3 სათაური' },
      { key: 'why.feature3_desc', label: 'ფიჩერი 3 აღწერა', type: 'textarea' },
      { key: 'why.feature4_title', label: 'ფიჩერი 4 სათაური' },
      { key: 'why.feature4_desc', label: 'ფიჩერი 4 აღწერა', type: 'textarea' },
    ],
  },
  {
    title: 'პოპულარული პროცედურები',
    keys: [
      { key: 'popular.title', label: 'სათაური' },
      { key: 'popular.title_highlight', label: 'სათაური (ჰაილაით)' },
      { key: 'popular.subtitle', label: 'ქვესათაური', type: 'textarea' },
    ],
  },
  {
    title: 'FAQ სექცია',
    keys: [
      { key: 'faq.title', label: 'სათაური' },
      { key: 'faq.subtitle', label: 'ქვესათაური' },
    ],
  },
  {
    title: 'ვიდეო გალერეა',
    keys: [
      { key: 'reels.title', label: 'სათაური' },
      { key: 'reels.title_highlight', label: 'სათაური (ჰაილაით)' },
      { key: 'reels.subtitle', label: 'ქვესათაური' },
    ],
  },
  {
    title: 'კურსის გვერდი',
    keys: [
      { key: 'course.badge', label: 'ბეჯი' },
      { key: 'course.title_line1', label: 'სათაური ხაზი 1' },
      { key: 'course.title_line2', label: 'სათაური ხაზი 2 (ჰაილაით)' },
      { key: 'course.subtitle', label: 'ქვესათაური', type: 'textarea' },
      { key: 'course.about_title', label: 'შესახებ სათაური' },
      { key: 'course.about_text', label: 'შესახებ ტექსტი', type: 'textarea' },
      { key: 'course.about_image', label: 'შესახებ სურათი', type: 'image' },
      { key: 'course.hero_image', label: 'Hero სურათი', type: 'image' },
      { key: 'course.features', label: 'ფიჩერები (მძიმით გამოყოფილი)', type: 'textarea' },
    ],
  },
];

const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api('/api/content/settings').then(data => { setSettings(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api('/api/admin/settings', { method: 'PUT', body: settings });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">პარამეტრები</h1>
          <p className="text-gray-500">საიტის ტექსტები და კონფიგურაცია</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-colors ${
            saved ? 'bg-green-600 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
          } disabled:opacity-50`}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saved ? 'შენახულია ✓' : 'შენახვა'}
        </button>
      </div>

      {settingsGroups.map(group => (
        <div key={group.title} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white">{group.title}</h2>
          </div>
          <div className="p-6 space-y-5">
            {group.keys.map(field => (
              <div key={field.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <label className="text-sm text-gray-400 pt-2.5 font-medium">{field.label}<span className="text-gray-600 block text-xs mt-0.5">{field.key}</span></label>
                <div className="md:col-span-2">
                  {field.type === 'toggle' ? (
                    <button
                      onClick={() => handleChange(field.key, settings[field.key] === 'true' ? 'false' : 'true')}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        settings[field.key] === 'true' || (!settings[field.key] && field.key === 'sticky_button.enabled') ? 'bg-purple-600' : 'bg-gray-700'
                      }`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        settings[field.key] === 'true' || (!settings[field.key] && field.key === 'sticky_button.enabled') ? 'translate-x-8' : 'translate-x-1.5'
                      }`} />
                    </button>
                  ) : field.type === 'image' ? (
                    <ImageUpload
                      value={settings[field.key] || ''}
                      onChange={(url) => handleChange(field.key, url)}
                    />
                  ) : field.type === 'number' ? (
                    <input
                      type="number"
                      value={settings[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none transition-colors"
                    />
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={settings[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none transition-colors resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={settings[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none transition-colors"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminSettings;
