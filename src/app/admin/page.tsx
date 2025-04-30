
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Newspaper, Users, Activity, Edit3, Clock, CheckCircle, BarChartHorizontalBig } from "lucide-react"; // Added more icons
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Placeholder components for charts
const PlaceholderLineChart = () => <div className="h-60 w-full bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">Ziyaretçi Grafiği (Placeholder)</div>;
const PlaceholderBarChart = () => <div className="h-60 w-full bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">İçerik Performans Grafiği (Placeholder)</div>;


export default function AdminDashboard() {
  return (
    <div className="space-y-8"> {/* Increased spacing */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gösterge Paneli</h1>
        <Button asChild>
          <Link href="/admin/articles/new">Yeni Makale Oluştur</Link>
        </Button>
      </div>


      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"> {/* Adjusted grid cols and gap */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Makale</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">
              Yayınlanmış ve taslak makaleler
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taslaklar</CardTitle>
            <Edit3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">
              Henüz yayınlanmamış makaleler
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kullanıcılar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+150</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">
              Toplam kayıtlı kullanıcı
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Yorumlar</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">
              Onay bekleyen yorumlar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Site Ziyaretleri (Son 30 Gün)</CardTitle>
                <CardDescription>Genel site trafiği eğilimi.</CardDescription>
            </CardHeader>
            <CardContent>
                <PlaceholderLineChart />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>En Popüler İçerikler</CardTitle>
                <CardDescription>En çok görüntülenen makaleler.</CardDescription>
            </CardHeader>
            <CardContent>
                <PlaceholderBarChart />
            </CardContent>
        </Card>
      </div>

       {/* Recent Activity and Quick Actions */}
       <div className="grid gap-6 lg:grid-cols-3">
           <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Son Etkinlikler</CardTitle>
                    <CardDescription>Sistemdeki en son önemli hareketler.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Replace with actual activity feed */}
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Yeni makale yayınlandı: "Kuantum Bilgisayarlar"</span>
                            <span className="ml-auto text-xs">1 saat önce</span>
                        </li>
                         <li className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Yeni kullanıcı kaydoldu: ahmet_y</span>
                             <span className="ml-auto text-xs">3 saat önce</span>
                        </li>
                        <li className="flex items-center gap-2">
                           <Edit3 className="h-4 w-4" />
                           <span>Makale güncellendi: "Yapay Zeka Devrimi"</span>
                            <span className="ml-auto text-xs">Dün</span>
                        </li>
                         <li className="flex items-center gap-2">
                           <Newspaper className="h-4 w-4" />
                           <span>Yeni taslak oluşturuldu: "Blockchain Uygulamaları"</span>
                            <span className="ml-auto text-xs">2 gün önce</span>
                        </li>
                         {/* Add more activities */}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Hızlı Eylemler</CardTitle>
                    <CardDescription>Sık kullanılan işlemlere hızlı erişim.</CardDescription>
                 </CardHeader>
                 <CardContent className="flex flex-col space-y-3">
                    <Button variant="outline" asChild><Link href="/admin/articles/new">Yeni Makale</Link></Button>
                    <Button variant="outline" asChild><Link href="/admin/users">Kullanıcıları Yönet</Link></Button>
                    <Button variant="outline" asChild><Link href="/admin/settings">Site Ayarları</Link></Button>
                     {/* Add more quick actions */}
                 </CardContent>
            </Card>
        </div>

    </div>
  );
}
