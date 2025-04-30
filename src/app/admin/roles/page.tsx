
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilePenLine, Trash2, ShieldQuestion, UserPlus } from "lucide-react"; // Added icons
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Mock Data - Replace with actual API calls
interface Role {
    id: string;
    name: string;
    description: string;
    userCount: number;
    permissions: string[];
}

const rolesData: Role[] = [
    {
        id: 'admin',
        name: 'Admin',
        description: 'Tam yetkili yönetici',
        userCount: 1,
        permissions: [
            'Dashboard Görüntüleme',
            'Ayarları Görüntüleme',
            'Ayarları Düzenleme',
            'Makaleleri Görüntüleme',
            'Makale Oluşturma',
            'Makale Düzenleme',
            'Makale Silme',
            'Kullanıcıları Görüntüleme',
            'Kullanıcı Ekleme/Silme',
            'Kullanıcı Düzenleme',
            'Rolleri Yönetme',
            'Yorumları Yönetme',
            'Medya Yönetimi',
            'Site Ayarlarını Yönetme',
            'Sayfaları Yönetme',
            // Add other 11 permissions...
            'İstatistikleri Görüntüleme',
            'Raporlama',
            'Güvenlik Ayarları',
            'Entegrasyon Yönetimi',
            'E-posta Ayarları',
            'Tema Ayarları',
            'Menü Yönetimi',
            'Dil Yönetimi',
            'Yedekleme/Kurtarma',
            'İş Akışı Yönetimi',
            'Sistem Güncelleme',
        ]
    },
    {
        id: 'editor',
        name: 'Editör',
        description: 'İçerik düzenleme yetkisine sahip',
        userCount: 3,
        permissions: [
            'Dashboard Görüntüleme',
            'Ayarları Görüntüleme', // Assuming Editors can view some settings
            'Makaleleri Görüntüleme',
            'Makale Oluşturma',
            'Makale Düzenleme',
            'Makale Silme', // Assuming Editors can delete their own/assigned articles
            'Yorumları Yönetme',
            'Medya Yönetimi',
            'Sayfaları Görüntüleme', // Assuming page viewing
            'Sayfa Düzenleme', // Assuming page editing
            // Add other 2 permissions...
            'İçerik Takvimini Görüntüleme',
            'SEO Ayarlarını Düzenleme (Makale)',
        ]
    },
    {
        id: 'yazar',
        name: 'Yazar',
        description: 'Sadece içerik oluşturabilir',
        userCount: 5,
        permissions: [
            'Dashboard Görüntüleme',
            'Makaleleri Görüntüleme', // View own/published articles
            'Makale Oluşturma',
            'Makale Düzenleme', // Edit own drafts
            'Sayfaları Görüntüleme', // View relevant pages
            'Medya Yükleme (Kendi içeriği için)', // Specific media permission
        ]
    }
];

// Mock Data - Permission Reference
interface PermissionCategory {
    name: string;
    permissions: { id: string; description: string }[];
}

