import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, CheckCircle, AlertCircle, Mail, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLocation, Link } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { useContent } from '@/contexts/ContentContext';

const API_BASE = import.meta.env.VITE_API_URL || '';

const BookingPage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preSelectedDoctor = queryParams.get('doctor');
  const { procedures: ctxProcedures, team: ctxTeam, s } = useContent();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    procedure: '',
    doctor: preSelectedDoctor || '',
    date: '',
    time: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return false;
    if (!formData.phone.trim()) return false;
    if (!formData.date) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        toast({
            title: "შეცდომა",
            description: "გთხოვთ შეავსოთ სავალდებულო ველები (*)",
            variant: "destructive",
            duration: 3000,
        });
        return;
    }

    setIsSubmitting(true);
    
    try {
        const res = await fetch(`${API_BASE}/api/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error();
        setIsSubmitting(false);
        setIsSuccess(true);
        toast({
            title: "ჯავშანი მიღებულია!",
            description: "ჩვენი ადმინისტრატორი მალე დაგიკავშირდებათ.",
            duration: 5000,
        });
    } catch {
        setIsSubmitting(false);
        toast({
            title: "შეცდომა",
            description: "გთხოვთ სცადოთ თავიდან",
            variant: "destructive",
        });
    }
  };

  if (isSuccess) {
    return (
        <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-background px-4">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-lg w-full bg-card border border-border rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-primary-purple"></div>
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-4">წარმატება!</h1>
                <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                    თქვენი ვიზიტი წარმატებით დაჯავშნილია. <br/>
                    ჩვენი გუნდი მალე დაგიკავშირდებათ დეტალების დასაზუსტებლად.
                </p>
                <div className="space-y-4">
                    <button 
                        onClick={() => { setIsSuccess(false); setFormData({name: '', phone: '', email: '', procedure: '', doctor: '', date: '', time: '', notes: ''}); }} 
                        className="w-full bg-primary-purple text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-purple/90 transition-colors shadow-lg"
                    >
                        ახალი ჯავშნის დამატება
                    </button>
                    <Link to="/" className="block w-full text-primary-purple font-bold hover:underline">
                        მთავარ გვერდზე დაბრუნება
                    </Link>
                </div>
            </motion.div>
        </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>დაჯავშნა - Entourage</title>
      </Helmet>

      <div className="min-h-screen bg-background pb-24">
        <PageHeader 
          title="ვიზიტის დაჯავშნა" 
          description="აირჩიეთ სასურველი დრო და პროცედურა"
          className="bg-primary-purple"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Contact Info Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-lg">
                        <h3 className="text-xl font-bold text-foreground mb-6">საკონტაქტო ინფორმაცია</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary-purple/10 flex items-center justify-center text-primary-purple shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-bold mb-1">ტელეფონი</p>
                                    <p className="text-foreground font-bold">{s('contact.phone', '032 219 54 00')}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary-purple/10 flex items-center justify-center text-primary-purple shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-bold mb-1">ელ. ფოსტა</p>
                                    <p className="text-foreground font-bold">{s('contact.email', 'info@entourage.ge')}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary-purple/10 flex items-center justify-center text-primary-purple shrink-0">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-bold mb-1">სამუშაო საათები</p>
                                    <p className="text-foreground font-bold">ყოველდღე: 10:00 - 21:00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-primary-purple to-pink-600 rounded-3xl p-8 text-white shadow-lg">
                        <h3 className="text-xl font-bold mb-4">გჭირდებათ დახმარება?</h3>
                        <p className="mb-6 opacity-90">
                            თუ ვერ პოულობთ სასურველ დროს ან პროცედურას, დაგვირეკეთ პირდაპირ.
                        </p>
                        <a href="tel:0322195400" className="inline-block bg-white text-primary-purple px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors">
                            დაგვირეკეთ
                        </a>
                    </div>
                </div>

                {/* Booking Form */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="lg:col-span-2 bg-card border border-border rounded-3xl p-8 md:p-10 shadow-xl"
                >
                    <div className="mb-8 pb-8 border-b border-border">
                        <h2 className="text-2xl font-bold text-foreground mb-2">ონლაინ ჯავშანი</h2>
                        <p className="text-muted-foreground">შეავსეთ ფორმა და დაჯავშნეთ ვიზიტი მარტივად</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <User size={20} className="text-primary-purple" /> პერსონალური ინფორმაცია
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground">სახელი, გვარი <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-purple focus:ring-1 focus:ring-primary-purple transition-colors text-foreground"
                                        placeholder="თქვენი სახელი"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground">ტელეფონი <span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-purple focus:ring-1 focus:ring-primary-purple transition-colors text-foreground"
                                        placeholder="+995 5XX XX XX XX"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-muted-foreground">ელ. ფოსტა</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-purple focus:ring-1 focus:ring-primary-purple transition-colors text-foreground"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Procedure & Doctor */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <FileText size={20} className="text-primary-purple" /> ვიზიტის დეტალები
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground">პროცედურა</label>
                                    <div className="relative">
                                        <select
                                            name="procedure"
                                            value={formData.procedure}
                                            onChange={handleChange}
                                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-purple focus:ring-1 focus:ring-primary-purple transition-colors text-foreground appearance-none cursor-pointer"
                                        >
                                            <option value="">აირჩიეთ პროცედურა</option>
                                            {ctxProcedures.map(p => (
                                              <option key={p.slug} value={p.slug}>{p.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground">სპეციალისტი</label>
                                    <div className="relative">
                                        <select
                                            name="doctor"
                                            value={formData.doctor}
                                            onChange={handleChange}
                                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-purple focus:ring-1 focus:ring-primary-purple transition-colors text-foreground appearance-none cursor-pointer"
                                        >
                                            <option value="">ნებისმიერი</option>
                                            {ctxTeam.map(m => (
                                              <option key={m.slug} value={m.slug}>{m.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Calendar size={20} className="text-primary-purple" /> დრო და თარიღი
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground">თარიღი <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-purple focus:ring-1 focus:ring-primary-purple transition-colors text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground">დრო (სავარაუდო)</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-purple focus:ring-1 focus:ring-primary-purple transition-colors text-foreground"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-muted-foreground">კომენტარი / შენიშვნა</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary-purple focus:ring-1 focus:ring-primary-purple transition-colors text-foreground resize-none"
                                        placeholder="დამატებითი ინფორმაცია..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary-purple hover:bg-primary-purple/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary-purple/20 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99] flex justify-center items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                        მუშავდება...
                                    </>
                                ) : (
                                    'ჯავშნის დადასტურება'
                                )}
                            </button>
                            <p className="text-center text-xs text-muted-foreground mt-4">
                                ღილაკზე დაჭერით თქვენ ეთანხმებით ჩვენს კონფიდენციალურობის პოლიტიკას
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
      </div>
    </>
  );
};

export default BookingPage;