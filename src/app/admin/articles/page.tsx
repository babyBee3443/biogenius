
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FilePenLine, Trash2, Filter, ArrowUpDown } from "lucide-react"; // Added Filter, ArrowUpDown
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // Added Input for search
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"; // Added DropdownMenu for filtering/sorting
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from "@/components/ui/pagination"; // Added Pagination
import Link from "next/link";


// Mock data - replace with actual data fetching logic
const articles = [
  { id: '1', title: 'Yapay Zeka Devrimi', category: 'Teknoloji', status: 'Yayınlandı', createdAt: '2024-07-20', author: 'Admin User' },
  { id: '2', title: 'Gen Düzenleme Teknolojileri', category: 'Biyoloji', status: 'Yayınlandı', createdAt: '2024-07-19', author: 'Editor Ayşe' },
  { id: '3', title: 'Kuantum Bilgisayarlar', category: 'Teknoloji', status: 'Taslak', createdAt: '2024-07-18', author: 'Admin User' },
   { id: '4', title: 'Mikrobiyom: İçimizdeki Dünya', category: 'Biyoloji', status: 'İncelemede', createdAt: '2024-07-21', author: 'Editor Ayşe' },
   { id: '5', title: 'Blockchain Teknolojisi', category: 'Teknoloji', status: 'Arşivlendi', createdAt: '2024-06-15', author: 'Admin User' },
  // Add more articles for pagination testing
  { id: '6', title: 'Sentetik Biyoloji', category: 'Biyoloji', status: 'Yayınlandı', createdAt: '2024-07-17', author: 'Editor Ayşe' },
  { id: '7', title: 'Nöral Ağlar ve Derin Öğrenme', category: 'Teknoloji', status: 'Taslak', createdAt: '2024-07-22', author: 'Admin User' },
  { id: '8', title: 'Kanser İmmünoterapisi', category: 'Biyoloji', status: 'Yayınlandı', createdAt: '2024-07-16', author: 'Editor Ayşe' },
];

const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
        case 'Yayınlandı': return 'default'; // Use default (primary) for published
        case 'Taslak': return 'secondary';
        case 'İncelemede': return 'outline'; // Use outline for pending/review
        case 'Arşivlendi': return 'destructive'; // Use destructive-like visually for archived
        default: return 'secondary';
    }
}

const getCategoryClass = (category: string): string => {
     switch (category) {
        case 'Teknoloji': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'Biyoloji': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        default: return 'bg-muted text-muted-foreground';
    }
}


export default function AdminArticlesPage() {
  // TODO: Implement state for filtering, sorting, search, and pagination
  const currentPage = 1; // Example: current page number
  const totalPages = 2; // Example: total number of pages

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold">Makaleleri Yönet</h1>
            <p className="text-muted-foreground">Mevcut makaleleri görüntüleyin, düzenleyin veya silin.</p>
        </div>
        <Button asChild>
           <Link href="/admin/articles/new">
             <PlusCircle className="mr-2 h-4 w-4" /> Yeni Makale Ekle
           </Link>
        </Button>
      </div>

      {/* Filtering and Search Bar */}
       <Card>
            <CardHeader>
                <CardTitle>Filtrele ve Ara</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-4">
                 <Input placeholder="Makale başlığında ara..." className="flex-1" />
                 <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Durum
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Duruma göre filtrele</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* TODO: Make these checkbox items stateful */}
                        <DropdownMenuCheckboxItem checked>Yayınlandı</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Taslak</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>İncelemede</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Arşivlendi</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" /> Kategori
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Kategoriye göre filtrele</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>Teknoloji</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem checked>Biyoloji</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <ArrowUpDown className="mr-2 h-4 w-4" /> Sırala
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Sıralama Ölçütü</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                             {/* TODO: Implement sorting logic */}
                            <DropdownMenuCheckboxItem>En Yeni</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>En Eski</DropdownMenuCheckboxItem>
                             <DropdownMenuCheckboxItem>Başlığa Göre (A-Z)</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
            </CardContent>
       </Card>


      <Card>
        {/* Removed Header for Table, filtering is separate */}
        <CardContent className="pt-6"> {/* Add padding top since header is removed */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Yazar</TableHead> {/* Added Author Column */}
                <TableHead>Durum</TableHead>
                <TableHead>Oluşturulma Tarihi</TableHead>
                <TableHead className="text-right">Eylemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
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
                  <TableCell className="text-muted-foreground">{article.author}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(article.status)} className={article.status === 'Arşivlendi' ? 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive' : ''}>
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{article.createdAt}</TableCell>
                  <TableCell className="text-right">
                    {/* Link to Edit Page */}
                    <Button variant="ghost" size="icon" className="mr-1" asChild>
                       <Link href={`/admin/articles/edit/${article.id}`}>
                           <FilePenLine className="h-4 w-4" />
                           <span className="sr-only">Düzenle</span>
                       </Link>
                    </Button>
                    {/* TODO: Implement Delete Functionality */}
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                       <span className="sr-only">Sil</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
         {/* Pagination */}
         <CardContent>
             <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href={currentPage > 1 ? `/admin/articles?page=${currentPage - 1}` : '#'} aria-disabled={currentPage <= 1} />
                </PaginationItem>
                 {/* TODO: Dynamically generate page numbers */}
                <PaginationItem>
                  <PaginationLink href="/admin/articles?page=1" isActive={currentPage === 1}>1</PaginationLink>
                </PaginationItem>
                 {totalPages > 2 && currentPage > 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                 {totalPages > 1 && currentPage !== 1 && currentPage !== totalPages && (
                    <PaginationItem>
                     <PaginationLink href={`/admin/articles?page=${currentPage}`} isActive>{currentPage}</PaginationLink>
                    </PaginationItem>
                 )}
                  {totalPages > 2 && currentPage < totalPages - 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                 {totalPages > 1 && (
                    <PaginationItem>
                    <PaginationLink href={`/admin/articles?page=${totalPages}`} isActive={currentPage === totalPages}>{totalPages}</PaginationLink>
                    </PaginationItem>
                 )}
                <PaginationItem>
                  <PaginationNext href={currentPage < totalPages ? `/admin/articles?page=${currentPage + 1}` : '#'} aria-disabled={currentPage >= totalPages} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
         </CardContent>
      </Card>
    </div>
  );
}
