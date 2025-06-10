
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlusCircle, FilePenLine, Trash2, Loader2, RefreshCw, BookOpen as DerslerIcon } from "lucide-react";
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
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { getCourses, deleteCourse, type Course } from '@/lib/data/courses';
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
} from "@/components/ui/alert-dialog";
import { usePermissions } from "@/hooks/usePermissions";
import { useRouter } from "next/navigation";

export default function AdminDerslerPage() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = React.useState(false);
  const [courseToDelete, setCourseToDelete] = React.useState<{ id: string; title: string } | null>(null);
  
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const { hasPermission, isLoading: permissionsLoading, error: permissionsError } = usePermissions(currentUserId);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          setCurrentUserId(JSON.parse(storedUser)?.id || null);
        } catch (e) { setCurrentUserId(null); }
      }
    }
  }, []);

  const fetchCourses = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCourses();
      setCourses(data.filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase())));
    } catch (err) {
      console.error("[AdminDerslerPage] Error fetching courses:", err);
      setError("Dersler yüklenirken bir hata oluştu.");
      toast({ variant: "destructive", title: "Hata", description: "Dersler yüklenemedi." });
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  React.useEffect(() => {
    if (permissionsLoading) {
      // Still loading permissions, do nothing yet.
      return;
    }

    // Permissions are loaded (or failed to load)
    if (currentUserId) { // User is identified
      if (permissionsError) {
        // If there's an error loading permissions, show a toast.
        // AdminLayout should handle fundamental access issues (e.g., redirecting non-admins to login).
        // This error here might indicate a misconfiguration or data issue specific to permissions.
        toast({ variant: "destructive", title: "Yetki Yükleme Hatası", description: `İzinler yüklenirken bir sorun oluştu: ${permissionsError}. Lütfen destek ile iletişime geçin veya ayarları kontrol edin.` });
        // Optionally, prevent content rendering or redirect to a safe page like /admin
        // For now, we'll prevent fetchCourses and let AdminLayout handle broader access.
        // If AdminLayout has already confirmed Admin role, this error points to permission system itself.
        setError(`İzinler yüklenirken bir sorun oluştu: ${permissionsError}`); // Display error on page
        setLoading(false); // Ensure loading spinner stops
        return;
      }

      if (!hasPermission('Dersleri Yönetme')) {
        // This means permissions loaded successfully, user is identified, but explicitly lacks permission.
        // For an Admin user, this would indicate a serious configuration issue (Admin role should have this).
        // AdminLayout should have already redirected non-Admin users to /login.
        // If an Admin user reaches this point without the permission, it's a problem with role/permission setup.
        toast({ variant: "destructive", title: "Yetkisiz Erişim", description: "Bu sayfayı görüntüleme yetkiniz bulunmamaktadır. Rol ve izin yapılandırmanızı kontrol edin." });
        router.push('/admin'); // Redirect to dashboard as a fallback.
        return;
      }

      // If we reach here, user is identified, permissions loaded without error, and has the specific permission.
      fetchCourses();
    } else if (!loading && !currentUserId && !permissionsLoading) {
        // No currentUserId, and all loading flags are false.
        // This implies the user is not logged in or user data couldn't be retrieved.
        // AdminLayout should ideally handle redirection to /login.
        // If this page is somehow accessed directly without user context, show an error or let AdminLayout redirect.
        setError("Kullanıcı oturumu bulunamadı veya yetkiler yüklenemedi. Lütfen giriş yapın.");
        setLoading(false);
    }
    // If currentUserId is null but permissionsLoading is true, we wait.
    // If currentUserId is null and permissionsLoading is false (and no error), it means usePermissions determined no user.
    // AdminLayout should then redirect to /login. We don't fetchCourses in that case.

  }, [currentUserId, permissionsLoading, permissionsError, hasPermission, fetchCourses, router, loading]);


  const handleDeleteInitiate = (id: string, title: string) => {
    setCourseToDelete({ id, title });
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    const { id, title } = courseToDelete;

    setDeletingId(id);
    setIsConfirmDeleteDialogOpen(false);
    try {
        const success = await deleteCourse(id);
        if (success) {
            toast({ title: "Kurs Silindi", description: `"${title}" başlıklı kurs başarıyla silindi.` });
            await fetchCourses();
        } else {
            toast({ variant: "destructive", title: "Silme Hatası", description: "Kurs silinemedi." });
        }
    } catch (error) {
        toast({ variant: "destructive", title: "Silme Hatası", description: "Kurs silinirken bir hata oluştu." });
    } finally {
        setDeletingId(null);
        setCourseToDelete(null);
    }
  };
  
  // Initial loading state for the entire page, before permissions are even checked.
  // This is different from the `loading` state for `fetchCourses`.
  if (permissionsLoading && currentUserId === null) { // Show loader if permissions hook is loading AND we don't have a userId yet.
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            Yönetici Bilgileri Yükleniyor...
        </div>
    );
  }

  // If there was a general error during fetchCourses (not permission related)
  if (error && !loading) { // Display general errors if fetchCourses failed and it wasn't a permission issue handled above
    return <div className="text-center py-10 text-destructive">{error}</div>;
  }


  return (
    <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
              <h1 className="text-3xl font-bold flex items-center gap-2"><DerslerIcon className="h-8 w-8 text-primary" /> Ders Yönetimi</h1>
              <p className="text-muted-foreground">Mevcut kursları, bölümleri ve dersleri yönetin.</p>
          </div>
          <div className="flex gap-2">
              <Button variant="outline" onClick={fetchCourses} disabled={loading || deletingId !== null}>
                  <RefreshCw className={cn("mr-2 h-4 w-4", (loading || !!deletingId) && 'animate-spin')} />
                  Yenile
              </Button>
              {hasPermission('Dersleri Yönetme') && (
                <Button asChild>
                    <Link href="/admin/dersler/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> Yeni Kurs Ekle
                    </Link>
                </Button>
              )}
          </div>
        </div>

        <Card>
          <CardHeader>
              <CardTitle>Filtrele ve Ara</CardTitle>
          </CardHeader>
          <CardContent>
              <Input
                  placeholder="Kurs başlığında ara..."
                  className="flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            {loading ? ( // This loading is for the fetchCourses call
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                    Kurslar yükleniyor...
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    {searchTerm ? "Arama kriterlerine uygun kurs bulunamadı." : "Henüz kurs oluşturulmamış."}
                </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kurs Başlığı</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Eğitmen</TableHead>
                    <TableHead>Bölüm Sayısı</TableHead>
                    <TableHead>Ders Sayısı</TableHead>
                    <TableHead className="text-right">Eylemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id} className={cn(deletingId === course.id && 'opacity-50 pointer-events-none')}>
                      <TableCell className="font-medium">
                        <Link href={`/admin/dersler/edit/${course.id}`} className="hover:underline">
                          {course.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{course.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{course.instructor || '-'}</TableCell>
                      <TableCell>{course.sections?.length || 0}</TableCell>
                      <TableCell>{course.sections?.reduce((acc, section) => acc + (section.lessons?.length || 0), 0) || 0}</TableCell>
                      <TableCell className="text-right">
                        {hasPermission('Dersleri Yönetme') && (
                          <>
                            <Button variant="ghost" size="icon" className="mr-1" asChild disabled={deletingId === course.id}>
                                <Link href={`/admin/dersler/edit/${course.id}`}>
                                    <FilePenLine className="h-4 w-4" />
                                    <span className="sr-only">Düzenle</span>
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteInitiate(course.id, course.title)}
                                disabled={deletingId === course.id}
                                aria-label="Sil"
                            >
                                {deletingId === course.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                <Trash2 className="h-4 w-4" />
                                )}
                                <span className="sr-only">Sil</span>
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              "{courseToDelete?.title}" başlıklı kursu ve içindeki tüm bölümleri/dersleri silmek üzeresiniz. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsConfirmDeleteDialogOpen(false); setCourseToDelete(null);}}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className={cn(buttonVariants({ variant: "destructive" }))}>
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
}

