
"use client"; // Required for useState, useEffect, event handlers

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { MenuSquare, Palette, Shield, Plug, Mail, Save, Timer } from "lucide-react"; // Added Timer icon
import { toast } from "@/hooks/use-toast";

const SESSION_TIMEOUT_KEY = 'adminSessionTimeoutMinutes';
const DEFAULT_SESSION_TIMEOUT_MINUTES = 5;

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = React.useState("TeknoBiyo");
  const [siteDescription, setSiteDescription] = React.useState("Teknoloji ve Biyoloji Makaleleri");
  const [siteUrl, setSiteUrl] = React.useState("https://teknobiyo.example.com");
  const [adminEmail, setAdminEmail] = React.useState("admin@example.com");
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [sessionTimeout, setSessionTimeout] = React.useState(DEFAULT_SESSION_TIMEOUT_MINUTES);

  // Load existing settings on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTimeout = localStorage.getItem(SESSION_TIMEOUT_KEY);
      if (storedTimeout) {
        const timeoutValue = parseInt(storedTimeout, 10);
        if (!isNaN(timeoutValue) && timeoutValue > 0) {
          setSessionTimeout(timeoutValue);
        }
      }
      // TODO: Load other settings from localStorage or a settings service if they were saved
    }
  }, []);


  const handleGeneralSettingsSave = () => {
    // TODO: Implement saving of general settings (siteName, siteDescription, etc.)
    // For now, we'll focus on saving the session timeout.
    if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_TIMEOUT_KEY, sessionTimeout.toString());
        // Dispatch a custom event to notify AdminLayout about the change
        window.dispatchEvent(new CustomEvent('sessionTimeoutChanged'));
    }
    toast({ title: "Ayarlar Kaydedildi", description: "Genel ayarlar başarıyla güncellendi." });
    console.log("Genel ayarlar kaydedildi:", { siteName, siteDescription, siteUrl, adminEmail, maintenanceMode, sessionTimeout });
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ayarlar</h1>
      <p className="text-muted-foreground">Site yapılandırmasını ve tercihlerini yönetin.</p>

        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6"> {/* Adjusted grid for more tabs */}
                <TabsTrigger value="general">Genel</TabsTrigger>
                <TabsTrigger value="navigation">Navigasyon</TabsTrigger> {/* Changed Appearance to Navigation */}
                <TabsTrigger value="appearance">Görünüm</TabsTrigger>
                <TabsTrigger value="security">Güvenlik</TabsTrigger>
                <TabsTrigger value="integrations">Entegrasyonlar</TabsTrigger>
                <TabsTrigger value="email">E-posta</TabsTrigger>
            </TabsList>

            {/* General Settings Tab */}
            <TabsContent value="general">
                 <Card>
                    <CardHeader>
                        <CardTitle>Genel Ayarlar</CardTitle>
                        <CardDescription>Site temel bilgilerini ve durumunu yapılandırın.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6"> {/* Increased spacing */}
                        <div className="space-y-2">
                            <Label htmlFor="site-name">Site Adı</Label>
                            <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="site-description">Site Açıklaması</Label>
                            <Textarea id="site-description" value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} placeholder="Siteniz için kısa bir açıklama girin..." />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="site-url">Site URL</Label>
                            <Input id="site-url" type="url" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="admin-email">Yönetici E-postası</Label>
                            <Input id="admin-email" type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
                            <p className="text-xs text-muted-foreground">Önemli sistem bildirimleri bu adrese gönderilir.</p>
                         </div>
                        <div className="flex items-center space-x-3"> {/* Adjusted spacing */}
                            <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                            <Label htmlFor="maintenance-mode" className="cursor-pointer">Bakım Modu Aktif</Label>
                        </div>
                        <Separator />
                        {/* Session Timeout Setting */}
                        <div className="space-y-2">
                            <Label htmlFor="session-timeout" className="flex items-center gap-2">
                                <Timer className="h-4 w-4"/>
                                Oturum Zaman Aşımı (dakika)
                            </Label>
                            <Input
                                id="session-timeout"
                                type="number"
                                min="1"
                                max="120" // Example max
                                value={sessionTimeout}
                                onChange={(e) => setSessionTimeout(Math.max(1, parseInt(e.target.value, 10) || DEFAULT_SESSION_TIMEOUT_MINUTES))}
                            />
                            <p className="text-xs text-muted-foreground">
                                Belirtilen süre (dakika cinsinden) işlem yapılmadığında yönetici oturumu otomatik olarak sonlandırılır. (Min: 1, Maks: 120)
                            </p>
                        </div>
                         <Separator />
                        <div className="flex justify-end">
                            <Button onClick={handleGeneralSettingsSave}>
                                <Save className="mr-2 h-4 w-4"/> Genel Ayarları Kaydet
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Navigation Settings Tab Placeholder */}
            <TabsContent value="navigation">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MenuSquare className="h-5 w-5"/>
                            Navigasyon / Menü Yönetimi
                        </CardTitle>
                        <CardDescription>Ana menüdeki bağlantıları yönetin.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <p className="text-muted-foreground mb-4">Site başlığında görünen ana navigasyon menüsünü buradan düzenleyebilirsiniz.</p>
                         <Button asChild>
                             <Link href="/admin/settings/navigation">Menü Öğelerini Düzenle</Link>
                         </Button>
                     </CardContent>
                 </Card>
             </TabsContent>


            {/* Appearance Settings Tab */}
            <TabsContent value="appearance">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                             <Palette className="h-5 w-5" />
                             Görünüm Ayarları
                         </CardTitle>
                        <CardDescription>Sitenin görünümünü ve kullanıcı arayüzü tercihlerini yönetin.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         {/* Theme settings handled by ThemeToggle, mention it here */}
                        <div>
                            <Label>Site Teması</Label>
                            <p className="text-sm text-muted-foreground">Tema (Açık/Koyu/Sistem) sağ üst köşedeki düğme ile değiştirilebilir.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logo-upload">Site Logosu</Label>
                            {/* TODO: Add actual file upload component */}
                            <Input id="logo-upload" type="file" />
                             <p className="text-xs text-muted-foreground">Önerilen boyut: 200x50 piksel. SVG, PNG, JPG formatları desteklenir.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="favicon-upload">Site Favicon</Label>
                             {/* TODO: Add actual file upload component */}
                            <Input id="favicon-upload" type="file" accept=".ico, .png, .svg"/>
                             <p className="text-xs text-muted-foreground">.ico, .png veya .svg formatında kare bir görsel yükleyin.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="articles-per-page">Sayfa Başına Makale Sayısı</Label>
                            <Input id="articles-per-page" type="number" min="1" max="50" defaultValue={9} />
                            <p className="text-xs text-muted-foreground">Ana sayfa ve kategori sayfalarında gösterilecek makale sayısı.</p>
                        </div>
                        <Separator />
                        <div className="flex justify-end">
                            <Button>Görünüm Ayarlarını Kaydet</Button>
                         </div>
                    </CardContent>
                 </Card>
            </TabsContent>

            {/* Security Settings Tab */}
            <TabsContent value="security">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5"/>
                            Güvenlik Ayarları
                        </CardTitle>
                        <CardDescription>Site güvenliğini ve kullanıcı erişimini yapılandırın.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="enable-mfa">Çok Faktörlü Kimlik Doğrulama (MFA)</Label>
                                <p className="text-xs text-muted-foreground">
                                    Yönetici hesapları için ek güvenlik katmanı sağlayın.
                                </p>
                             </div>
                            <Switch id="enable-mfa" />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="allowed-ips">İzin Verilen IP Adresleri</Label>
                            <Textarea id="allowed-ips" placeholder="Her IP adresini yeni bir satıra girin (örneğin, 192.168.1.1)" />
                            <p className="text-xs text-muted-foreground">Boş bırakılırsa tüm IP adreslerine izin verilir. Sadece admin paneline erişimi kısıtlar.</p>
                        </div>
                        {/* Add more security settings: Login attempt limits, Captcha config etc. */}
                         <Separator />
                         <div className="flex justify-end">
                            <Button>Güvenlik Ayarlarını Kaydet</Button>
                         </div>
                    </CardContent>
                 </Card>
            </TabsContent>

             {/* Integrations Settings Tab */}
            <TabsContent value="integrations">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plug className="h-5 w-5"/>
                            Entegrasyonlar
                        </CardTitle>
                        <CardDescription>Üçüncü parti servisleri bağlayın ve yapılandırın.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="google-analytics-id">Google Analytics ID</Label>
                            <Input id="google-analytics-id" placeholder="UA-XXXXX-Y veya G-XXXXXXX" />
                             <p className="text-xs text-muted-foreground">Web sitesi trafiğini izlemek için Google Analytics izleme kimliğinizi girin.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="google-maps-key">Google Maps API Anahtarı</Label>
                            <Input id="google-maps-key" type="password" placeholder="API Anahtarını buraya girin" />
                            {/* Add link to relevant Google Cloud console */}
                        </div>
                         {/* Add more integrations: Mailchimp API Key, Social Media App IDs etc. */}
                        <Separator />
                        <div className="flex justify-end">
                            <Button>Entegrasyonları Kaydet</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

             {/* Email Settings Tab */}
            <TabsContent value="email">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5"/>
                            E-posta Ayarları
                        </CardTitle>
                        <CardDescription>Giden e-posta sunucusu ve şablonlarını yapılandırın.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="space-y-2">
                            <Label htmlFor="mail-from-address">Gönderen E-posta Adresi</Label>
                            <Input id="mail-from-address" type="email" placeholder="noreply@example.com" />
                            <p className="text-xs text-muted-foreground">Sistem e-postaları bu adresten gönderilecek.</p>
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="mail-from-name">Gönderen Adı</Label>
                            <Input id="mail-from-name" placeholder="TeknoBiyo Bildirimleri" />
                         </div>
                          <div className="space-y-2">
                            <Label htmlFor="mail-driver">E-posta Sürücüsü</Label>
                            <Select defaultValue="smtp">
                                <SelectTrigger id="mail-driver">
                                    <SelectValue placeholder="Bir sürücü seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="smtp">SMTP</SelectItem>
                                    <SelectItem value="sendmail">Sendmail</SelectItem>
                                    <SelectItem value="log">Log (Test için)</SelectItem>
                                    {/* Add other drivers like SES, Mailgun etc. */}
                                </SelectContent>
                            </Select>
                         </div>
                         {/* Conditionally show SMTP settings based on driver selection */}
                         <Card className="bg-muted/50 p-4 space-y-4">
                             <h4 className="font-medium text-sm">SMTP Ayarları</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-host">SMTP Sunucusu</Label>
                                    <Input id="smtp-host" placeholder="smtp.mailtrap.io" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-port">SMTP Port</Label>
                                    <Input id="smtp-port" type="number" placeholder="2525" />
                                </div>
                             </div>
                             <div className="space-y-2">
                                    <Label htmlFor="smtp-username">SMTP Kullanıcı Adı</Label>
                                    <Input id="smtp-username" />
                                </div>
                             <div className="space-y-2">
                                    <Label htmlFor="smtp-password">SMTP Şifresi</Label>
                                    <Input id="smtp-password" type="password" />
                             </div>
                             <div className="space-y-2">
                                    <Label htmlFor="smtp-encryption">SMTP Şifreleme</Label>
                                     <Select>
                                        <SelectTrigger id="smtp-encryption">
                                            <SelectValue placeholder="Şifreleme seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="null">Yok</SelectItem>
                                            <SelectItem value="tls">TLS</SelectItem>
                                            <SelectItem value="ssl">SSL</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                         </Card>
                         {/* TODO: Add Email Template Management Link/Section */}
                        <Separator />
                        <div className="flex justify-between items-center">
                             <Button variant="outline">Test E-postası Gönder</Button>
                            <Button>E-posta Ayarlarını Kaydet</Button>
                        </div>
                    </CardContent>
                 </Card>
            </TabsContent>

        </Tabs>

    </div>
  );
}
