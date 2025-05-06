
"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { createUser, type User } from "@/lib/mock-data"; // Import createUser

export default function AdminNewUserPage() {
    const router = useRouter();
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [role, setRole] = React.useState<User['role']>("User"); // Default to 'User'
    const [password, setPassword] = React.useState(""); // Basic password field
    const [saving, setSaving] = React.useState(false);

    const handleSave = async () => {
        if (!name || !email || !role || !password) {
            toast({ variant: "destructive", title: "Eksik Bilgi", description: "Lütfen tüm zorunlu alanları doldurun." });
            return;
        }
        if (password.length < 6) { // Basic password length check
            toast({ variant: "destructive", title: "Geçersiz Şifre", description: "Şifre en az 6 karakter olmalıdır." });
            return;
        }

        setSaving(true);
        try {
            // Note: In a real app, password should be hashed securely on the backend.
            // Here we are just passing it for the mock data structure.
            const newUser = await createUser({ name, email, role }); // Password is not part of User type for createUser
            if (newUser) {
                toast({
                    title: "Kullanıcı Oluşturuldu",
                    description: `"${newUser.name}" kullanıcısı başarıyla oluşturuldu.`,
                });
                router.push('/admin/users'); // Redirect to user list
            } else {
                toast({ variant: "destructive", title: "Oluşturma Hatası", description: "Kullanıcı oluşturulamadı." });
                setSaving(false);
            }
        } catch (error: any) {
            console.error("Error creating user:", error);
            toast({ variant: "destructive", title: "Oluşturma Hatası", description: error.message || "Kullanıcı oluşturulurken bir hata oluştu." });
            setSaving(false);
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <Button variant="outline" size="sm" asChild className="mb-4">
                        <Link href="/admin/users"><ArrowLeft className="mr-2 h-4 w-4" /> Kullanıcı Listesine Dön</Link>
                    </Button>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <UserPlus className="h-8 w-8 text-primary" /> Yeni Kullanıcı Ekle
                    </h1>
                    <p className="text-muted-foreground">Yeni bir kullanıcı hesabı oluşturun.</p>
                </div>
                <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Kullanıcıyı Kaydet
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Kullanıcı Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tam Ad <span className="text-destructive">*</span></Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta <span className="text-destructive">*</span></Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Rol <span className="text-destructive">*</span></Label>
                            <Select value={role} onValueChange={(value) => setRole(value as User['role'])} required>
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
                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre <span className="text-destructive">*</span></Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="En az 6 karakter"/>
                             <p className="text-xs text-muted-foreground">Kullanıcı ilk girişinde şifresini değiştirmelidir.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
             <div className="flex justify-end">
                 <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Kullanıcıyı Kaydet
                </Button>
            </div>
        </form>
    );
}

    