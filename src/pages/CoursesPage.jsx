import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Check, ArrowRight, User, Mail, Phone, BookOpen, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import PageHeader from '@/components/PageHeader';
import { useContent } from '@/contexts/ContentContext';

const CoursesPage = () => {
  const { toast } = useToast();
  const { mentors: ctxMentors, s } = useContent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const res = await fetch('/api/course-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error();
        toast({ 
          title: "რეგისტრაცია წარმატებულია!", 
          description: "ჩვენი მენეჯერი დაგიკავშირდებათ დეტალების განსახილველად.",
          duration: 5000,
        });
        setFormData({ name: '', email: '', phone: '', experience: '', message: '' });
    } catch {
        toast({ title: "შეცდომა", description: "გთხოვთ სცადოთ თავიდან", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  const mentors = ctxMentors.length > 0 ? ctxMentors : [];

  return (
    <>
      <Helmet>
        <title>სასწავლო კურსები - Entourage</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Custom Hero for Course */}
        <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
                <img 
                    src={s('course.hero_image', 'https://ihost.ge/s3/site-entourage-ge/images/hero/hero-slide-3.jpg')} 
                    alt="Clinic Interior" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-primary-purple/20 border border-primary-purple/40 text-primary-purple font-bold text-sm mb-6 backdrop-blur-sm">
                        სერტიფიცირებული პროგრამა
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display">
                        ლაზერული თერაპიის <br />
                        <span className="text-primary-purple">სრული კურსი</span>
                    </h1>
                    <p className="text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
                        დაეუფლე თანამედროვე ესთეტიკური მედიცინის ერთ-ერთ ყველაზე მოთხოვნად მიმართულებას პროფესიონალებთან ერთად.
                    </p>
                    <button 
                        onClick={() => document.getElementById('registration-form').scrollIntoView({ behavior: 'smooth' })}
                        className="bg-primary-purple text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-purple/90 transition-all shadow-lg shadow-primary-purple/30 flex items-center gap-2"
                    >
                        დარეგისტრირდი ახლავე <ArrowRight size={20} />
                    </button>
                </motion.div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Course Details */}
                <div className="space-y-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-foreground mb-6">კურსის შესახებ</h2>
                        <div className="relative rounded-2xl overflow-hidden mb-8 shadow-2xl">
                             <img 
                                src={s('course.about_image', 'https://ihost.ge/s3/site-entourage-ge/images/popular/facial-rejuvenation.jpg')} 
                                alt="Laser Therapy" 
                                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                            ეს ინტენსიური კურსი განკუთვნილია როგორც დამწყები, ისე მოქმედი სპეციალისტებისთვის. 
                            პროგრამა მოიცავს თეორიულ საფუძვლებს და პრაქტიკულ მუშაობას უახლესი თაობის აპარატურაზე.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {["აპარატურის შესწავლა", "უსაფრთხოების ნორმები", "პრაქტიკა მოდელებზე", "საერთაშორისო სერტიფიკატი"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border shadow-sm">
                                    <div className="w-8 h-8 rounded-full bg-primary-purple/10 flex items-center justify-center text-primary-purple shrink-0">
                                        <Check size={16} />
                                    </div>
                                    <span className="font-medium text-foreground">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-bold text-foreground mb-8">მენტორები</h2>
                        <div className="flex flex-wrap gap-8">
                            {mentors.map((mentor, index) => (
                                <div key={index} className="flex items-center gap-4 bg-card p-4 pr-8 rounded-full border border-border shadow-md hover:shadow-lg transition-shadow">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-purple p-0.5">
                                        <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">{mentor.name}</h3>
                                        <p className="text-sm text-primary-purple font-medium">{mentor.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Registration Form */}
                <motion.div 
                    id="registration-form"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-card border border-border rounded-3xl p-8 lg:p-12 shadow-2xl sticky top-24"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary-purple/10 flex items-center justify-center text-primary-purple">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-foreground">რეგისტრაცია</h3>
                            <p className="text-muted-foreground text-sm">შეავსეთ ფორმა კურსზე დასარეგისტრირებლად</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground flex items-center gap-2">
                                <User size={16} className="text-primary-purple" /> სახელი, გვარი
                            </label>
                            <input
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:border-primary-purple focus:ring-1 focus:ring-primary-purple outline-none transition-all text-foreground"
                                placeholder="თქვენი სახელი"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                                    <Mail size={16} className="text-primary-purple" /> ელ. ფოსტა
                                </label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:border-primary-purple focus:ring-1 focus:ring-primary-purple outline-none transition-all text-foreground"
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                                    <Phone size={16} className="text-primary-purple" /> ტელეფონი
                                </label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:border-primary-purple focus:ring-1 focus:ring-primary-purple outline-none transition-all text-foreground"
                                    placeholder="+995 5XX XX XX XX"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">გამოცდილება</label>
                            <select
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:border-primary-purple focus:ring-1 focus:ring-primary-purple outline-none transition-all text-foreground"
                            >
                                <option value="">აირჩიეთ დონე</option>
                                <option value="beginner">დამწყები</option>
                                <option value="intermediate">საშუალო</option>
                                <option value="advanced">პროფესიონალი</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">შეტყობინება (არასავალდებულო)</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:border-primary-purple focus:ring-1 focus:ring-primary-purple outline-none transition-all text-foreground"
                                placeholder="დამატებითი კითხვები..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary-purple text-white py-4 rounded-xl font-bold hover:bg-primary-purple/90 transition-all shadow-lg shadow-primary-purple/20 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
                        >
                            {isSubmitting ? 'იგზავნება...' : <>გაგზავნა <Send size={18} /></>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
      </div>
    </>
  );
};

export default CoursesPage;