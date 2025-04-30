
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
import { ArrowLeft, Save, Trash2, KeyRound, Activity } from "lucide-react"; // Added icons
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge"; // For status/role

// Mock data fetching - replace with actual API call
const getUserById = async (id: string): Promise<User | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users: User[] = [
         { id: 'u1', name: 'Ali Veli', email: 'ali.veli@example.com', role: 'Admin', joinedAt: '2024-01-15', avatar: 'https://picsum.photos/seed/u1/128/128', lastLogin: '2024-07-22 10:30' },
         { id: 'u2', name: 'Ayşe Kaya', email: 'ayse.kaya@example.com', role: 'Editor', joinedAt: '2024-03-22', avatar: 'https://picsum.photos/seed/u2/128/128', lastLogin: '2024-07-21 15:00' },
         { id: 'u3', name: 'Mehmet Yılmaz', email: 'mehmet.yilmaz@example.com', role: 'User', joinedAt: '2024-06-10', avatar: 'https://picsum.photos/seed/u3/128/128', lastLogin: '2024-07-20 09:15' },
    ];
    return users.find(user => user.id === id) || null;
};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  avatar: string;
  lastLogin: string; // Added last login example
}

// Mock activity data - replace with actual API call
const getUserActivity = async (userId: string): Promise<UserActivity[]> => {
     await new Promise(resolve => setTimeout(resolve, 700));
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
    const userId = params.id as string;

    const [user, setUser] = React.useState<User | null>(null);
    const [activity, setActivity] = React.useState<UserActivity[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [name, setName] = React.useState("");
    const [role, setRole] = React.useState("");

    React.useEffect(() => {
        if (userId) {
            Promise.all([getUserById(userId), getUserActivity(userId)])
                .then(([userData, userActivityData]) => {
                    if (userData) {
                        setUser(userData);
                        setName(userData.name);
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

    const handleSave = () => {
        console.log("Updating user:", { userId, name, role });
        // TODO: Implement actual API call to update user details (name, role)
        toast({
            title: "Kullanıcı Güncellendi",
            description: `${name} kullanıcısının bilgileri başarıyla güncellendi.`,
        });
         // Refetch or update local state if necessary
        if(user) setUser({...user, name, role});
    };

     const handleDelete = () => {
        if (window.confirm(`${name} (${user?.email}) kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            console.log("Deleting user:", userId);
            // TODO: Implement actual API call to delete the user
             toast({
                 variant: "destructive",
                 title: "Kullanıcı Silindi",
                 description: `${name} kullanıcısı silindi.`,
            });
            // TODO: Redirect to users list page
             // router.push('/admin/users');
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
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Kullanıcıyı Sil
                    </Button>
                    <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet
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
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm text-muted-foreground">Katılma Tarihi: {user.joinedAt}</p>
                                    <p className="text-sm text-muted-foreground">Son Giriş: {user.lastLogin}</p>
                                </div>
                            </div>
                             <Separator />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tam Ad</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-posta</Label>
                                    <Input id="email" type="email" value={user.email} disabled />
                                     <p className="text-xs text-muted-foreground">E-posta adresi değiştirilemez.</p>
                                </div>
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
                 <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" /> Kullanıcıyı Sil
                </Button>
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet
                </Button>
             </div>
         </form>
    );
}
