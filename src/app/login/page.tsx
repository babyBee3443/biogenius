"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { LogIn, Mail, KeyRound, Eye, EyeOff, Loader2, User } from 'lucide-react'; // Added User icon
import Link from 'next/link';

// Placeholder Logo
const AnimatedLogo = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex items-center justify-center mb-8"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-12 w-12 text-primary animate-spin-slow"
    >
      <path d="M4 4C4 4 6 12 12 12C18 12 20 20 20 20" />
      <path d="M4 20C4 20 6 12 12 12C18 12 20 4 20 4" />
      <path d="M6.5 7.5L9.5 5.5" />
      <path d="M14.5 18.5L17.5 16.5" />
      <path d="M6.5 16.5L9.5 18.5" />
      <path d="M14.5 5.5L17.5 7.5" />
      <motion.path
        d="M10 12H14"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
      />
    </svg>
    <span className="ml-3 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-green-500 to-blue-500">
      TeknoBiyo
    </span>
  </motion.div>
);

export default function LoginPage() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = React.useState(''); // Changed from email
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Updated validation to accept username 'admin' or email 'admin@teknobiyo.com'
    if (
      (emailOrUsername.toLowerCase() === 'admin@teknobiyo.com' || emailOrUsername.toLowerCase() === 'admin') &&
      password === 'password123'
    ) {
      toast({
        title: 'Giriş Başarılı!',
        description: 'Admin paneline yönlendiriliyorsunuz...',
      });
      // In a real app, you'd set a session/token here
      router.push('/admin');
    } else {
      setError('Geçersiz e-posta/kullanıcı adı veya şifre. Lütfen tekrar deneyin.');
      toast({
        variant: 'destructive',
        title: 'Giriş Başarısız',
        description: 'E-posta/kullanıcı adı veya şifreniz yanlış.',
      });
    }
    setIsLoading(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-border/60 overflow-hidden">
          <CardHeader className="text-center p-8 bg-card">
            <AnimatedLogo />
            <CardTitle className="text-3xl font-bold">Yönetim Paneli Girişi</CardTitle>
            <CardDescription className="text-muted-foreground">
              Lütfen devam etmek için giriş yapın.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="emailOrUsername" className="flex items-center text-muted-foreground">
                  <User className="mr-2 h-4 w-4" /> E-posta veya Kullanıcı Adı
                </Label>
                <Input
                  id="emailOrUsername"
                  type="text" // Changed type to text to accommodate username
                  placeholder="admin@example.com veya admin"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                  className="h-11 text-base"
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password" className="flex items-center text-muted-foreground">
                  <KeyRound className="mr-2 h-4 w-4" /> Şifre
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Şifreniz"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 text-base pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </motion.div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive text-center"
                >
                  {error}
                </motion.p>
              )}

              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <LogIn className="mr-2 h-5 w-5" />
                  )}
                  Giriş Yap
                </Button>
              </motion.div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center p-6 pt-0">
            <Link href="/" className="text-sm text-primary hover:underline mb-2">
              Şifremi Unuttum?
            </Link>
            <p className="text-xs text-muted-foreground">
              Bu panel yalnızca yetkili kullanıcılar içindir.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
       <footer className="mt-12 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} TeknoBiyo. Tüm hakları saklıdır.
        <br />
         <Link href="/" className="hover:text-primary">Ana Sayfaya Dön</Link>
      </footer>
    </div>
  );
