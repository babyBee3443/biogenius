
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
    Loader2, Edit3, Bell, KeyRound, Trash2, Palette, LogOut, UserCircle, 
    Settings as SettingsIcon, Wand2, Info, Download, UserX, Languages 
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { updateUser, type User, getUserById } from '@/lib/data/users'; // Corrected getUserById import
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
// import { usePermissions } from "@/hooks/usePermissions"; // Commented out as it's not used here


const DnaBackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden z-0 opacity-5 dark:opacity-[0.03] pointer-events-none">
    {[...Array(25)].map((_, i) => (
      <svg
        key={`dna-pattern-${i}`}
        className="absolute animate-pulse"
        style={{
          left: `${Math.random() * 120 - 10}%`, 
          top: `${Math.random() * 120 - 10}%`,
          width: `${Math.random() * 150 + 80}px`,
          height: `${Math.random() * 150 + 80}px`,
          animationDuration: `${Math.random() * 20 + 15}s`,
          animationDelay: `${Math.random() * 10}s`,
          transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.3 + 0.2})`,
        }}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M50 10 Q60 30 50 50 Q40 70 50 90" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M50 10 Q40 30 50 50 Q60 70 50 90" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        {[...Array(6)].map((_, j) => (
            <line key={j} x1={45 - j*1.5} y1={20 + j*10} x2={55 + j*1.5} y2={20 + j*10} stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        ))}
      </svg>
    ))}
  </div>
);


export default function UserProfilePage() {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const [fullName, setFullName] = React.useState("");
  const [userBio, setUserBio] = React.useState("");
  const [userStatus, setUserStatus] = React.useState<User['status'] | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const [quizReminders, setQuizReminders] = React.useState(true);
  const [newContentAlerts, setNewContentAlerts] = React.useState(true);
  const [emailFrequency, setEmailFrequency] = React.useState("daily");

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isSavingPassword, setIsSavingPassword] = React.useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);
  
  // const { permissions, isLoading: permissionsLoading } = usePermissions(currentUser?.id || null);


  React.useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser) as User;
            if (isMounted) {
              if (user.role === 'Admin' || user.role === 'Editor') {
                // For admin/editor, we might want a different profile page or redirect to admin profile.
                // For now, let's assume this page handles all user profiles including admin/editor if they access it.
                // router.replace('/admin/profile'); // Example: redirect to admin profile
              }
              const fetchedUser = await getUserById(user.id); // Fetch latest data
              if (fetchedUser && isMounted) {
                  setCurrentUser(fetchedUser);
                  setFullName(fetchedUser.name || "");
                  setUserBio(fetchedUser.bio || "");
                  setUserStatus(fetchedUser.status || undefined);
                  setAvatarPreview(fetchedUser.avatar || `https://placehold.co/128x128.png?text=${(fetchedUser.name || 'U').charAt(0)}`);
              } else if (isMounted) {
                 // User from localStorage not found in DB, might be an issue.
                 // For now, proceed with localStorage data but log a warning.
                 console.warn("User from localStorage not found in DB, using localStorage data for profile.");
                 setCurrentUser(user);
                 setFullName(user.name || "");
                 setUserBio(user.bio || "");
                 setUserStatus(user.status || undefined);
                 setAvatarPreview(user.avatar || `https://placehold.co/128x128.png?text=${(user.name || 'U').charAt(0)}`);
              }
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
    };
    fetchUser();
    return () => { isMounted = false; };
  }, [router]);

  const handleProfileSave = async () => {
    if (!currentUser) return;
    setIsSavingProfile(true);
    const updatedData: Partial<Omit<User, 'id' | 'email' | 'joinedAt' | 'username' | 'role'>> = {
        name: fullName,
        bio: userBio,
        status: userStatus,
        avatar: avatarPreview || undefined,
    };
    try {
        const updatedUser = await updateUser(currentUser.id, updatedData);
        if (updatedUser) {
            setCurrentUser(updatedUser);
            if (typeof window !== 'undefined') {
              const storedCurrentUser = localStorage.getItem('currentUser');
              if (storedCurrentUser) {
                  try {
                      const currentUserData = JSON.parse(storedCurrentUser);
                      if (currentUserData.id === updatedUser.id) {
                          localStorage.setItem('currentUser', JSON.stringify({
                              ...currentUserData,
                              name: updatedUser.name,
                              avatar: updatedUser.avatar,
                              bio: updatedUser.bio,
                              status: updatedUser.status,
                          }));
                          window.dispatchEvent(new CustomEvent('currentUserUpdated'));
                      }
                  } catch (e) { console.error("Failed to update localStorage user", e); }
              }
            }
            toast({ title: "Profil Güncellendi", description: "Bilgileriniz başarıyla kaydedildi." });
        } else {
            toast({ variant: "destructive", title: "Hata", description: "Profil güncellenemedi." });
        }
    } catch (error) {
        toast({ variant: "destructive", title: "Hata", description: "Profil kaydedilirken bir hata oluştu." });
    } finally {
        setIsSavingProfile(false);
    }
  };
  
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        toast({ variant: "destructive", title: "Dosya Çok Büyük", description: "Lütfen 2MB'den küçük bir resim seçin." });
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type)) {
        toast({ variant: "destructive", title: "Geçersiz Dosya Türü", description: "Lütfen PNG, JPG, GIF veya WEBP formatında bir resim seçin." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        toast({ title: "Avatar Önizlemesi Güncellendi", description: "Kaydetmeyi unutmayın."});
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (newPassword.length < 6) {
        toast({ variant: "destructive", title: "Şifre Çok Kısa", description: "Yeni şifre en az 6 karakter olmalıdır." });
        return;
    }
    if (newPassword !== confirmNewPassword) {
        toast({ variant: "destructive", title: "Şifreler Eşleşmiyor", description: "Yeni şifre ve tekrarı aynı olmalıdır." });
        return;
    }
    setIsSavingPassword(true);
    setTimeout(() => {
        toast({ title: "Şifre Değiştirildi (Simülasyon)", description: "Şifreniz başarıyla güncellendi." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setIsSavingPassword(false);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    setIsConfirmDeleteOpen(true);
  };

  const confirmDeleteAccount = () => {
    setIsDeletingAccount(true);
    setTimeout(() => {
        toast({ variant: "destructive", title: "Hesap Silindi (Simülasyon)", description: "Hesabınız silindi. Anasayfaya yönlendiriliyorsunuz." });
        if (typeof window !== 'undefined') localStorage.removeItem('currentUser');
        setCurrentUser(null);
        setIsDeletingAccount(false);
        setIsConfirmDeleteOpen(false);
        router.push('/');
    }, 1500);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      window.dispatchEvent(new CustomEvent('currentUserUpdated')); 
    }
    toast({ title: "Çıkış Başarılı", description: "Başarıyla çıkış yaptınız." });
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-theme(spacing.16))]">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
        Profil yükleniyor...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-10 min-h-screen flex flex-col justify-center items-center">
        <p className="text-muted-foreground">Lütfen giriş yapınız.</p>
        <Button asChild className="mt-4" onClick={() => router.push('/')}>
          Ana Sayfaya Dön
        </Button>
      </div>
    );
  }

  return (
    <>
      <DnaBackgroundPattern />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Merhaba, {currentUser.name || currentUser.username}!
          </h1>
          <p className="text-lg text-muted-foreground mt-2">Bilimle dolu bir gün seni bekliyor.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-xl border border-border/30 rounded-xl">
            <CardHeader className="items-center text-center p-6">
              <Avatar className="h-32 w-32 mb-4 border-4 border-primary/50 shadow-lg">
                <AvatarImage src={avatarPreview || undefined} alt={currentUser.name} data-ai-hint="user avatar placeholder" />
                <AvatarFallback className="text-4xl bg-muted">{(currentUser.name || currentUser.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => avatarInputRef.current?.click()} disabled={isSavingProfile}>
                <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Avatar Seç (Yakında)
              </Button>
              <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
              <CardTitle className="text-2xl font-semibold mt-3">{currentUser.name || currentUser.username}</CardTitle>
              <CardDescription className="text-sm text-primary">@{currentUser.username}</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="profile-fullname">Tam Adınız</Label>
                <Input id="profile-fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isSavingProfile} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-email">E-posta</Label>
                <Input id="profile-email" value={currentUser.email} disabled />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-status">Statünüz</Label>
                <Select value={userStatus} onValueChange={(value) => setUserStatus(value as User['status'])} disabled={isSavingProfile}>
                  <SelectTrigger id="profile-status"><SelectValue placeholder="Statü seçin..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Öğrenci">Öğrenci</SelectItem>
                    <SelectItem value="Öğretmen">Öğretmen</SelectItem>
                    <SelectItem value="Meraklı">Meraklı</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                 <Label htmlFor="profile-bio">Biyografi</Label>
                 <Textarea id="profile-bio" value={userBio} onChange={(e) => setUserBio(e.target.value)} placeholder="Kendinizden kısaca bahsedin..." rows={3} disabled={isSavingProfile}/>
              </div>
              <p className="text-xs text-muted-foreground">Katılım Tarihi: {new Date(currentUser.joinedAt).toLocaleDateString('tr-TR')}</p>
              <Button onClick={handleProfileSave} className="w-full" disabled={isSavingProfile}>
                {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />} Profili Kaydet
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl">
                <TabsTrigger value="general" className="gap-1.5"><SettingsIcon className="h-4 w-4"/>Genel</TabsTrigger>
                <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-4 w-4"/>Bildirimler</TabsTrigger>
                <TabsTrigger value="security" className="gap-1.5"><KeyRound className="h-4 w-4"/>Güvenlik</TabsTrigger>
                <TabsTrigger value="account" className="gap-1.5"><UserX className="h-4 w-4"/>Hesap</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-xl border border-border/30 rounded-xl">
                  <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Palette className="h-5 w-5 text-primary"/>Görünüm Ayarları</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="theme-toggle" className="text-base">Tema Seçimi</Label>
                      <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between">
                       <Label className="text-base flex items-center gap-1.5"><Languages className="h-4 w-4"/>Dil</Label>
                       <Button variant="outline" size="sm" onClick={() => toast({title:"Yakında!", description:"Dil seçimi özelliği yakında aktif olacak."})}>
                           Türkçe (Değiştir - Yakında)
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-xl border border-border/30 rounded-xl">
                  <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/>Bildirim Ayarları</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="quiz-reminders" className="flex-1">Quiz Hatırlatıcıları</Label>
                      <Switch id="quiz-reminders" checked={quizReminders} onCheckedChange={setQuizReminders} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="new-content-alerts" className="flex-1">Yeni İçerik Bildirimleri</Label>
                      <Switch id="new-content-alerts" checked={newContentAlerts} onCheckedChange={setNewContentAlerts} />
                    </div>
                    <div className="space-y-1.5 p-3 border rounded-md">
                        <Label htmlFor="email-frequency">E-posta Bildirim Frekansı</Label>
                        <Select value={emailFrequency} onValueChange={setEmailFrequency}>
                            <SelectTrigger id="email-frequency"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="instant">Anlık</SelectItem>
                                <SelectItem value="daily">Günlük Özet</SelectItem>
                                <SelectItem value="weekly">Haftalık Özet</SelectItem>
                                <SelectItem value="none">Alma</SelectItem>
                            </SelectContent>
                        </Select>
                         <p className="text-xs text-muted-foreground">Bu ayar simüle edilmiştir.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-xl border border-border/30 rounded-xl">
                  <CardHeader><CardTitle className="text-xl flex items-center gap-2"><KeyRound className="h-5 w-5 text-primary"/>Şifre Yönetimi</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={(e) => { e.preventDefault(); handlePasswordChange();}} className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="current-password">Mevcut Şifre (Simülasyon)</Label>
                          <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={isSavingPassword} placeholder="Mevcut şifrenizi girin (simülasyon)"/>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label htmlFor="new-password">Yeni Şifre</Label>
                              <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isSavingPassword} placeholder="Yeni şifreniz"/>
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="confirm-new-password">Yeni Şifre Tekrar</Label>
                              <Input id="confirm-new-password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} disabled={isSavingPassword} placeholder="Yeni şifrenizi tekrar girin"/>
                            </div>
                        </div>
                        <Button type="submit" disabled={isSavingPassword || !newPassword || !confirmNewPassword}>
                            {isSavingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <KeyRound className="mr-2 h-4 w-4" />} Şifreyi Değiştir (Simülasyon)
                        </Button>
                    </form>
                    <Separator/>
                    <Button variant="outline" onClick={() => toast({title:"Yakında!", description:"İki faktörlü kimlik doğrulama yakında!"})} className="w-full sm:w-auto">
                        <SettingsIcon className="mr-2 h-4 w-4"/> 2FA Ayarla (Yakında)
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account">
                <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-xl border border-border/30 rounded-xl">
                  <CardHeader><CardTitle className="text-xl flex items-center gap-2"><UserX className="h-5 w-5 text-destructive"/>Hesap Yönetimi</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <Button variant="outline" onClick={() => toast({title:"Yakında!", description:"Veri indirme özelliği yakında!"})} className="w-full sm:w-auto justify-start gap-2">
                        <Download className="h-4 w-4"/> Verilerimi İndir (JSON - Yakında)
                    </Button>
                     <div className="p-4 border border-destructive/30 bg-destructive/5 rounded-md">
                        <h4 className="font-semibold text-destructive">Hesabı Kalıcı Olarak Sil</h4>
                        <p className="text-xs text-destructive/80 mt-1 mb-3">
                            Bu işlem geri alınamaz. Tüm notlarınız, ilerlemeniz ve kişisel bilgileriniz kalıcı olarak silinecektir.
                        </p>
                        <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeletingAccount}>
                          {isDeletingAccount ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4" />} Hesabımı Sil (Simülasyon)
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="text-center mt-12">
                 <Button variant="outline" onClick={handleLogout} className="border-border/50 hover:bg-muted/80">
                     <span className="flex items-center gap-2">
                        <LogOut className="h-4 w-4" /> Çıkış Yap
                     </span>
                 </Button>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Hesabınızı kalıcı olarak silmek üzeresiniz. Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmDeleteOpen(false)} disabled={isDeletingAccount}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAccount}
              className={cn(
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                isDeletingAccount && "opacity-50 cursor-not-allowed"
              )}
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Evet, Hesabımı Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    