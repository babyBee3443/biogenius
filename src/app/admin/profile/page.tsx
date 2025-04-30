
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profil Ayarları</h1>

      <Card>
        <CardHeader>
          <CardTitle>Kişisel Bilgiler</CardTitle>
          <CardDescription>Profil bilgilerinizi güncelleyin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center space-x-4">
             <Avatar className="h-16 w-16">
               <AvatarImage src="https://picsum.photos/seed/admin-avatar/128/128" alt="Admin" />
               <AvatarFallback>AD</AvatarFallback>
             </Avatar>
             <Button variant="outline">Profil Resmini Değiştir</Button>
           </div>
          <div className="space-y-2">
            <Label htmlFor="full-name">Tam Ad</Label>
            <Input id="full-name" defaultValue="Admin User" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" defaultValue="admin@example.com" disabled />
             <p className="text-xs text-muted-foreground">E-posta adresi değiştirilemez.</p>
          </div>
          <Button>Bilgileri Kaydet</Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Şifre Değiştir</CardTitle>
          <CardDescription>Güvenliğiniz için düzenli olarak şifrenizi değiştirin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Mevcut Şifre</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Yeni Şifre</Label>
            <Input id="new-password" type="password" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="confirm-password">Yeni Şifre Tekrar</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>Şifreyi Değiştir</Button>
        </CardContent>
      </Card>

    </div>
  );
}
