import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { useContent } from '@/contexts/ContentContext';

const ProceduresPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState(null);
  const { procedures: ctxProcedures } = useContent();

  const categories = [
    { id: 'all', label: 'ყველა' },
    { id: 'injection', label: 'ინექციური' },
    { id: 'laser', label: 'ლაზერული' },
    { id: 'care', label: 'მოვლა' },
  ];

  const procedures = ctxProcedures.length > 0 ? ctxProcedures.map(p => ({
    id: p.slug,
    category: p.category || 'care',
    name: p.name,
    description: p.description,
    image: p.image,
    video_url: p.video_url,
  })) : [];

  const filteredProcedures = activeCategory === 'all' 
    ? procedures 
    : procedures.filter(p => p.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>პროცედურები - Entourage</title>
      </Helmet>

      <div className="min-h-screen bg-background pb-24">
        <PageHeader 
          title="პროცედურები" 
          description="აღმოაჩინეთ სილამაზის ინოვაციური მეთოდები"
          className="bg-pink-500"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            {/* Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                    activeCategory === category.id 
                      ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25 scale-105' 
                      : 'bg-card border border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProcedures.map((procedure) => (
                <motion.div
                  key={procedure.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={procedure.image} 
                      alt={procedure.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold mb-1">{procedure.name}</h3>
                      <p className="opacity-80 text-sm">{procedure.description}</p>
                    </div>
                  </div>
                  <div className="p-6 flex justify-between items-center">
                    <button 
                      onClick={() => procedure.video_url && setActiveVideo(procedure.video_url)}
                      className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-pink-500 transition-colors"
                    >
                      <Play size={16} /> ვიდეო
                    </button>
                    <Link 
                      to={`/procedure/${procedure.id}`}
                      className="flex items-center gap-2 bg-pink-50 text-pink-500 px-4 py-2 rounded-lg font-bold hover:bg-pink-500 hover:text-white transition-all"
                    >
                      დეტალურად <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Video Modal */}
        <AnimatePresence>
          {activeVideo && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={() => setActiveVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
              >
                <iframe 
                  src={activeVideo}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  title="Procedure Video"
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProceduresPage;