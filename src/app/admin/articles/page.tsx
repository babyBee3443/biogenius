
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
import { getArticles, deleteArticle, type ArticleData, getCategories, type Category } from '@/lib/mock-data'; // Import mock data functions including categories
import { cn } from "@/lib/utils"; // Import cn utility

const getStatusVariant = (status: ArticleData['status']): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
        case 'Yayınlandı': return 'default';
        case 'Taslak': return 'secondary';
        case 'İncelemede': return 'outline';
        case 'Arşivlendi': return 'destructive';
        default: return 'secondary';
    }
}

// Basic category styling based on common examples - refine as needed
const getCategoryClass = (categoryName: string): string => {
     const lowerCaseName = categoryName.toLowerCase();
     if (lowerCaseName.includes('teknoloji')) {
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
     } else if (lowerCaseName.includes('biyoloji') || lowerCaseName.includes('genetik') || lowerCaseName.includes('hücre')) {
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
     }
     // Add more specific checks or a default
     return 'bg-muted text-muted-foreground';
}


export default function AdminArticlesPage() {
  const [articles, setArticles] = React.useState<ArticleData[]>([]);
  const [allCategories, setAllCategories] = React.useState<Category[]>([]); // State for all categories
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null); // Track deleting state

  // Filters
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]); // Filter by category name

  // TODO: Implement state for sorting and pagination
  const currentPage = 1; // Example
  const totalPages = 1; // Example


  const fetchArticlesAndCategories = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("[fetchArticlesAndCategories] Fetching data...");
    try {
      const [articleData, categoryData] = await Promise.all([
        getArticles(),
        getCategories()
      ]);
      console.log("[fetchArticlesAndCategories] Raw data fetched:", articleData.length, "articles,", categoryData.length, "categories");

      setAllCategories(categoryData); // Store all categories for filter dropdown

      // Apply filtering
      const filteredData = articleData.filter(article =>
          (article.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (selectedStatuses.length === 0 || selectedStatuses.includes(article.status)) &&
          (selectedCategories.length === 0 || selectedCategories.includes(article.category))
      );
      // TODO: Add sorting logic here

      setArticles(filteredData);
      console.log("[fetchArticlesAndCategories] Filtered data set to state:", filteredData.length, "articles");
    } catch (err) {
      console.error("[fetchArticlesAndCategories] Error fetching data:", err);
      setError("Makaleler veya kategoriler yüklenirken bir hata oluştu.");
      toast({ variant: "destructive", title: "Hata", description: "Veriler yüklenemedi." });
    } finally {
      setLoading(false);
      console.log("[fetchArticlesAndCategories] Fetching complete, loading set to false.");
    }
  }, [searchTerm, selectedStatuses, selectedCategories]); // Add filter dependencies

  React.useEffect(() => {
    fetchArticlesAndCategories();
  }, [fetchArticlesAndCategories]); // Fetch data on mount and when dependencies change

   const handleDelete = async (id: string, title: string) => {
     console.log(`[handleDelete] Attempting to delete article: ${id} (${title})`);
     if (window.confirm(`"${title}" başlıklı makaleyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
         console.log(`[handleDelete] User confirmed deletion for: ${id}`);
         setDeletingId(id); // Indicate deletion in progress for this row
         try {
             console.log(`[handleDelete] Calling deleteArticle(${id})`);
             const success = await deleteArticle(id);
             console.log(`[handleDelete] deleteArticle(${id}) returned: ${success}`);
             if (success) {
                 toast({
                     variant: "default", // Changed variant for visual distinction
                     title: "Makale Silindi",
                     description: `"${title}" başlıklı makale başarıyla silindi.`,
                 });
                 console.log(`[handleDelete] Deletion successful for ${id}. Refetching articles...`);
                 // Refetch articles after successful deletion to update the list
                 await fetchArticlesAndCategories(); // Use await to ensure fetch completes before resetting deletingId
                 console.log(`[handleDelete] Article list refetched after deleting ${id}.`);
             } else {
                 console.error(`[handleDelete] deleteArticle(${id}) failed.`);
                 toast({ variant: "destructive", title: "Silme Hatası", description: "Makale silinemedi." });
                 setDeletingId(null); // Reset on failure as well
             }
         } catch (error) {
             console.error(`[handleDelete] Error during deletion of ${id}:`, error);
             toast({ variant: "destructive", title: "Silme Hatası", description: "Makale silinirken bir hata oluştu." });
             setDeletingId(null); // Reset on error
         }
         // Removed finally block for deletingId reset - handled within try/catch now
     } else {
        console.log(`[handleDelete] User cancelled deletion for: ${id}`);
     }
   };

    // Filter Handlers
   const handleStatusFilterChange = (status: string) => {
       setSelectedStatuses(prev =>
           prev.includes(status)
           ? prev.filter(s => s !== status)
           : [...prev, status]
       );
   };

   const handleCategoryFilterChange = (categoryName: string) => {
       setSelectedCategories(prev =>
           prev.includes(categoryName)
           ? prev.filter(c => c !== categoryName)
           : [...prev, categoryName]
       );
   };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold">Makaleleri Yönet</h1>
            <p className="text-muted-foreground">Mevcut makaleleri görüntüleyin, düzenleyin veya silin.</p>
        </div>
        <div className="flex gap-2">
             <Button variant="outline" onClick={fetchArticlesAndCategories} disabled={loading}>
                 <RefreshCw className={cn("mr-2 h-4 w-4", loading && 'animate-spin')} />
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
                    {/* Status Filter Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Durum ({selectedStatuses.length > 0 ? selectedStatuses.length : 'Tümü'})
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                             <DropdownMenuLabel>Duruma Göre Filtrele</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             {['Yayınlandı', 'Taslak', 'İncelemede', 'Arşivlendi'].map(status => (
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
                    {/* Category Filter Dropdown */}
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
                              <Link href="/admin/categories" className="p-2 text-sm text-muted-foreground hover:text-primary">Kategorileri Yönet</Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/* Sort Dropdown (Placeholder) */}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" disabled> {/* Disabled until implemented */}
                                <ArrowUpDown className="mr-2 h-4 w-4" /> Sırala
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Sırala</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* Add Radio items for sorting logic */}
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
          ) : articles.length === 0 ? (
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
                {articles.map((article) => (
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
                        aria-label="Sil"
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
                     {totalPages > 5 && currentPage < totalPages - 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
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
