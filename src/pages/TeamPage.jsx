import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Stethoscope, Star, Instagram } from 'lucide-react';
import { Facebook } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { useContent } from '@/contexts/ContentContext';

const TikTokIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.88a8.18 8.18 0 004.77 1.52V7a4.84 4.84 0 01-1-.31z"/></svg>
);

const TeamPage = () => {
  const { team: ctxTeam } = useContent();

  const teamMembers = ctxTeam.length > 0 ? ctxTeam.map(m => ({
    id: m.slug,
    name: m.name,
    role: m.role,
    spec: m.specialization || m.role,
    image: m.image,
    instagram: m.instagram || '',
    facebook: m.facebook || '',
    linkedin: m.linkedin || '',
    tiktok: m.tiktok || '',
  })) : [];

  return (
    <>
      <Helmet>
        <title>ჩვენი გუნდი - Entourage</title>
      </Helmet>

      <div className="min-h-screen bg-background pb-24">
        <PageHeader 
          title="ჩვენი გუნდი" 
          description="პროფესიონალები, რომლებიც ქმნიან თქვენს სილამაზეს"
          className="bg-primary-purple"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {teamMembers.map((member, index) => (
                    <motion.div
                        key={member.id + index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group flex flex-col items-center"
                    >
                        <motion.div 
                          className="relative w-64 h-64 mb-6"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-purple to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-xl group-hover:shadow-2xl group-hover:shadow-primary-purple/30 transition-all duration-500 bg-muted">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute bottom-2 right-2 w-10 h-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-lg text-primary-purple opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                <Stethoscope size={18} />
                            </div>
                        </motion.div>

                        <div className="text-center space-y-3">
                            <div>
                              <h3 className="text-2xl font-bold text-foreground mb-1">{member.name}</h3>
                              <p className="text-primary-purple font-medium text-lg">{member.role}</p>
                            </div>
                            
                            <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
                                <Star size={14} className="fill-primary-purple text-primary-purple" />
                                {member.spec}
                            </p>

                            <div className="pt-4 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <Link
                                    to={`/booking?doctor=${member.id}`}
                                    className="inline-flex items-center gap-2 bg-primary-purple text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-primary-purple/90 transition-colors shadow-lg"
                                >
                                    <Calendar size={14} />
                                    დაჯავშნა
                                </Link>
                                {member.instagram && (
                                  <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors">
                                    <Instagram size={18} />
                                  </a>
                                )}
                                {member.facebook && (
                                  <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors">
                                    <Facebook size={18} />
                                  </a>
                                )}
                                {member.tiktok && (
                                  <a href={member.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors">
                                    <TikTokIcon size={18} />
                                  </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </>
  );
};

export default TeamPage;