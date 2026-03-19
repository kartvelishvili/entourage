import React, { useRef, useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { uploadFile } from '@/lib/api';

const ImageUpload = ({ value, onChange, label, className = '' }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (err) {
      alert(err.message);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className={className}>
      {label && <label className="text-sm text-gray-400 mb-1 block">{label}</label>}
      <div className="flex gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="სურათის URL..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 hover:text-white px-3 py-2.5 rounded-xl transition-colors disabled:opacity-50 shrink-0"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {value && (
        <div className="mt-2 relative inline-block">
          <img src={value} alt="" className="h-20 rounded-lg object-cover" onError={e => e.target.style.display='none'} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
