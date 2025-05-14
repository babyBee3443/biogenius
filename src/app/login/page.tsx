
"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { LogIn, ShieldCheck, KeyRound, Eye, EyeOff, Loader2, Mail, AtSign } from 'lucide-react'; // Changed User to ShieldCheck
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getUsers, type User as UserData } from '@/lib/mock-data';

const AnimatedLockIcon = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="mx-auto mb-6" // Increased margin bottom
  >
    <ShieldCheck className="h-16 w-16 text-primary" /> 
  </motion.div>
);

export default function AdminLoginPage() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // If an admin is already logged in, redirect to dashboard
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user && user.role === 'Admin') {
            router.replace('/admin');
          }
        } catch (e) {
          // Corrupted data, clear it
          localStorage.removeItem('currentUser');
        }
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const allUsers = await getUsers();
      const lowercasedInput = emailOrUsername.toLowerCase();

      const foundUser = allUsers.find(
        (user: UserData) =>
          (user.email && user.email.toLowerCase() === lowercasedInput) ||
          (user.username && user.username.toLowerCase() === lowercasedInput)
      );

      if (foundUser && password) { // Basic password check
        if (foundUser.role === 'Admin') {
          if (typeof window !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            // Dispatch custom event to notify other parts of the app (like AdminLayout)
            window.dispatchEvent(new CustomEvent('currentUserUpdated'));
          }
          toast({
            title: 'Giriş Başarılı!',
            description: `Hoş geldiniz, ${foundUser.name}! Yönetim paneline yönlendiriliyorsunuz.`,
          });
          router.push('/admin'); // Redirect to admin dashboard
        } else {
          setError('Bu alan yalnızca yöneticilere özeldir.');
          toast({
            variant: 'destructive',
            title: 'Yetkisiz Giriş',
            description: 'Sadece yönetici rolüne sahip kullanıcılar giriş yapabilir.',
          });
        }
      } else {
        setError('E-posta/kullanıcı adı veya şifre yanlış.');
        toast({
          variant: 'destructive',
          title: 'Giriş Başarısız',
          description: 'Lütfen bilgilerinizi kontrol edin.',
        });
      }
    } catch (fetchError) {
      console.error("Error fetching users for admin login:", fetchError);
      setError('Giriş sırasında bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      toast({
        variant: 'destructive',
        title: 'Sistem Hatası',
        description: 'Kullanıcı verileri yüklenemedi.',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 p-4 selection:bg-primary/20">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-md border-primary/30 shadow-2xl rounded-xl overflow-hidden">
          <CardHeader className="text-center pt-8 pb-4 bg-card/50">
            <AnimatedLockIcon />
            <DialogTitle className="text-3xl font-bold text-foreground tracking-tight">Yönetici Girişi</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm px-4">
              Lütfen BiyoHox yönetim paneline erişmek için giriş yapın.
            </DialogDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="emailOrUsernameAdminLogin" className="flex items-center text-muted-foreground font-medium text-sm">
                  <AtSign className="mr-2 h-4 w-4 text-primary" /> E-posta veya Kullanıcı Adı
                </Label>
                <Input
                  id="emailOrUsernameAdminLogin"
                  type="text"
                  placeholder="admin@example.com veya admin_user"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                  className="h-12 text-base bg-background/70 border-border focus:border-primary focus:ring-primary/50 shadow-sm"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordAdminLogin" className="flex items-center text-muted-foreground font-medium text-sm">
                  <KeyRound className="mr-2 h-4 w-4 text-primary" /> Şifre
                </Label>
                <div className="relative">
                  <Input
                    id="passwordAdminLogin"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 text-base bg-background/70 border-border focus:border-primary focus:ring-primary/50 pr-10 shadow-sm"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded-md border border-destructive/30">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-gradient-to-r from-primary via-teal-600 to-cyan-600 hover:from-primary/90 hover:via-teal-600/90 hover:to-cyan-600/90 text-primary-foreground shadow-lg hover:shadow-primary/40 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-primary/50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-5 w-5" />
                )}
                Giriş Yap
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-xs text-muted-foreground py-6 bg-card/50 border-t border-border/20">
             <Link href="/" className="hover:text-primary transition-colors">
                &larr; Ana Sayfaya Dön
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
        <p className="text-center text-xs text-slate-500 mt-8">
            &copy; {new Date().getFullYear()} BiyoHox Yönetim Paneli. Tüm hakları saklıdır.
        </p>
    </div>
  );
}
