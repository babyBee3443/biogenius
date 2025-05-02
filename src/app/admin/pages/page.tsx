
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, LayoutTemplate, Eye, Trash2 } from "lucide-react";
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
        <Button disabled> {/* Disable button as functionality is not implemented yet */}
           <PlusCircle className="mr-2 h-4 w-4" /> Yeni Sayfa Oluştur (Yakında)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mevcut Sayfalar</CardTitle>
          <CardDescription>
            Bu bölüm, kod yazmadan sayfa tasarımlarını düzenlemenizi ve yeni sayfalar oluşturmanızı sağlayacak şekilde geliştirilecektir.
            Şu an için mevcut sayfaları listelemektedir.
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
                  <TableCell className="font-medium">{page.name}</TableCell>
                  <TableCell className="text-muted-foreground">{page.path}</TableCell>
                  <TableCell>{page.status}</TableCell>
                  <TableCell>{page.lastModified}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {/* Placeholder buttons - Functionality to be added */}
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled title="Görsel Düzenleyici (Yakında)">
                       <LayoutTemplate className="h-4 w-4" />
                       <span className="sr-only">Görsel Düzenleyici</span>
                    </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                         <Link href={page.path} target="_blank" title="Sayfayı Görüntüle">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Görüntüle</span>
                        </Link>
                     </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" disabled title="Sayfayı Sil (Yakında)">
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

       <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
         <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-300">Gelecek Özellikler</CardTitle>
         </CardHeader>
         <CardContent className="text-blue-700 dark:text-blue-400 text-sm space-y-2">
             <p>Bu alana eklenecek özellikler:</p>
             <ul className="list-disc pl-5 space-y-1">
                 <li>Sürükle-bırak arayüzü ile sayfa düzenleme.</li>
                 <li>Yeni sayfalar ve özel şablonlar oluşturma.</li>
                 <li>Hazır bileşenleri (başlık, metin, görsel, buton vb.) sayfalara ekleme.</li>
                 <li>Sayfa tasarımlarını koda dokunmadan değiştirme.</li>
             </ul>
             <p className="pt-2">Bu özellikler geliştirme aşamasındadır ve yakında kullanıma sunulacaktır.</p>
         </CardContent>
       </Card>

    </div>
  );
}
