
"use client";

import * as React from "react";
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Trash2, KeyRound, Activity, Loader2 } from "lucide-react"; // Added Loader2
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge"; // For status/role
import { getUserById, updateUser as mockUpdateUser, deleteUser as mockDeleteUser, type User } from '@/lib/mock-data'; // Renamed functions for clarity


// Mock activity data - replace with actual API call
const getUserActivity = async (userId: string): Promise<UserActivity[]> => {
     // await new Promise(resolve => setTimeout(resolve, 700)); // Removed delay
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
    const userId = React.use(params.id) as string;

    const [user, setUser] = React.useState<User | null>(null);
    const [activity, setActivity] = React.useState<UserActivity[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [name, setName] = React.useState("");
    const [username, setUsername] = React.useState(""); // Added username state
    const [role, setRole] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);


    React.useEffect(() => {
        if (userId) {
            Promise.all([getUserById(userId), getUserActivity(userId)])
                .then(([userData, userActivityData]) => {
                    if (userData) {
                        setUser(userData);
                        setName(userData.name);
                        setUsername(userData.username); // Set username
                        setRole(userData.role);
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
        }
    }, [userId]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            // Username is not updatable in this mock setup after creation, so we don't pass it to mockUpdateUser
            const updatedUser = await mockUpdateUser(userId, { name, role });
            if (updatedUser) {
                 setUser(updatedUser); // Update local state
                 setName(updatedUser.name); // Re-sync form fields
                 setRole(updatedUser.role);
                 setUsername(updatedUser.username); // Re-sync username although it's not changed
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

     const handleDelete = async () => {
        if (!user) return;
        if (window.confirm(`${user.name} (${user.email}) kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            setIsDeleting(true);
            try {
                const success = await mockDeleteUser(userId);
                if (success) {
                    toast({
                        variant: "destructive",
                        title: "Kullanıcı Silindi",
                        description: `${user.name} kullanıcısı silindi.`,
                    });
                    // Redirect to users list page (using next/navigation is better but window.location for simplicity here)
                    window.location.href = '/admin/users';
                } else {
                    toast({ variant: "destructive", title: "Silme Hatası", description: "Kullanıcı silinemedi." });
                     setIsDeleting(false);
                }
            } catch (error: any) {
                 console.error("Error deleting user:", error);
                 toast({ variant: "destructive", title: "Silme Hatası", description: error.message || "Kullanıcı silinirken bir hata oluştu." });
                 setIsDeleting(false);
            }
            // No finally block for setIsDeleting(false) here if redirecting on success
        }
    };

    const handlePasswordReset = () => {
         console.log("Sending password reset email to:", user?.email);
         // TODO: Implement API call to trigger password reset flow for the user
         toast({
             title: "Şifre Sıfırlama E-postası Gönderildi",
             description: `${user?.email} adresine şifre sıfırlama talimatları gönderildi.`,
         });
    };


    if (loading) {
        return <div className="flex justify-center items-center h-64">Kullanıcı bilgileri yükleniyor...</div>;
    }

     if (!user) {
         return <div className="text-center py-10">Kullanıcı bulunamadı.</div>;
    }


    return (
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
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting || isSaving}>
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4" />} Kullanıcıyı Sil
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || isDeleting}>
                         {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />} Değişiklikleri Kaydet
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Details */}
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Kullanıcı Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16">
                                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar placeholder"/>
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm text-muted-foreground">Katılma Tarihi: {new Date(user.joinedAt).toLocaleDateString('tr-TR')}</p>
                                    <p className="text-sm text-muted-foreground">Son Giriş: {user.lastLogin ? new Date(user.lastLogin).toLocaleString('tr-TR') : '-'}</p>
                                </div>
                            </div>
                             <Separator />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tam Ad</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Kullanıcı Adı</Label>
                                    <Input id="username" value={username} disabled />
                                    <p className="text-xs text-muted-foreground">Kullanıcı adı değiştirilemez.</p>
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
                                <Select value={role} onValueChange={setRole} required>
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
                             {/* Optional: Add link to full activity log */}
                             <Button variant="link" size="sm" className="p-0 h-auto mt-4"><Activity className="mr-1 h-3 w-3"/> Tüm Etkinlikleri Görüntüle</Button>
                         </CardContent>
                     </Card>

                </div>

                {/* Actions Sidebar */}
                 <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Hesap Yönetimi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full justify-start" onClick={handlePasswordReset}>
                               <KeyRound className="mr-2 h-4 w-4" /> Şifre Sıfırlama E-postası Gönder
                            </Button>
                             {/* Add other actions like Suspend User, Force Logout etc. */}
                              <Button variant="outline" className="w-full justify-start" disabled>
                                {/* Placeholder for future action */}
                                Kullanıcıyı Askıya Al (Yakında)
                             </Button>
                        </CardContent>
                     </Card>
                     {/* Could add cards for user stats, groups, permissions etc. here */}
                 </div>
             </div>

              <Separator />
             <div className="flex justify-end gap-2">
                 <Button variant="destructive" onClick={handleDelete} disabled={isDeleting || isSaving}>
                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4" />} Kullanıcıyı Sil
                </Button>
                <Button onClick={handleSave} disabled={isSaving || isDeleting}>
                     {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />} Değişiklikleri Kaydet
                </Button>
             </div>
         </form>
    );
}

