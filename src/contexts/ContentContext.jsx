import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({
    settings: {},
    heroSlides: [],
    procedures: [],
    team: [],
    faqs: [],
    results: [],
    reels: [],
    offers: [],
    mentors: [],
    navItems: [],
    loaded: false,
  });

  const fetchAll = useCallback(async () => {
    try {
      const base = import.meta.env.VITE_API_URL || '';
      const nocache = `_t=${Date.now()}`;
      const [settings, heroSlides, procedures, team, faqs, results, reels, offers, mentors, navItems] = await Promise.all([
        fetch(`${base}/api/content/settings?${nocache}`).then(r => r.json()).catch(() => ({})),
        fetch(`${base}/api/content/hero-slides?${nocache}`).then(r => r.json()).catch(() => []),
        fetch(`${base}/api/content/procedures?${nocache}`).then(r => r.json()).catch(() => []),
        fetch(`${base}/api/content/team?${nocache}`).then(r => r.json()).catch(() => []),
        fetch(`${base}/api/content/faqs?${nocache}`).then(r => r.json()).catch(() => []),
        fetch(`${base}/api/content/results?${nocache}`).then(r => r.json()).catch(() => []),
        fetch(`${base}/api/content/reels?${nocache}`).then(r => r.json()).catch(() => []),
        fetch(`${base}/api/content/offers?${nocache}`).then(r => r.json()).catch(() => []),
        fetch(`${base}/api/content/mentors?${nocache}`).then(r => r.json()).catch(() => []),
        fetch(`${base}/api/content/nav-items?${nocache}`).then(r => r.json()).catch(() => []),
      ]);
      setContent({ settings, heroSlides, procedures, team, faqs, results, reels, offers, mentors, navItems, loaded: true });
    } catch {
      setContent(prev => ({ ...prev, loaded: true }));
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const s = (key, fallback = '') => content.settings[key] || fallback;

  return (
    <ContentContext.Provider value={{ ...content, s, refetch: fetchAll }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
