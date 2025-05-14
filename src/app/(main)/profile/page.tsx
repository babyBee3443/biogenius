
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
    Loader2, KeyRound, Trash2, Palette, LogOut as LogOutIcon, UserCircle,
    Settings as SettingsIcon, Clock, Eye, Save, Upload, ChevronLeft, ChevronRight
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { updateUser, type User, getUserById } from '@/lib/data/users';
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
import { usePermissions } from "@/hooks/usePermissions";


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
  const { permissions, isLoading: permissionsLoading } = usePermissions(currentUser?.id || null);

  const [fullName, setFullName] = React.useState("");
  const [userBio, setUserBio] = React.useState("");
  const [userStatus, setUserStatus] = React.useState<User['status'] | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [sessionAvatarHistory, setSessionAvatarHistory] = React.useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = React.useState<number>(-1);


  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");

  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isSavingPassword, setIsSavingPassword] = React.useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);


  React.useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser) as User;
            if (isMounted) {
              const fetchedUser = await getUserById(user.id);
              if (fetchedUser && isMounted) {
                  setCurrentUser(fetchedUser);
                  setFullName(fetchedUser.name || "");
                  setUserBio(fetchedUser.bio || "");
                  setUserStatus(fetchedUser.status || 'Meraklı');
                  const initialAvatar = fetchedUser.avatar || `https://api.dicebear.com/8.x/personas/svg?seed=${(fetchedUser.name || 'User').replace(/\s/g, '')}&size=128`;
                  setAvatarUrl(initialAvatar);
                  setSessionAvatarHistory([initialAvatar]);
                  setCurrentHistoryIndex(0);
              } else if (isMounted) {
                 console.warn("User from localStorage not found in DB, using localStorage data for profile.");
                 setCurrentUser(user);
                 setFullName(user.name || "");
                 setUserBio(user.bio || "");
                 setUserStatus(user.status || 'Meraklı');
                 const initialAvatar = user.avatar || `https://api.dicebear.com/8.x/personas/svg?seed=${(user.name || 'User').replace(/\s/g, '')}&size=128`;
                 setAvatarUrl(initialAvatar);
                 setSessionAvatarHistory([initialAvatar]);
                 setCurrentHistoryIndex(0);
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
        avatar: avatarUrl || undefined,
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

  const handleGenerateNewAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatarUrl = `https://api.dicebear.com/8.x/personas/svg?seed=${randomSeed}&size=128`;
    
    // Remove subsequent history if any
    const newHistory = sessionAvatarHistory.slice(0, currentHistoryIndex + 1);
    newHistory.push(newAvatarUrl);

    setSessionAvatarHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
    setAvatarUrl(newAvatarUrl);
    toast({ title: "Yeni Avatar Oluşturuldu", description: "Kaydetmeyi unutmayın." });
  };

  const handlePreviousAvatar = () => {
    if (currentHistoryIndex > 0) {
        const newIndex = currentHistoryIndex - 1;
        setCurrentHistoryIndex(newIndex);
        setAvatarUrl(sessionAvatarHistory[newIndex]);
    }
  };

  const handleNextAvatar = () => {
     if (currentHistoryIndex < sessionAvatarHistory.length - 1) {
        const newIndex = currentHistoryIndex + 1;
        setCurrentHistoryIndex(newIndex);
        setAvatarUrl(sessionAvatarHistory[newIndex]);
    } else {
        // If at the end of history, generate a new one
        handleGenerateNewAvatar();
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
        router.replace('/');
    }, 1500);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      window.dispatchEvent(new CustomEvent('currentUserUpdated'));
    }
    toast({ title: "Çıkış Başarılı", description: "Başarıyla çıkış yaptınız." });
    router.replace('/');
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
                <AvatarImage src={avatarUrl || undefined} alt={currentUser.name || currentUser.username || ''} data-ai-hint="user persona avatar"/>
                <AvatarFallback className="text-4xl bg-muted">{(currentUser.name || currentUser.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-center gap-2 w-full">
                 <Button type="button" variant="outline" size="icon" onClick={handlePreviousAvatar} disabled={isSavingProfile || currentHistoryIndex <= 0} className="text-xs h-9 w-9 rounded-full">
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">Önceki Avatar</span>
                 </Button>
                 <Button type="button" variant="outline" size="icon" onClick={handleNextAvatar} disabled={isSavingProfile} className="text-xs h-9 w-9 rounded-full">
                    <ChevronRight className="h-5 w-5" />
                     <span className="sr-only">Sonraki Avatar / Yeni Üret</span>
                 </Button>
              </div>
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
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-6 bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl">
                <TabsTrigger value="general" className="gap-1.5"><SettingsIcon className="h-4 w-4"/>Genel</TabsTrigger>
                <TabsTrigger value="security" className="gap-1.5"><KeyRound className="h-4 w-4"/>Güvenlik</TabsTrigger>
                <TabsTrigger value="account" className="gap-1.5"><UserCircle className="h-4 w-4"/>Hesap</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card className="bg-card/80 dark:bg-card/60 backdrop-blur-sm shadow-xl border border-border/30 rounded-xl">
                  <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Palette className="h-5 w-5 text-primary"/>Görünüm ve Diğer Ayarlar</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="theme-toggle" className="text-base">Tema Seçimi</Label>
                      <ThemeToggle />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="profile-timezone" className="flex items-center gap-1.5"><Clock className="h-4 w-4"/>Saat Dilimi</Label>
                        <Select disabled onValueChange={(value) => toast({title:"Yakında!", description:`Saat dilimi ${value} olarak ayarlanacak.`})}>
                            <SelectTrigger id="profile-timezone"><SelectValue placeholder="Europe/Istanbul (Yakında)" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Europe/Istanbul">Europe/Istanbul</SelectItem>
                                <SelectItem value="America/New_York">America/New York</SelectItem>
                                <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="profile-visibility" className="flex items-center gap-1.5"><Eye className="h-4 w-4"/>Profil Görünürlüğü</Label>
                         <Select disabled onValueChange={(value) => toast({title:"Yakında!", description:`Profil görünürlüğü ${value} olarak ayarlanacak.`})}>
                            <SelectTrigger id="profile-visibility"><SelectValue placeholder="Herkese Açık (Yakında)" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public">Herkese Açık</SelectItem>
                                <SelectItem value="private">Gizli</SelectItem>
                                <SelectItem value="friends_only">Sadece Arkadaşlar (Yakında)</SelectItem>
                            </SelectContent>
                        </Select>
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
                  <CardHeader><CardTitle className="text-xl flex items-center gap-2"><UserCircle className="h-5 w-5 text-primary"/>Hesap Yönetimi</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                     <Button variant="outline" onClick={() => toast({title:"Yakında!", description:"Hesabı geçici olarak devre dışı bırakma özelliği yakında!"})} className="w-full sm:w-auto justify-start gap-2">
                         Hesabı Geçici Olarak Devre Dışı Bırak (Yakında)
                    </Button>
                    <div>
                        <h4 className="font-medium mb-1 flex items-center gap-1.5"><Clock className="h-4 w-4"/>Son Giriş Aktiviteleri (Yakında)</h4>
                        <p className="text-xs text-muted-foreground">
                            Hesabınıza yapılan son giriş denemeleri ve başarılı girişler burada listelenecektir.
                        </p>
                    </div>
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
                        <LogOutIcon className="mr-2 h-4 w-4" /> Çıkış Yap
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
