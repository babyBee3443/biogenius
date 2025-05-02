
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


// --- Mock Data Fetching Functions ---
// TODO: Replace these with actual API calls to your backend/database (e.g., Firestore)

// Simulate fetching total article count
async function getTotalArticleCount(): Promise<number> {
  // await new Promise(resolve => setTimeout(resolve, 150)); // Removed delay
  // Replace with: const snapshot = await getDocs(collection(db, 'articles')); return snapshot.size;
  return 8; // Mock value
}

// Simulate fetching total user count
async function getTotalUserCount(): Promise<number> {
  // await new Promise(resolve => setTimeout(resolve, 200)); // Removed delay
  // Replace with: const snapshot = await getDocs(collection(db, 'users')); return snapshot.size;
  return 5; // Mock value
}

// Simulate fetching total comment count
async function getTotalCommentCount(): Promise<number> {
  // await new Promise(resolve => setTimeout(resolve, 250)); // Removed delay
   // Replace with: const snapshot = await getDocs(collection(db, 'comments')); return snapshot.size;
  return 12; // Mock value
}

interface Article {
  id: string;
  title: string;
  category: string;
  // Add views or other metric for 'popularity' if available
}
// Simulate fetching recent/popular articles
async function getRecentArticles(limit: number = 5): Promise<Article[]> {
   // await new Promise(resolve => setTimeout(resolve, 300)); // Removed delay
   // Replace with actual query, potentially ordering by creation date or view count
   return [
     { id: '1', title: 'Yapay Zeka Devrimi', category: 'Teknoloji' },
     { id: '2', title: 'Gen Düzenleme Teknolojileri', category: 'Biyoloji' },
     { id: '7', title: 'Nöral Ağlar ve Derin Öğrenme', category: 'Teknoloji' },
     { id: '8', title: 'Kanser İmmünoterapisi', category: 'Biyoloji' },
     { id: '4', title: 'Mikrobiyom: İçimizdeki Dünya', category: 'Biyoloji' },
   ].slice(0, limit);
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  lastLogin: string; // Use this to sort for 'active'
}
// Simulate fetching recent/active users
async function getActiveUsers(limit: number = 5): Promise<User[]> {
   // await new Promise(resolve => setTimeout(resolve, 350)); // Removed delay
    // Replace with actual query, potentially ordering by last login date
   return [
     { id: 'u1', name: 'Ali Veli', email: 'ali.veli@example.com', avatar: 'https://picsum.photos/seed/u1/32/32', lastLogin: '2024-07-22 10:30' },
     { id: 'u2', name: 'Ayşe Kaya', email: 'ayse.kaya@example.com', avatar: 'https://picsum.photos/seed/u2/32/32', lastLogin: '2024-07-21 15:00' },
     { id: 'u3', name: 'Mehmet Yılmaz', email: 'mehmet.yilmaz@example.com', avatar: 'https://picsum.photos/seed/u3/32/32', lastLogin: '2024-07-20 09:15' },
     { id: 'u5', name: 'Can Öztürk', email: 'can.ozturk@example.com', avatar: 'https://picsum.photos/seed/u5/32/32', lastLogin: '2024-07-19 18:45' },
     { id: 'u4', name: 'Zeynep Demir', email: 'zeynep.demir@example.com', avatar: 'https://picsum.photos/seed/u4/32/32', lastLogin: '2024-07-18 11:00' },
   ].sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()).slice(0, limit); // Simple sort by date string
}

// --- Placeholder Components ---
const PlaceholderChart = ({ height = 'h-72' }: { height?: string }) => (
    <div className={`${height} w-full bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground`}>
        Grafik Alanı (Gerçek Analitik Verisi Gerekiyor)
    </div>
);


export default async function AdminDashboard() {
  // Fetch data (parallel fetching)
  const [
      totalArticles,
      totalUsers,
      totalComments,
      recentArticles,
      activeUsers
  ] = await Promise.all([
      getTotalArticleCount(),
      getTotalUserCount(),
      getTotalCommentCount(),
      getRecentArticles(),
      getActiveUsers()
  ]);

  // --- Data for placeholders that require real analytics ---
  // These values would come from an analytics service or more complex backend tracking
  const pageViews = 0; // Placeholder
  const uniqueVisitors = 0; // Placeholder
  const bounceRate = "0.00%"; // Placeholder
  const conversionRate = "0.00%"; // Placeholder
  const avgReadTime = "0:00"; // Placeholder
  const pageLoadTime = "0ms"; // Placeholder
  const serverResponseTime = "0ms"; // Placeholder
  const subscriberConversionRate = "0.00%"; // Placeholder
  const errorRate = "0.00%"; // Placeholder

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">İstatistikler</h1>
        {/* TODO: Implement refresh functionality if needed */}
        <Button variant="outline" disabled>
           <RefreshCw className="mr-2 h-4 w-4" /> Verileri Yenile (Yakında)
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
            <CardTitle className="text-sm font-medium">Tekil Ziyaretçi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueVisitors}</div>
            <p className="text-xs text-muted-foreground">
              (Gerçek analitik verisi gerekiyor)
            </p>
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
                    <CardTitle className="text-base font-semibold">Son Eklenen/Popüler Makaleler</CardTitle>
                     <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <CardDescription className="mb-4 -mt-2">En son eklenen veya en çok görüntülenen makaleler</CardDescription>
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
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                             <Link href={`/admin/users/edit/${user.id}`} className="text-sm font-medium hover:underline">{user.name}</Link>
                                             <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                     <p className="text-xs text-muted-foreground">{new Date(user.lastLogin).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
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
