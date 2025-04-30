import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} TeknoBiyo. Tüm hakları saklıdır.</p>
        <div className="mt-2 space-x-4">
          <Link href="/hakkinda" className="hover:text-primary">Hakkında</Link>
          <Link href="/iletisim" className="hover:text-primary">İletişim</Link>
          <Link href="/gizlilik-politikasi" className="hover:text-primary">Gizlilik Politikası</Link>
          <Link href="/kullanim-sartlari" className="hover:text-primary">Kullanım Şartları</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
