
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
import { MenuSquare, Palette, Shield, Plug, Mail, Save, Timer, Download, UploadCloud, AlertTriangle, Settings as SettingsIcon, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ARTICLE_STORAGE_KEY } from '@/lib/data/articles';
import { NOTE_STORAGE_KEY } from '@/lib/data/notes';
import { CATEGORY_STORAGE_KEY } from '@/lib/data/categories';
import { USER_STORAGE_KEY } from '@/lib/data/users';
import { ROLE_STORAGE_KEY } from '@/lib/data/roles';
import { PAGE_STORAGE_KEY } from '@/lib/data/pages';
import { TEMPLATE_STORAGE_KEY } from '@/lib/data/templates';
import { loadInitialData as reloadMockData } from '@/lib/mock-data';
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
import { ThemeToggle } from '@/components/theme-toggle';


const SESSION_TIMEOUT_KEY = 'adminSessionTimeoutMinutes';
const MAINTENANCE_MODE_KEY = 'maintenanceModeActive';
const ADSENSE_ENABLED_KEY = 'adsenseEnabled';
const ADSENSE_PUBLISHER_ID_KEY = 'adsensePublisherId';
const DEFAULT_SESSION_TIMEOUT_MINUTES = 30; // Increased default

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = React.useState("BiyoHox");
  const [siteDescription, setSiteDescription] = React.useState("Teknoloji ve Biyoloji Makaleleri");
  const [siteUrl, setSiteUrl] = React.useState("https://biyohox.example.com");
  const [adminEmail, setAdminEmail] = React.useState("admin@example.com");
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);
  const [sessionTimeout, setSessionTimeout] = React.useState(DEFAULT_SESSION_TIMEOUT_MINUTES);
  const [exporting, setExporting] = React.useState(false);
  const [importing, setImporting] = React.useState(false);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = React.useState(false);
  const [fileToImport, setFileToImport] = React.useState<File | null>(null);

  const [adsenseEnabled, setAdsenseEnabled] = React.useState(true);
  const [adsensePublisherId, setAdsensePublisherId] = React.useState("");

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

      const storedAdsenseEnabled = localStorage.getItem(ADSENSE_ENABLED_KEY);
      setAdsenseEnabled(storedAdsenseEnabled === null ? true : storedAdsenseEnabled === 'true'); // Default to true if not set

      const storedAdsensePublisherId = localStorage.getItem(ADSENSE_PUBLISHER_ID_KEY);
      if (storedAdsensePublisherId) {
        setAdsensePublisherId(storedAdsensePublisherId);
      }
    }
  }, []);

  const handleMaintenanceModeChange = (checked: boolean) => {
    setMaintenanceMode(checked);
    if (typeof window !== 'undefined') {
      localStorage.setItem(MAINTENANCE_MODE_KEY, String(checked));
      window.dispatchEvent(new CustomEvent('maintenanceModeUpdated'));
      console.log("AdminSettingsPage: Dispatched maintenanceModeUpdated event", checked);
    }
  };

  const handleGeneralSettingsSave = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_TIMEOUT_KEY, sessionTimeout.toString());
        localStorage.setItem(MAINTENANCE_MODE_KEY, String(maintenanceMode));
        localStorage.setItem(ADSENSE_ENABLED_KEY, String(adsenseEnabled));
        localStorage.setItem(ADSENSE_PUBLISHER_ID_KEY, adsensePublisherId);

        window.dispatchEvent(new CustomEvent('sessionTimeoutChanged'));
        window.dispatchEvent(new CustomEvent('maintenanceModeUpdated'));
        window.dispatchEvent(new CustomEvent('adsenseSettingsUpdated')); // New event for AdSense
        console.log("AdminSettingsPage: Dispatched maintenanceModeUpdated event on save", maintenanceMode);
    }
    toast({ title: "Ayarlar Kaydedildi", description: "Genel ayarlar başarıyla güncellendi." });
    console.log("Genel ayarlar kaydedildi:", { siteName, siteDescription, siteUrl, adminEmail, maintenanceMode, sessionTimeout, adsenseEnabled, adsensePublisherId });
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
        templates: TEMPLATE_STORAGE_KEY,
        settings: { // Include settings in export
          [SESSION_TIMEOUT_KEY]: localStorage.getItem(SESSION_TIMEOUT_KEY),
          [MAINTENANCE_MODE_KEY]: localStorage.getItem(MAINTENANCE_MODE_KEY),
          [ADSENSE_ENABLED_KEY]: localStorage.getItem(ADSENSE_ENABLED_KEY),
          [ADSENSE_PUBLISHER_ID_KEY]: localStorage.getItem(ADSENSE_PUBLISHER_ID_KEY),
          siteName, siteDescription, siteUrl, adminEmail // Include other state-managed settings
        }
      };

      for (const [key, storageKeyOrObject] of Object.entries(dataKeys)) {
        if (key === 'settings') {
            allData[key] = storageKeyOrObject;
        } else {
            const storedItem = localStorage.getItem(storageKeyOrObject as string);
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
      }

      const jsonString = JSON.stringify(allData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().slice(0, 10);
      a.download = `biyohox_data_backup_${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({ title: "Veri Dışa Aktarıldı", description: "Tüm uygulama verileri ve ayarları başarıyla bilgisayarınıza indirildi." });
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

        const dataKeys = [
            ARTICLE_STORAGE_KEY, NOTE_STORAGE_KEY, CATEGORY_STORAGE_KEY,
            USER_STORAGE_KEY, ROLE_STORAGE_KEY, PAGE_STORAGE_KEY, TEMPLATE_STORAGE_KEY
        ];
        const dataKeyMap = {
            articles: ARTICLE_STORAGE_KEY, notes: NOTE_STORAGE_KEY, categories: CATEGORY_STORAGE_KEY,
            users: USER_STORAGE_KEY, roles: ROLE_STORAGE_KEY, pages: PAGE_STORAGE_KEY, templates: TEMPLATE_STORAGE_KEY
        };

        for (const [key, storageKey] of Object.entries(dataKeyMap)) {
            if (importedData[key]) {
                localStorage.setItem(storageKey, JSON.stringify(importedData[key]));
            } else {
                console.warn(`İçe aktarılan veride '${key}' alanı bulunamadı. Bu bölüm için varsayılanlar kullanılacak veya boş kalacaktır.`);
                localStorage.removeItem(storageKey); // Clear if not present in backup
            }
        }
        
        // Import settings
        if (importedData.settings) {
            const settings = importedData.settings;
            localStorage.setItem(SESSION_TIMEOUT_KEY, settings[SESSION_TIMEOUT_KEY] || DEFAULT_SESSION_TIMEOUT_MINUTES.toString());
            localStorage.setItem(MAINTENANCE_MODE_KEY, settings[MAINTENANCE_MODE_KEY] || 'false');
            localStorage.setItem(ADSENSE_ENABLED_KEY, settings[ADSENSE_ENABLED_KEY] || 'true');
            localStorage.setItem(ADSENSE_PUBLISHER_ID_KEY, settings[ADSENSE_PUBLISHER_ID_KEY] || '');

            setSiteName(settings.siteName || "BiyoHox");
            setSiteDescription(settings.siteDescription || "Teknoloji ve Biyoloji Makaleleri");
            setSiteUrl(settings.siteUrl || "https://biyohox.example.com");
            setAdminEmail(settings.adminEmail || "admin@example.com");
            setSessionTimeout(parseInt(settings[SESSION_TIMEOUT_KEY], 10) || DEFAULT_SESSION_TIMEOUT_MINUTES);
            setMaintenanceMode(settings[MAINTENANCE_MODE_KEY] === 'true');
            setAdsenseEnabled(settings[ADSENSE_ENABLED_KEY] === null ? true : settings[ADSENSE_ENABLED_KEY] === 'true');
            setAdsensePublisherId(settings[ADSENSE_PUBLISHER_ID_KEY] || '');

            window.dispatchEvent(new CustomEvent('sessionTimeoutChanged'));
            window.dispatchEvent(new CustomEvent('maintenanceModeUpdated'));
            window.dispatchEvent(new CustomEvent('adsenseSettingsUpdated'));
        }

        reloadMockData(); // This function now correctly initializes from the updated localStorage

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
        // Optionally, force a page reload to ensure all components re-fetch from localStorage
        // window.location.reload(); 
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
             <ThemeToggle />
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
                        <div className="flex items-center space-x-3 pt-2">
                            <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={handleMaintenanceModeChange} />
                            <Label htmlFor="maintenance-mode" className="cursor-pointer flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-orange-500"/> Bakım Modu Aktif
                            </Label>
                        </div>
                        <p className="text-xs text-muted-foreground -mt-3 pl-12">
                            Bakım modu aktifken site ziyaretçilere kapalı olacaktır.
                        </p>
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
                            <h3 className="text-md font-medium mb-2">AdSense Ayarları</h3>
                            <div className="flex items-center space-x-3 pt-1">
                                <Switch id="adsense-enabled" checked={adsenseEnabled} onCheckedChange={setAdsenseEnabled} />
                                <Label htmlFor="adsense-enabled" className="cursor-pointer">AdSense Reklamlarını Etkinleştir</Label>
                            </div>
                            <div className="space-y-2 mt-4">
                                <Label htmlFor="adsense-publisher-id">AdSense Yayıncı Kimliği (Publisher ID)</Label>
                                <Input 
                                    id="adsense-publisher-id" 
                                    value={adsensePublisherId} 
                                    onChange={(e) => setAdsensePublisherId(e.target.value)} 
                                    placeholder="pub-xxxxxxxxxxxxxxxx"
                                />
                                <p className="text-xs text-muted-foreground">Google AdSense yayıncı kimliğinizi girin.</p>
                            </div>
                            <Card className="mt-4 bg-muted/30 border-dashed">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2"><Info className="h-4 w-4 text-blue-500"/> ads.txt Bilgisi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground mb-2">
                                        Sitenizin reklam envanterini satmaya yetkili olduğunuzu doğrulamak için `public` klasörünüzün kök dizinine `ads.txt` adında bir dosya oluşturup aşağıdaki içeriği eklemeniz gerekir:
                                    </p>
                                    <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                                        {`google.com, ${adsensePublisherId || 'pub-xxxxxxxxxxxxxxxx'}, DIRECT, f08c47fec0942fa0`}
                                    </pre>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Yukarıdaki `pub-xxxxxxxxxxxxxxxx` kısmını kendi Yayıncı Kimliğiniz ile değiştirmeyi unutmayın.
                                    </p>
                                </CardContent>
                            </Card>
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
                             <Label htmlFor="allowed-ips">İzin Verilen IP Adresleri (Admin Paneli)</Label>
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
                            <Input id="mail-from-name" placeholder="BiyoHox Bildirimleri" />
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

