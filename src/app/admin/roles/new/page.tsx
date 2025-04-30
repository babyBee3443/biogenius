
"use client";

import * as React from "react";
import { useRouter } from 'next/navigation'; // Use for redirect after save
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Square, CheckSquare } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Mock Data - Replace with actual API calls
interface PermissionCategory {
    name: string;
    permissions: { id: string; description: string }[];
}

const getAllPermissions = async (): Promise<PermissionCategory[]> => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate fetch delay
    // Reusing the same structure as edit page
    return [
        {
            name: "Genel", permissions: [{ id: "Dashboard Görüntüleme", description: "Ana gösterge panelini görüntüleme." }],
        },
        {
            name: "Makaleler", permissions: [
                { id: "Makaleleri Görüntüleme", description: "Tüm veya belirli makaleleri listeleme ve okuma." },
                { id: "Makale Oluşturma", description: "Yeni makale taslağı oluşturma." },
                { id: "Makale Düzenleme", description: "Mevcut makaleleri düzenleme." },
                { id: "Makale Silme", description: "Makaleleri kalıcı olarak silme." },
                { id: "Makale Yayınlama", description: "Makaleleri yayına alma veya yayından kaldırma." },
                { id: "SEO Ayarlarını Düzenleme (Makale)", description: "Makalelere özel SEO bilgilerini düzenleme." },
                { id: "İçerik Takvimini Görüntüleme", description: "Yayınlanacak içerik takvimini görme." },
            ],
        },
        {
            name: "Sayfalar", permissions: [
                 { id: "Sayfaları Görüntüleme", description: "Statik sayfaları (Hakkında vb.) görüntüleme." },
                 { id: "Sayfa Düzenleme", description: "Statik sayfaların içeriğini düzenleme." },
                 { id: "Sayfa Oluşturma/Silme", description: "Yeni statik sayfalar oluşturma veya silme." },
                 { id: "Menü Yönetimi", description: "Site navigasyon menülerini düzenleme."},
            ],
        },
         {
            name: "Kullanıcılar ve Roller", permissions: [
                { id: "Kullanıcıları Görüntüleme", description: "Kullanıcı listesini görüntüleme." },
                { id: "Kullanıcı Ekleme/Silme", description: "Yeni kullanıcı ekleme veya mevcutları silme." },
                { id: "Kullanıcı Düzenleme", description: "Kullanıcı profillerini ve rollerini düzenleme." },
                { id: "Rolleri Yönetme", description: "Kullanıcı rollerini ve izinlerini oluşturma, düzenleme, silme." },
            ],
        },
        {
            name: "Ayarlar", permissions: [
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
            name: "Medya ve Yorumlar", permissions: [
                 { id: "Medya Yönetimi", description: "Medya kütüphanesini yönetme (yükleme, silme, düzenleme)." },
                 { id: "Medya Yükleme (Kendi içeriği için)", description: "Sadece kendi oluşturduğu içerikler için medya yükleme."},
                 { id: "Yorumları Yönetme", description: "Makale yorumlarını onaylama, silme, düzenleme." },
            ],
        },
         {
            name: "İstatistik ve Diğer", permissions: [
                 { id: "İstatistikleri Görüntüleme", description: "Site analiz ve istatistiklerini görüntüleme." },
                 { id: "Raporlama", description: "Özel raporlar oluşturma ve görüntüleme." },
                 { id: "İş Akışı Yönetimi", description: "İçerik onay süreçlerini yönetme."},
                 { id: "Sistem Güncelleme", description: "Site yazılımını güncelleme."},
            ],
        },
    ];
};


