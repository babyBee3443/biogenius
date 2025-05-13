"use client";

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { UserPlus, User, KeyRound, Eye, EyeOff, Loader2, Mail, AtSign } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createUser, getUsers, type User as UserData } from '@/lib/mock-data';

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
        <linearGradient id="createAccountDnaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
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
          stroke="url(#createAccountDnaGradient)"
          strokeWidth="6" fill="none" strokeLinecap="round"
        >
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="10s" repeatCount="indefinite" />
        </path>
        <path
          d="M0,-35 Q -18,-17.5 0,0 Q 18,17.5 0,35"
          stroke="url(#createAccountDnaGradient)"
          strokeWidth="6" fill="none" strokeLinecap="round"
        >
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="10s" repeatCount="indefinite" />
        </path>
        {[...Array(6)].map((_, i) => (
          <line key={`create-account-dna-base-${i}`}
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

interface CreateAccountModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAccountCreateSuccess: () => void;
  openLogin: () => void; // New prop to open login modal
}

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({ isOpen, setIsOpen, onAccountCreateSuccess, openLogin }) => {
  const [fullName, setFullName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      toast({ variant: "destructive", title: "Hata", description: "Şifreler eşleşmiyor." });
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      toast({ variant: "destructive", title: "Hata", description: "Şifre en az 6 karakter olmalıdır." });
      setIsLoading(false);
      return;
    }
    if (username.length < 3) {
      setError("Kullanıcı adı en az 3 karakter olmalıdır.");
      toast({ variant: "destructive", title: "Hata", description: "Kullanıcı adı en az 3 karakter olmalıdır." });
      setIsLoading(false);
      return;
    }
     if (/\s/.test(username)) {
      setError("Kullanıcı adı boşluk içeremez.");
      toast({ variant: "destructive", title: "Hata", description: "Kullanıcı adı boşluk içeremez." });
      setIsLoading(false);
      return;
    }


    try {
      // Check if username or email already exists
      const existingUsers = await getUsers();
      if (existingUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        setError("Bu kullanıcı adı zaten kullanılıyor.");
        toast({ variant: "destructive", title: "Hata", description: "Bu kullanıcı adı zaten kullanılıyor." });
        setIsLoading(false);
        return;
      }
      if (existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setError("Bu e-posta adresi zaten kayıtlı.");
        toast({ variant: "destructive", title: "Hata", description: "Bu e-posta adresi zaten kayıtlı." });
        setIsLoading(false);
        return;
      }

      const newUser = await createUser({ name: fullName, username, email, role: 'User' }); // Password handled by mock in this case
      if (newUser) {
        toast({
          title: 'Hesap Oluşturuldu!',
          description: `${newUser.name}, BiyoHox'a hoş geldiniz! Şimdi giriş yapabilirsiniz.`,
        });
        onAccountCreateSuccess(); // This will close the modal and can trigger login
      } else {
        setError('Hesap oluşturulamadı. Lütfen tekrar deneyin.');
        toast({
          variant: 'destructive',
          title: 'Hesap Oluşturma Başarısız',
          description: 'Bir sorun oluştu.',
        });
      }
    } catch (createError) {
      console.error("Error creating account:", createError);
      setError('Hesap oluşturulurken bir sorun oluştu.');
      toast({
        variant: 'destructive',
        title: 'Sistem Hatası',
        description: 'Hesap oluşturulamadı.',
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-background/80 dark:bg-slate-900/80 backdrop-blur-md border-primary/30 rounded-xl shadow-2xl">
        <DialogHeader className="text-center pt-4">
          <AnimatedDnaIcon />
          <DialogTitle className="text-2xl font-bold text-foreground">Hesap Oluştur</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            BiyoHox topluluğuna katılın.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateAccount} className="space-y-4 px-2 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullNameModal" className="flex items-center text-muted-foreground text-xs">
              <User className="mr-2 h-3.5 w-3.5" /> Tam Adınız
            </Label>
            <Input
              id="fullNameModal"
              type="text"
              placeholder="Adınız Soyadınız"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="h-10 text-sm bg-background/70 border-border focus:border-primary"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="usernameModal" className="flex items-center text-muted-foreground text-xs">
              <AtSign className="mr-2 h-3.5 w-3.5" /> Kullanıcı Adı
            </Label>
            <Input
              id="usernameModal"
              type="text"
              placeholder="Kullanıcı adınız (boşluksuz)"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
              required
              className="h-10 text-sm bg-background/70 border-border focus:border-primary"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="emailModalCreate" className="flex items-center text-muted-foreground text-xs">
              <Mail className="mr-2 h-3.5 w-3.5" /> E-posta Adresiniz
            </Label>
            <Input
              id="emailModalCreate"
              type="email"
              placeholder="ornek@eposta.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 text-sm bg-background/70 border-border focus:border-primary"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="passwordModalCreate" className="flex items-center text-muted-foreground text-xs">
              <KeyRound className="mr-2 h-3.5 w-3.5" /> Şifre
            </Label>
            <div className="relative">
              <Input
                id="passwordModalCreate"
                type={showPassword ? 'text' : 'password'}
                placeholder="Şifreniz (en az 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 text-sm bg-background/70 border-border focus:border-primary pr-10"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPasswordModal" className="flex items-center text-muted-foreground text-xs">
              <KeyRound className="mr-2 h-3.5 w-3.5" /> Şifre Tekrar
            </Label>
            <div className="relative">
              <Input
                id="confirmPasswordModal"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Şifrenizi tekrar girin"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-10 text-sm bg-background/70 border-border focus:border-primary pr-10"
                disabled={isLoading}
              />
               <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-primary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>


          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full h-11 text-md bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 hover:from-green-500/90 hover:via-teal-500/90 hover:to-cyan-500/90 text-white shadow-lg hover:shadow-green-500/40 transition-all duration-300 ease-in-out transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-5 w-5" />
            )}
            Hesap Oluştur
          </Button>
        </form>
        <DialogFooter className="flex flex-col sm:flex-row items-center justify-center pt-3 px-2 border-t border-border/20">
          <span className="text-xs text-muted-foreground mr-1">Zaten hesabınız var mı?</span>
          <Button variant="link" className="text-xs text-primary hover:underline p-0 h-auto" onClick={openLogin}>
            Giriş Yapın
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
