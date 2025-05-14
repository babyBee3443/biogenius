
"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { LogIn, User, KeyRound, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getUsers, type User as UserData } from '@/lib/data/users'; // Assuming UserData type is exported
import { useRouter } from 'next/navigation'; // Import useRouter

const AnimatedDnaIcon = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="mx-auto mb-4"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="h-12 w-12 text-primary"
    >
      <defs>
        <linearGradient id="loginDnaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))">
            <animate attributeName="stop-color" values="hsl(var(--primary));hsl(var(--accent));hsl(var(--primary))" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="hsl(var(--accent))">
            <animate attributeName="stop-color" values="hsl(var(--accent));hsl(var(--primary));hsl(var(--accent))" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <g transform="translate(50,50) scale(0.9) rotate(0)">
        <path
          d="M0,-35 Q 18,-17.5 0,0 Q -18,17.5 0,35"
          stroke="url(#loginDnaGradient)"
          strokeWidth="6" fill="none" strokeLinecap="round"
        >
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="10s" repeatCount="indefinite" />
        </path>
        <path
          d="M0,-35 Q -18,-17.5 0,0 Q 18,17.5 0,35"
          stroke="url(#loginDnaGradient)"
          strokeWidth="6" fill="none" strokeLinecap="round"
        >
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="10s" repeatCount="indefinite" />
        </path>
        {[...Array(6)].map((_, i) => (
          <line key={`login-dna-base-${i}`}
            x1={Math.sin(i * Math.PI / 3) * 10} y1={-30 + i * (60 / 5)}
            x2={Math.sin(i * Math.PI / 3 + Math.PI) * 10} y2={-30 + i * (60 / 5)}
            strokeWidth="3" strokeLinecap="round"
            className="stroke-primary/70"
          >
            <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="10s" repeatCount="indefinite" />
          </line>
        ))}
      </g>
    </svg>
  </motion.div>
);

interface LoginModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLoginSuccess: () => void;
  openCreateAccount: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, setIsOpen, onLoginSuccess, openCreateAccount }) => {
  const [emailOrUsername, setEmailOrUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter(); // Initialize router

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

      // For mock purposes: If a user is found by email/username,
      // and password is not empty, consider it a successful login.
      // In a real app, you'd securely verify the password against a hash.
      if (foundUser && password) {
        // Removed the admin check here to allow admins to log in.
        // The redirection logic below will handle where they go.
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(foundUser));
          window.dispatchEvent(new CustomEvent('currentUserUpdated'));
        }
        toast({
          title: 'Giriş Başarılı!',
          description: `${foundUser.name}, hoş geldiniz!`,
        });

        if (foundUser.role === 'Admin') {
          router.push('/admin'); // Redirect Admin to admin dashboard
        } else {
          // For other users, just call onLoginSuccess which closes the modal.
          // Further redirection (e.g., to profile) can be handled by the parent component if needed.
          onLoginSuccess();
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
      console.error("Error fetching users for login:", fetchError);
      setError('Giriş sırasında bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
      toast({
        variant: 'destructive',
        title: 'Sistem Hatası',
        description: 'Kullanıcılar yüklenemedi.',
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-background/80 dark:bg-slate-900/80 backdrop-blur-md border-primary/30 rounded-xl shadow-2xl">
        <DialogHeader className="text-center pt-4">
          <AnimatedDnaIcon />
          <DialogTitle className="text-2xl font-bold text-foreground">Giriş Yap</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-green-500 animate-text-rgb-cycle-fast font-semibold">
              BiyoHox
            </span> platformuna erişmek için giriş yapın.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-6 px-2 py-4">
          <div className="space-y-2">
            <Label htmlFor="emailOrUsernameModalLogin" className="flex items-center text-muted-foreground">
              <User className="mr-2 h-4 w-4" /> E-posta veya Kullanıcı Adı
            </Label>
            <Input
              id="emailOrUsernameModalLogin"
              type="text"
              placeholder="E-posta / Kullanıcı Adı"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              className="h-11 text-base bg-background/70 border-border focus:border-primary"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordModalLogin" className="flex items-center text-muted-foreground">
              <KeyRound className="mr-2 h-4 w-4" /> Şifre
            </Label>
            <div className="relative">
              <Input
                id="passwordModalLogin"
                type={showPassword ? 'text' : 'password'}
                placeholder="Şifreniz"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 text-base bg-background/70 border-border focus:border-primary pr-10"
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
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-lg bg-gradient-to-r from-primary via-teal-600 to-cyan-600 hover:from-primary/90 hover:via-teal-600/90 hover:to-cyan-600/90 text-primary-foreground shadow-lg hover:shadow-primary/40 transition-all duration-300 ease-in-out transform hover:scale-105"
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
        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between pt-4 px-2 border-t border-border/20">
          <Link href="#" className="text-xs text-primary hover:underline" onClick={() => toast({title: "Yakında!", description:"Bu özellik yakında aktif olacaktır."})}>
            Şifremi Unuttum?
          </Link>
          <Button variant="link" className="text-xs text-primary hover:underline p-0 h-auto" onClick={openCreateAccount}>
            Hesap Oluştur
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
