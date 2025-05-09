
"use client";

import * as React from "react";
import { notFound, useParams, useRouter } from 'next/navigation'; // Added useRouter
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button"; // Import buttonVariants
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Trash2, CheckSquare, Square, Loader2 } from "lucide-react"; // Added Loader2
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
import { cn } from "@/lib/utils";
import { type Role, getRoleById as mockGetRoleById, updateRole as mockUpdateRole, deleteRole as mockDeleteRole, getAllPermissions as mockGetAllPermissions, type PermissionCategory} from '@/lib/mock-data'; // Renamed imports
import { usePermissions } from "@/hooks/usePermissions";

export default function EditRolePage() {
    const params = useParams();
    const roleId = params.id as string;
    const router = useRouter();
    const { hasPermission, isLoading: permissionsLoading } = usePermissions();

    const [role, setRole] = React.useState<Role | null>(null);
    const [allPermissions, setAllPermissions] = React.useState<PermissionCategory[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    // Form states
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [selectedPermissions, setSelectedPermissions] = React.useState<Set<string>>(new Set());

    React.useEffect(() => {
        if (!permissionsLoading && !hasPermission('Rolleri Yönetme')) {
            toast({ variant: "destructive", title: "Erişim Reddedildi", description: "Rolleri düzenleme yetkiniz yok." });
            router.push('/admin');
            return;
        }

        if (roleId && !permissionsLoading && hasPermission('Rolleri Yönetme')) {
            setLoading(true);
            Promise.all([mockGetRoleById(roleId), mockGetAllPermissions()])
                .then(([roleData, permissionsData]) => {
                    if (roleData) {
                        setRole(roleData);
                        setName(roleData.name);
                        setDescription(roleData.description);
                        setSelectedPermissions(new Set(roleData.permissions));
                        setAllPermissions(permissionsData);
                    } else {
                        notFound();
                    }
                })
                .catch(error => {
                    console.error("Error fetching role data:", error);
                    toast({ variant: "destructive", title: "Hata", description: "Rol bilgileri yüklenirken bir sorun oluştu." });
                })
                .finally(() => setLoading(false));
        }
    }, [roleId, permissionsLoading, hasPermission, router]);

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

    const handleSave = async () => {
        if (!name.trim()) {
            toast({ variant: "destructive", title: "Eksik Bilgi", description: "Rol adı boş olamaz." });
            return;
        }
        setIsSaving(true);
        try {
            const updatedRoleData = {
                name,
                description,
                permissions: Array.from(selectedPermissions),
            };
            const result = await mockUpdateRole(roleId, updatedRoleData);
            if (result) {
                setRole(result);
                toast({
                    title: "Rol Güncellendi",
                    description: `"${name}" rolü başarıyla güncellendi.`,
                });
            } else {
                toast({ variant: "destructive", title: "Güncelleme Hatası", description: "Rol güncellenemedi." });
            }
        } catch (error) {
            console.error("Error updating role:", error);
            toast({ variant: "destructive", title: "Güncelleme Hatası", description: "Rol güncellenirken bir hata oluştu." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const success = await mockDeleteRole(roleId);
            if (success) {
                 toast({
                     variant: "destructive",
                     title: "Rol Silindi",
                     description: `"${name}" rolü silindi.`,
                });
                router.push('/admin/roles');
            } else {
                toast({ variant: "destructive", title: "Silme Hatası", description: "Rol silinemedi." });
            }
        } catch (error) {
            console.error("Error deleting role:", error);
            toast({ variant: "destructive", title: "Silme Hatası", description: "Rol silinirken bir hata oluştu." });
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading || permissionsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                Rol bilgileri yükleniyor...
            </div>
        );
    }

    if (!role && !loading) { // Added !loading check
        return <div className="text-center py-10">Rol bulunamadı.</div>;
    }


    return (
        <form onSubmit={(e) => {e.preventDefault(); handleSave();}} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <Button variant="outline" size="sm" asChild className="mb-4">
                        <Link href="/admin/roles"><ArrowLeft className="mr-2 h-4 w-4" /> Rol Listesine Dön</Link>
                    </Button>
                    <h1 className="text-3xl font-bold">Rolü Düzenle: {role?.name}</h1>
                    <p className="text-muted-foreground">Rol bilgilerini ve atanmış izinleri yönetin.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting || isSaving}>
                                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />} Rolü Sil
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    "{name}" rolünü silmek üzeresiniz. Bu işlem, bu role sahip kullanıcıları etkileyebilir ve geri alınamaz.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className={cn(buttonVariants({ variant: "destructive" }))}>
                                    Evet, Sil
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button type="submit" disabled={isSaving || isDeleting}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Değişiklikleri Kaydet
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rol Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="role-name">Rol Adı</Label>
                        <Input id="role-name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role-description">Açıklama</Label>
                        <Textarea id="role-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Rolün amacını açıklayın..." />
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
             <div className="flex justify-end gap-2">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" type="button" disabled={isDeleting || isSaving}>
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />} Rolü Sil
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                            <AlertDialogDescription>
                                "{name}" rolünü silmek üzeresiniz. Bu işlem, bu role sahip kullanıcıları etkileyebilir ve geri alınamaz.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className={cn(buttonVariants({ variant: "destructive" }))}>
                                Evet, Sil
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Button type="submit" disabled={isSaving || isDeleting}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Değişiklikleri Kaydet
                </Button>
            </div>
        </form>
    );
}
