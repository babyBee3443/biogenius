"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions'; // To get user role for conditional redirect
import { useRouter } from 'next/navigation';

export default function UserProfilePage() {
  const [currentUser, setCurrentUser] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  // Pass currentUserId to usePermissions. It will be null initially.
  const { permissions, isLoading: permissionsLoading } = usePermissions(currentUser?.id || null);


  React.useEffect(() => {
    let isMounted = true;
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (isMounted) setCurrentUser(user);
        } catch (e) {
          console.error("Error parsing current user from localStorage", e);
          if (isMounted) router.push('/login'); // Redirect if user data is corrupt
        }
      } else {
        if (isMounted) router.push('/login'); // Redirect if no user is logged in
      }
      if (isMounted) setLoading(false);
    }
    return () => { isMounted = false; };
  }, [router]);

  // Effect to handle redirection for Admin/Editor after currentUser and permissions are loaded
  React.useEffect(() => {
    if (!loading && !permissionsLoading && currentUser) {
      if (currentUser.role === 'Admin' || currentUser.role === 'Editor') {
        router.replace('/admin/profile');
      }
    }
  }, [loading, permissionsLoading, currentUser, router]);


  if (loading || permissionsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
        Profil yükleniyor...
      </div>
    );
  }

  if (!currentUser) {
    // This state should ideally be handled by the redirect in the first useEffect
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Lütfen giriş yapınız.</p>
        <Button asChild className="mt-4">
          <Link href="/login">Giriş Yap</Link>
        </Button>
      </div>
    );
  }
  
  // If user is Admin or Editor, this component should not render its main content.
  // The redirection effect above handles this.
  if (currentUser.role === 'Admin' || currentUser.role === 'Editor') {
    return (
         <div className="flex justify-center items-center h-screen">
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
            Yönlendiriliyor...
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Anasayfaya Dön</Link>
      </Button>
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-secondary/50 p-6 rounded-t-lg">
          <Avatar className="h-28 w-28 mx-auto mb-4 border-4 border-primary/50 shadow-md">
            <AvatarImage src={currentUser.avatar || `https://picsum.photos/seed/${currentUser.username || 'user'}/128/128`} alt={currentUser.name} data-ai-hint="user avatar placeholder" />
            <AvatarFallback className="text-3xl">{(currentUser.name || 'U').charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">{currentUser.name}</CardTitle>
          <CardDescription className="text-primary">@{currentUser.username}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-muted-foreground text-sm">E-posta</h3>
              <p className="text-foreground">{currentUser.email}</p>
            </div>
            <div>
              <h3 className="font-semibold text-muted-foreground text-sm">Katılma Tarihi</h3>
              <p className="text-foreground">{new Date(currentUser.joinedAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          {currentUser.bio && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold text-muted-foreground text-sm mb-1">Biyografi</h3>
              <p className="text-sm text-foreground whitespace-pre-line">{currentUser.bio}</p>
            </div>
          )}
          <Button className="w-full mt-8" disabled>
            Profili Düzenle (Yakında)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
