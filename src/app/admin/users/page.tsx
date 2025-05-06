"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, Trash2, Filter, UserPlus, RefreshCw, Loader2 } from "lucide-react"; // Added icons
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
import { toast } from "@/hooks/use-toast"; // Import toast for feedback
import { getUsers, deleteUser, type User } from "@/lib/mock-data"; // Import user data functions
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components

const getRoleVariant = (role: string): "default" | "secondary" | "outline" | "destructive" => {
     switch (role) {
        case 'Admin': return 'destructive';
        case 'Editor': return 'default';
        case 'User': return 'outline';
        default: return 'secondary';
    }
}


export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // State for AlertDialog
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<{ id: string; name: string } | null>(null);


  // Filtering and Search state
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const fetchUsers = React.useCallback(async () => {
    console.log("[AdminUsersPage/fetchUsers] Fetching users...");
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      console.log("[AdminUsersPage/fetchUsers] Users fetched:", data.length);
      setUsers(data);
    } catch (err) {
      console.error("[AdminUsersPage/fetchUsers] Error fetching users:", err);
      setError("Kullanıcılar yüklenirken bir hata oluştu.");
      toast({ variant: "destructive", title: "Hata", description: "Kullanıcılar yüklenemedi." });
    } finally {
      setLoading(false);
      console.log("[AdminUsersPage/fetchUsers] Fetching complete.");
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleFilterChange = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
    setCurrentPage(1); 
  };

  const filteredUsers = users.filter(user =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedRoles.length === 0 || selectedRoles.includes(user.role))
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteInitiate = (id: string, name: string) => {
    setUserToDelete({ id, name });
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    const { id, name } = userToDelete;
    console.log(`[AdminUsersPage/confirmDelete] User confirmed deletion for: ${id}`);
    setDeletingId(id);
    setIsConfirmDeleteDialogOpen(false); // Close dialog

    try {
      console.log(`[AdminUsersPage/confirmDelete] Calling deleteUser(${id}) from mock-data`);
      const success = await deleteUser(id);
      console.log(`[AdminUsersPage/confirmDelete] deleteUser(${id}) returned: ${success}`);
      if (success) {
        toast({
          title: "Kullanıcı Silindi",
          description: `"${name}" kullanıcısı başarıyla silindi.`,
        });
        console.log(`[AdminUsersPage/confirmDelete] Deletion successful for ${id}. Refetching users...`);
        await fetchUsers(); 
        if (paginatedUsers.length === 1 && currentPage > 1 && totalPages > 1 && currentPage === totalPages) {
           console.log(`[AdminUsersPage/confirmDelete] Last item on page deleted, moving to page ${currentPage - 1}`);
           setCurrentPage(currentPage - 1);
        }
        console.log(`[AdminUsersPage/confirmDelete] User list refetched after deleting ${id}.`);
      } else {
        console.error(`[AdminUsersPage/confirmDelete] deleteUser(${id}) failed (returned false).`);
        toast({ variant: "destructive", title: "Silme Hatası", description: "Kullanıcı silinemedi." });
      }
    } catch (error) {
      console.error(`[AdminUsersPage/confirmDelete] Error during deletion of ${id}:`, error);
      toast({ variant: "destructive", title: "Silme Hatası", description: "Kullanıcı silinirken bir hata oluştu." });
    } finally {
      console.log(`[AdminUsersPage/confirmDelete] Resetting deletingId for ${id}.`);
      setDeletingId(null);
      setUserToDelete(null); // Clear user to delete
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
         <div>
            <h1 className="text-3xl font-bold">Kullanıcıları Yönet</h1>
            <p className="text-muted-foreground">Kullanıcı rollerini ve durumlarını yönetin.</p>
         </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={fetchUsers} disabled={loading || deletingId !== null}>
                 <RefreshCw className={cn("mr-2 h-4 w-4", (loading || !!deletingId) && 'animate-spin')} />
                 Yenile
            </Button>
            <Button asChild>
                <Link href="/admin/users/new">
                    <UserPlus className="mr-2 h-4 w-4" /> Yeni Kullanıcı Ekle
                </Link>
            </Button>
        </div>
      </div>

      <Card>
            <CardHeader>
                <CardTitle>Filtrele ve Ara</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-4">
                 <Input
                    placeholder="Kullanıcı adı veya e-postada ara..."
                    className="flex-1"
                    value={searchTerm}
                    onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                 />
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Rol ({selectedRoles.length > 0 ? selectedRoles.length : 'Tümü'})
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Role göre filtrele</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {['Admin', 'Editor', 'User'].map(role => (
                            <DropdownMenuCheckboxItem
                                key={role}
                                checked={selectedRoles.includes(role)}
                                onCheckedChange={() => handleRoleFilterChange(role)}
                            >
                                {role}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                 </DropdownMenu>
            </CardContent>
       </Card>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
             <div className="flex justify-center items-center py-10">
               <Loader2 className="mr-2 h-8 w-8 animate-spin" />
               Kullanıcılar yükleniyor...
             </div>
          ) : error ? (
            <div className="text-center py-10 text-destructive">{error}</div>
          ) : paginatedUsers.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">
                {searchTerm || selectedRoles.length > 0
                    ? "Arama kriterlerine uygun kullanıcı bulunamadı."
                    : "Henüz kullanıcı oluşturulmamış."
                }
             </div>
          ) : (
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
                {paginatedUsers.map((user) => (
                    <TableRow key={user.id} className={cn(deletingId === user.id && 'opacity-50 pointer-events-none')}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar placeholder"/>
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
                    <TableCell className="text-muted-foreground">{new Date(user.joinedAt).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="mr-1" asChild disabled={!!deletingId}>
                        <Link href={`/admin/users/edit/${user.id}`}>
                            <UserCog className="h-4 w-4" />
                            <span className="sr-only">Kullanıcıyı Düzenle</span>
                        </Link>
                        </Button>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteInitiate(user.id, user.name)}
                                disabled={!!deletingId} 
                                aria-label="Kullanıcıyı Sil"
                            >
                                {deletingId === user.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                                <span className="sr-only">Kullanıcıyı Sil</span>
                            </Button>
                         </AlertDialogTrigger>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          )}
        </CardContent>
        {totalPages > 1 && !loading && !error && paginatedUsers.length > 0 && (
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

       <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              "{userToDelete?.name}" kullanıcısını silmek üzeresiniz. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}