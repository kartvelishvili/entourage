import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

const ReelsSection = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const { reels: ctxReels, s } = useContent();

  const reels = ctxReels.length > 0 ? ctxReels.map(r => ({
    id: r.id,
    title: r.title,
    description: r.description,
    thumbnail: r.thumbnail,
    video: r.video_url,
  })) : [];

  return (
    <section className="py-24 bg-background relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              ვიდეო <span className="text-primary-purple">{s('reels.title_highlight', 'გალერეა')}</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              ნახეთ პროცედურების მიმდინარეობა და შედეგები
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative aspect-[9/16] rounded-3xl overflow-hidden shadow-xl cursor-pointer bg-black"
              onClick={() => setActiveVideo(reel.video)}
            >
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Play size={32} fill="currentColor" className="ml-1" />
                </div>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/60 to-transparent pt-20">
                <h3 className="text-white font-bold text-lg mb-1">{reel.title}</h3>
                <p className="text-white/80 text-sm">{reel.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X size={24} />
              </button>
              <iframe
                src={activeVideo}
                className="w-full h-full"
                frameBorder="0"
                width="100%"
                height="100%"
                allowFullScreen
                title="Video Player"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ReelsSection;