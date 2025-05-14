
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Upload, Save, KeyRound, Loader2, Globe, Twitter, Linkedin, Instagram, Facebook, Youtube, X as XIcon, Newspaper, BookCopy, Eye } from 'lucide-react';
import { getUserById, updateUser, type User } from '@/lib/data/users'; // Updated import
import { getArticles, type ArticleData } from '@/lib/data/articles'; // Updated import
import { getNotes, type NoteData } from '@/lib/data/notes'; // Updated import

interface UserContentStats {
    articlesCount: number;
    notesCount: number;
    totalArticleViews: number;
    totalNoteViews: number;
}

export default function AdminProfilePage() {
  const router = useRouter();

  const [userId, setUserId] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isSavingPassword, setIsSavingPassword] = React.useState(false);
  const [contentStats, setContentStats] = React.useState<UserContentStats>({
    articlesCount: 0,
    notesCount: 0,
    totalArticleViews: 0,
    totalNoteViews: 0,
  });


  const [fullName, setFullName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [twitterHandle, setTwitterHandle] = React.useState("");
  const [linkedinProfile, setLinkedinProfile] = React.useState("");
  const [instagramProfile, setInstagramProfile] = React.useState("");
  const [facebookProfile, setFacebookProfile] = React.useState("");
  const [youtubeChannel, setYoutubeChannel] = React.useState("");
  const [xProfile, setXProfile] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState("");

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserString = localStorage.getItem('currentUser');
      if (storedUserString) {
        try {
          const storedUser = JSON.parse(storedUserString);
          if (storedUser && storedUser.id) {
            setUserId(storedUser.id);
          } else {
            console.error("User ID not found in stored currentUser object.");
            toast({ variant: "destructive", title: "Hata", description: "Oturum bilgileri bulunamadı. Lütfen tekrar giriş yapın." });
            router.push('/login');
          }
        } catch (e) {
          console.error("Error parsing currentUser from localStorage:", e);
          toast({ variant: "destructive", title: "Hata", description: "Oturum bilgileri okunamadı." });
          router.push('/login');
        }
      } else {
        toast({ variant: "destructive", title: "Oturum Yok", description: "Lütfen giriş yapın." });
        router.push('/login');
      }
    }
  }, [router]);


  React.useEffect(() => {
    if (userId) {
      setLoading(true);
      Promise.all([
        getUserById(userId),
        getArticles(),
        getNotes()
      ]).then(([userData, allArticles, allNotes]) => {
          if (userData) {
            setUser(userData);
            setFullName(userData.name || "");
            setUsername(userData.username || "");
            setEmail(userData.email || "");
            setBio(userData.bio || "");
            setWebsite(userData.website || "");
            setTwitterHandle(userData.twitterHandle || "");
            setLinkedinProfile(userData.linkedinProfile || "");
            setInstagramProfile(userData.instagramProfile || "");
            setFacebookProfile(userData.facebookProfile || "");
            setYoutubeChannel(userData.youtubeChannel || "");
            setXProfile(userData.xProfile || "");
            setAvatarUrl(userData.avatar || "https://picsum.photos/seed/default-avatar/128/128");

            const userArticles = allArticles.filter(article => article.authorId === userId);
            const userNotes = allNotes.filter(note => note.authorId === userId);
            const totalArticleViews = userArticles.reduce((sum, _) => sum + Math.floor(Math.random() * 500) + 50, 0);
            const totalNoteViews = userNotes.reduce((sum, _) => sum + Math.floor(Math.random() * 200) + 20, 0);

            setContentStats({
                articlesCount: userArticles.length,
                notesCount: userNotes.length,
                totalArticleViews,
                totalNoteViews,
            });

          } else {
            toast({ variant: "destructive", title: "Hata", description: "Kullanıcı profili bulunamadı." });
          }
        })
        .catch(err => {
          console.error("Error fetching user profile or content:", err);
          toast({ variant: "destructive", title: "Hata", description: "Profil veya içerik bilgileri yüklenirken bir sorun oluştu." });
        })
        .finally(() => setLoading(false));
    }
  }, [userId]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
        toast({ variant: "destructive", title: "Hata", description: "Kullanıcı ID bulunamadı." });
        return;
    }
    setIsSavingProfile(true);
    const updatedData: Partial<Omit<User, 'id' | 'email' | 'joinedAt' | 'lastLogin' | 'role'>> = {
      name: fullName,
      username,
      avatar: avatarUrl,
      bio,
      website,
      twitterHandle,
      linkedinProfile,
      instagramProfile,
      facebookProfile,
      youtubeChannel,
      xProfile,
    };

    try {
      const result = await updateUser(userId, updatedData);
      if (result) {
        setUser(result);
        if (typeof window !== 'undefined') {
            const storedCurrentUser = localStorage.getItem('currentUser');
            if (storedCurrentUser) {
                try {
                    const currentUserData = JSON.parse(storedCurrentUser);
                    if (currentUserData.id === userId) {
                        localStorage.setItem('currentUser', JSON.stringify({
                            ...currentUserData,
                            name: result.name,
                            avatar: result.avatar,
                            username: result.username,
                        }));
                        window.dispatchEvent(new CustomEvent('currentUserUpdated'));
                    }
                } catch (e) { console.error("Failed to update localStorage user", e); }
            }
        }
        toast({ title: "Profil Güncellendi", description: "Kişisel bilgileriniz başarıyla kaydedildi." });
      } else {
        toast({ variant: "destructive", title: "Güncelleme Hatası", description: "Profil güncellenemedi." });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({ variant: "destructive", title: "Hata", description: "Profil kaydedilirken bir hata oluştu." });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPassword(true);
    console.log("Changing password (simulated)...");
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Hata", description: "Yeni şifreler eşleşmiyor." });
      setIsSavingPassword(false);
      return;
    }
    if (newPassword.length < 8) {
      toast({ variant: "destructive", title: "Hata", description: "Yeni şifre en az 8 karakter olmalıdır." });
      setIsSavingPassword(false);
      return;
    }
    setTimeout(() => {
      toast({ title: "Şifre Değiştirildi (Simülasyon)", description: "Şifreniz başarıyla güncellendi." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsSavingPassword(false);
    }, 1000);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ variant: "destructive", title: "Dosya Çok Büyük", description: "Lütfen 2MB'den küçük bir resim dosyası seçin." });
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type)) {
        toast({ variant: "destructive", title: "Geçersiz Dosya Türü", description: "Lütfen PNG, JPG, GIF veya WEBP formatında bir resim seçin." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        toast({ title: "Profil Resmi Önizlemesi Güncellendi", description: "Değişiklikleri kaydetmeyi unutmayın." });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        Profil yükleniyor...
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-10 text-destructive">Kullanıcı profili yüklenemedi veya oturum bulunamadı.</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Profil Ayarları</h1>

      <Card>
        <CardHeader>
          <CardTitle>Kişisel Bilgiler</CardTitle>
          <CardDescription>Herkese açık profil bilgilerinizi güncelleyin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} alt={fullName || username} data-ai-hint="user avatar placeholder"/>
                <AvatarFallback>{(fullName || username || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-2 items-center sm:items-start">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isSavingProfile}>
                  <Upload className="mr-2 h-4 w-4" /> Profil Resmini Değiştir
                </Button>
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleAvatarChange}
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  disabled={isSavingProfile}
                />
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP. Maks. 2MB.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full-name">Tam Ad</Label>
                <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isSavingProfile} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))} required disabled={isSavingProfile} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" value={email} disabled />
              <p className="text-xs text-muted-foreground">E-posta adresi güvenlik nedeniyle değiştirilemez.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biyografi</Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Kendinizden kısaca bahsedin..." rows={3} disabled={isSavingProfile} />
            </div>

            <Separator />
            <h3 className="text-lg font-medium">Sosyal Medya Bağlantıları</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" />Web Sitesi</Label>
                <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" disabled={isSavingProfile} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="x-profile" className="flex items-center gap-2"><XIcon className="h-4 w-4 text-muted-foreground" />X (Twitter)</Label>
                <div className="flex items-center">
                  <span className="text-muted-foreground text-sm px-3 border border-r-0 rounded-l-md h-10 flex items-center bg-muted">x.com/</span>
                  <Input id="x-profile" value={xProfile} onChange={(e) => setXProfile(e.target.value)} placeholder="kullaniciadi" className="rounded-l-none" disabled={isSavingProfile} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2"><Linkedin className="h-4 w-4 text-muted-foreground" />LinkedIn</Label>
                <div className="flex items-center">
                  <span className="text-muted-foreground text-sm px-3 border border-r-0 rounded-l-md h-10 flex items-center bg-muted">linkedin.com/in/</span>
                  <Input id="linkedin" value={linkedinProfile} onChange={(e) => setLinkedinProfile(e.target.value)} placeholder="profil-url" className="rounded-l-none" disabled={isSavingProfile} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2"><Instagram className="h-4 w-4 text-muted-foreground" />Instagram</Label>
                <div className="flex items-center">
                  <span className="text-muted-foreground text-sm px-3 border border-r-0 rounded-l-md h-10 flex items-center bg-muted">instagram.com/</span>
                  <Input id="instagram" value={instagramProfile} onChange={(e) => setInstagramProfile(e.target.value)} placeholder="kullaniciadi" className="rounded-l-none" disabled={isSavingProfile} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook" className="flex items-center gap-2"><Facebook className="h-4 w-4 text-muted-foreground" />Facebook</Label>
                <div className="flex items-center">
                  <span className="text-muted-foreground text-sm px-3 border border-r-0 rounded-l-md h-10 flex items-center bg-muted">facebook.com/</span>
                  <Input id="facebook" value={facebookProfile} onChange={(e) => setFacebookProfile(e.target.value)} placeholder="profil.adi" className="rounded-l-none" disabled={isSavingProfile} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube" className="flex items-center gap-2"><Youtube className="h-4 w-4 text-muted-foreground" />YouTube</Label>
                <div className="flex items-center">
                  <span className="text-muted-foreground text-sm px-3 border border-r-0 rounded-l-md h-10 flex items-center bg-muted">youtube.com/</span>
                  <Input id="youtube" value={youtubeChannel} onChange={(e) => setYoutubeChannel(e.target.value)} placeholder="@kanaladi veya channel/ID" className="rounded-l-none" disabled={isSavingProfile} />
                </div>
              </div>
            </div>

            <Separator />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSavingProfile}>
                {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Profili Kaydet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Şifre Değiştir</CardTitle>
          <CardDescription>Güvenliğiniz için güçlü ve benzersiz bir şifre kullanın.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mevcut Şifre</Label>
              <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required disabled={isSavingPassword} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="new-password">Yeni Şifre</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={isSavingPassword} />
                <p className="text-xs text-muted-foreground">En az 8 karakter olmalıdır.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Yeni Şifre Tekrar</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isSavingPassword} />
              </div>
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSavingPassword}>
                {isSavingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                Şifreyi Değiştir
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

        <Card>
            <CardHeader>
                <CardTitle>İçerik İstatistikleri</CardTitle>
                <CardDescription>Bu kullanıcının oluşturduğu içeriklerin genel özeti.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-secondary/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Newspaper className="h-4 w-4 text-primary" />
                            Toplam Makale
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{contentStats.articlesCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Toplam Görüntülenme: {contentStats.totalArticleViews.toLocaleString()} (simüle)
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-secondary/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <BookCopy className="h-4 w-4 text-green-600" />
                            Toplam Biyoloji Notu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{contentStats.notesCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Toplam Görüntülenme: {contentStats.totalNoteViews.toLocaleString()} (simüle)
                        </p>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>

    </div>
  );
}
