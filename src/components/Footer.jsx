import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

const TikTokIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.88a8.18 8.18 0 004.77 1.52V7a4.84 4.84 0 01-1-.31z"/></svg>
);

const Footer = () => {
  const { s, procedures } = useContent();

  return (
    <footer className="bg-muted dark:bg-card pt-16 pb-8 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-6 group">
            {s('site.logo') ? (
              <div className="relative">
                <div className="absolute -inset-2 bg-primary-purple/15 rounded-2xl blur-lg opacity-60" />
                <img src={s('site.logo')} alt={s('site.name', 'Entourage')} className="h-12 w-auto object-contain relative z-10 drop-shadow-[0_0_8px_rgba(139,92,246,0.25)]" />
              </div>
            ) : (
              <span className="text-3xl font-serif font-bold text-primary-purple tracking-wide">
                {s('site.name', 'Entourage')}
              </span>
            )}
            </Link>
            <p className="text-muted-foreground mb-6">
              {s('site.tagline', 'პრემიუმ ესთეტიკური ცენტრი, სადაც სილამაზე ხვდება პროფესიონალიზმს.')}
            </p>
            <div className="flex gap-4">
              {s('footer.facebook_url') && (
                <a href={s('footer.facebook_url')} target="_blank" rel="noopener noreferrer" className="p-2 bg-background rounded-full text-primary-purple hover:bg-primary-purple hover:text-white transition-colors shadow-sm">
                  <Facebook size={20} />
                </a>
              )}
              {s('footer.instagram_url') && (
                <a href={s('footer.instagram_url')} target="_blank" rel="noopener noreferrer" className="p-2 bg-background rounded-full text-primary-purple hover:bg-primary-purple hover:text-white transition-colors shadow-sm">
                  <Instagram size={20} />
                </a>
              )}
              {s('footer.tiktok_url') && (
                <a href={s('footer.tiktok_url')} target="_blank" rel="noopener noreferrer" className="p-2 bg-background rounded-full text-primary-purple hover:bg-primary-purple hover:text-white transition-colors shadow-sm">
                  <TikTokIcon size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6">ნავიგაცია</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary-purple transition-colors">მთავარი</Link>
              </li>
              <li>
                <Link to="/procedures" className="text-muted-foreground hover:text-primary-purple transition-colors">პროცედურები</Link>
              </li>
              <li>
                <Link to="/results" className="text-muted-foreground hover:text-primary-purple transition-colors">შედეგები</Link>
              </li>
              <li>
                <Link to="/courses" className="text-muted-foreground hover:text-primary-purple transition-colors">კურსები</Link>
              </li>
              <li>
                <Link to="/team" className="text-muted-foreground hover:text-primary-purple transition-colors">გუნდი</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6">პროცედურები</h3>
            <ul className="space-y-3">
              {procedures.slice(0, 5).map(p => (
                <li key={p.id}>
                  <Link to={`/procedures/${p.slug}`} className="text-muted-foreground hover:text-primary-purple transition-colors">{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-6">კონტაქტი</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary-purple shrink-0 mt-0.5" />
                <span>{s('contact.address', 'თბილისი, წყნეთის გზატკეცილი 49')}</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary-purple shrink-0" />
                <span>{s('contact.phone', '032 219 54 00')}</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary-purple shrink-0" />
                <span>{s('contact.email', 'info@enturage.ge')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Entourage Aesthetic Center. ყველა უფლება დაცულია.
          </p>
          {s('footer.creator_logo') && (
            <a
              href={s('footer.creator_url', '#')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
              title={s('footer.creator_name', 'შემქმნელი')}
            >
              <img src={s('footer.creator_logo')} alt={s('footer.creator_name', 'შემქმნელი')} style={{ height: `${s('footer.creator_logo_height', '32')}px` }} className="w-auto object-contain" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;