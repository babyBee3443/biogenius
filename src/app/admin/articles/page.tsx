
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FilePenLine, Trash2 } from "lucide-react"; // Icons for actions
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data - replace with actual data fetching
const articles = [
  { id: '1', title: 'Yapay Zeka Devrimi', category: 'Teknoloji', status: 'Yayınlandı', createdAt: '2024-07-20' },
  { id: '2', title: 'Gen Düzenleme Teknolojileri', category: 'Biyoloji', status: 'Yayınlandı', createdAt: '2024-07-19' },
  { id: '3', title: 'Kuantum Bilgisayarlar', category: 'Teknoloji', status: 'Taslak', createdAt: '2024-07-18' },
  // Add more articles
];

export default function AdminArticlesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Makaleleri Yönet</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Yeni Makale Ekle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mevcut Makaleler</CardTitle>
          <CardDescription>Mevcut makaleleri düzenleyin veya silin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Oluşturulma Tarihi</TableHead>
                <TableHead className="text-right">Eylemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>
                     <Badge variant={article.category === 'Teknoloji' ? 'default' : 'secondary'} className={article.category === 'Teknoloji' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}>
                        {article.category}
                     </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={article.status === 'Yayınlandı' ? 'outline' : 'secondary'}>
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{article.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-1">
                      <FilePenLine className="h-4 w-4" />
                      <span className="sr-only">Düzenle</span>
                    </Button>
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
      </Card>
    </div>
  );
}
