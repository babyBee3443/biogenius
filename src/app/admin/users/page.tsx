
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, Trash2 } from "lucide-react"; // Icons for actions
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";


// Mock data - replace with actual data fetching
const users = [
  { id: 'u1', name: 'Ali Veli', email: 'ali.veli@example.com', role: 'Admin', joinedAt: '2024-01-15', avatar: 'https://picsum.photos/seed/u1/32/32' },
  { id: 'u2', name: 'Ayşe Kaya', email: 'ayse.kaya@example.com', role: 'Editor', joinedAt: '2024-03-22', avatar: 'https://picsum.photos/seed/u2/32/32' },
  { id: 'u3', name: 'Mehmet Yılmaz', email: 'mehmet.yilmaz@example.com', role: 'User', joinedAt: '2024-06-10', avatar: 'https://picsum.photos/seed/u3/32/32' },
   // Add more users
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kullanıcıları Yönet</h1>
        {/* Optional: Add Invite User Button */}
         {/* <Button> <UserPlus className="mr-2 h-4 w-4" /> Kullanıcı Davet Et </Button> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kayıtlı Kullanıcılar</CardTitle>
          <CardDescription>Kullanıcı rollerini ve durumlarını yönetin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Katılma Tarihi</TableHead>
                <TableHead className="text-right">Eylemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={user.avatar} alt={user.name} />
                         <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                       </Avatar>
                       {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                     <Badge variant={user.role === 'Admin' ? 'destructive' : user.role === 'Editor' ? 'default' : 'outline'}>
                        {user.role}
                     </Badge>
                  </TableCell>
                  <TableCell>{user.joinedAt}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-1">
                      <UserCog className="h-4 w-4" />
                      <span className="sr-only">Rolü Düzenle</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                       <span className="sr-only">Kullanıcıyı Sil</span>
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
