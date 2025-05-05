
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, LayoutTemplate, Eye, Trash2, FilePenLine } from "lucide-react"; // Added FilePenLine
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";

// Mock data - Replace with actual page data fetching
const pages = [
  { id: 'anasayfa', name: 'Anasayfa', path: '/', status: 'Yayınlandı', lastModified: '2024-07-25' },
  { id: 'hakkimizda', name: 'Hakkımızda', path: '/hakkimizda', status: 'Yayınlandı', lastModified: '2024-07-25' },
  { id: 'iletisim', name: 'İletişim', path: '/iletisim', status: 'Yayınlandı', lastModified: '2024-07-25' },
  // Add other potential pages like 'gizlilik-politikasi', etc.
];

export default function AdminPagesPage() {

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold">Sayfa Yönetimi</h1>
            <p className="text-muted-foreground">Mevcut sayfaları düzenleyin veya yeni sayfalar oluşturun.</p>
        </div>
        {/* Enabled button and linked to new page route */}
        <Button asChild>
           <Link href="/admin/pages/new">
             <PlusCircle className="mr-2 h-4 w-4" /> Yeni Sayfa Oluştur
           </Link>
        </Button>
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
                    {/* Link page name to edit page */}
                    <Link href={`/admin/pages/edit/${page.id}`} className="hover:underline">
                      {page.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{page.path}</TableCell>
                  <TableCell>{page.status}</TableCell>
                  <TableCell>{page.lastModified}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {/* Edit Button */}
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/admin/pages/edit/${page.id}`} title="Sayfayı Düzenle">
                        <FilePenLine className="h-4 w-4" />
                        <span className="sr-only">Düzenle</span>
                      </Link>
                    </Button>
                    {/* View Button */}
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={page.path} target="_blank" title="Sayfayı Görüntüle">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Görüntüle</span>
                      </Link>
                    </Button>
                    {/* Delete Button (Placeholder) */}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title="Sayfayı Sil (Yakında)" disabled>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Sil</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

       {/* Removed the "Gelecek Özellikler" card */}

    </div>
  );
}
