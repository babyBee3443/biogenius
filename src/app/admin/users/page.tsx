
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, Trash2, Filter, UserPlus } from "lucide-react"; // Added Filter, UserPlus
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
import { Input } from "@/components/ui/input"; // Added Input for search
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"; // Added DropdownMenu for filtering
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from "@/components/ui/pagination"; // Added Pagination
import Link from "next/link";


// Mock data - replace with actual data fetching logic
const users = [
  { id: 'u1', name: 'Ali Veli', email: 'ali.veli@example.com', role: 'Admin', joinedAt: '2024-01-15', avatar: 'https://picsum.photos/seed/u1/32/32' },
  { id: 'u2', name: 'Ayşe Kaya', email: 'ayse.kaya@example.com', role: 'Editor', joinedAt: '2024-03-22', avatar: 'https://picsum.photos/seed/u2/32/32' },
  { id: 'u3', name: 'Mehmet Yılmaz', email: 'mehmet.yilmaz@example.com', role: 'User', joinedAt: '2024-06-10', avatar: 'https://picsum.photos/seed/u3/32/32' },
  { id: 'u4', name: 'Zeynep Demir', email: 'zeynep.demir@example.com', role: 'User', joinedAt: '2024-07-01', avatar: 'https://picsum.photos/seed/u4/32/32' },
  { id: 'u5', name: 'Can Öztürk', email: 'can.ozturk@example.com', role: 'Editor', joinedAt: '2024-05-19', avatar: 'https://picsum.photos/seed/u5/32/32' },
   // Add more users for pagination testing
];

const getRoleVariant = (role: string): "default" | "secondary" | "outline" | "destructive" => {
     switch (role) {
        case 'Admin': return 'destructive';
        case 'Editor': return 'default'; // Use primary for Editor
        case 'User': return 'outline';
        default: return 'secondary';
    }
}


export default function AdminUsersPage() {
  // TODO: Implement state for filtering, search, and pagination
  const currentPage = 1; // Example: current page number
  const totalPages = 1; // Example: total number of pages

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
         <div>
            <h1 className="text-3xl font-bold">Kullanıcıları Yönet</h1>
            <p className="text-muted-foreground">Kullanıcı rollerini ve durumlarını yönetin.</p>
         </div>
        <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Yeni Kullanıcı Ekle {/* Or "Kullanıcı Davet Et" */}
        </Button>
      </div>

      {/* Filtering and Search Bar */}
       <Card>
            <CardHeader>
                <CardTitle>Filtrele ve Ara</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-4">
                 <Input placeholder="Kullanıcı adı veya e-postada ara..." className="flex-1" />
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Rol
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Role göre filtrele</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* TODO: Make these checkbox items stateful */}
                    <DropdownMenuCheckboxItem checked>Admin</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Editor</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>User</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
                 {/* Optional: Add sorting if needed */}
            </CardContent>
       </Card>

      <Card>
        {/* Removed Header for Table */}
        <CardContent className="pt-6">
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
                       <Avatar className="h-9 w-9"> {/* Slightly larger avatar */}
                         <AvatarImage src={user.avatar} alt={user.name} />
                         <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                       </Avatar>
                       <div>
                            <Link href={`/admin/users/edit/${user.id}`} className="font-medium hover:underline">{user.name}</Link>
                            <div className="text-xs text-muted-foreground">{user.id}</div>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                     <Badge variant={getRoleVariant(user.role)}>
                        {user.role}
                     </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.joinedAt}</TableCell>
                  <TableCell className="text-right">
                     {/* Link to Edit User Page */}
                    <Button variant="ghost" size="icon" className="mr-1" asChild>
                       <Link href={`/admin/users/edit/${user.id}`}>
                          <UserCog className="h-4 w-4" />
                          <span className="sr-only">Kullanıcıyı Düzenle</span>
                       </Link>
                    </Button>
                     {/* TODO: Implement Delete Functionality */}
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
        {/* Pagination */}
         <CardContent>
             <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href={currentPage > 1 ? `/admin/users?page=${currentPage - 1}` : '#'} aria-disabled={currentPage <= 1} />
                </PaginationItem>
                {/* TODO: Dynamically generate page numbers */}
                <PaginationItem>
                  <PaginationLink href="/admin/users?page=1" isActive={currentPage === 1}>1</PaginationLink>
                </PaginationItem>
                {/* Add Ellipsis and more pages if totalPages > 1 */}
                <PaginationItem>
                  <PaginationNext href={currentPage < totalPages ? `/admin/users?page=${currentPage + 1}` : '#'} aria-disabled={currentPage >= totalPages}/>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
         </CardContent>
      </Card>
    </div>
  );
}

