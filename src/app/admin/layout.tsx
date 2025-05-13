
"use client";

import type { Metadata } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Newspaper, Users, Settings, PlusCircle, LogOut, ShieldCheck, MenuSquare, Layers, BookCopy, Tag, Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { toast } from '@/hooks/use-toast';
import { usePermissions } from "@/hooks/usePermissions";
import { ThemeToggle } from '@/components/theme-toggle';

const SESSION_TIMEOUT_KEY = 'adminSessionTimeoutMinutes';
const DEFAULT_SESSION_TIMEOUT_MINUTES = 5;


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUserName, setCurrentUserName] = React.useState("Kullanıcı");
  const [currentUserAvatar, setCurrentUserAvatar] = React.useState("https://picsum.photos/seed/default-avatar/32/32");
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = React.useState(DEFAULT_SESSION_TIMEOUT_MINUTES);
  const [authCheckComplete, setAuthCheckComplete] = React.useState(false);
  const [initialLoadAttempted, setInitialLoadAttempted] = React.useState(false);
  const router = useRouter();
  const { permissions, isLoading: permissionsLoading, error: permissionsError, hasPermission } = usePermissions();


  const loadUserDataAndSettings = React.useCallback(() => {
    console.log("[AdminLayout] loadUserDataAndSettings called");
    let userFound = false;
    if (typeof window !== 'undefined') {
      const storedUserString = localStorage.getItem('currentUser');
      if (storedUserString) {
        try {
          const userData = JSON.parse(storedUserString);
          if (userData && userData.id) {
            setCurrentUserName(userData.name || "Kullanıcı");
            setCurrentUserAvatar(userData.avatar || "https://picsum.photos/seed/default-avatar/32/32");
            setCurrentUserId(userData.id);
            userFound = true;
            console.log("[AdminLayout] User data loaded from localStorage:", userData.id, userData.name);
          } else {
             console.error("[AdminLayout] User ID not found in stored currentUser object.");
             setCurrentUserId(null);
          }
        } catch (e) {
          console.error("Error parsing user data from localStorage in AdminLayout", e);
          setCurrentUserName("Kullanıcı");
          setCurrentUserAvatar("https://picsum.photos/seed/default-avatar/32/32");
          setCurrentUserId(null);
          localStorage.removeItem('currentUser');
        }
      } else {
        setCurrentUserId(null);
        console.log("[AdminLayout] No currentUser in localStorage.");
      }

      const storedTimeout = localStorage.getItem(SESSION_TIMEOUT_KEY);
      if (storedTimeout) {
        const timeoutValue = parseInt(storedTimeout, 10);
        setSessionTimeoutMinutes(!isNaN(timeoutValue) && timeoutValue > 0 ? timeoutValue : DEFAULT_SESSION_TIMEOUT_MINUTES);
      } else {
        // setSessionTimeoutMinutes(DEFAULT_SESSION_TIMEOUT_MINUTES); // This was causing the error, removed it.
      }
    }
    setAuthCheckComplete(true);
    if (!initialLoadAttempted) setInitialLoadAttempted(true);
    return userFound;
  }, [sessionTimeoutMinutes, initialLoadAttempted]);


  React.useEffect(() => {
    document.title = 'BiyoHox Admin';
    loadUserDataAndSettings();

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'currentUser' || event.key === SESSION_TIMEOUT_KEY) {
            console.log(`AdminLayout: '${event.key}' changed in localStorage (another tab), reloading user data and settings.`);
            setAuthCheckComplete(false); // Re-trigger auth check
            loadUserDataAndSettings();
        }
    };

    const handleCurrentUserUpdated = () => {
        console.log("AdminLayout: 'currentUserUpdated' event received, reloading user data.");
        setAuthCheckComplete(false); // Re-trigger auth check
        loadUserDataAndSettings();
    };

    const handleSessionTimeoutChanged = () => {
        console.log("AdminLayout: 'sessionTimeoutChanged' event received, reloading settings.");
        loadUserDataAndSettings(); // Reload settings which includes session timeout
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('currentUserUpdated', handleCurrentUserUpdated);
    window.addEventListener('sessionTimeoutChanged', handleSessionTimeoutChanged);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('currentUserUpdated', handleCurrentUserUpdated);
      window.removeEventListener('sessionTimeoutChanged', handleSessionTimeoutChanged);
    };
  }, [loadUserDataAndSettings]);


  // Effect for redirection logic, dependent on states being settled
  React.useEffect(() => {
    if (!initialLoadAttempted || !authCheckComplete || permissionsLoading) {
      return; // Wait for initial load, auth check, and permissions to complete
    }

    if (!currentUserId && typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      console.log("[AdminLayout] Redirection Effect: User not authenticated, redirecting to login.");
      toast({ variant: "destructive", title: "Oturum Gerekli", description: "Devam etmek için lütfen giriş yapın." });
      router.replace('/login');
    }
  }, [initialLoadAttempted, authCheckComplete, permissionsLoading, currentUserId, router]);


  const handleLogout = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    setCurrentUserName("Kullanıcı");
    setCurrentUserAvatar("https://picsum.photos/seed/default-avatar/32/32");
    setCurrentUserId(null);
    setAuthCheckComplete(true);
    toast({ title: "Oturum Kapatıldı", description: "Başarıyla çıkış yaptınız." });
    router.replace('/login');
  }, [router]);


  useIdleTimeout({ onIdle: handleLogout, idleTimeInMinutes: sessionTimeoutMinutes });


  if (!initialLoadAttempted || !authCheckComplete || permissionsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Yönetim paneli yükleniyor...</p>
      </div>
    );
  }

  // This explicit check might be redundant if the useEffect for redirection works correctly,
  // but can serve as a fallback or to show a "Redirecting..." message.
  if (!currentUserId && typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
     console.log("[AdminLayout] Render-time check: No user ID, rendering redirect placeholder.");
      if (!window.location.pathname.startsWith('/login')) { // Extra check to prevent loop on login page
        router.replace('/login');
      }
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Yönlendiriliyor...</p>
        </div>
     );
  }


  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex flex-col items-center justify-center p-4 mt-2">
          <Link href="/admin" className="flex flex-col items-center group" title="Gösterge Paneline Git">
             <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7 text-primary flex-shrink-0 group-data-[collapsible=icon]:ml-1 animate-spin-slow"
            >
                {/* Simplified SVG for brevity, original SVG can be kept */}
                <path d="M12 2a10 10 0 0 0-10 10c0 2.5 1 4.8 2.6 6.4A10 10 0 0 0 12 22a10 10 0 0 0 10-10c0-2.5-1-4.8-2.6-6.4A10 10 0 0 0 12 2z" />
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                <path d="M15.7 15.7a4 4 0 1 0-7.4 0" />
            </svg>
          </Link>
        </SidebarHeader>

        <div className="py-4 text-center group-data-[collapsible=icon]:hidden mt-0">
             <span className="block font-semibold text-sm text-muted-foreground">
                Hoşgeldiniz
            </span>
          <span className="block font-bold text-md mt-0.5">
            {currentUserName}
          </span>
        </div>

        <SidebarContent className="p-2">
          <SidebarMenu>
            {hasPermission('Dashboard Görüntüleme') && (
                <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Gösterge Paneli">
                    <Link href="/admin">
                    <LayoutDashboard />
                    <span>Gösterge Paneli</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            )}

            {(hasPermission('Makaleleri Görüntüleme') || hasPermission('Makale Oluşturma') || hasPermission('Biyoloji Notlarını Görüntüleme') || hasPermission('Yeni Biyoloji Notu Ekleme') || hasPermission('Kategorileri Yönetme') || hasPermission('Sayfaları Yönetme')) && (
                <SidebarGroup className="p-0">
                <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">İçerik</SidebarGroupLabel>
                    <SidebarMenu>
                        {hasPermission('Makaleleri Görüntüleme') && (
                            <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Tüm Makaleler">
                                <Link href="/admin/articles">
                                <Newspaper />
                                <span>Makaleler</span>
                                </Link>
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                        {hasPermission('Makale Oluşturma') && (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Yeni Makale Ekle">
                                    <Link href="/admin/articles/new">
                                    <PlusCircle />
                                    <span>Yeni Makale</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                        {hasPermission('Biyoloji Notlarını Görüntüleme') && (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Biyoloji Notları">
                                    <Link href="/admin/biyoloji-notlari">
                                    <BookCopy />
                                    <span>Biyoloji Notları</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                        {hasPermission('Yeni Biyoloji Notu Ekleme') && (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Yeni Biyoloji Notu Ekle">
                                    <Link href="/admin/biyoloji-notlari/new">
                                    <PlusCircle />
                                    <span>Yeni Not Ekle</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                        {hasPermission('Kategorileri Yönetme') && (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Kategoriler">
                                    <Link href="/admin/categories">
                                    <Tag />
                                    <span>Kategoriler</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                        {hasPermission('Sayfaları Yönetme') && (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Sayfa Yönetimi">
                                    <Link href="/admin/pages">
                                    <Layers />
                                    <span>Sayfa Yönetimi</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            )}

            {(hasPermission('Kullanıcıları Görüntüleme') || hasPermission('Rolleri Yönetme')) && (
                <SidebarGroup className="p-0">
                <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Yönetim</SidebarGroupLabel>
                    <SidebarMenu>
                        {hasPermission('Kullanıcıları Görüntüleme') && (
                            <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Kullanıcılar">
                                <Link href="/admin/users">
                                <Users />
                                <span>Kullanıcılar</span>
                                </Link>
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                        {hasPermission('Rolleri Yönetme') && (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Roller">
                                    <Link href="/admin/roles">
                                    <ShieldCheck />
                                    <span>Roller</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            )}

            {(hasPermission('Ayarları Görüntüleme') || hasPermission('Menü Yönetimi')) && (
                <SidebarGroup className="p-0">
                <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Sistem</SidebarGroupLabel>
                    <SidebarMenu>
                        {hasPermission('Ayarları Görüntüleme') && (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Genel Ayarlar">
                                    <Link href="/admin/settings">
                                    <Settings />
                                    <span>Genel Ayarlar</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                        {hasPermission('Menü Yönetimi') && (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Menü Yönetimi">
                                    <Link href="/admin/settings/navigation">
                                    <MenuSquare />
                                    <span>Menü Yönetimi</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            )}
            {hasPermission('Kullanım Kılavuzunu Görüntüleme') && (
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Kullanım Kılavuzu">
                        <Link href="/admin/pages/edit/kullanim-kilavuzu">
                           <Layers />
                           <span>Kullanım Kılavuzu</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
           <SidebarGroup className="p-0">
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Hesap</SidebarGroupLabel>
                 <SidebarMenu>
                   <SidebarMenuItem>
                     <SidebarMenuButton asChild tooltip="Profil">
                        <Link href={currentUserId ? `/admin/profile` : '/login'}>
                          <Avatar className="size-5">
                            <AvatarImage src={currentUserAvatar} alt={currentUserName} data-ai-hint="user avatar placeholder"/>
                            <AvatarFallback>{currentUserName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span>{currentUserName}</span>
                        </Link>
                     </SidebarMenuButton>
                   </SidebarMenuItem>
                    <SidebarMenuItem>
                     <SidebarMenuButton onClick={handleLogout} asChild tooltip="Çıkış Yap">
                        <button className="w-full">
                           <LogOut />
                           <span>Çıkış Yap</span>
                        </button>
                     </SidebarMenuButton>
                   </SidebarMenuItem>
                 </SidebarMenu>
           </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
         <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:justify-end">
           <SidebarTrigger className="md:hidden" />
           <div className="flex items-center gap-2">
            <Button variant="outline" asChild size="sm">
                <Link href="/" target="_blank">
                    <Home className="mr-2 h-4 w-4" /> Siteyi Görüntüle
                </Link>
            </Button>
            <ThemeToggle />
            <Link href={currentUserId ? `/admin/profile` : '/login'} passHref>
              <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8">
                  <Avatar className="size-7">
                    <AvatarImage src={currentUserAvatar} alt={currentUserName} data-ai-hint="user avatar placeholder"/>
                    <AvatarFallback>{currentUserName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                  </Avatar>
              </Button>
            </Link>
           </div>
         </header>
         <main className="flex-1 p-4 md:p-6 pt-[calc(theme(spacing.14)+theme(spacing.6))] md:pt-[calc(theme(spacing.14)+theme(spacing.6))]">
            {children}
         </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
