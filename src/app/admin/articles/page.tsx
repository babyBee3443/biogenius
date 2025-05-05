"use client"; // Indicate this is a Client Component

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
import { toast } from "@/hooks/use-toast"; // Import toast
import { getArticles, deleteArticle, type ArticleData } from '@/lib/mock-data'; // Import mock data functions

const getStatusVariant = (status: ArticleData['status']): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
        case 'Yayınlandı': return 'default';
        case 'Taslak': return 'secondary';
        case 'İncelemede': return 'outline';
        case 'Arşivlendi': return 'destructive';
        default: return 'secondary';
    }
}

const getCategoryClass = (category: ArticleData['category']): string => {
     switch (category) {
        case 'Teknoloji': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'Biyoloji': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        default: return 'bg-muted text-muted-foreground';
    }
}


export default function AdminArticlesPage() {
  const [articles, setArticles] = React.useState<ArticleData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null); // Track deleting state

  // TODO: Implement state for filtering, sorting, search, and pagination
  const currentPage = 1; // Example
  const totalPages = 1; // Example (Calculate based on total articles and items per page)
  const [searchTerm, setSearchTerm] = React.useState(""); // Add search state
  // Add states for filters (status, category) and sorting

  const fetchArticles = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticles(); // Fetch from mock data source
       // Apply filtering and sorting here based on state
       const filteredData = data.filter(article =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase())
          // Add more filters here (status, category)
       );
       // Add sorting logic here

      setArticles(filteredData);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Makaleler yüklenirken bir hata oluştu.");
      toast({ variant: "destructive", title: "Hata", description: "Makaleler yüklenemedi." });
    } finally {
      setLoading(false);
    }
  }, [searchTerm]); // Add dependencies for filters and sorting

  React.useEffect(() => {
    fetchArticles();
  }, [fetchArticles]); // Fetch articles on component mount and when fetchArticles changes

   const handleDelete = async (id: string, title: string) => {
     if (window.confirm(`"${title}" başlıklı makaleyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
         setDeletingId(id); // Indicate deletion in progress for this row
         try {
             const success = await deleteArticle(id);
             if (success) {
                 toast({
                     variant: "destructive",
                     title: "Makale Silindi",
                     description: `"${title}" başlıklı makale başarıyla silindi.`,
                 });
                 // Refetch articles after successful deletion
                 fetchArticles();
             } else {
                 toast({ variant: "destructive", title: "Silme Hatası", description: "Makale silinemedi." });
             }
         } catch (error) {
             console.error("Error deleting article:", error);
             toast({ variant: "destructive", title: "Silme Hatası", description: "Makale silinirken bir hata oluştu." });
         } finally {
              setDeletingId(null); // Reset deleting state
         }
     }
   };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold">Makaleleri Yönet</h1>
            <p className="text-muted-foreground">Mevcut makaleleri görüntüleyin, düzenleyin veya silin.</p>
        </div>
        <div className="flex gap-2">
             <Button variant="outline" onClick={fetchArticles} disabled={loading}>
                 <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                 Yenile
             </Button>
             <Button asChild>
               <Link href="/admin/articles/new">
                 <PlusCircle className="mr-2 h-4 w-4" /> Yeni Makale Ekle
               </Link>
             </Button>
         </div>
      </div>

      {/* Filtering and Search Bar */}
       <Card>
            <CardHeader>
                <CardTitle>Filtrele ve Ara</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-4">
                 <Input
                    placeholder="Makale başlığında ara..."
                    className="flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <div className="flex gap-2">
                    {/* Status Filter Dropdown (Placeholder) */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Durum
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* ... Status filter items ... */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/* Category Filter Dropdown (Placeholder) */}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Kategori
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           {/* ... Category filter items ... */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/* Sort Dropdown (Placeholder) */}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <ArrowUpDown className="mr-2 h-4 w-4" /> Sırala
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* ... Sort options ... */}
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
          ) : articles.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                  {searchTerm ? `"${searchTerm}" için sonuç bulunamadı.` : "Henüz makale oluşturulmamış."}
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
                {articles.map((article) => (
                  <TableRow key={article.id} className={deletingId === article.id ? 'opacity-50' : ''}>
                    <TableCell className="font-medium">
                      <Link href={`/admin/articles/edit/${article.id}`} className="hover:underline">
                        {article.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${getCategoryClass(article.category)} font-normal`}>
                        {article.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{article.authorId || 'Bilinmiyor'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(article.status)}>
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{article.createdAt ? new Date(article.createdAt).toLocaleDateString('tr-TR') : '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="mr-1" asChild disabled={deletingId === article.id}>
                        <Link href={`/admin/articles/edit/${article.id}`}>
                          <FilePenLine className="h-4 w-4" />
                          <span className="sr-only">Düzenle</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(article.id, article.title)}
                        disabled={deletingId === article.id}
                      >
                        {deletingId === article.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Sil</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
         {/* Pagination (Only show if not loading, no error, and there are articles) */}
         {!loading && !error && articles.length > 0 && (
             <CardContent>
                 <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href={currentPage > 1 ? `/admin/articles?page=${currentPage - 1}` : '#'} aria-disabled={currentPage <= 1} />
                    </PaginationItem>
                    {/* Dynamically generate page numbers based on totalPages */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink href={`/admin/articles?page=${pageNumber}`} isActive={currentPage === pageNumber}>
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                    ))}
                    {/* Add Ellipsis if needed */}
                    <PaginationItem>
                      <PaginationNext href={currentPage < totalPages ? `/admin/articles?page=${currentPage + 1}` : '#'} aria-disabled={currentPage >= totalPages} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
             </CardContent>
         )}
      </Card>
    </div>
  );
}