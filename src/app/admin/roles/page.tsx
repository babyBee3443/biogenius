
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilePenLine, Trash2, ShieldQuestion, UserPlus, Loader2, RefreshCw } from "lucide-react"; 
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getRoles, deleteRole, getAllPermissions, type Role, type PermissionCategory } from '@/lib/data/roles'; // Updated import
import { usePermissions } from "@/hooks/usePermissions";
import { useRouter } from "next/navigation";


export default function AdminRolesPage() {
    const [rolesData, setRolesData] = React.useState<Role[]>([]);
    const [permissionsReference, setPermissionsReference] = React.useState<PermissionCategory[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [deletingId, setDeletingId] = React.useState<string | null>(null);
    const { hasPermission, isLoading: permissionsLoading } = usePermissions();
    const router = useRouter();

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [roles, permissions] = await Promise.all([
                getRoles(),
                getAllPermissions()
            ]);
            setRolesData(roles);
            setPermissionsReference(permissions);
        } catch (err) {
            console.error("Error fetching roles/permissions data:", err);
            setError("Rol veya izin verileri yüklenirken bir hata oluştu.");
            toast({ variant: "destructive", title: "Hata", description: "Veriler yüklenemedi." });
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        if (!permissionsLoading && !hasPermission('Rolleri Yönetme')) {
            toast({ variant: "destructive", title: "Erişim Reddedildi", description: "Rol yönetimi sayfasına erişim yetkiniz yok." });
            router.push('/admin');
            return;
        }
        if (!permissionsLoading && hasPermission('Rolleri Yönetme')) {
            fetchData();
        }
    }, [fetchData, permissionsLoading, hasPermission, router]);

    const handleDeleteRole = async (id: string, name: string) => {
        setDeletingId(id);
        try {
            const success = await deleteRole(id);
            if (success) {
                toast({ title: "Rol Silindi", description: `"${name}" rolü başarıyla silindi.` });
                await fetchData(); 
            } else {
                toast({ variant: "destructive", title: "Silme Hatası", description: "Rol silinemedi." });
            }
        } catch (error) {
            console.error("Error deleting role:", error);
            toast({ variant: "destructive", title: "Silme Hatası", description: "Rol silinirken bir hata oluştu." });
        } finally {
            setDeletingId(null);
        }
    };

    if (loading || permissionsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                Yükleniyor...
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-10 text-destructive">{error}</div>;
    }


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Roller</h1>
                    <p className="text-muted-foreground">Kullanıcı rolleri ve izinlerini yönetin.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchData} disabled={loading || !!deletingId}>
                        <RefreshCw className={cn("mr-2 h-4 w-4", (loading || !!deletingId) && "animate-spin")} />
                        Yenile
                    </Button>
                    {hasPermission('Rolleri Yönetme') && ( 
                        <Button asChild>
                            <Link href="/admin/roles/new">
                                <UserPlus className="mr-2 h-4 w-4" /> Yeni Rol Ekle
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <Tabs defaultValue="roles">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="roles">Roller</TabsTrigger>
                    <TabsTrigger value="permissions">İzinler Referansı</TabsTrigger>
                </TabsList>

                <TabsContent value="roles" className="mt-6 space-y-4">
                    {rolesData.map((role) => (
                        <Card key={role.id}>
                            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
                                <div className="flex items-start gap-3">
                                    <ShieldQuestion className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />
                                    <div>
                                        <CardTitle className="text-xl">{role.name}</CardTitle>
                                        <CardDescription className="mt-1">{role.description}</CardDescription>
                                        <p className="text-xs text-muted-foreground mt-2">{role.userCount} kullanıcı bu role sahip</p>
                                    </div>
                                </div>
                                {hasPermission('Rolleri Yönetme') && (
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                            <Link href={`/admin/roles/edit/${role.id}`}>
                                                <FilePenLine className="h-4 w-4" />
                                                <span className="sr-only">Rolü Düzenle</span>
                                            </Link>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" disabled={deletingId === role.id}>
                                                    {deletingId === role.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                    <span className="sr-only">Rolü Sil</span>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    "{role.name}" rolünü silmek üzeresiniz. Bu işlem, bu role sahip kullanıcıları etkileyebilir ve geri alınamaz.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeleteRole(role.id, role.name)}
                                                    className={cn(buttonVariants({ variant: "destructive" }))}
                                                >
                                                    Evet, Sil
                                                </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )}
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
