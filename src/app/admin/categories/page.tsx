
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tag, Trash2, PlusCircle, Edit2, Loader2, RefreshCw } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { type Category, getCategories, addCategory, updateCategory, deleteCategory } from "@/lib/mock-data"; // Import category functions
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button"; // Ensure this is imported if not already
import { usePermissions } from "@/hooks/usePermissions";
import { useRouter } from "next/navigation";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = React.useState("");
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const router = useRouter();

  const fetchCategories = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Kategoriler yüklenirken bir hata oluştu.");
      toast({ variant: "destructive", title: "Hata", description: "Kategoriler yüklenemedi." });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!permissionsLoading && !hasPermission('Kategorileri Yönetme')) {
        toast({ variant: "destructive", title: "Erişim Reddedildi", description: "Kategori yönetimi sayfasına erişim yetkiniz yok." });
        router.push('/admin');
        return;
    }
    if (!permissionsLoading && hasPermission('Kategorileri Yönetme')) {
        fetchCategories();
    }
  }, [fetchCategories, permissionsLoading, hasPermission, router]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({ variant: "destructive", title: "Eksik Bilgi", description: "Kategori adı boş olamaz." });
      return;
    }
    setIsAdding(true);
    try {
      const newCat = await addCategory({ name: newCategoryName.trim() });
      if (newCat) {
        toast({ title: "Kategori Eklendi", description: `"${newCat.name}" kategorisi başarıyla eklendi.` });
        setNewCategoryName("");
        await fetchCategories(); // Refresh list
      } else {
        toast({ variant: "destructive", title: "Ekleme Hatası", description: "Kategori eklenemedi." });
      }
    } catch (error: any) {
      console.error("Error adding category:", error);
      toast({ variant: "destructive", title: "Ekleme Hatası", description: error.message || "Kategori eklenirken bir hata oluştu." });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      const success = await deleteCategory(id);
      if (success) {
        toast({ variant: "destructive", title: "Kategori Silindi", description: `"${name}" kategorisi silindi.` });
        await fetchCategories(); // Refresh list
      } else {
        toast({ variant: "destructive", title: "Silme Hatası", description: "Kategori silinemedi." });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({ variant: "destructive", title: "Silme Hatası", description: "Kategori silinirken bir hata oluştu." });
    } finally {
      setDeletingId(null);
    }
  };

   const handleEditClick = (category: Category) => {
     setEditingCategory(category);
     setEditCategoryName(category.name);
   };

   const handleUpdateCategory = async () => {
     if (!editCategoryName.trim() || !editingCategory) {
       toast({ variant: "destructive", title: "Hata", description: "Kategori adı boş olamaz." });
       return;
     }
     setIsUpdating(true);
     try {
       const updatedCat = await updateCategory(editingCategory.id, { name: editCategoryName.trim() });
       if (updatedCat) {
         toast({ title: "Kategori Güncellendi", description: `"${updatedCat.name}" kategorisi başarıyla güncellendi.` });
         setEditingCategory(null); // Close dialog
         setEditCategoryName("");
         await fetchCategories(); // Refresh list
       } else {
         toast({ variant: "destructive", title: "Güncelleme Hatası", description: "Kategori güncellenemedi." });
       }
     } catch (error: any) {
       console.error("Error updating category:", error);
       toast({ variant: "destructive", title: "Güncelleme Hatası", description: error.message || "Kategori güncellenirken bir hata oluştu." });
     } finally {
       setIsUpdating(false);
     }
   };

  if (permissionsLoading || loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            Yükleniyor...
        </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Tag className="h-8 w-8 text-primary" /> Kategoriler</h1>
          <p className="text-muted-foreground">Makale ve not kategorilerini yönetin.</p>
        </div>
         <Button variant="outline" onClick={fetchCategories} disabled={loading}>
             <RefreshCw className={cn("mr-2 h-4 w-4", loading && 'animate-spin')} />
             Yenile
         </Button>
      </div>

      {/* Add New Category Form */}
      <Card>
        <CardHeader>
          <CardTitle>Yeni Kategori Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleAddCategory(); }} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow space-y-2">
              <Label htmlFor="new-category-name" className="sr-only">Yeni Kategori Adı</Label>
              <Input
                id="new-category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Yeni kategori adı (örn: Moleküler Biyoloji)"
                required
                disabled={isAdding}
              />
            </div>
            <Button type="submit" disabled={isAdding || !newCategoryName.trim()}>
              {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Ekle
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Mevcut Kategoriler</CardTitle>
          <CardDescription>Oluşturulmuş kategorileri düzenleyin veya silin.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" /> Yükleniyor...
            </div>
          ) : error ? (
            <div className="text-center py-10 text-destructive">{error}</div>
          ) : categories.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">Henüz kategori eklenmemiş.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori Adı</TableHead>
                  <TableHead className="text-right">Eylemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} className={cn(deletingId === category.id && "opacity-50 pointer-events-none")}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right">
                      <Dialog open={editingCategory?.id === category.id} onOpenChange={(open) => { if(!open) setEditingCategory(null); }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-1 h-8 w-8" onClick={() => handleEditClick(category)}>
                              <Edit2 className="h-4 w-4" />
                              <span className="sr-only">Düzenle</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                              <DialogHeader>
                                  <DialogTitle>Kategoriyi Düzenle</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                      <Label htmlFor="edit-category-name">Kategori Adı</Label>
                                      <Input
                                          id="edit-category-name"
                                          value={editCategoryName}
                                          onChange={(e) => setEditCategoryName(e.target.value)}
                                          required
                                          disabled={isUpdating}
                                      />
                                  </div>
                              </div>
                              <DialogFooter>
                                   <DialogClose asChild>
                                        <Button variant="outline" disabled={isUpdating}>İptal</Button>
                                   </DialogClose>
                                   <Button onClick={handleUpdateCategory} disabled={isUpdating || !editCategoryName.trim()}>
                                       {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                       Güncelle
                                   </Button>
                              </DialogFooter>
                          </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            {deletingId === category.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            <span className="sr-only">Sil</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{category.name}" kategorisini silmek üzeresiniz. Bu kategoriye ait tüm içerikler kategorisiz kalacaktır. Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCategory(category.id, category.name)}
                              className={buttonVariants({ variant: "destructive" })}
                            >
                              Evet, Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
