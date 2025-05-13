
"use client";
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
  Activity, // Activity Icon
  Loader2, // Loader Icon
  Home, // Home icon for "Siteyi Görüntüle"
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // For lists
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // For user list
import { getArticles, getUsers, type ArticleData, type User } from "@/lib/mock-data"; // Update imports
import * as React from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";


// --- Mock Data Fetching Functions ---
// Simulate fetching total comment count
async function getTotalCommentCount(): Promise<number> {
   // Replace with: const snapshot = await getDocs(collection(db, 'comments')); return snapshot.size;
  return 0; // Mock value
}


// --- Placeholder Components ---
const PlaceholderChart = ({ height = 'h-72' }: { height?: string }) => (
    <div className={`${height} w-full bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground`}>
        Grafik Alanı (Gerçek Analitik Verisi Gerekiyor)
    </div>
);


export default function AdminDashboard() {
  const [totalArticles, setTotalArticles] = React.useState(0);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [totalComments, setTotalComments] = React.useState(0);
  const [recentArticles, setRecentArticles] = React.useState<ArticleData[]>([]);
  const [activeUsers, setActiveUsers] = React.useState<User[]>([]);
  const [loadingData, setLoadingData] = React.useState(true); // Renamed from 'loading'
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUserId(user.id || null);
        } catch (e) {
          console.error("Error parsing currentUser in AdminDashboard", e);
          setCurrentUserId(null);
        }
      }
    }
  }, []);


  const { hasPermission, isLoading: permissionsLoading, error: permissionsError } = usePermissions(currentUserId);
  const router = useRouter();

  const fetchData = React.useCallback(async () => {
    console.log("[AdminDashboard] Starting data fetch...");
    setLoadingData(true);
    try {
      const [
        articlesData,
        usersData,
        commentsData,
      ] = await Promise.all([
        getArticles(),
        getUsers(),
        getTotalCommentCount(),
      ]);
      console.log("[AdminDashboard] Data fetched:", { articles: articlesData.length, users: usersData.length, comments: commentsData });

      setTotalArticles(articlesData.length);
      setTotalUsers(usersData.length);
      setTotalComments(commentsData);

      setRecentArticles(
        articlesData
          .filter(a => a.status === 'Yayınlandı')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
      );

      setActiveUsers(
        usersData
          .filter(u => u.lastLogin)
          .sort((a, b) => new Date(b.lastLogin!).getTime() - new Date(a.lastLogin!).getTime())
          .slice(0, 5)
      );

    } catch (error) {
      console.error("[AdminDashboard] Error fetching dashboard data:", error);
      toast({ variant: "destructive", title: "Veri Yükleme Hatası", description: "Gösterge paneli verileri yüklenemedi."})
    } finally {
      setLoadingData(false);
      console.log("[AdminDashboard] Data fetch complete.");
    }
  }, []);

  React.useEffect(() => {
    console.log("[AdminDashboard] Permissions effect: loading=", permissionsLoading, "hasPerm=", hasPermission('Dashboard Görüntüleme'));
    if (permissionsLoading) {
        console.log("[AdminDashboard] Waiting for permissions to load...");
        return;
    }

    if (!hasPermission('Dashboard Görüntüleme')) {
        console.log("[AdminDashboard] No permission to view dashboard, redirecting to profile.");
        toast({ variant: "destructive", title: "Erişim Reddedildi", description: "Gösterge panelini görüntüleme yetkiniz yok." });
        router.push('/admin/profile');
        return;
    }
    console.log("[AdminDashboard] User has permission, fetching data.");
    fetchData();

  }, [fetchData, permissionsLoading, hasPermission, router]);

  if (permissionsError) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive text-lg mb-2">İzin Hatası</p>
            <p className="text-muted-foreground max-w-md text-center">{permissionsError}</p>
            <Button onClick={() => router.push('/login')} className="mt-6">Giriş Sayfasına Dön</Button>
        </div>
    );
  }

  if (permissionsLoading || loadingData) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            Gösterge Paneli Yükleniyor...
        </div>
    );
  }


  // --- Data for placeholders that require real analytics ---
  const pageViews = 0; 
  const uniqueVisitors = 0; 
  const bounceRate = "0.00%"; 
  const conversionRate = "0.00%"; 
  const avgReadTime = "0:00"; 
  const pageLoadTime = "0ms"; 
  const serverResponseTime = "0ms"; 
  const subscriberConversionRate = "0.00%"; 
  const errorRate = "0.00%"; 


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">İstatistikler</h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={fetchData} disabled={loadingData}>
               <RefreshCw className="mr-2 h-4 w-4" /> Verileri Yenile
            </Button>
            <Button variant="outline" asChild>
                <Link href="/" target="_blank">
                    <Home className="mr-2 h-4 w-4" /> Siteyi Görüntüle
                </Link>
            </Button>
        </div>
      </div>

      {/* Top Row Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Makale</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
             <Link href="/admin/articles" className="text-xs text-muted-foreground hover:text-primary transition-colors">
               Tüm makaleleri gör
             </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sayfa Görüntülenme</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageViews}</div>
            <p className="text-xs text-muted-foreground">
              (Gerçek analitik verisi gerekiyor)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
             <Link href="/admin/users" className="text-xs text-muted-foreground hover:text-primary transition-colors">
               Kullanıcıları yönet
             </Link>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yorumlar</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
             <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
               Yorumları yönet (Yakında)
             </Link>
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
            <div className="text-2xl font-bold">{bounceRate}</div>
            <p className="text-xs text-muted-foreground">
              (Gerçek analitik verisi gerekiyor)
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dönüşüm Oranı (Hedef)</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}</div>
            <p className="text-xs text-muted-foreground">
              (Gerçek analitik verisi gerekiyor)
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Okuma Süresi</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgReadTime}</div>
            <p className="text-xs text-muted-foreground">
              (Gerçek analitik verisi gerekiyor)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphs Section */}
       <Card>
         <CardHeader>
            <CardTitle>Grafikler</CardTitle>
             <CardDescription>Site performansı ve kullanıcı etkileşimlerinin görsel özeti. (Gerçek analitik verisi gerekiyor)</CardDescription>
         </CardHeader>
         <CardContent>
             <Tabs defaultValue="traffic">
                 <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4">
                    <TabsTrigger value="traffic"><LineChart className="mr-1 h-4 w-4"/>Trafik</TabsTrigger>
                    <TabsTrigger value="sources"><ExternalLink className="mr-1 h-4 w-4"/>Kaynaklar</TabsTrigger>
                    <TabsTrigger value="devices"><Smartphone className="mr-1 h-4 w-4"/>Cihazlar</TabsTrigger>
                    <TabsTrigger value="content"><FileText className="mr-1 h-4 w-4"/>İçerik</TabsTrigger>
                    <TabsTrigger value="engagement"><Users className="mr-1 h-4 w-4"/>Etkileşim</TabsTrigger>
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
                 {/* Other Tabs - Render PlaceholderChart for now */}
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
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold">Son Eklenen Makaleler</CardTitle>
                     <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <CardDescription className="mb-4 -mt-2">En son yayınlanan makaleler.</CardDescription>
                    {recentArticles.length > 0 ? (
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Başlık</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead className="text-right">Eylemler</TableHead>
                                </TableRow>
                            </TableHeader>
                             <TableBody>
                                {recentArticles.map((article) => (
                                    <TableRow key={article.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/admin/articles/edit/${article.id}`} className="hover:underline">
                                                {article.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{article.category}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/articles/${article.id}`} target="_blank">Görüntüle</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                         </Table>
                    ) : (
                        <p className="text-sm text-muted-foreground">Henüz makale yok.</p>
                    )}
                </CardContent>
            </Card>
            <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-base font-semibold">Son Aktif Kullanıcılar</CardTitle>
                      <Users className="h-5 w-5 text-muted-foreground" />
                 </CardHeader>
                 <CardContent>
                    <CardDescription className="mb-4 -mt-2">Son giriş yapan kullanıcılar</CardDescription>
                     {activeUsers.length > 0 ? (
                         <div className="space-y-4">
                             {activeUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar placeholder" />
                                            <AvatarFallback>{user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                             <Link href={`/admin/users/edit/${user.id}`} className="text-sm font-medium hover:underline">{user.name || 'İsimsiz Kullanıcı'}</Link>
                                             <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                     <p className="text-xs text-muted-foreground">{user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                                </div>
                             ))}
                         </div>
                     ) : (
                         <p className="text-sm text-muted-foreground">Henüz kullanıcı yok.</p>
                     )}
                     <Button variant="link" size="sm" className="p-0 h-auto mt-4" asChild>
                        <Link href="/admin/users"><Activity className="mr-1 h-3 w-3"/> Tüm Kullanıcıları Gör</Link>
                     </Button>
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
                    <div className="text-2xl font-bold">{pageLoadTime}</div>
                    <p className="text-xs text-muted-foreground">
                     (Gerçek ölçüm gerekiyor)
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sunucu Yanıt Süresi</CardTitle>
                    <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{serverResponseTime}</div>
                    <p className="text-xs text-muted-foreground">
                      (Gerçek ölçüm gerekiyor)
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dönüşüm Oranı (Abone)</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{subscriberConversionRate}</div>
                    <p className="text-xs text-muted-foreground">
                     (Gerçek analitik verisi gerekiyor)
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hata Oranı</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{errorRate}</div>
                    <p className="text-xs text-muted-foreground">
                     (Gerçek ölçüm/loglama gerekiyor)
                    </p>
                </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
