
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ayarlar</h1>

      <Card>
        <CardHeader>
          <CardTitle>Genel Ayarlar</CardTitle>
          <CardDescription>Site genel ayarlarını yapılandırın.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Adı</Label>
            <Input id="site-name" defaultValue="TeknoBiyo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-description">Site Açıklaması</Label>
            <Input id="site-description" defaultValue="Teknoloji ve Biyoloji Makaleleri" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="maintenance-mode" />
            <Label htmlFor="maintenance-mode">Bakım Modu Aktif</Label>
          </div>
          <Button>Ayarları Kaydet</Button>
        </CardContent>
      </Card>

      <Separator />

       <Card>
        <CardHeader>
          <CardTitle>Görünüm Ayarları</CardTitle>
          <CardDescription>Sitenin görünüm tercihlerini yönetin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {/* Theme settings might be handled globally, but you could add specific toggles */}
           <p className="text-sm text-muted-foreground">Tema ayarları (Açık/Koyu/Sistem) genel başlıkta yönetilmektedir.</p>
           {/* Add other appearance settings like default articles per page etc. */}
           <div className="space-y-2">
            <Label htmlFor="articles-per-page">Sayfa Başına Makale</Label>
            <Input id="articles-per-page" type="number" defaultValue={9} />
          </div>
          <Button>Görünüm Ayarlarını Kaydet</Button>
        </CardContent>
      </Card>

        <Separator />

       <Card>
        <CardHeader>
          <CardTitle>Entegrasyonlar</CardTitle>
          <CardDescription>Üçüncü parti servis entegrasyonları.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google-analytics-id">Google Analytics ID</Label>
            <Input id="google-analytics-id" placeholder="UA-XXXXX-Y" />
          </div>
           {/* Add more integration settings as needed */}
          <Button>Entegrasyonları Kaydet</Button>
        </CardContent>
      </Card>

    </div>
  );
}