const permissionsReference: PermissionCategory[] = [
    {
        name: "Genel",
        permissions: [
            { id: "Dashboard Görüntüleme", description: "Ana gösterge panelini görüntüleme." },
        ],
    },
    {
        name: "Makaleler",
        permissions: [
            { id: "Makaleleri Görüntüleme", description: "Tüm veya belirli makaleleri listeleme ve okuma." },
            { id: "Makale Oluşturma", description: "Yeni makale taslağı oluşturma." },
            { id: "Makale Düzenleme", description: "Mevcut makaleleri düzenleme." },
            { id: "Makale Silme", description: "Makaleleri kalıcı olarak silme." },
            { id: "Makale Yayınlama", description: "Makaleleri yayına alma veya yayından kaldırma." },
             { id: "SEO Ayarlarını Düzenleme (Makale)", description: "Makalelere özel SEO bilgilerini düzenleme." },
             { id: "İçerik Takvimini Görüntüleme", description: "Yayınlanacak içerik takvimini görme."},
        ],
    },
    {
        name: "Sayfalar",
        permissions: [
             { id: "Sayfaları Görüntüleme", description: "Statik sayfaları (Hakkında vb.) görüntüleme." },
             { id: "Sayfa Düzenleme", description: "Statik sayfaların içeriğini düzenleme." },
             { id: "Sayfa Oluşturma/Silme", description: "Yeni statik sayfalar oluşturma veya silme." },
             { id: "Menü Yönetimi", description: "Site navigasyon menülerini düzenleme."},
        ],
    },
     {
        name: "Kullanıcılar ve Roller",
        permissions: [
            { id: "Kullanıcıları Görüntüleme", description: "Kullanıcı listesini görüntüleme." },
            { id: "Kullanıcı Ekleme/Silme", description: "Yeni kullanıcı ekleme veya mevcutları silme." },
            { id: "Kullanıcı Düzenleme", description: "Kullanıcı profillerini ve rollerini düzenleme." },
            { id: "Rolleri Yönetme", description: "Kullanıcı rollerini ve izinlerini oluşturma, düzenleme, silme." },
        ],
    },
    {
        name: "Ayarlar",
        permissions: [
             { id: "Ayarları Görüntüleme", description: "Genel site ayarlarını görüntüleme." },
             { id: "Ayarları Düzenleme", description: "Genel site ayarlarını değiştirme." },
             { id: "Güvenlik Ayarları", description: "Güvenlik ile ilgili ayarları yönetme."},
             { id: "Entegrasyon Yönetimi", description: "Üçüncü parti servis entegrasyonlarını yönetme."},
             { id: "E-posta Ayarları", description: "Sistem e-posta ayarlarını yönetme."},
             { id: "Tema Ayarları", description: "Site görünüm ve tema ayarlarını yönetme."},
             { id: "Dil Yönetimi", description: "Site dil ve çeviri ayarlarını yönetme."},
             { id: "Yedekleme/Kurtarma", description: "Site yedekleme ve geri yükleme işlemlerini yapma."},
        ],
    },
     {
        name: "Medya ve Yorumlar",
        permissions: [
             { id: "Medya Yönetimi", description: "Medya kütüphanesini yönetme (yükleme, silme, düzenleme)." },
             { id: "Medya Yükleme (Kendi içeriği için)", description: "Sadece kendi oluşturduğu içerikler için medya yükleme."},
             { id: "Yorumları Yönetme", description: "Makale yorumlarını onaylama, silme, düzenleme." },
        ],
    },
     {
        name: "İstatistik ve Diğer",
        permissions: [
             { id: "İstatistikleri Görüntüleme", description: "Site analiz ve istatistiklerini görüntüleme." },
             { id: "Raporlama", description: "Özel raporlar oluşturma ve görüntüleme." },
             { id: "İş Akışı Yönetimi", description: "İçerik onay süreçlerini yönetme."},
             { id: "Sistem Güncelleme", description: "Site yazılımını güncelleme."},
        ],
    },
    // Add more categories and permissions
];

export default function AdminRolesPage() {

    // TODO: Implement state for adding/editing roles and permissions

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Roller</h1>
                    <p className="text-muted-foreground">Kullanıcı rolleri ve izinlerini yönetin.</p>
                </div>
                <Button asChild>
                    {/* Link to a new role page or open a modal */}
                    <Link href="/admin/roles/new">
                        <UserPlus className="mr-2 h-4 w-4" /> Yeni Rol Ekle
                    </Link>
                </Button>
            </div>

            <Tabs defaultValue="roles">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="roles">Roller</TabsTrigger>
                    <TabsTrigger value="permissions">İzinler Referansı</TabsTrigger>
                </TabsList>

                {/* Roles Tab */}
                <TabsContent value="roles" className="mt-6 space-y-4">
                    {rolesData.map((role) => (
                        <Card key={role.id}>
                            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
                                <div className="flex items-start gap-3">
                                    {/* Optional: Icon based on role */}
                                    <ShieldQuestion className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />
                                    <div>
                                        <CardTitle className="text-xl">{role.name}</CardTitle>
                                        <CardDescription className="mt-1">{role.description}</CardDescription>
                                        <p className="text-xs text-muted-foreground mt-2">{role.userCount} kullanıcı bu role sahip</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                        <Link href={`/admin/roles/edit/${role.id}`}>
                                            <FilePenLine className="h-4 w-4" />
                                            <span className="sr-only">Rolü Düzenle</span>
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Rolü Sil</span>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Separator className="mb-4" />
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions.slice(0, 6).map((permission) => (
                                        <Badge key={permission} variant="secondary" className="font-normal text-xs">
                                            {permission}
                                        </Badge>
                                    ))}
                                    {role.permissions.length > 6 && (
                                        <Badge variant="outline" className="font-normal text-xs">
                                            +{role.permissions.length - 6} daha
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                {/* Permissions Reference Tab */}
                <TabsContent value="permissions" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>İzinler Referansı</CardTitle>
                            <CardDescription>Sistemdeki tüm mevcut izinlerin açıklamaları.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {permissionsReference.map((category, index) => (
                                <div key={index}>
                                    <h3 className="text-lg font-semibold mb-3">{category.name}</h3>
                                    <div className="space-y-3 pl-4 border-l-2 border-muted">
                                        {category.permissions.map((permission) => (
                                            <div key={permission.id}>
                                                <p className="font-medium text-sm">{permission.id}</p>
                                                <p className="text-xs text-muted-foreground">{permission.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {index < permissionsReference.length - 1 && <Separator className="mt-6" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
