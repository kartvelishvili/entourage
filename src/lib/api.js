const API_BASE = import.meta.env.VITE_API_URL || '';
const getToken = () => localStorage.getItem('admin_token');

const api = async (url, options = {}) => {
  const token = getToken();
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  };
  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(`${API_BASE}${url}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'შეცდომა');
  return data;
};

const uploadFile = async (file) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/api/admin/upload`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'ატვირთვის შეცდომა');
  return data.url;
};

export default api;
export { API_BASE, getToken, uploadFile };
