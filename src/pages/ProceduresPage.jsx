import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, Sparkles, Syringe, Sun, Scissors, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';

const categoryConfig = {
  all: { label: 'ყველა', icon: Sparkles, color: 'purple' },
  injection: { label: 'ინექციური', icon: Syringe, color: 'pink' },
  care: { label: 'კანის მოვლა', icon: Sun, color: 'amber' },
  modeling: { label: 'მოდელირება', icon: Scissors, color: 'violet' },
  laser: { label: 'ლაზერული', icon: Zap, color: 'cyan' },
};

const ProceduresPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { procedures: ctxProcedures, s } = useContent();

  const procedures = ctxProcedures.length > 0 ? ctxProcedures : [];

  const filteredProcedures = activeCategory === 'all'
    ? procedures
    : procedures.filter(p => p.category === activeCategory);

  const categories = Object.entries(categoryConfig);

  return (
    <>
      <Helmet>
        <title>{s('seo.procedures.title', 'პროცედურები - Entourage')}</title>
        {s('seo.procedures.description') && <meta name="description" content={s('seo.procedures.description')} />}
        {s('seo.procedures.keywords') && <meta name="keywords" content={s('seo.procedures.keywords')} />}
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-background via-primary-purple/5 to-pink-500/5">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-purple/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-purple/10 border border-primary-purple/20 text-primary-purple text-sm font-medium mb-6"
            >
              <Sparkles size={14} />
              ესთეტიკური პროცედურები
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 font-display"
            >
              ჩვენი{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-pink-500">
                პროცედურები
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              {s('procedures.subtitle', 'აღმოაჩინეთ სილამაზის ინოვაციური მეთოდები თანამედროვე ტექნოლოგიებით')}
            </motion.p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 py-10"
          >
            {categories.map(([id, config]) => {
              const Icon = config.icon;
              const isActive = activeCategory === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-purple text-white shadow-lg shadow-primary-purple/25 scale-105'
                      : 'bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon size={16} />
                  {config.label}
                </button>
              );
            })}
          </motion.div>

          {/* Count */}
          <div className="text-center mb-8">
            <span className="text-sm text-muted-foreground">
              {filteredProcedures.length} პროცედურა
            </span>
          </div>

          {/* Procedures Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProcedures.map((procedure, index) => {
                const catConfig = categoryConfig[procedure.category] || categoryConfig.care;
                return (
                  <motion.div
                    key={procedure.slug || procedure.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/procedure/${procedure.slug}`}
                      className="group block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary-purple/5 transition-all duration-500 hover:-translate-y-1"
                    >
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={procedure.image}
                          alt={procedure.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                            <catConfig.icon size={12} />
                            {catConfig.label}
                          </span>
                        </div>

                        {/* Price Badge */}
                        {procedure.price_from && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-primary-purple/90 text-white text-xs font-bold">
                              {procedure.price_from}-დან
                            </span>
                          </div>
                        )}

                        {/* Title Overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                            {procedure.name}
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {procedure.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {procedure.duration && (
                              <span className="inline-flex items-center gap-1">
                                <Clock size={12} />
                                {procedure.duration}
                              </span>
                            )}
                          </div>
                          <span className="inline-flex items-center gap-1 text-primary-purple text-sm font-medium group-hover:gap-2 transition-all">
                            დეტალურად
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredProcedures.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">ამ კატეგორიაში პროცედურები არ მოიძებნა</p>
            </div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-r from-primary-purple to-pink-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
                გაინტერესებთ პროცედურა?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                დაჯავშნეთ უფასო კონსულტაცია და მიიღეთ ინდივიდუალური რეკომენდაცია
              </p>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 bg-white text-primary-purple px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
              >
                დაჯავშნე კონსულტაცია
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProceduresPage;