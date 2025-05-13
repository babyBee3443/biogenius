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
import { MenuSquare, Palette, Shield, Plug, Mail, Save, Timer, Download, UploadCloud, AlertTriangle, Settings as SettingsIcon } from "lucide-react"; // Added SettingsIcon
import { toast } from "@/hooks/use-toast";
import { ARTICLE_STORAGE_KEY, NOTE_STORAGE_KEY, CATEGORY_STORAGE_KEY, USER_STORAGE_KEY, ROLE_STORAGE_KEY, PAGE_STORAGE_KEY, loadInitialData as reloadMockData } from '@/lib/mock-data';
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

const SESSION_TIMEOUT_KEY = 'adminSessionTimeoutMinutes';
const MAINTENANCE_MODE_KEY = 'maintenanceModeActive'; // Key for localStorage
const DEFAULT_SESSION_TIMEOUT_MINUTES = 5;

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = React.useState("TeknoBiyo");
  const [siteDescription, setSiteDescription] = React.useState("Teknoloji ve Biyoloji Makaleleri");
  const [siteUrl, setSiteUrl] = React.useState("https://teknobiyo.example.com");
  const [adminEmail, setAdminEmail] = React.useState("admin@example.com");
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [sessionTimeout, setSessionTimeout] = React.useState(DEFAULT_SESSION_TIMEOUT_MINUTES);
  const [exporting, setExporting] = React.useState(false);
  const [importing, setImporting] = React.useState(false);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = React.useState(false);
  const [fileToImport, setFileToImport] = React.useState<File | null>(null);

  const importFileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTimeout = localStorage.getItem(SESSION_TIMEOUT_KEY);
      if (storedTimeout) {
        const timeoutValue = parseInt(storedTimeout, 10);
        if (!isNaN(timeoutValue) && timeoutValue > 0) {
          setSessionTimeout(timeoutValue);
        }
      }
      const storedMaintenanceMode = localStorage.getItem(MAINTENANCE_MODE_KEY);
      setMaintenanceMode(storedMaintenanceMode === 'true');
    }
  }, []);

  const handleMaintenanceModeChange = (checked: boolean) => {
    setMaintenanceMode(checked);
    if (typeof window !== 'undefined') {
      localStorage.setItem(MAINTENANCE_MODE_KEY, String(checked));
      // Optionally, dispatch an event if other parts of the app need to react immediately
      // window.dispatchEvent(new CustomEvent('maintenanceModeChanged', { detail: checked }));
    }
  };

  const handleGeneralSettingsSave = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_TIMEOUT_KEY, sessionTimeout.toString());
        localStorage.setItem(MAINTENANCE_MODE_KEY, String(maintenanceMode)); // Ensure maintenance mode is also saved here
        window.dispatchEvent(new CustomEvent('sessionTimeoutChanged'));
        // window.dispatchEvent(new CustomEvent('maintenanceModeChanged', { detail: maintenanceMode }));
    }
    toast({ title: "Ayarlar Kaydedildi", description: "Genel ayarlar başarıyla güncellendi." });
    console.log("Genel ayarlar kaydedildi:", { siteName, siteDescription, siteUrl, adminEmail, maintenanceMode, sessionTimeout });
  };

  const handleExportData = () => {
    if (typeof window === 'undefined') return;
    setExporting(true);
    try {
      const allData: Record<string, any> = {};
      const dataKeys = {
        articles: ARTICLE_STORAGE_KEY,
        notes: NOTE_STORAGE_KEY,
        categories: CATEGORY_STORAGE_KEY,
        users: USER_STORAGE_KEY,
        roles: ROLE_STORAGE_KEY,
        pages: PAGE_STORAGE_KEY,
      };

      for (const [key, storageKey] of Object.entries(dataKeys)) {
        const storedItem = localStorage.getItem(storageKey);
        if (storedItem) {
          try {
            allData[key] = JSON.parse(storedItem);
          } catch (e) {
            console.warn(`Could not parse ${key} from localStorage:`, e);
            allData[key] = [];
          }
        } else {
          allData[key] = [];
        }
      }

      const jsonString = JSON.stringify(allData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().slice(0, 10);
      a.download = `teknobiyo_data_${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({ title: "Veri Dışa Aktarıldı", description: "Tüm uygulama verileri başarıyla bilgisayarınıza indirildi." });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({ variant: "destructive", title: "Dışa Aktarma Hatası", description: "Veriler dışa aktarılırken bir sorun oluştu." });
    } finally {
      setExporting(false);
    }
  };

  const handleImportFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json') {
        toast({ variant: "destructive", title: "Geçersiz Dosya Türü", description: "Lütfen .json uzantılı bir dosya seçin." });
        return;
      }
      setFileToImport(file);
      setIsImportConfirmOpen(true);
    }
  };

  const confirmImportData = () => {
    if (!fileToImport || typeof window === 'undefined') return;
    setIsImportConfirmOpen(false);
    setImporting(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);

        const requiredKeys = ['articles', 'notes', 'categories', 'users', 'roles', 'pages'];
        const missingKeys = requiredKeys.filter(key => !(key in importedData));

        if (missingKeys.length > 0) {
          toast({ variant: "destructive", title: "İçe Aktarma Hatası", description: `Dosyada eksik alanlar var: ${missingKeys.join(', ')}. Lütfen geçerli bir yedek dosyası seçin.` });
          setImporting(false);
          return;
        }
        
        localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(importedData.articles || []));
        localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(importedData.notes || []));
        localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(importedData.categories || []));
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(importedData.users || []));
        localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(importedData.roles || []));
        localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(importedData.pages || []));

        reloadMockData(); 

        toast({ title: "Veri İçe Aktarıldı", description: "Veriler başarıyla içe aktarıldı. Değişikliklerin yansıması için sayfa yenilenebilir." });
      } catch (error) {
        console.error("Error importing data:", error);
        toast({ variant: "destructive", title: "İçe Aktarma Hatası", description: "Veriler içe aktarılırken bir sorun oluştu. Dosya formatını kontrol edin." });
      } finally {
        setImporting(false);
        setFileToImport(null);
        if (importFileInputRef.current) {
          importFileInputRef.current.value = "";
        }
      }
    };
    reader.onerror = () => {
        toast({ variant: "destructive", title: "Dosya Okuma Hatası", description: "Dosya okunurken bir sorun oluştu." });
        setImporting(false);
        setFileToImport(null);
    }
    reader.readAsText(fileToImport);
  };

  return (
    <>
    <div className="space-y-6">
        <div className="flex items-center justify-between">
             <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <SettingsIcon className="h-7 w-7 text-primary"/> Ayarlar
                </h1>
                <p className="text-muted-foreground">Site yapılandırmasını ve tercihlerini yönetin.</p>
             </div>
             {/* Add any top-level action buttons here if needed */}
        </div>


        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-6">
                <TabsTrigger value="general">Genel</TabsTrigger>
                <TabsTrigger value="navigation">Navigasyon</TabsTrigger>
                <TabsTrigger value="appearance">Görünüm</TabsTrigger>
                <TabsTrigger value="security">Güvenlik</TabsTrigger>
                <TabsTrigger value="integrations">Entegrasyonlar</TabsTrigger>
                <TabsTrigger value="email">E-posta</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
                 <Card>
                    <CardHeader>
                        <CardTitle>Genel Ayarlar</CardTitle>
                        <CardDescription>Site temel bilgilerini ve durumunu yapılandırın.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                        <div className="flex items-center space-x-3">
                            <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={handleMaintenanceModeChange} />
                            <Label htmlFor="maintenance-mode" className="cursor-pointer">Bakım Modu Aktif</Label>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label htmlFor="session-timeout" className="flex items-center gap-2">
                                <Timer className="h-4 w-4"/>
                                Oturum Zaman Aşımı (dakika)
                            </Label>
                            <Input
                                id="session-timeout"
                                type="number"
                                min="1"
                                max="120"
                                value={sessionTimeout}
                                onChange={(e) => setSessionTimeout(Math.max(1, parseInt(e.target.value, 10) || DEFAULT_SESSION_TIMEOUT_MINUTES))}
                            />
                            <p className="text-xs text-muted-foreground">
                                Belirtilen süre (dakika cinsinden) işlem yapılmadığında yönetici oturumu otomatik olarak sonlandırılır. (Min: 1, Maks: 120)
                            </p>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="text-md font-medium mb-2">Veri Yönetimi</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Site verilerini JSON formatında yedekleyebilir veya daha önce aldığınız bir yedeği geri yükleyebilirsiniz.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button onClick={handleExportData} variant="outline" disabled={exporting}>
                                    <Download className="mr-2 h-4 w-4" />
                                    {exporting ? "Veriler Dışa Aktarılıyor..." : "Tüm Verileri Dışa Aktar"}
                                </Button>
                                <Button onClick={() => importFileInputRef.current?.click()} variant="outline" disabled={importing}>
                                    <UploadCloud className="mr-2 h-4 w-4" />
                                    {importing ? "Veriler İçe Aktarılıyor..." : "Veri İçe Aktar (.json)"}
                                </Button>
                                <Input 
                                    type="file" 
                                    className="hidden" 
                                    ref={importFileInputRef} 
                                    onChange={handleImportFileSelect} 
                                    accept=".json"
                                />
                            </div>
                             <p className="text-xs text-muted-foreground mt-2">
                                <AlertTriangle className="inline h-3 w-3 mr-1 text-destructive" />
                                İçe aktarma işlemi mevcut tüm verilerin üzerine yazacaktır. Lütfen dikkatli olun ve işlem öncesi yedek aldığınızdan emin olun.
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
                        <div>
                            <Label>Site Teması</Label>
                            <p className="text-sm text-muted-foreground">Tema (Açık/Koyu/Sistem) sağ üst köşedeki düğme ile değiştirilebilir.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logo-upload">Site Logosu</Label>
                            <Input id="logo-upload" type="file" />
                             <p className="text-xs text-muted-foreground">Önerilen boyut: 200x50 piksel. SVG, PNG, JPG formatları desteklenir.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="favicon-upload">Site Favicon</Label>
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
                         <Separator />
                         <div className="flex justify-end">
                            <Button>Güvenlik Ayarlarını Kaydet</Button>
                         </div>
                    </CardContent>
                 </Card>
            </TabsContent>

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
                        </div>
                        <Separator />
                        <div className="flex justify-end">
                            <Button>Entegrasyonları Kaydet</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

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
                                </SelectContent>
                            </Select>
                         </div>
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
    <AlertDialog open={isImportConfirmOpen} onOpenChange={setIsImportConfirmOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Veri İçe Aktarmayı Onayla</AlertDialogTitle>
                <AlertDialogDescription>
                    Bu işlem, seçtiğiniz dosyadan gelen verilerle mevcut tüm verilerin üzerine yazacaktır. Bu işlem geri alınamaz.
                    Devam etmeden önce mevcut verilerinizin bir yedeğini aldığınızdan emin olun.
                    Devam etmek istediğinize emin misiniz?
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => { setFileToImport(null); if(importFileInputRef.current) importFileInputRef.current.value = ""; }}>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={confirmImportData}>
                    Evet, İçe Aktar
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}