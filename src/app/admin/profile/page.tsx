
"use client"; // Add 'use client' for handling form state and interactions

import * as React from "react"; // Import React for state management
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea"; // Added Textarea for Bio
import { toast } from "@/hooks/use-toast"; // Import toast for feedback
import { Twitter, Linkedin, Globe } from 'lucide-react'; // Added icons for social links

export default function AdminProfilePage() {

  // TODO: Replace with actual user data fetching and state management
  const [fullName, setFullName] = React.useState("Admin User");
  const [bio, setBio] = React.useState("TeknoBiyo yöneticisi.");
  const [website, setWebsite] = React.useState("https://teknobiyo.example.com");
  const [twitter, setTwitter] = React.useState("teknobiyo");
  const [linkedin, setLinkedin] = React.useState("teknobiyo");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Placeholder save functions - replace with actual API calls
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving profile:", { fullName, bio, website, twitter, linkedin });
    // Add API call logic here
    toast({ title: "Profil Güncellendi", description: "Kişisel bilgileriniz başarıyla kaydedildi." });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
     e.preventDefault();
    console.log("Changing password...");
     if (newPassword !== confirmPassword) {
         toast({ variant: "destructive", title: "Hata", description: "Yeni şifreler eşleşmiyor." });
         return;
     }
     if (newPassword.length < 8) {
          toast({ variant: "destructive", title: "Hata", description: "Yeni şifre en az 8 karakter olmalıdır." });
          return;
     }
     // Add API call logic here to verify current password and update
     toast({ title: "Şifre Değiştirildi", description: "Şifreniz başarıyla güncellendi." });
     // Clear password fields after successful change
     setCurrentPassword("");
     setNewPassword("");
     setConfirmPassword("");
  };

    // Placeholder for image upload logic
   const handleAvatarChange = () => {
     // Trigger file input or open modal
     console.log("Changing avatar...");
      toast({ title: "Özellik Yakında", description: "Profil resmi değiştirme özelliği yakında eklenecektir." });
   };


  return (
    <div className="space-y-8"> {/* Increased spacing */}
      <h1 className="text-3xl font-bold">Profil Ayarları</h1>

      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Kişisel Bilgiler</CardTitle>
          <CardDescription>Herkese açık profil bilgilerinizi güncelleyin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSave} className="space-y-6"> {/* Increased spacing */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"> {/* Adjusted for responsive layout */}
                <Avatar className="h-20 w-20"> {/* Larger Avatar */}
                <AvatarImage src="https://picsum.photos/seed/admin-avatar/128/128" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-2 items-center sm:items-start">
                    <Button type="button" variant="outline" onClick={handleAvatarChange}>Profil Resmini Değiştir</Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG veya GIF. Maks. 800KB.</p>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Grid layout for inputs */}
                <div className="space-y-2">
                    <Label htmlFor="full-name">Tam Ad</Label>
                    <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input id="email" type="email" defaultValue="admin@example.com" disabled />
                    <p className="text-xs text-muted-foreground">E-posta adresi güvenlik nedeniyle değiştirilemez.</p>
                </div>
             </div>
            <div className="space-y-2">
                <Label htmlFor="bio">Biyografi</Label>
                <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Kendinizden kısaca bahsedin..." rows={3} />
            </div>

            {/* Social Links */}
             <div className="space-y-4">
                <h3 className="text-base font-medium">Sosyal Medya Bağlantıları</h3>
                 <div className="space-y-2 flex items-center gap-3">
                     <Label htmlFor="website" className="w-8 pt-2"><Globe className="h-5 w-5 text-muted-foreground" /></Label>
                    <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" />
                </div>
                <div className="space-y-2 flex items-center gap-3">
                    <Label htmlFor="twitter" className="w-8 pt-2"><Twitter className="h-5 w-5 text-muted-foreground" /></Label>
                    <div className="flex items-center w-full">
                       <span className="text-muted-foreground text-sm px-3 border border-r-0 rounded-l-md h-10 flex items-center bg-muted">twitter.com/</span>
                       <Input id="twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="kullaniciadiniz" className="rounded-l-none"/>
                    </div>
                </div>
                 <div className="space-y-2 flex items-center gap-3">
                     <Label htmlFor="linkedin" className="w-8 pt-2"><Linkedin className="h-5 w-5 text-muted-foreground" /></Label>
                      <div className="flex items-center w-full">
                         <span className="text-muted-foreground text-sm px-3 border border-r-0 rounded-l-md h-10 flex items-center bg-muted">linkedin.com/in/</span>
                        <Input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="profil-url" className="rounded-l-none" />
                     </div>
                </div>
             </div>

             <Separator />
             <div className="flex justify-end">
                <Button type="submit">Kişisel Bilgileri Kaydet</Button>
             </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle>Şifre Değiştir</CardTitle>
          <CardDescription>Güvenliğiniz için güçlü ve benzersiz bir şifre kullanın.</CardDescription>
        </CardHeader>
        <CardContent>
           <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="current-password">Mevcut Şifre</Label>
                    <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Yeni Şifre</Label>
                        <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                         <p className="text-xs text-muted-foreground">En az 8 karakter olmalıdır.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Yeni Şifre Tekrar</Label>
                        <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                </div>
                 <Separator />
                 <div className="flex justify-end">
                     <Button type="submit">Şifreyi Değiştir</Button>
                 </div>
           </form>
        </CardContent>
      </Card>

    </div>
  );
}
