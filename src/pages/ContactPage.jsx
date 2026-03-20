import React from 'react';
import { Helmet } from 'react-helmet';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import PageHeader from '@/components/PageHeader';
import { useContent } from '@/contexts/ContentContext';

const API_BASE = import.meta.env.VITE_API_URL || '';

const ContactPage = () => {
  const { toast } = useToast();
  const { s } = useContent();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '', phone: '', email: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const res = await fetch(`${API_BASE}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error();
        toast({ title: "შეტყობინება გაგზავნილია", description: "მალე დაგიკავშირდებით" });
        setFormData({ name: '', phone: '', email: '', message: '' });
    } catch {
        toast({ title: "შეცდომა", description: "გთხოვთ სცადოთ თავიდან", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  const infoCards = [
    { icon: Phone, title: "დაგვირეკეთ", value: s('contact.phone', '032 219 54 00'), sub: s('contact.hours', 'ყოველდღე 10:00 - 21:00') },
    { icon: Mail, title: "მოგვწერეთ", value: s('contact.email', 'info@enturage.ge'), sub: "პასუხი 24 საათში" },
    { icon: MapPin, title: "გვეწვიეთ", value: s('contact.address', 'წყნეთის გზატკეცილი 49'), sub: "თბილისი, საქართველო" },
  ];

  return (
    <>
      <Helmet>
        <title>{s('seo.contact.title', 'კონტაქტი - Entourage')}</title>
        {s('seo.contact.description') && <meta name="description" content={s('seo.contact.description')} />}
        {s('seo.contact.keywords') && <meta name="keywords" content={s('seo.contact.keywords')} />}
      </Helmet>

      <div className="min-h-screen bg-background pb-24">
        <PageHeader 
          title="კონტაქტი" 
          description="მზად ვართ გიპასუხოთ ნებისმიერ შეკითხვაზე" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {infoCards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border border-border p-8 rounded-3xl shadow-xl text-center hover:scale-105 transition-transform duration-300"
                    >
                        <div className="w-16 h-16 bg-primary-purple/10 text-primary-purple rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <card.icon size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{card.title}</h3>
                        <p className="text-lg font-bold text-primary-purple mb-1">{card.value}</p>
                        <p className="text-sm text-muted-foreground">{card.sub}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <motion.div 
                   initial={{ opacity: 0, x: -50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   className="bg-card border border-border rounded-3xl p-8 lg:p-12 shadow-2xl"
                >
                    <h2 className="text-3xl font-bold text-foreground mb-8">მოგვწერეთ</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground">სახელი</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:border-primary-purple outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground">ტელეფონი</label>
                                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:border-primary-purple outline-none transition-colors" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground">ელ. ფოსტა</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:border-primary-purple outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground">შეტყობინება</label>
                            <textarea rows={4} name="message" value={formData.message} onChange={handleChange} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:border-primary-purple outline-none transition-colors"></textarea>
                        </div>
                        <button disabled={isSubmitting} className="w-full bg-primary-purple text-white py-4 rounded-xl font-bold hover:bg-primary-purple/90 transition-colors flex justify-center items-center gap-2">
                           {isSubmitting ? "იგზავნება..." : <>გაგზავნა <Send size={18} /></>}
                        </button>
                    </form>
                </motion.div>

                {/* Map */}
                <motion.div
                   initial={{ opacity: 0, x: 50 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl h-[600px] lg:h-auto"
                >
                   <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2977.1234567890123!2d44.7833!3d41.6938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDQxJzM3LjciTiA0NMKwNDYnNTkuOSJF!5e0!3m2!1sen!2sge!4v1234567890123!5m2!1sen!2sge" 
                      width="100%" 
                      height="100%" 
                      style={{border:0}} 
                      allowFullScreen="" 
                      loading="lazy"
                      className="grayscale hover:grayscale-0 transition-all duration-700"
                   ></iframe>
                </motion.div>
            </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;