export default function NewRolePage() {
    const router = useRouter();
    const [allPermissions, setAllPermissions] = React.useState<PermissionCategory[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [selectedPermissions, setSelectedPermissions] = React.useState<Set<string>>(new Set());

    React.useEffect(() => {
        getAllPermissions()
            .then(permissionsData => {
                setAllPermissions(permissionsData);
            })
            .catch(error => {
                console.error("Error fetching permissions:", error);
                toast({ variant: "destructive", title: "Hata", description: "İzin listesi yüklenirken bir sorun oluştu." });
            })
            .finally(() => setLoading(false));
    }, []);

     const handlePermissionChange = (permissionId: string, checked: boolean | 'indeterminate') => {
        setSelectedPermissions(prev => {
            const newSet = new Set(prev);
            if (checked === true) {
                newSet.add(permissionId);
            } else {
                newSet.delete(permissionId);
            }
            return newSet;
        });
    };

     const handleCategoryChange = (category: PermissionCategory, checked: boolean | 'indeterminate') => {
        setSelectedPermissions(prev => {
            const newSet = new Set(prev);
            category.permissions.forEach(permission => {
                 if (checked === true) {
                    newSet.add(permission.id);
                } else {
                    newSet.delete(permission.id);
                }
            });
            return newSet;
        });
     };

     const getCategoryCheckedState = (category: PermissionCategory): boolean | 'indeterminate' => {
        const categoryPermissions = category.permissions.map(p => p.id);
        const selectedInCategory = categoryPermissions.filter(p => selectedPermissions.has(p));

        if (selectedInCategory.length === 0) return false;
        if (selectedInCategory.length === categoryPermissions.length) return true;
        return 'indeterminate';
     };

    const handleSave = () => {
        // Generate a unique ID for the new role (replace with actual backend ID generation)
        const newRoleId = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        const newRoleData = {
            id: newRoleId,
            name,
            description,
            permissions: Array.from(selectedPermissions),
        };
        console.log("Creating new role:", newRoleData);
        // TODO: Implement actual API call to create the new role
        toast({
            title: "Rol Oluşturuldu",
            description: `"${name}" rolü başarıyla oluşturuldu.`,
        });
        // Redirect to the roles list page or the edit page of the new role
        router.push('/admin/roles');
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">İzinler yükleniyor...</div>;
    }

    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <Button variant="outline" size="sm" asChild className="mb-4">
                        <Link href="/admin/roles"><ArrowLeft className="mr-2 h-4 w-4" /> Rol Listesine Dön</Link>
                    </Button>
                    <h1 className="text-3xl font-bold">Yeni Rol Oluştur</h1>
                    <p className="text-muted-foreground">Yeni bir kullanıcı rolü tanımlayın ve izinlerini ayarlayın.</p>
                </div>
                <Button onClick={handleSave} disabled={!name}> {/* Disable save if name is empty */}
                    <Save className="mr-2 h-4 w-4" /> Rolü Kaydet
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rol Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="role-name">Rol Adı <span className="text-destructive">*</span></Label>
                        <Input
                            id="role-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Örn: İçerik Yöneticisi"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role-description">Açıklama</Label>
                        <Textarea
                            id="role-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            placeholder="Rolün amacını kısaca açıklayın (isteğe bağlı)..."
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>İzinler</CardTitle>
                    <CardDescription>Bu role atanacak izinleri seçin.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Accordion type="multiple" defaultValue={allPermissions.map(cat => cat.name)} className="w-full">
                         {allPermissions.map((category) => (
                            <AccordionItem value={category.name} key={category.name}>
                                <AccordionTrigger className="hover:no-underline">
                                     <div className="flex items-center gap-3">
                                         <Checkbox
                                             id={`cat-${category.name}`}
                                             checked={getCategoryCheckedState(category)}
                                             onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                                             aria-label={`Tüm ${category.name} izinlerini seç`}
                                         />
                                        <span className="text-base font-medium">{category.name}</span>
                                     </div>
                                </AccordionTrigger>
                                <AccordionContent className="pl-8 pr-2 space-y-3 pt-3">
                                    {category.permissions.map((permission) => (
                                        <div key={permission.id} className="flex items-start gap-3">
                                            <Checkbox
                                                id={`perm-${permission.id}`}
                                                checked={selectedPermissions.has(permission.id)}
                                                onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                                                className="mt-1"
                                            />
                                            <div className="grid gap-0.5 leading-none">
                                                <Label htmlFor={`perm-${permission.id}`} className="text-sm font-medium cursor-pointer">
                                                    {permission.id}
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    {permission.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                         ))}
                     </Accordion>
                </CardContent>
            </Card>

            <Separator />
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={!name}>
                    <Save className="mr-2 h-4 w-4" /> Rolü Kaydet
                </Button>
            </div>
        </form>
    );
}
