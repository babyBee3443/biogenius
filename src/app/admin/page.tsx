
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Newspaper, Users, Activity } from "lucide-react"; // Icons for dashboard cards

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gösterge Paneli</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Makale</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">
              Yayınlanmış makale sayısı
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
            <CardTitle className="text-sm font-medium">Site Aktivitesi</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div> {/* Placeholder value */}
            <p className="text-xs text-muted-foreground">
              Son 30 gündeki ziyaretler
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for Recent Activity or Charts */}
      <Card>
          <CardHeader>
              <CardTitle>Son Etkinlikler</CardTitle>
              <CardDescription>Sistemdeki son hareketler.</CardDescription>
          </CardHeader>
          <CardContent>
              {/* Replace with actual activity feed */}
              <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Yeni makale eklendi: "Kuantum Bilgisayarlar"</li>
                  <li>Kullanıcı kaydoldu: ahmet_y</li>
                  <li>Makale güncellendi: "Yapay Zeka Devrimi"</li>
              </ul>
          </CardContent>
      </Card>

    </div>
  );
}
