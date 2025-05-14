
"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Loader2, Edit3, Bell, KeyRound, Trash2, Palette, LogOut, UserCircle, Settings as SettingsIcon, Wand2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import type { User } from '@/lib/data/users';
import Link from 'next/link';
import { usePermissions } from "@/hooks/usePermissions";

const DnaBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0 opacity-5 dark:opacity-[0.03]">
    {[...Array(20)].map((_, i) => (
      <svg
        key={`dna-bg-${i}`}
        className="absolute animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 100 + 50}px`,
          height: `${Math.random() * 100 + 50}px`,
          animationDuration: `${Math.random() * 10 + 10}s`,
          animationDelay: `${Math.random() * 5}s`,
          transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`,
        }}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M50 10 Q60 30 50 50 Q40 70 50 90" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M50 10 Q40 30 50 50 Q60 70 50 90" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="45" y1="20" x2="55" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="43" y1="30" x2="57" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="45" y1="40" x2="55" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="43" y1="60" x2="57" y2="60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="45" y1="70" x2="55" y2="70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="43" y1="80" x2="57" y2="80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ))}
  </div>
);


export default function UserProfilePage() {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const { permissions, isLoading: permissionsLoading } = usePermissions(currentUser?.id || null);

  const [quizReminders, setQuizReminders] = React.useState(true);
  const [newContentAlerts, setNewContentAlerts] = React.useState(true);
  const [newPassword, setNewPassword] = React.useState("");


  React.useEffect(() => {
    let isMounted = true;
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser) as User;
          if (isMounted) {
            setCurrentUser(user);
            // Initialize notification states based on user data if available, otherwise default
            // For demo, we'll use defaults. In a real app, these would come from user.preferences
          }
        } catch (e) {
          console.error("Error parsing current user from localStorage", e);
          if (isMounted) router.push('/');
        }
      } else {
        if (isMounted) router.push('/');
      }
      if (isMounted) setLoading(false);
    }
    return () => { isMounted = false; };
  }, [router]);


  if (loading || permissionsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
        Profil yükleniyor...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-10 min-h-screen flex flex-col justify-center items-center bg-background text-foreground">
        <p className="text-muted-foreground">Lütfen giriş yapınız.</p>
        <Button asChild className="mt-4">
          <Link href="/">Giriş Yap</Link>
        </Button>
      </div>
    );
  }

  // If user is Admin or Editor, redirect them to their admin profile page
  if (currentUser.role === 'Admin' || currentUser.role === 'Editor') {
    router.replace('/admin/profile');
    return ( // Render a loading state while redirecting
         <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
            Yönlendiriliyor...
      </div>
    );
  }

  const handlePasswordChange = () => {
    if(newPassword.length < 6) {
      toast({variant: "destructive", title: "Hata", description: "Şifre en az 6 karakter olmalı."});
      return;
    }
    toast({title: "Başarılı (Simülasyon)", description: "Şifre değiştirme talebiniz alındı."});
    setNewPassword("");
  };

  const handleDeleteAccount = () => {
     toast({variant: "destructive", title: "Hesap Silme (Simülasyon)", description: "Hesap silme işlemi başlatıldı."});
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      window.dispatchEvent(new CustomEvent('currentUserUpdated')); // Notify header
    }
    toast({ title: "Çıkış Başarılı", description: "Başarıyla çıkış yaptınız." });
    router.push('/'); // Redirect to homepage after logout
  };


  return (
    <div className="min-h-screen bg-secondary/30 dark:bg-slate-900 text-foreground relative overflow-hidden">
      <DnaBackground />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Merhaba, {currentUser.name || currentUser.username}!
          </h1>
          <p className="text-lg text-muted-foreground mt-2">Bilimle dolu bir gün seni bekliyor.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Profil Kartı */}
          <Card className="lg:col-span-1 bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-xl border border-border/30 rounded-xl">
            <CardHeader className="items-center text-center p-6">
              <Avatar className="h-28 w-28 mb-4 border-4 border-primary/50 shadow-md">
                <AvatarImage src={currentUser.avatar || `https://placehold.co/128x128.png?text=${(currentUser.name || 'U').charAt(0)}`} alt={currentUser.name} data-ai-hint="user avatar placeholder" />
                <AvatarFallback className="text-3xl">{(currentUser.name || currentUser.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-semibold">{currentUser.name || currentUser.username}</CardTitle>
              <CardDescription className="text-sm text-primary">@{currentUser.username}</CardDescription>
              {currentUser.status && (
                <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-primary/30">{currentUser.status}</Badge>
              )}
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-3 text-sm">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => toast({title:"Yakında!", description: "Avatar seçme özelliği yakında!"})}>
                    <Wand2 className="h-4 w-4" /> Avatar Seç (Yakında)
                </Button>
              <Separator />
              <div>
                <p className="font-medium">E-posta:</p>
                <p className="text-muted-foreground">{currentUser.email}</p>
              </div>
              <div>
                <p className="font-medium">Katılım Tarihi:</p>
                <p className="text-muted-foreground">{new Date(currentUser.joinedAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              {currentUser.bio && (
                <div className="border-t pt-3 mt-3">
                  <p className="font-medium mb-1">Biyografi:</p>
                  <p className="text-xs text-muted-foreground whitespace-pre-line">{currentUser.bio}</p>
                </div>
              )}
              <Button variant="outline" className="w-full mt-4 justify-start gap-2" onClick={() => toast({title:"Yakında!", description: "Profil düzenleme yakında!"})}>
                <Edit3 className="h-4 w-4" /> Profili Düzenle (Yakında)
              </Button>
            </CardContent>
          </Card>

          {/* Sağ Ayarlar Bölümü */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-xl border border-border/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2"><Palette className="h-5 w-5 text-primary"/> Görünüm Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Label htmlFor="theme-toggle" className="text-base">Tema Seçimi</Label>
                <ThemeToggle />
              </CardContent>
            </Card>

            <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-xl border border-border/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/> Bildirim Ayarları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quiz-reminders" className="flex-1">Quiz Hatırlatıcıları</Label>
                  <Switch id="quiz-reminders" checked={quizReminders} onCheckedChange={setQuizReminders} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-content-alerts" className="flex-1">Yeni İçerik Bildirimleri</Label>
                  <Switch id="new-content-alerts" checked={newContentAlerts} onCheckedChange={setNewContentAlerts} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-xl border border-border/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2"><KeyRound className="h-5 w-5 text-primary"/> Şifre Yönetimi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="new-password">Yeni Şifre</Label>
                  <Input id="new-password" type="password" placeholder="Yeni şifrenizi girin" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <Button onClick={handlePasswordChange} variant="secondary" disabled={!newPassword}>Şifreyi Değiştir (Simülasyon)</Button>
              </CardContent>
            </Card>

            <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-xl border border-border/30 rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2"><Trash2 className="h-5 w-5 text-destructive"/> Hesap Yönetimi</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-start gap-4">
                <Button variant="destructive" onClick={handleDeleteAccount} className="w-full sm:w-auto">
                  Hesabımı Sil (Simülasyon)
                </Button>
                 <p className="text-xs text-muted-foreground">Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.</p>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                    <LogOut className="h-4 w-4" /> Çıkış Yap
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

