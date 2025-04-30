
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  Newspaper, // Toplam Makale
  Eye, // Sayfa Görüntülenme
  Users, // Tekil Ziyaretçi & Aktif Kullanıcılar
  MessageSquare, // Yorumlar
  ArrowUpRight, // Hemen Çıkma Oranı
  Upload, // Dönüşüm Oranı (Hedef)
  Clock, // Ortalama Okuma Süresi
  LineChart, // Trafik Tab
  ExternalLink, // Kaynaklar Tab
  Smartphone, // Cihazlar Tab
  FileText, // İçerik Tab
  Search, // SEO Tab
  TrendingUp, // Popüler Makaleler & Dönüşüm Oranı (Abone)
  Gauge, // Sayfa Yüklenme Süresi
  Server, // Sunucu Yanıt Süresi
  AlertTriangle, // Hata Oranı
  RefreshCw, // Verileri Yenile
} from "lucide-react";

// Placeholder components for charts and lists
const PlaceholderChart = ({ height = 'h-72' }: { height?: string }) => <div className={`${height} w-full bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground`}>Grafik Alanı</div>;
const PlaceholderList = () => <div className="h-40 w-full bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">Liste Alanı</div>;


export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">İstatistikler</h1>
        <Button variant="outline">
           <RefreshCw className="mr-2 h-4 w-4" /> Verileri Yenile
        </Button>
      </div>

      {/* Top Row Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Makale</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              İçerik yönetim sisteminde kayıtlı toplam makale sayısı
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sayfa Görüntülenme</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive mr-1">&gt;</span> Pasif canlı analitik
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tekil Ziyaretçi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Toplam tekil ziyaretçi sayısı
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yorumlar</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Tüm makalelere yapılan toplam yorum sayısı
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Second Row Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hemen Çıkma Oranı</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">%0.00</div>
            <p className="text-xs text-muted-foreground">
              Tek sayfa görüntüleyip çıkan ziyaretçiler
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dönüşüm Oranı</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">%0.00</div>
            <p className="text-xs text-muted-foreground">
              Hedef işlemi tamamlayan ziyaretçi oranı
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Okuma Süresi</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0:00</div>
            <p className="text-xs text-muted-foreground">
              Makalelerde geçirilen ortalama süre
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphs Section */}
       <Card>
         <CardHeader>
            <CardTitle>Grafikler</CardTitle>
         </CardHeader>
         <CardContent>
             <Tabs defaultValue="traffic">
                 <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4">
                    <TabsTrigger value="traffic"><LineChart className="mr-1 h-4 w-4"/>Trafik</TabsTrigger>
                    <TabsTrigger value="sources"><ExternalLink className="mr-1 h-4 w-4"/>Kaynaklar</TabsTrigger>
                    <TabsTrigger value="devices"><Smartphone className="mr-1 h-4 w-4"/>Cihazlar</TabsTrigger>
                    <TabsTrigger value="content"><FileText className="mr-1 h-4 w-4"/>İçerik</TabsTrigger>
                    <TabsTrigger value="engagement"><Users className="mr-1 h-4 w-4"/>Etkileşim</TabsTrigger> {/* Using Users as placeholder */}
                    <TabsTrigger value="seo"><Search className="mr-1 h-4 w-4"/>SEO</TabsTrigger>
                 </TabsList>
                 <TabsContent value="traffic">
                     <Card>
                        <CardHeader>
                            <CardTitle>Sayfa Görüntülenmeleri</CardTitle>
                            <CardDescription>Son 30 gün içindeki trafik</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PlaceholderChart />
                        </CardContent>
                     </Card>
                 </TabsContent>
                 <TabsContent value="sources"><PlaceholderChart /></TabsContent>
                 <TabsContent value="devices"><PlaceholderChart /></TabsContent>
                 <TabsContent value="content"><PlaceholderChart /></TabsContent>
                 <TabsContent value="engagement"><PlaceholderChart /></TabsContent>
                 <TabsContent value="seo"><PlaceholderChart /></TabsContent>
             </Tabs>
         </CardContent>
       </Card>

       {/* Popular Articles and Active Users */}
       <div className="grid gap-6 lg:grid-cols-3">
           <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center space-x-3 space-y-0">
                     <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base font-semibold">Popüler Makaleler</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="mb-4 -mt-2">En çok görüntülenen makaleler</CardDescription>
                    <PlaceholderList />
                </CardContent>
            </Card>
            <Card>
                 <CardHeader className="flex flex-row items-center space-x-3 space-y-0">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base font-semibold">Aktif Kullanıcılar</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <CardDescription className="mb-4 -mt-2">En aktif kullanıcılar</CardDescription>
                     <PlaceholderList />
                 </CardContent>
            </Card>
        </div>

        {/* Performance Metrics */}
        <div>
            <h2 className="text-xl font-semibold mb-4">Performans Metrikleri</h2>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sayfa Yüklenme Süresi</CardTitle>
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0s</div>
                    <p className="text-xs text-muted-foreground">
                    Ortalama sayfa yüklenme süresi
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sunucu Yanıt Süresi</CardTitle>
                    <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">0s</div>
                    <p className="text-xs text-muted-foreground">
                     Ortalama sunucu yanıt süresi
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dönüşüm Oranı</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" /> {/* Using TrendingUp again */}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">%0.00</div>
                    <p className="text-xs text-muted-foreground">
                    Ziyaretçiden aboneye dönüşüm oranı
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hata Oranı</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">%0.00</div>
                    <p className="text-xs text-muted-foreground">
                    Sayfa isteklerindeki hata oranı
                    </p>
                </CardContent>
                </Card>
            </div>
        </div>

    </div>
  );
}
