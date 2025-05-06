"use client";

import * as React from "react";
import { notFound, useParams, useRouter } from 'next/navigation'; // Added useRouter
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button"; // Import buttonVariants
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Added for Bio
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Trash2, KeyRound, Activity, Loader2, Upload, Globe, Twitter, Linkedin, Instagram, Facebook, Youtube, X as XIcon } from "lucide-react"; // Added new icons for social media
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getUserById, updateUser as mockUpdateUser, deleteUser as mockDeleteUser, type User } from '@/lib/mock-data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";


// Mock activity data - replace with actual API call
const getUserActivity = async (userId: string): Promise<UserActivity[]> => {
     if (userId === 'u1') {
         return [
             { timestamp: '2024-07-22 11:00', action: 'Makale oluşturdu: "Yeni Teknoloji Trendleri"' },
             { timestamp: '2024-07-22 10:30', action: 'Giriş yaptı' },
             { timestamp: '2024-07-21 18:00', action: 'Profilini güncelledi' },
         ];
     }
     return [
         { timestamp: '2024-07-21 15:00', action: 'Giriş yaptı' },
         { timestamp: '2024-07-20 14:00', action: 'Yorum yaptı: "Yapay Zeka Devrimi"' },
     ];
}

interface UserActivity {
    timestamp: string;
    action: string;
}


