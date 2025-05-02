
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-secondary/50 mt-16"> {/* Added margin-top */}
      <div className="container py-10 text-center md:text-left"> {/* Adjusted padding and text alignment */}
        <div className="md:flex md:justify-between md:items-center">
          <div className="mb-6 md:mb-0">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} TeknoBiyo. Tüm hakları saklıdır.
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Teknoloji ve biyoloji dünyasındaki en son gelişmeler.
            </p>
          </div>
          <div className="flex justify-center md:justify-start space-x-5 text-sm"> {/* Increased spacing */}
            {/* Updated Hakkında link to /hakkimizda */}
            <Link href="/hakkimizda" className="text-muted-foreground hover:text-primary transition-colors">Hakkımızda</Link>
            <Link href="/iletisim" className="text-muted-foreground hover:text-primary transition-colors">İletişim</Link>
            {/* Updated placeholder links */}
            <Link href="/gizlilik-politikasi" className="text-muted-foreground hover:text-primary transition-colors">Gizlilik Politikası</Link>
            <Link href="/kullanim-sartlari" className="text-muted-foreground hover:text-primary transition-colors">Kullanım Şartları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
