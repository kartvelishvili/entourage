import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, GraduationCap, Calendar, Home, Users, Phone, Mail, Star, Heart, Camera, Play, Tag, Search, Settings, Info, FileText, MapPin, Clock, Award, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';

const iconMap = {
  Calendar, GraduationCap, Home, Users, Phone, Mail, Star, Heart, Camera, Play, Tag, Search, Settings, Info, FileText, MapPin, Clock, Award, Gift,
};

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const { navItems: dbNavItems, s } = useContent();

  const navLinks = (dbNavItems && dbNavItems.length > 0)
    ? dbNavItems.map(item => ({
        path: item.path,
        label: item.label,
        isSpecial: item.is_special,
        isCta: item.is_cta,
        icon: item.icon ? iconMap[item.icon] : null,
        openInNewTab: item.open_in_new_tab,
      }))
    : [
        { path: '/', label: 'მთავარი' },
        { path: '/procedures', label: 'პროცედურები' },
        { path: '/results', label: 'შედეგები' },
        { path: '/courses', label: 'კურსი', isSpecial: true },
        { path: '/team', label: 'გუნდი' },
        { path: '/booking', label: 'დაჯავშნა', icon: Calendar, isCta: true },
        { path: '/contact', label: 'კონტაქტი' },
      ];

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const regularLinks = navLinks.filter(link => !link.isCta);
  const ctaLinks = navLinks.filter(link => link.isCta);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {s('site.logo') ? (
              <img src={s('site.logo')} alt={s('site.title', 'Entourage')} className="h-10 w-auto object-contain" />
            ) : (
              <>
                <div className="w-10 h-10 bg-primary-purple rounded-xl flex items-center justify-center text-white font-serif font-bold text-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary-purple/20">E</div>
                <span className="text-2xl font-serif font-bold text-foreground tracking-wide group-hover:text-primary-purple transition-colors">
                  Entourage
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {regularLinks.map((link) => {
              const IconComp = link.isSpecial ? GraduationCap : (link.icon || null);
              const Wrapper = link.openInNewTab ? 'a' : Link;
              const wrapperProps = link.openInNewTab
                ? { href: link.path, target: '_blank', rel: 'noopener noreferrer' }
                : { to: link.path };

              return (
                <Wrapper
                  key={link.path}
                  {...wrapperProps}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                    isActive(link.path)
                      ? 'bg-primary-purple/10 text-primary-purple'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  } ${link.isSpecial ? 'text-pink-500 hover:text-pink-600 hover:bg-pink-50' : ''}`}
                >
                  {IconComp && <IconComp size={16} />}
                  {link.label}
                </Wrapper>
              );
            })}
            
            <div className="w-px h-6 bg-border mx-4" />

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {ctaLinks.map((link) => {
              const IconComp = link.icon || null;
              const Wrapper = link.openInNewTab ? 'a' : Link;
              const wrapperProps = link.openInNewTab
                ? { href: link.path, target: '_blank', rel: 'noopener noreferrer' }
                : { to: link.path };

              return (
                <Wrapper
                  key={link.path}
                  {...wrapperProps}
                  className="ml-4 bg-primary-purple hover:bg-primary-purple/90 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary-purple/20 hover:shadow-primary-purple/40 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  {IconComp && <IconComp size={16} />}
                  {link.label}
                </Wrapper>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const IconComp = link.isSpecial ? GraduationCap : (link.icon || null);
                const Wrapper = link.openInNewTab ? 'a' : Link;
                const wrapperProps = link.openInNewTab
                  ? { href: link.path, target: '_blank', rel: 'noopener noreferrer', onClick: () => setIsMenuOpen(false) }
                  : { to: link.path, onClick: () => setIsMenuOpen(false) };

                return (
                  <Wrapper
                    key={link.path}
                    {...wrapperProps}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.path)
                        ? 'bg-muted text-primary-purple'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                       {IconComp && <IconComp size={16} />}
                       {link.label}
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;