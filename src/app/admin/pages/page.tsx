
"use client"; // Ensure this is a client component

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Eye, Trash2, FilePenLine, Loader2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import { getPages, type PageData, deletePage } from "@/lib/data/pages"; // Import page data functions
import { toast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/usePermissions"; // Import usePermissions
import { useRouter } from "next/navigation"; // Import useRouter
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
import { buttonVariants } from "@/components/ui/button";


export default function AdminPagesPage() {
  const [pages, setPages] = React.useState<PageData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const { hasPermission, isLoading: permissionsLoading, error: permissionsError } = usePermissions(currentUserId);
  const router = useRouter();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          setCurrentUserId(JSON.parse(storedUser)?.id || null);
        } catch (e) { setCurrentUserId(null); }
      }
    }
  }, []);

  const fetchPages = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPages();
      setPages(data);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast({ variant: "destructive", title: "Hata", description: "Sayfalar yüklenemedi." });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!permissionsLoading && !hasPermission('Sayfaları Yönetme') && currentUserId) {
        // router.push('/admin'); // Handled by AdminLayout
        return;
    }
    if (!permissionsLoading && (hasPermission('Sayfaları Yönetme') || !currentUserId)) {
        fetchPages();
    }
  }, [fetchPages, permissionsLoading, hasPermission, router, currentUserId]);

  const handleDeletePage = async (pageId: string, pageTitle: string) => {
    if (!hasPermission('Sayfaları Yönetme')) {
        toast({ variant: "destructive", title: "Yetki Yok", description: "Sayfa silme yetkiniz bulunmamaktadır."});
        return;
    }
    setDeletingId(pageId);
    try {
        const success = await deletePage(pageId);
        if (success) {
            toast({ title: "Sayfa Silindi", description: `"${pageTitle}" başlıklı sayfa başarıyla silindi.`});
            fetchPages(); // Refresh the list
        } else {
            toast({ variant: "destructive", title: "Silme Hatası", description: `"${pageTitle}" sayfası silinemedi (muhtemelen çekirdek bir sayfa).`});
        }
    } catch (error) {
        console.error("Error deleting page:", error);
        toast({ variant: "destructive", title: "Silme Hatası", description: "Sayfa silinirken bir hata oluştu."});
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

    if (permissionsError && currentUserId) {
        return <div className="text-center py-10 text-destructive"><p>Yetki Hatası: {permissionsError}</p></div>;
    }

    if (currentUserId && !hasPermission('Sayfaları Yönetme') && !loading && !permissionsError) {
        return (
            <div className="text-center py-10">
                <p className="text-lg font-semibold text-destructive">Erişim Reddedildi</p>
                <p className="text-muted-foreground">Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
            </div>
        );
    }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold">Sayfa Yönetimi</h1>
            <p className="text-muted-foreground">Mevcut sayfaları düzenleyin veya yeni sayfalar oluşturun.</p>
        </div>
        {hasPermission('Sayfaları Yönetme') && (
            <Button asChild>
            <Link href="/admin/pages/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Yeni Sayfa Oluştur
            </Link>
            </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mevcut Sayfalar</CardTitle>
          <CardDescription>
            Oluşturulmuş sayfaları düzenleyin veya silin. Yeni sayfalar eklemek için yukarıdaki butonu kullanın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sayfa Adı</TableHead>
                <TableHead>Yol (Path)</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Son Düzenleme</TableHead>
                <TableHead className="text-right">Eylemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/pages/edit/${page.id}`} className="hover:underline">
                      {page.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{page.slug === '' ? '/' : `/${page.slug}`}</TableCell>
                  <TableCell>{page.status}</TableCell>
                  <TableCell>{new Date(page.updatedAt).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {hasPermission('Sayfaları Yönetme') && (
                        <>
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={`/admin/pages/edit/${page.id}`} title="Sayfayı Düzenle">
                                <FilePenLine className="h-4 w-4" />
                                <span className="sr-only">Düzenle</span>
                            </Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link href={page.slug === '' ? '/' : `/${page.slug}`} target="_blank" title="Sayfayı Görüntüle">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Görüntüle</span>
                            </Link>
                            </Button>
                            {!['anasayfa', 'hakkimizda', 'iletisim', 'kullanim-kilavuzu'].includes(page.id) && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title="Sayfayı Sil" disabled={deletingId === page.id}>
                                            {deletingId === page.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                            <span className="sr-only">Sil</span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                            "{page.title}" başlıklı sayfayı silmek üzeresiniz. Bu işlem geri alınamaz.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={() => setDeletingId(null)}>İptal</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDeletePage(page.id, page.title)}
                                                className={cn(buttonVariants({ variant: "destructive" }))}
                                            >
                                                Evet, Sil
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    