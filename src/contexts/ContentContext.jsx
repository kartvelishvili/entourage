import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [settings, heroSlides, procedures, team, faqs, results, reels, offers, mentors, navItems] = await Promise.all([
          fetch('/api/content/settings').then(r => r.json()).catch(() => ({})),
          fetch('/api/content/hero-slides').then(r => r.json()).catch(() => []),
          fetch('/api/content/procedures').then(r => r.json()).catch(() => []),
          fetch('/api/content/team').then(r => r.json()).catch(() => []),
          fetch('/api/content/faqs').then(r => r.json()).catch(() => []),
          fetch('/api/content/results').then(r => r.json()).catch(() => []),
          fetch('/api/content/reels').then(r => r.json()).catch(() => []),
          fetch('/api/content/offers').then(r => r.json()).catch(() => []),
          fetch('/api/content/mentors').then(r => r.json()).catch(() => []),
          fetch('/api/content/nav-items').then(r => r.json()).catch(() => []),
        ]);
        setContent({ settings, heroSlides, procedures, team, faqs, results, reels, offers, mentors, navItems, loaded: true });
      } catch {
        setContent(prev => ({ ...prev, loaded: true }));
      }
    };
    fetchAll();
  }, []);

  const s = (key, fallback = '') => content.settings[key] || fallback;

  return (
    <ContentContext.Provider value={{ ...content, s }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
