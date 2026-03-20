import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, CheckCircle, Clock, ArrowRight, Sparkles, Syringe, Sun, Scissors, Zap } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

const categoryConfig = {
  injection: { label: 'ინექციური', icon: Syringe, color: 'pink' },
  care: { label: 'კანის მოვლა', icon: Sun, color: 'amber' },
  modeling: { label: 'მოდელირება', icon: Scissors, color: 'violet' },
  laser: { label: 'ლაზერული', icon: Zap, color: 'cyan' },
};

const ProcedureDetailPage = () => {
  const { procedureId } = useParams();
  const { procedures } = useContent();

  const procedure = procedures.find(p => p.slug === procedureId);

  if (!procedure) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">პროცედურა ვერ მოიძებნა</h1>
          <Link to="/procedures" className="text-primary-purple hover:underline">უკან პროცედურებზე</Link>
        </div>
      </div>
    );
  }

  const benefits = typeof procedure.benefits === 'string' ? JSON.parse(procedure.benefits) : (procedure.benefits || []);
  const steps = typeof procedure.steps === 'string' ? JSON.parse(procedure.steps) : (procedure.steps || []);
  const catConfig = categoryConfig[procedure.category] || categoryConfig.care;
  const CatIcon = catConfig.icon;

  // Get related procedures (same category, excluding current)
  const related = procedures
    .filter(p => p.category === procedure.category && p.slug !== procedure.slug)
    .slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{procedure.name} - Entourage</title>
        <meta name="description" content={procedure.description} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <img
            src={procedure.image}
            alt={procedure.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-black/30" />

          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Link
                  to="/procedures"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm"
                >
                  <ArrowLeft size={16} />
                  პროცედურები
                </Link>

                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/10">
                    <CatIcon size={12} />
                    {catConfig.label}
                  </span>
                  {procedure.price_from && (
                    <span className="px-3 py-1 rounded-full bg-primary-purple/90 text-white text-xs font-bold">
                      {procedure.price_from}-დან
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-display">
                  {procedure.name}
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-2xl">
                  {procedure.description}
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-4"
              >
                {procedure.duration && (
                  <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-purple/10 flex items-center justify-center">
                      <Clock size={22} className="text-primary-purple" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ხანგრძლივობა</p>
                      <p className="text-foreground font-bold">{procedure.duration}</p>
                    </div>
                  </div>
                )}
                {procedure.price_from && (
                  <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Sparkles size={22} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ფასი</p>
                      <p className="text-foreground font-bold">{procedure.price_from}-დან</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Detail Description */}
              {(procedure.detail_description) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card border border-border rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">აღწერა</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {procedure.detail_description}
                  </p>
                </motion.div>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card border border-border rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-6">უპირატესობები</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle size={14} />
                        </div>
                        <span className="text-foreground">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Steps */}
              {steps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card border border-border rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-6">პროცედურის ეტაპები</h2>
                  <div className="space-y-4">
                    {steps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary-purple text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-foreground font-medium">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Video */}
              {procedure.video_url && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <div className="aspect-video">
                    <iframe
                      src={procedure.video_url}
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                      title="პროცედურის ვიდეო"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Booking CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-primary-purple to-pink-500 text-white rounded-2xl p-8 sticky top-24"
              >
                <h3 className="text-2xl font-bold mb-3">დაჯავშნე ვიზიტი</h3>
                <p className="text-white/80 mb-6 text-sm leading-relaxed">
                  გაიარეთ კონსულტაცია ჩვენს სპეციალისტებთან და მიიღეთ ინდივიდუალურ საჭიროებაზე მორგებული გეგმა
                </p>
                {procedure.price_from && (
                  <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/10">
                    <p className="text-white/60 text-xs mb-1">ფასი იწყება</p>
                    <p className="text-3xl font-bold">{procedure.price_from}</p>
                  </div>
                )}
                <Link
                  to="/booking"
                  className="flex items-center justify-center gap-2 bg-white text-primary-purple w-full py-4 rounded-xl font-bold hover:bg-white/90 transition-colors"
                >
                  <Calendar size={20} />
                  დაჯავშნა
                </Link>
                <a
                  href="tel:+995555000000"
                  className="flex items-center justify-center gap-2 mt-3 border border-white/20 text-white w-full py-3 rounded-xl font-medium hover:bg-white/10 transition-colors text-sm"
                >
                  ან დარეკეთ
                </a>
              </motion.div>

              {/* Related Procedures */}
              {related.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-foreground mb-4">მსგავსი პროცედურები</h3>
                  <div className="space-y-3">
                    {related.map(rel => (
                      <Link
                        key={rel.slug}
                        to={`/procedure/${rel.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <img src={rel.image} alt={rel.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{rel.name}</p>
                          {rel.price_from && <p className="text-xs text-muted-foreground">{rel.price_from}-დან</p>}
                        </div>
                        <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary-purple transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcedureDetailPage;