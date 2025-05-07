
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
import { ArrowLeft, Save, Square, CheckSquare, Loader2 } from "lucide-react"; // Added Loader2
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { type PermissionCategory, getAllPermissions as mockGetAllPermissions, createRole as mockCreateRole } from '@/lib/mock-data'; // Use mock functions
import { usePermissions } from "@/hooks/usePermissions";

export default function NewRolePage() {
    const router = useRouter();
    const { hasPermission, isLoading: permissionsLoading } = usePermissions();
    const [allPermissions, setAllPermissions] = React.useState<PermissionCategory[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [selectedPermissions, setSelectedPermissions] = React.useState<Set<string>>(new Set());

    React.useEffect(() => {
        if (!permissionsLoading && !hasPermission('Rolleri Yönetme')) {
            toast({ variant: "destructive", title: "Erişim Reddedildi", description: "Yeni rol oluşturma yetkiniz yok." });
            router.push('/admin');
            return;
        }
        if (!permissionsLoading && hasPermission('Rolleri Yönetme')) {
            mockGetAllPermissions()
                .then(permissionsData => {
                    setAllPermissions(permissionsData);
                })
                .catch(error => {
                    console.error("Error fetching permissions:", error);
                    toast({ variant: "destructive", title: "Hata", description: "İzin listesi yüklenirken bir sorun oluştu." });
                })
                .finally(() => setLoading(false));
        }
    }, [permissionsLoading, hasPermission, router]);

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
            const newRoleData = {
                name,
                description,
                permissions: Array.from(selectedPermissions),
                userCount: 0, // New roles typically start with 0 users
            };
            const newRole = await mockCreateRole(newRoleData); // Use mock function
            if (newRole) {
                toast({
                    title: "Rol Oluşturuldu",
                    description: `"${name}" rolü başarıyla oluşturuldu.`,
                });
                router.push('/admin/roles');
            } else {
                toast({ variant: "destructive", title: "Oluşturma Hatası", description: "Rol oluşturulamadı." });
            }
        } catch (error: any) {
             console.error("Error creating role:", error);
             toast({ variant: "destructive", title: "Oluşturma Hatası", description: error.message || "Rol oluşturulurken bir hata oluştu." });
        } finally {
            setIsSaving(false);
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

    return (
        <form onSubmit={(e) => {e.preventDefault(); handleSave();}} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <Button variant="outline" size="sm" asChild className="mb-4">
                        <Link href="/admin/roles"><ArrowLeft className="mr-2 h-4 w-4" /> Rol Listesine Dön</Link>
                    </Button>
                    <h1 className="text-3xl font-bold">Yeni Rol Oluştur</h1>
                    <p className="text-muted-foreground">Yeni bir kullanıcı rolü tanımlayın ve izinlerini ayarlayın.</p>
                </div>
                <Button type="submit" disabled={!name || isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Rolü Kaydet
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
                <Button type="submit" disabled={!name || isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Rolü Kaydet
                </Button>
            </div>
        </form>
    );
}
