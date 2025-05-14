
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FilePenLine, Trash2, Filter, ArrowUpDown, Loader2, RefreshCw } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from "@/components/ui/pagination";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { getArticles, deleteArticle, type ArticleData } from '@/lib/data/articles'; // Updated import
import { getCategories, type Category } from '@/lib/data/categories'; // Updated import
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePermissions } from "@/hooks/usePermissions";
import { useRouter } from "next/navigation";

const getStatusVariant = (status: ArticleData['status']): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
        case 'Yayınlandı': return 'default';
        case 'Taslak': return 'secondary';
        case 'İncelemede': return 'outline';
        case 'Hazır': return 'secondary'; 
        case 'Arşivlendi': return 'destructive';
        default: return 'secondary';
    }
}

const getCategoryClass = (categoryName: string): string => {
     const lowerCaseName = categoryName.toLowerCase();
     if (lowerCaseName.includes('biyoloji') || lowerCaseName.includes('genetik') || lowerCaseName.includes('hücre')) {
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
     }
     return 'bg-muted text-muted-foreground';
}


export default function AdminArticlesPage() {
  const [articles, setArticles] = React.useState<ArticleData[]>([]);
  const [allCategories, setAllCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = React.useState(false);
  const [articleToDelete, setArticleToDelete] = React.useState<{ id: string; title: string } | null>(null);
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;


  const fetchArticlesAndCategories = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [articleData, categoryData] = await Promise.all([
        getArticles(),
        getCategories()
      ]);
      setAllCategories(categoryData.filter(cat => cat.name !== 'Teknoloji')); 

      const filteredData = articleData.filter(article =>
          (article.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (selectedStatuses.length === 0 || selectedStatuses.includes(article.status)) &&
          (selectedCategories.length === 0 || selectedCategories.includes(article.category))
      );
      setArticles(filteredData);
    } catch (err) {
      console.error("[fetchArticlesAndCategories] Error fetching data:", err);
      setError("Makaleler veya kategoriler yüklenirken bir hata oluştu.");
      toast({ variant: "destructive", title: "Hata", description: "Veriler yüklenemedi." });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStatuses, selectedCategories]);

  React.useEffect(() => {
    if (!permissionsLoading && !hasPermission('Makaleleri Görüntüleme')) {
      toast({ variant: "destructive", title: "Erişim Reddedildi", description: "Bu sayfayı görüntüleme yetkiniz yok." });
      router.push('/admin');
      return;
    }
    if (!permissionsLoading && hasPermission('Makaleleri Görüntüleme')) {
        fetchArticlesAndCategories();
    }
  }, [fetchArticlesAndCategories, permissionsLoading, hasPermission, router]);

  const handleDeleteInitiate = (id: string, title: string) => {
    setArticleToDelete({ id, title });
    setIsConfirmDeleteDialogOpen(true);
  };

   const confirmDelete = async () => {
     if (!articleToDelete) return;
     const { id, title } = articleToDelete;

     setDeletingId(id);
     setIsConfirmDeleteDialogOpen(false);
     try {
         const success = await deleteArticle(id);
         if (success) {
             toast({
                 variant: "default",
                 title: "Makale Silindi",
                 description: `"${title}" başlıklı makale başarıyla silindi.`,
             });
             await fetchArticlesAndCategories();
             if (paginatedArticles.length === 1 && currentPage > 1 && totalPages > 1 && currentPage === totalPages) {
                 setCurrentPage(currentPage - 1);
             }
         } else {
             toast({ variant: "destructive", title: "Silme Hatası", description: "Makale silinemedi." });
         }
     } catch (error) {
         toast({ variant: "destructive", title: "Silme Hatası", description: "Makale silinirken bir hata oluştu." });
     } finally {
         setDeletingId(null);
         setArticleToDelete(null);
     }
   };

   const handleStatusFilterChange = (status: string) => {
       setSelectedStatuses(prev =>
           prev.includes(status)
           ? prev.filter(s => s !== status)
           : [...prev, status]
       );
       setCurrentPage(1);
   };

   const handleCategoryFilterChange = (categoryName: string) => {
       setSelectedCategories(prev =>
           prev.includes(categoryName)
           ? prev.filter(c => c !== categoryName)
           : [...prev, categoryName]
       );
       setCurrentPage(1);
   };

  const filteredArticles = articles.filter(article =>
    (article.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedStatuses.length === 0 || selectedStatuses.includes(article.status)) &&
    (selectedCategories.length === 0 || selectedCategories.includes(article.category))
  );

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  if (permissionsLoading || loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            Yükleniyor...
        </div>
    );
  }


  return (
    <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold">Makaleleri Yönet</h1>
            <p className="text-muted-foreground">Mevcut makaleleri görüntüleyin, düzenleyin veya silin.</p>
        </div>
        <div className="flex gap-2">
             <Button variant="outline" onClick={fetchArticlesAndCategories} disabled={loading || deletingId !== null}>
                 <RefreshCw className={cn("mr-2 h-4 w-4", (loading || !!deletingId) && 'animate-spin')} />
                 Yenile
             </Button>
             {hasPermission('Makale Oluşturma') && (
                <Button asChild>
                <Link href="/admin/articles/new">
                    <PlusCircle className="mr-2 h-4 w-4" /> Yeni Makale Ekle
                </Link>
                </Button>
             )}
         </div>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Filtrele ve Ara</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-4">
                 <Input
                    placeholder="Makale başlığında ara..."
                    className="flex-1"
                    value={searchTerm}
                    onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                 />
                 <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Durum ({selectedStatuses.length > 0 ? selectedStatuses.length : 'Tümü'})
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                             <DropdownMenuLabel>Duruma Göre Filtrele</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             {['Yayınlandı', 'Taslak', 'İncelemede', 'Hazır', 'Arşivlendi'].map(status => (
                                 <DropdownMenuCheckboxItem
                                     key={status}
                                     checked={selectedStatuses.includes(status)}
                                     onCheckedChange={() => handleStatusFilterChange(status)}
                                 >
                                     {status}
                                 </DropdownMenuCheckboxItem>
                             ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Kategori ({selectedCategories.length > 0 ? selectedCategories.length : 'Tümü'})
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Kategoriye Göre Filtrele</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             {allCategories.map(cat => (
                                 <DropdownMenuCheckboxItem
                                     key={cat.id}
                                     checked={selectedCategories.includes(cat.name)}
                                     onCheckedChange={() => handleCategoryFilterChange(cat.name)}
                                 >
                                     {cat.name}
                                 </DropdownMenuCheckboxItem>
                             ))}
                              <DropdownMenuSeparator />
                              {hasPermission('Kategorileri Yönetme') && (
                                <Link href="/admin/categories" className="p-2 text-sm text-muted-foreground hover:text-primary">Kategorileri Yönet</Link>
                              )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" disabled>
                                <ArrowUpDown className="mr-2 h-4 w-4" /> Sırala
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Sırala</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                             <DropdownMenuCheckboxItem disabled>Başlık (A-Z)</DropdownMenuCheckboxItem>
                             <DropdownMenuCheckboxItem disabled>Tarih (En Yeni)</DropdownMenuCheckboxItem>
                             <DropdownMenuCheckboxItem disabled>Tarih (En Eski)</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
            </CardContent>
       </Card>


      <Card>
        <CardContent className="pt-6">
          {loading ? (
             <div className="flex justify-center items-center py-10">
               <Loader2 className="mr-2 h-8 w-8 animate-spin" />
               Makaleler yükleniyor...
             </div>
          ) : error ? (
             <div className="text-center py-10 text-destructive">{error}</div>
          ) : paginatedArticles.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                  {searchTerm || selectedStatuses.length > 0 || selectedCategories.length > 0
                    ? `Arama kriterlerine uygun makale bulunamadı.`
                    : "Henüz makale oluşturulmamış."}
              </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Başlık</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Yazar</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Oluşturulma Tarihi</TableHead>
                  <TableHead className="text-right">Eylemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedArticles.map((article) => (
                  <TableRow key={article.id} className={cn(deletingId === article.id && 'opacity-50 pointer-events-none')}>
                    <TableCell className="font-medium">
                      <Link href={`/admin/articles/edit/${article.id}`} className="hover:underline">
                        {article.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {article.category ? (
                          <Badge variant="secondary" className={cn(getCategoryClass(article.category), "font-normal")}>
                             {article.category}
                           </Badge>
                       ) : (
                           <span className="text-xs text-muted-foreground italic">Kategorisiz</span>
                       )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{article.authorId || 'Bilinmiyor'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(article.status)}>
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{article.createdAt ? new Date(article.createdAt).toLocaleDateString('tr-TR') : '-'}</TableCell>
                    <TableCell className="text-right">
                        {hasPermission('Makale Düzenleme') && (
                            <Button variant="ghost" size="icon" className="mr-1" asChild disabled={deletingId === article.id}>
                                <Link href={`/admin/articles/edit/${article.id}`}>
                                <FilePenLine className="h-4 w-4" />
                                <span className="sr-only">Düzenle</span>
                                </Link>
                            </Button>
                        )}
                        {hasPermission('Makale Silme') && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteInitiate(article.id, article.title)}
                                disabled={deletingId === article.id}
                                aria-label="Sil"
                            >
                                {deletingId === article.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                <Trash2 className="h-4 w-4" />
                                )}
                                <span className="sr-only">Sil</span>
                            </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
         {totalPages > 1 && !loading && !error && paginatedArticles.length > 0 && (
             <CardContent>
                 <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.max(1, prev - 1)); }}
                            aria-disabled={currentPage <= 1}
                            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => { e.preventDefault(); setCurrentPage(pageNumber); }}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                    ))}
                     {totalPages > 5 && currentPage < totalPages - 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }}
                            aria-disabled={currentPage >= totalPages}
                            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
             </CardContent>
         )}
      </Card>
    </div>
    <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
          <AlertDialogDescription>
            "{articleToDelete?.title}" başlıklı makaleyi silmek üzeresiniz. Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => { setIsConfirmDeleteDialogOpen(false); setArticleToDelete(null);}}>İptal</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete}>
            Evet, Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
