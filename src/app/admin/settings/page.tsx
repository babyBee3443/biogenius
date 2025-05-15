
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
import { MenuSquare, Palette, Shield, Plug, Mail, Save, Timer, Download, UploadCloud, AlertTriangle, Settings as SettingsIcon, Info, Copy, ExternalLink } from "lucide-react"; // Added Copy, ExternalLink
import { toast } from "@/hooks/use-toast";
import { ARTICLE_STORAGE_KEY, initializeArticles } from '@/lib/data/articles';
import { NOTE_STORAGE_KEY, initializeNotes } from '@/lib/data/notes';
import { CATEGORY_STORAGE_KEY, initializeCategories } from '@/lib/data/categories';
import { USER_STORAGE_KEY, initializeUsers } from '@/lib/data/users';
import { ROLE_STORAGE_KEY, initializeRoles } from '@/lib/data/roles';
import { PAGE_STORAGE_KEY, initializePages } from '@/lib/data/pages';
import { TEMPLATE_STORAGE_KEY, initializeTemplates } from '@/lib/data/templates';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Added Accordion

const SESSION_TIMEOUT_KEY = 'adminSessionTimeoutMinutes';
const MAINTENANCE_MODE_KEY = 'maintenanceModeActive';
const ADSENSE_ENABLED_KEY = 'adsenseEnabled';
const ADSENSE_PUBLISHER_ID_KEY = 'adsensePublisherId';
const DEFAULT_SESSION_TIMEOUT_MINUTES = 30;

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
      setAdsenseEnabled(storedAdsenseEnabled === null ? true : storedAdsenseEnabled === 'true');

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
        window.dispatchEvent(new CustomEvent('adsenseSettingsUpdated'));
    }
    toast({ title: "Ayarlar Kaydedildi", description: "Genel ayarlar başarıyla güncellendi." });
    console.log("Ayarlar kaydedildi:", { siteName, siteDescription, siteUrl, adminEmail, maintenanceMode, sessionTimeout, adsenseEnabled, adsensePublisherId });
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
        settings: {
          [SESSION_TIMEOUT_KEY]: localStorage.getItem(SESSION_TIMEOUT_KEY),
          [MAINTENANCE_MODE_KEY]: localStorage.getItem(MAINTENANCE_MODE_KEY),
          [ADSENSE_ENABLED_KEY]: localStorage.getItem(ADSENSE_ENABLED_KEY),
          [ADSENSE_PUBLISHER_ID_KEY]: localStorage.getItem(ADSENSE_PUBLISHER_ID_KEY),
          siteName, siteDescription, siteUrl, adminEmail
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

        const dataInitializers: Record<string, (data: any[]) => void> = {
            articles: initializeArticles,
            notes: initializeNotes,
            categories: initializeCategories,
            users: initializeUsers,
            roles: initializeRoles,
            pages: initializePages,
            templates: initializeTemplates,
        };

        for (const [key, initializer] of Object.entries(dataInitializers)) {
            if (importedData[key]) {
                initializer(importedData[key]); // This function should also setItem to localStorage
            } else {
                console.warn(`İçe aktarılan veride '${key}' alanı bulunamadı. Bu bölüm için varsayılanlar kullanılacak veya boş kalacaktır.`);
                localStorage.removeItem(eval(`${key.toUpperCase()}_STORAGE_KEY`)); // Clear if not present
            }
        }
        
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Kopyalandı!", description: "İçerik panoya kopyalandı." });
    }).catch(err => {
      toast({ variant: "destructive", title: "Kopyalama Hatası", description: "İçerik kopyalanamadı." });
    });
  };

  const adsenseTxtContent = `google.com, ${adsensePublisherId || 'pub-XXXXXXXXXXXXXXXX'}, DIRECT, f08c47fec0942fa0`;

  const adPlaceholderCodeExample = `
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-YOUR_PUBLISHER_ID"  <!-- Kendi Yayıncı ID'niz ile değiştirin -->
     data-ad-slot="YOUR_AD_SLOT_ID"           <!-- Kendi Reklam Birimi ID'niz ile değiştirin -->
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
  `.trim();

  const mainAdsenseScriptPlaceholder = `
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
     crossorigin="anonymous"></script>
<!-- YUKARIDAKİ satırdaki ca-pub-YOUR_PUBLISHER_ID kısmını kendi Yayıncı ID'niz ile DEĞİŞTİRİN -->
  `.trim();


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
                <TabsTrigger value="adsense">AdSense Yönetimi</TabsTrigger> {/* New Tab */}
                <TabsTrigger value="navigation">Navigasyon</TabsTrigger>
                <TabsTrigger value="appearance">Görünüm</TabsTrigger>
                <TabsTrigger value="security">Güvenlik</TabsTrigger>
                <TabsTrigger value="integrations">Entegrasyonlar</TabsTrigger>
                {/* Removed E-posta tab for now, can be re-added if needed */}
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
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="adsense">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                             AdSense Yönetimi
                        </CardTitle>
                        <CardDescription>Google AdSense entegrasyonunu yönetin ve reklam yerleşimleri hakkında bilgi edinin.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="text-lg">Temel AdSense Ayarları</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center space-x-3">
                                    <Switch id="adsense-enabled" checked={adsenseEnabled} onCheckedChange={setAdsenseEnabled} />
                                    <Label htmlFor="adsense-enabled" className="cursor-pointer">AdSense Reklamlarını Sitede Etkinleştir</Label>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="adsense-publisher-id">AdSense Yayıncı Kimliği (Publisher ID)</Label>
                                    <Input 
                                        id="adsense-publisher-id" 
                                        value={adsensePublisherId} 
                                        onChange={(e) => setAdsensePublisherId(e.target.value)} 
                                        placeholder="pub-xxxxxxxxxxxxxxxx"
                                    />
                                    <p className="text-xs text-muted-foreground">Google AdSense hesabınızdaki yayıncı kimliğiniz.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted/30">
                            <CardHeader>
                                 <CardTitle className="text-lg">Adım 1: Ana AdSense Script Kodu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    Google AdSense reklamlarının sitenizde çalışabilmesi için, AdSense hesabınızdan alacağınız ana script kodunu sitenizin tüm sayfalarının `<head>` bölümüne eklemeniz gerekir.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Bu kodu, projenizdeki `src/app/layout.tsx` dosyasında bulunan `<head> ... </head>` etiketleri arasına, `{/* Google AdSense Ana Script Kodu Buraya Eklenecek */}` yorumunun olduğu yere yapıştırın.
                                </p>
                                <Label>Örnek Ana Script Kodu (Kendi ID'niz ile güncelleyin):</Label>
                                <div className="bg-background p-3 rounded-md border">
                                    <pre className="text-xs whitespace-pre-wrap break-all"><code>{mainAdsenseScriptPlaceholder}</code></pre>
                                    <Button variant="outline" size="sm" className="mt-2" onClick={() => copyToClipboard(mainAdsenseScriptPlaceholder)}>
                                        <Copy className="mr-2 h-3.5 w-3.5"/> Kodu Kopyala
                                    </Button>
                                </div>
                                <a href="https://support.google.com/adsense/answer/9274634" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                                    Daha fazla bilgi için AdSense Yardım Merkezi <ExternalLink className="h-3 w-3"/>
                                </a>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-muted/30">
                            <CardHeader>
                                 <CardTitle className="text-lg">Adım 2: `ads.txt` Dosyası</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    `ads.txt`, sitenizde reklam satmaya yetkili olduğunuzu doğrulayan bir dosyadır. Bu dosya, reklam sahteciliğini önlemeye yardımcı olur.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Aşağıdaki içeriği kopyalayın, projenizin `public` klasörünün içine `ads.txt` adında bir dosya oluşturun ve bu içeriği içine yapıştırın.
                                    Eğer "AdSense Yayıncı Kimliği" alanını doldurduysanız, aşağıdaki içerik otomatik olarak güncellenecektir.
                                </p>
                                <Label htmlFor="ads-txt-content">Oluşturulacak `ads.txt` İçeriği:</Label>
                                <div className="bg-background p-3 rounded-md border">
                                    <pre id="ads-txt-content" className="text-xs whitespace-pre-wrap break-all"><code>{adsenseTxtContent}</code></pre>
                                    <Button variant="outline" size="sm" className="mt-2" onClick={() => copyToClipboard(adsenseTxtContent)}>
                                        <Copy className="mr-2 h-3.5 w-3.5"/> İçeriği Kopyala
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    <Info className="inline h-3 w-3 mr-1"/> `public` klasörüne ekledikten sonra, `https://biyohox.example.com/ads.txt` (sizin domaininizle) adresinden erişilebilir olmalıdır.
                                </p>
                            </CardContent>
                        </Card>

                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="ad-units-guide">
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline">Adım 3: Reklam Birimi Yerleştirme Kılavuzu</AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-6">
                                    <p className="text-sm text-muted-foreground">
                                        Aşağıda, sitenizdeki farklı sayfalara reklam birimlerini nasıl ekleyebileceğinize dair bir rehber bulunmaktadır.
                                        AdSense panelinizden reklam birimleri oluşturduktan sonra, size verilen kodları bu dosyalardaki ilgili yer tutuculara ekleyebilirsiniz.
                                        Unutmayın, aşağıdaki kodlar sadece **örnektir** ve kendi Yayıncı ID (`data-ad-client`) ve Reklam Birimi ID (`data-ad-slot`) değerlerinizle değiştirilmelidir.
                                    </p>
                                    
                                    {(['Anasayfa - Hero Altı', 'Anasayfa - Bölümler Arası', 'Anasayfa - Sayfa Sonu'] as const).map(area => (
                                        <Card key={area} className="bg-card/50">
                                            <CardHeader><CardTitle className="text-base">{area}</CardTitle></CardHeader>
                                            <CardContent>
                                                <p className="text-xs text-muted-foreground mb-1">Hedef Dosya: `src/app/(main)/page.tsx`</p>
                                                <Label className="text-xs">Örnek Reklam Kodu:</Label>
                                                <pre className="text-xs whitespace-pre-wrap break-all bg-background p-2 rounded border mt-1"><code>{adPlaceholderCodeExample}</code></pre>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {(['Makale Detay - İçerik Başı', 'Makale Detay - Paragraf Arası', 'Makale Detay - Makale Sonu'] as const).map(area => (
                                        <Card key={area} className="bg-card/50">
                                            <CardHeader><CardTitle className="text-base">{area}</CardTitle></CardHeader>
                                            <CardContent>
                                                <p className="text-xs text-muted-foreground mb-1">Hedef Dosya: `src/app/(main)/articles/[id]/page.tsx`</p>
                                                <Label className="text-xs">Örnek Reklam Kodu:</Label>
                                                <pre className="text-xs whitespace-pre-wrap break-all bg-background p-2 rounded border mt-1"><code>{adPlaceholderCodeExample}</code></pre>
                                            </CardContent>
                                        </Card>
                                    ))}
                                     {(['Notlar Liste - Filtre Altı', 'Notlar Liste - Kart Arası', 'Notlar Liste - Sayfa Sonu'] as const).map(area => (
                                        <Card key={area} className="bg-card/50">
                                            <CardHeader><CardTitle className="text-base">{area}</CardTitle></CardHeader>
                                            <CardContent>
                                                <p className="text-xs text-muted-foreground mb-1">Hedef Dosya: `src/app/(main)/biyoloji-notlari/page.tsx`</p>
                                                <Label className="text-xs">Örnek Reklam Kodu:</Label>
                                                <pre className="text-xs whitespace-pre-wrap break-all bg-background p-2 rounded border mt-1"><code>{adPlaceholderCodeExample}</code></pre>
                                            </CardContent>
                                        </Card>
                                    ))}
                                     {(['Not Detay - İçerik Başı', 'Not Detay - Not Sonu'] as const).map(area => (
                                        <Card key={area} className="bg-card/50">
                                            <CardHeader><CardTitle className="text-base">{area}</CardTitle></CardHeader>
                                            <CardContent>
                                                <p className="text-xs text-muted-foreground mb-1">Hedef Dosya: `src/app/(main)/biyoloji-notlari/[slug]/page.tsx`</p>
                                                <Label className="text-xs">Örnek Reklam Kodu:</Label>
                                                <pre className="text-xs whitespace-pre-wrap break-all bg-background p-2 rounded border mt-1"><code>{adPlaceholderCodeExample}</code></pre>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        
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
                            <Button onClick={() => toast({title: "Kaydedildi (Simülasyon)", description: "Görünüm ayarları kaydedildi."})}>Görünüm Ayarlarını Kaydet</Button>
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
                            <Switch id="enable-mfa" disabled />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="allowed-ips">İzin Verilen IP Adresleri (Admin Paneli)</Label>
                            <Textarea id="allowed-ips" placeholder="Her IP adresini yeni bir satıra girin (örneğin, 192.168.1.1)" disabled />
                            <p className="text-xs text-muted-foreground">Boş bırakılırsa tüm IP adreslerine izin verilir. Sadece admin paneline erişimi kısıtlar.</p>
                        </div>
                         <Separator />
                         <div className="flex justify-end">
                            <Button disabled onClick={() => toast({title: "Kaydedildi (Simülasyon)", description: "Güvenlik ayarları kaydedildi."})}>Güvenlik Ayarlarını Kaydet</Button>
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
                            <Input id="google-analytics-id" placeholder="UA-XXXXX-Y veya G-XXXXXXX" disabled />
                             <p className="text-xs text-muted-foreground">Web sitesi trafiğini izlemek için Google Analytics izleme kimliğinizi girin.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="google-maps-key">Google Maps API Anahtarı</Label>
                            <Input id="google-maps-key" type="password" placeholder="API Anahtarını buraya girin" disabled />
                        </div>
                        <Separator />
                        <div className="flex justify-end">
                            <Button disabled onClick={() => toast({title: "Kaydedildi (Simülasyon)", description: "Entegrasyonlar kaydedildi."})}>Entegrasyonları Kaydet</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            
        </Tabs>

        <div className="mt-8 flex justify-end">
             <Button onClick={handleGeneralSettingsSave}>
                 <Save className="mr-2 h-4 w-4"/> Tüm Ayarları Kaydet
             </Button>
        </div>
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

    