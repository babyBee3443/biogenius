
"use client"; 

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FilePenLine, Trash2, Filter, Loader2, RefreshCw, BookCopy } from "lucide-react";
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
import { getNotes, deleteNote, type NoteData } from '@/lib/data/notes';
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions"; // Import usePermissions
import { useRouter } from "next/navigation"; // Import useRouter

export default function AdminBiyolojiNotlariPage() {
  const [notes, setNotes] = React.useState<NoteData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null); // State for current user ID
  const { hasPermission, isLoading: permissionsLoading, error: permissionsError } = usePermissions(currentUserId); // Use permissions hook
  const router = useRouter(); // Initialize router

  React.useEffect(() => { // Effect to get current user ID from localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          setCurrentUserId(JSON.parse(storedUser)?.id || null);
        } catch (e) { setCurrentUserId(null); }
      }
    }
  }, []);

  const currentPage = 1; 
  const totalPages = 1; 
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string[]>([]); 
  const [selectedLevel, setSelectedLevel] = React.useState<string[]>([]); 

  const categories = [...new Set(notes.map(note => note.category))];
  const levels = [...new Set(notes.map(note => note.level))];

  const fetchNotes = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotes();
       const filteredData = data.filter(note =>
          (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (note.summary && note.summary.toLowerCase().includes(searchTerm.toLowerCase())) || 
           (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))) && 
          (selectedCategory.length === 0 || selectedCategory.includes(note.category)) &&
          (selectedLevel.length === 0 || selectedLevel.includes(note.level))
       );
      setNotes(filteredData);
    } catch (err) {
      console.error("[fetchNotes] Error fetching notes:", err);
      setError("Biyoloji notları yüklenirken bir hata oluştu.");
      toast({ variant: "destructive", title: "Hata", description: "Notlar yüklenemedi." });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedLevel]); 

  React.useEffect(() => {
    if (!permissionsLoading && !hasPermission('Biyoloji Notlarını Görüntüleme') && currentUserId) {
        // toast({ variant: "destructive", title: "Erişim Reddedildi", description: "Bu sayfayı görüntüleme yetkiniz yok." });
        // router.push('/admin'); // Handled by AdminLayout
        return;
    }
    if (!permissionsLoading && (hasPermission('Biyoloji Notlarını Görüntüleme') || !currentUserId)) { // Allow fetch if no user (guest access to admin panel is bad but per request)
        fetchNotes();
    }
  }, [fetchNotes, permissionsLoading, hasPermission, router, currentUserId]);

   const handleDelete = async (id: string, title: string) => {
     if (window.confirm(`"${title}" başlıklı notu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
         setDeletingId(id);
         try {
             const success = await deleteNote(id);
             if (success) {
                 toast({
                     variant: "default",
                     title: "Not Silindi",
                     description: `"${title}" başlıklı not başarıyla silindi.`,
                 });
                 await fetchNotes();
             } else {
                 toast({ variant: "destructive", title: "Silme Hatası", description: "Not silinemedi." });
             }
         } catch (error) {
             console.error(`[handleDelete] Error during deletion of ${id}:`, error);
             toast({ variant: "destructive", title: "Silme Hatası", description: "Not silinirken bir hata oluştu." });
         } finally {
             setDeletingId(null);
         }
     }
   };

   const handleFilterChange = (type: 'category' | 'level', value: string) => {
       const setter = type === 'category' ? setSelectedCategory : setSelectedLevel;
       const currentValues = type === 'category' ? selectedCategory : selectedLevel;

       setter(prev =>
           currentValues.includes(value)
           ? prev.filter(item => item !== value) 
           : [...prev, value] 
       );
   };


    if (loading || permissionsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                Yükleniyor...
            </div>
        );
    }

    // If there's a permission error and a user is logged in, show error
    if (permissionsError && currentUserId) {
        return (
            <div className="text-center py-10 text-destructive">
                <p>Yetki Hatası: {permissionsError}</p>
            </div>
        );
    }

    // If user is logged in but doesn't have permission (and no other loading/error state)
    if (currentUserId && !hasPermission('Biyoloji Notlarını Görüntüleme') && !loading && !permissionsError) {
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
            <h1 className="text-3xl font-bold flex items-center gap-2"><BookCopy className="h-8 w-8 text-green-600" /> Biyoloji Notlarını Yönet</h1>
            <p className="text-muted-foreground">Mevcut biyoloji notlarını görüntüleyin, düzenleyin veya silin.</p>
        </div>
        <div className="flex gap-2">
             <Button variant="outline" onClick={fetchNotes} disabled={loading}>
                 <RefreshCw className={cn("mr-2 h-4 w-4", loading && 'animate-spin')} />
                 Yenile
             </Button>
             {hasPermission('Yeni Biyoloji Notu Ekleme') && (
                <Button asChild>
                <Link href="/admin/biyoloji-notlari/new">
                    <PlusCircle className="mr-2 h-4 w-4" /> Yeni Not Ekle
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
                    placeholder="Not başlığı, özet veya etikette ara..."
                    className="flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Kategori ({selectedCategory.length > 0 ? selectedCategory.length : 'Tümü'})
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                             <DropdownMenuLabel>Kategoriye Göre Filtrele</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             {categories.map(cat => (
                                <DropdownMenuCheckboxItem
                                    key={cat}
                                    checked={selectedCategory.includes(cat)}
                                    onCheckedChange={() => handleFilterChange('category', cat)}
                                >
                                    {cat}
                                </DropdownMenuCheckboxItem>
                             ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Seviye ({selectedLevel.length > 0 ? selectedLevel.length : 'Tümü'})
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Seviyeye Göre Filtrele</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             {levels.map(lvl => (
                                <DropdownMenuCheckboxItem
                                    key={lvl}
                                    checked={selectedLevel.includes(lvl)}
                                    onCheckedChange={() => handleFilterChange('level', lvl)}
                                >
                                    {lvl}
                                </DropdownMenuCheckboxItem>
                             ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
            </CardContent>
       </Card>


      <Card>
        <CardContent className="pt-6">
          {loading && notes.length === 0 ? (
             <div className="flex justify-center items-center py-10">
               <Loader2 className="mr-2 h-8 w-8 animate-spin" />
               Notlar yükleniyor...
             </div>
          ) : error && !loading ? (
             <div className="text-center py-10 text-destructive">{error}</div>
          ) : notes.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                  {searchTerm || selectedCategory.length > 0 || selectedLevel.length > 0
                    ? `Arama kriterlerine uygun not bulunamadı.`
                    : "Henüz biyoloji notu oluşturulmamış."}
              </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Başlık</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Seviye</TableHead>
                  <TableHead>Etiketler</TableHead>
                  <TableHead>Son Güncelleme</TableHead>
                  <TableHead className="text-right">Eylemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((note) => (
                  <TableRow key={note.id} className={cn(deletingId === note.id && 'opacity-50 pointer-events-none')}>
                    <TableCell className="font-medium">
                      <Link href={`/admin/biyoloji-notlari/edit/${note.id}`} className="hover:underline">
                        {note.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-normal">
                        {note.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">{note.level}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                        {note.tags && note.tags.slice(0, 3).map(tag => ( 
                            <Badge key={tag} variant="outline" className="mr-1 text-xs font-normal">{tag}</Badge>
                        ))}
                        {note.tags && note.tags.length > 3 && <span className="text-xs text-muted-foreground">...</span>}
                    </TableCell>
                    <TableCell>{note.updatedAt ? new Date(note.updatedAt).toLocaleDateString('tr-TR') : '-'}</TableCell>
                    <TableCell className="text-right">
                      {hasPermission('Biyoloji Notlarını Düzenleme') && (
                            <Button variant="ghost" size="icon" className="mr-1" asChild disabled={deletingId === note.id}>
                                <Link href={`/admin/biyoloji-notlari/edit/${note.id}`}>
                                <FilePenLine className="h-4 w-4" />
                                <span className="sr-only">Düzenle</span>
                                </Link>
                            </Button>
                      )}
                      {hasPermission('Biyoloji Notlarını Silme') && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDelete(note.id, note.title)}
                                disabled={deletingId === note.id}
                                aria-label="Sil"
                            >
                                {deletingId === note.id ? (
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
         {!loading && !error && notes.length > 0 && (
             <CardContent>
                 <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href={currentPage > 1 ? `/admin/biyoloji-notlari?page=${currentPage - 1}` : '#'} aria-disabled={currentPage <= 1} />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink href={`/admin/biyoloji-notlari?page=${pageNumber}`} isActive={currentPage === pageNumber}>
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                    ))}
                     {totalPages > 5 && currentPage < totalPages - 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                    <PaginationItem>
                      <PaginationNext href={currentPage < totalPages ? `/admin/biyoloji-notlari?page=${currentPage + 1}` : '#'} aria-disabled={currentPage >= totalPages} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
             </CardContent>
         )}
      </Card>
    </div>
  );
}

    