export default function EditUserPage() {
    const params = useParams();
    const userId = React.use(params.id) as string; // Correctly use React.use for dynamic segment

    const router = useRouter();

    const [user, setUser] = React.useState<User | null>(null);
    const [activity, setActivity] = React.useState<UserActivity[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [name, setName] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [role, setRole] = React.useState("");
    const [avatar, setAvatar] = React.useState("");
    const [bio, setBio] = React.useState("");
    const [website, setWebsite] = React.useState("");
    const [twitterHandle, setTwitterHandle] = React.useState("");
    const [linkedinProfile, setLinkedinProfile] = React.useState("");
    const [instagramProfile, setInstagramProfile] = React.useState("");
    const [facebookProfile, setFacebookProfile] = React.useState("");
    const [youtubeChannel, setYoutubeChannel] = React.useState("");
    const [xProfile, setXProfile] = React.useState("");


    const [isSaving, setIsSaving] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    // State for AlertDialog
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);


    React.useEffect(() => {
        if (!userId || typeof userId !== 'string') {
            console.error("Invalid or missing userId:", userId);
            setLoading(false);
            notFound();
            return;
        }

        setLoading(true);
        Promise.all([getUserById(userId as string), getUserActivity(userId as string)])
            .then(([userData, userActivityData]) => {
                if (userData) {
                    setUser(userData);
                    setName(userData.name);
                    setUsername(userData.username);
                    setRole(userData.role);
                    setAvatar(userData.avatar || '');
                    setBio(userData.bio || '');
                    setWebsite(userData.website || '');
                    setTwitterHandle(userData.twitterHandle || '');
                    setLinkedinProfile(userData.linkedinProfile || '');
                    setInstagramProfile(userData.instagramProfile || '');
                    setFacebookProfile(userData.facebookProfile || '');
                    setYoutubeChannel(userData.youtubeChannel || '');
                    setXProfile(userData.xProfile || '');
                    setActivity(userActivityData);
                } else {
                    notFound();
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                toast({ variant: "destructive", title: "Hata", description: "Kullanıcı bilgileri yüklenirken bir sorun oluştu." });
            })
            .finally(() => setLoading(false));

    }, [userId]);

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
             if (file.size > 2 * 1024 * 1024) { // Max 2MB
                toast({ variant: "destructive", title: "Dosya Çok Büyük", description: "Lütfen 2MB'den küçük bir resim dosyası seçin." });
                return;
            }
            if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
                toast({ variant: "destructive", title: "Geçersiz Dosya Türü", description: "Lütfen PNG, JPG veya GIF formatında bir resim seçin." });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
                 toast({ title: "Profil Resmi Güncellendi", description: "Yeni profil resmi yüklendi. Kaydetmeyi unutmayın." });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!user || !userId || typeof userId !== 'string') return;
        setIsSaving(true);
        try {
            const updatedUserData: Partial<User> = {
                name,
                role,
                username,
                avatar,
                bio,
                website,
                twitterHandle,
                linkedinProfile,
                instagramProfile,
                facebookProfile,
                youtubeChannel,
                xProfile,
            };
            const updatedUser = await mockUpdateUser(userId, updatedUserData);
            if (updatedUser) {
                 setUser(updatedUser);
                 setName(updatedUser.name);
                 setRole(updatedUser.role);
                 setUsername(updatedUser.username);
                 setAvatar(updatedUser.avatar || '');
                 setBio(updatedUser.bio || '');
                 setWebsite(updatedUser.website || '');
                 setTwitterHandle(updatedUser.twitterHandle || '');
                 setLinkedinProfile(updatedUser.linkedinProfile || '');
                 setInstagramProfile(updatedUser.instagramProfile || '');
                 setFacebookProfile(updatedUser.facebookProfile || '');
                 setYoutubeChannel(updatedUser.youtubeChannel || '');
                 setXProfile(updatedUser.xProfile || '');

                // Update localStorage with new name and avatar for header display
                if (typeof window !== 'undefined') {
                    const storedUser = localStorage.getItem('currentUser');
                    if (storedUser) {
                        const currentUserData = JSON.parse(storedUser);
                        if (currentUserData.id === userId) { // Only update if it's the logged-in user
                             localStorage.setItem('currentUser', JSON.stringify({
                                ...currentUserData,
                                name: updatedUser.name,
                                avatar: updatedUser.avatar
                            }));
                            window.dispatchEvent(new CustomEvent('currentUserUpdated'));
                        }
                    }
                }

                 toast({
                    title: "Kullanıcı Güncellendi",
                    description: `${updatedUser.name} kullanıcısının bilgileri başarıyla güncellendi.`,
                });
            } else {
                toast({ variant: "destructive", title: "Güncelleme Hatası", description: "Kullanıcı güncellenemedi."});
            }
        } catch (error: any) {
            console.error("Error updating user:", error);
            toast({ variant: "destructive", title: "Hata", description: error.message || "Kullanıcı güncellenirken bir sorun oluştu." });
        } finally {
            setIsSaving(false);
        }
    };

     const handleDeleteInitiate = () => {
        if (!user) return;
        setIsConfirmDeleteDialogOpen(true);
    };

     const confirmDelete = async () => {
        if (!user || !userId || typeof userId !== 'string') return;
        setIsDeleting(true);
        setIsConfirmDeleteDialogOpen(false);
        try {
            const success = await mockDeleteUser(userId);
            if (success) {
                toast({
                    variant: "destructive",
                    title: "Kullanıcı Silindi",
                    description: `${user.name} kullanıcısı silindi.`,
                });
                router.push('/admin/users');
            } else {
                toast({ variant: "destructive", title: "Silme Hatası", description: "Kullanıcı silinemedi." });
                 setIsDeleting(false);
            }
        } catch (error: any) {
             console.error("Error deleting user:", error);
             toast({ variant: "destructive", title: "Silme Hatası", description: error.message || "Kullanıcı silinirken bir hata oluştu." });
             setIsDeleting(false);
        }
    };

    const handlePasswordReset = () => {
         console.log("Sending password reset email to:", user?.email);
         toast({
             title: "Şifre Sıfırlama E-postası Gönderildi",
             description: `${user?.email} adresine şifre sıfırlama talimatları gönderildi.`,
         });
    };


    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="mr-2 h-6 w-6 animate-spin"/>Kullanıcı bilgileri yükleniyor...</div>;
    }

     if (!user) {
         return <div className="text-center py-10">Kullanıcı bulunamadı.</div>;
    }


    return (
        <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
         <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                     <Button variant="outline" size="sm" asChild className="mb-4">
                        <Link href="/admin/users"><ArrowLeft className="mr-2 h-4 w-4" /> Kullanıcı Listesine Dön</Link>
                     </Button>
                    <h1 className="text-3xl font-bold">Kullanıcıyı Düzenle</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
                 <div className="flex flex-wrap gap-2">
                     <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isDeleting || isSaving}>
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4" />} Kullanıcıyı Sil
                        </Button>
                    </AlertDialogTrigger>
                    <Button onClick={handleSave} disabled={isSaving || isDeleting}>
                         {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />} Değişiklikleri Kaydet
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Kullanıcı Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6"> {/* Increased spacing */}
                             <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <Avatar className="h-24 w-24"> {/* Larger Avatar */}
                                <AvatarImage src={avatar || `https://picsum.photos/seed/${user.username}/128/128`} alt={user.name} data-ai-hint="user avatar placeholder"/>
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col space-y-2 items-center sm:items-start">
                                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isSaving}>
                                        <Upload className="mr-2 h-4 w-4"/> Profil Resmi Yükle
                                    </Button>
                                    <Input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/gif"
                                        disabled={isSaving}
                                    />
                                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF (Maks. 2MB)</p>
                                </div>
                            </div>
                             <Separator />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tam Ad</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSaving}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Kullanıcı Adı</Label>
                                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))} required disabled={isSaving}/>
                                </div>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-posta</Label>
                                    <Input id="email" type="email" value={user.email} disabled />
                                     <p className="text-xs text-muted-foreground">E-posta adresi değiştirilemez.</p>
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="role">Rol</Label>
                                <Select value={role} onValueChange={setRole} required disabled={isSaving}>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Rol seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="User">User</SelectItem>
                                        <SelectItem value="Editor">Editor</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                </div>
                             </div>
                             <div className="space-y-2">
                                <Label htmlFor="bio">Biyografi</Label>
                                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Kullanıcı hakkında kısa bilgi..." rows={3} disabled={isSaving}/>
                             </div>

                             <Separator />
                             <h3 className="text-base font-medium">Sosyal Medya Bağlantıları</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="website" className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground"/>Web Sitesi</Label>
                                    <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" disabled={isSaving}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="x-profile" className="flex items-center gap-2"><XIcon className="h-4 w-4 text-muted-foreground"/>X (Twitter)</Label>
                                    <div className="flex items-center">
                                        <span className="text-muted-foreground text-sm px-3 border border-r-0 rounded-l-md h-10 flex items-center bg-muted">x.com/</span>
                                        <Input id="x-profile" value={xProfile} onChange={(e) => setXProfile(e.target.value)} placeholder="kullaniciadi" className="rounded-l-none" disabled={isSaving}/>
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="linkedin" className="flex items-center gap-2"><Linkedin className="h-4 w-4 text-muted-foreground"/>LinkedIn</Label>
                                    <div className="flex items-center">
                                        <span className="text-muted-foreground text-sm px-3 border border-r-0 rounded-l-md h-10 flex items-center bg-muted">linkedin.com/in/</span>
                                        <Input id="linkedin" value={linkedinProfile} onChange={(e) => setLinkedinProfile(e.target.value)} placeholder="profil-url" className="rounded-l-none" disabled={isSaving}/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="instagram" className="flex items-center gap-2"><Instagram className="h-4 w-4 text-muted-foreground"/>Instagram</Label>
                                    <div className="flex items-center">
                                        <span className="text-muted-foreground text-sm px-3 border border-r-0 rounded-l-md h-10 flex items-center bg-muted">instagram.com/</span>
                                        <Input id="instagram" value={instagramProfile} onChange={(e) => setInstagramProfile(e.target.value)} placeholder="kullaniciadi" className="rounded-l-none" disabled={isSaving}/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="facebook" className="flex items-center gap-2"><Facebook className="h-4 w-4 text-muted-foreground"/>Facebook</Label>
                                     <div className="flex items-center">
                                        <span className="text-muted-foreground text-sm px-3 border border-r-0 rounded-l-md h-10 flex items-center bg-muted">facebook.com/</span>
                                        <Input id="facebook" value={facebookProfile} onChange={(e) => setFacebookProfile(e.target.value)} placeholder="profil.adi" className="rounded-l-none" disabled={isSaving}/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="youtube" className="flex items-center gap-2"><Youtube className="h-4 w-4 text-muted-foreground"/>YouTube</Label>
                                     <div className="flex items-center">
                                        <span className="text-muted-foreground text-sm px-3 border border-r-0 rounded-l-md h-10 flex items-center bg-muted">youtube.com/</span>
                                        <Input id="youtube" value={youtubeChannel} onChange={(e) => setYoutubeChannel(e.target.value)} placeholder="@kanaladi veya channel/ID" className="rounded-l-none" disabled={isSaving}/>
                                    </div>
                                </div>
                             </div>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Kullanıcı Etkinlikleri</CardTitle>
                            <CardDescription>Kullanıcının son işlemleri.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {activity.length > 0 ? (
                                <ul className="space-y-3 text-sm text-muted-foreground max-h-60 overflow-y-auto pr-2">
                                    {activity.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                                            <span>{item.action}</span>
                                            <span className="text-xs whitespace-nowrap pl-4">{item.timestamp}</span>
                                        </li>
                                    ))}
                                </ul>
                             ) : (
                                <p className="text-sm text-muted-foreground">Bu kullanıcı için henüz bir etkinlik kaydedilmemiş.</p>
                             )}
                             <Button variant="link" size="sm" className="p-0 h-auto mt-4"><Activity className="mr-1 h-3 w-3"/> Tüm Etkinlikleri Görüntüle</Button>
                         </CardContent>
                     </Card>

                </div>

                 <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Hesap Yönetimi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <p className="text-xs text-muted-foreground">Katılma Tarihi: {new Date(user.joinedAt).toLocaleDateString('tr-TR')}</p>
                             <p className="text-xs text-muted-foreground">Son Giriş: {user.lastLogin ? new Date(user.lastLogin).toLocaleString('tr-TR') : '-'}</p>
                             <Separator/>
                            <Button variant="outline" className="w-full justify-start" onClick={handlePasswordReset} disabled={isSaving}>
                               <KeyRound className="mr-2 h-4 w-4" /> Şifre Sıfırlama E-postası Gönder
                            </Button>
                              <Button variant="outline" className="w-full justify-start" disabled>
                                Kullanıcıyı Askıya Al (Yakında)
                             </Button>
                        </CardContent>
                     </Card>
                 </div>
             </div>

              <Separator />
             <div className="flex justify-end gap-2">
                 <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting || isSaving}>
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4" />} Kullanıcıyı Sil
                    </Button>
                </AlertDialogTrigger>
                <Button onClick={handleSave} disabled={isSaving || isDeleting}>
                     {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />} Değişiklikleri Kaydet
                </Button>
             </div>

             <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                    <AlertDialogDescription>
                    "{user?.name}" kullanıcısını silmek üzeresiniz. Bu işlem geri alınamaz.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsConfirmDeleteDialogOpen(false)}>İptal</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete} className={cn(buttonVariants({ variant: "destructive" }))}>
                    Evet, Sil
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
         </form>
        </AlertDialog>
    );

}
