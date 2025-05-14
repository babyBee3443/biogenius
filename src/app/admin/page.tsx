
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  Newspaper, 
  Eye, 
  Users, 
  MessageSquare, 
  ArrowUpRight, 
  Upload, 
  Clock, 
  LineChart, 
  ExternalLink, 
  Smartphone, 
  FileText, 
  Search, 
  TrendingUp, 
  Gauge, 
  Server, 
  AlertTriangle, 
  RefreshCw, 
  Activity, 
  Loader2, 
  Home, 
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { getArticles, type ArticleData } from '@/lib/data/articles';
import { getUsers, type User } from '@/lib/data/users';
import * as React from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";


async function getTotalCommentCount(): Promise<number> {
  return 0; 
}

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
  const [loadingData, setLoadingData] = React.useState(true);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = React.useState(false);


  React.useEffect(() => {
    let isMounted = true;
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (isMounted) setCurrentUserId(user.id || null);
        } catch (e) {
          console.error("Error parsing currentUser in AdminDashboard", e);
          if (isMounted) setCurrentUserId(null);
        }
      } else {
        if (isMounted) setCurrentUserId(null); 
      }
      if (isMounted) setIsInitialLoadComplete(true); 
    }
    return () => { isMounted = false; };
  }, []);


  const { hasPermission, isLoading: permissionsLoading, error: permissionsError } = usePermissions(currentUserId);
  const router = useRouter();

  const fetchData = React.useCallback(async () => {
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
    }
  }, []);

  React.useEffect(() => {
    if (!isInitialLoadComplete) {
        return;
    }
    
    if (!currentUserId) {
        // AdminLayout should handle redirecting to login if not on /login already
        setLoadingData(false); // Stop loading as there's no user to fetch data for
        return;
    }

    if (permissionsLoading) {
        return; 
    }

    if (permissionsError) {
        console.error("[AdminDashboard] Permissions error:", permissionsError);
        // Error is handled by the main return block below for permissions error
        // No need to toast here again, usePermissions might already do it or AdminLayout.
        setLoadingData(false); // Stop loading as permissions failed
        return;
    }
    
    if (!hasPermission('Dashboard Görüntüleme')) {
        // toast({ variant: "destructive", title: "Erişim Reddedildi", description: "Gösterge panelini görüntüleme yetkiniz yok." });
        // router.push('/admin/profile'); // Redirect to a safe page if no dashboard permission
        // This redirection is now primarily handled by AdminLayout for non-admins.
        // For admins without this specific permission, they might see a blank or restricted page.
        setLoadingData(false); // Stop loading if no permission
        return;
    }
    
    fetchData();

  }, [isInitialLoadComplete, currentUserId, fetchData, permissionsLoading, hasPermission, router, permissionsError]);

  // This loading state covers: initial localStorage check, permissions check, and data fetching
  if (!isInitialLoadComplete || (currentUserId && permissionsLoading) || loadingData) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            Gösterge Paneli Yükleniyor...
        </div>
    );
  }

  // This error rendering is now more specific to actual data loading or critical permission issues
  if (permissionsError && currentUserId) { // Only show if there's a user and a permission error
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive text-lg mb-2">Yetkilendirme Hatası</p>
            <p className="text-muted-foreground max-w-md text-center">{permissionsError}</p>
            {/* The logout button is in AdminLayout, so no need for another one here */}
        </div>
    );
  }

  if (!hasPermission('Dashboard Görüntüleme') && currentUserId) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive text-lg mb-2">Erişim Reddedildi</p>
            <p className="text-muted-foreground max-w-md text-center">
                Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.
            </p>
        </div>
    );
  }


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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">İstatistikler</h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={fetchData} disabled={loadingData}>
               <RefreshCw className="mr-2 h-4 w-4" /> Verileri Yenile
            </Button>
            <Button variant="outline" asChild size="sm">
                <Link href="/" target="_blank">
                    <Home className="mr-2 h-4 w-4" /> Siteyi Görüntüle
                </Link>
            </Button>
        </div>
      </div>

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
                 <TabsContent value="sources"><PlaceholderChart /></TabsContent>
                 <TabsContent value="devices"><PlaceholderChart /></TabsContent>
                 <TabsContent value="content"><PlaceholderChart /></TabsContent>
                 <TabsContent value="engagement"><PlaceholderChart /></TabsContent>
                 <TabsContent value="seo"><PlaceholderChart /></TabsContent>
             </Tabs>
         </CardContent>
       </Card>

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

    