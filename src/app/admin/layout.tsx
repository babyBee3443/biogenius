
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
  const [currentUserRoleName, setCurrentUserRoleName] = React.useState<string | null>(null); // Store role name
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = React.useState(DEFAULT_SESSION_TIMEOUT_MINUTES);
  const [authCheckComplete, setAuthCheckComplete] = React.useState(false);
  const router = useRouter();
  const { permissions, isLoading: permissionsLoading, error: permissionsError, hasPermission } = usePermissions(currentUserId);


  const loadUserDataAndSettings = React.useCallback(() => {
    console.log("[AdminLayout] loadUserDataAndSettings called");
    let userFound = false;
    let newUserId: string | null = null;
    let newUserName = "Kullanıcı";
    let newUserAvatar = "https://picsum.photos/seed/default-avatar/32/32";
    let newUserRoleName: string | null = null;

    if (typeof window !== 'undefined') {
      const storedUserString = localStorage.getItem('currentUser');
      if (storedUserString) {
        try {
          const userData = JSON.parse(storedUserString);
          if (userData && userData.id && userData.role) { // Ensure role is also present
            newUserName = userData.name || "Kullanıcı";
            newUserAvatar = userData.avatar || `https://picsum.photos/seed/${userData.username || 'avatar'}/32/32`;
            newUserId = userData.id;
            newUserRoleName = userData.role; // Store the role name
            userFound = true;
            console.log("[AdminLayout] User data loaded from localStorage:", {id: newUserId, name: newUserName, role: newUserRoleName });
          } else {
             console.error("[AdminLayout] User ID or Role not found in stored currentUser object.");
             newUserId = null;
             newUserRoleName = null;
          }
        } catch (e) {
          console.error("Error parsing user data from localStorage in AdminLayout", e);
          newUserId = null;
          newUserRoleName = null;
          localStorage.removeItem('currentUser'); // Clear corrupted data
        }
      } else {
        newUserId = null;
        newUserRoleName = null;
        console.log("[AdminLayout] No currentUser in localStorage.");
      }

      setCurrentUserId(newUserId);
      setCurrentUserName(newUserName);
      setCurrentUserAvatar(newUserAvatar);
      setCurrentUserRoleName(newUserRoleName); // Set the role name

      const storedTimeout = localStorage.getItem(SESSION_TIMEOUT_KEY);
      if (storedTimeout) {
        const timeoutValue = parseInt(storedTimeout, 10);
        setSessionTimeoutMinutes(!isNaN(timeoutValue) && timeoutValue > 0 ? timeoutValue : DEFAULT_SESSION_TIMEOUT_MINUTES);
      } else {
        setSessionTimeoutMinutes(DEFAULT_SESSION_TIMEOUT_MINUTES);
      }
    }
    if (isMountedRef.current) { // Ensure component is still mounted before setting authCheckComplete
        setAuthCheckComplete(true);
        console.log("[AdminLayout] Auth check complete.");
    }
    return userFound;
  }, []);

  const isMountedRef = React.useRef(false);

  React.useEffect(() => {
    isMountedRef.current = true;
    if (typeof window !== 'undefined') {
        document.title = 'BiyoHox Admin Panel';
    }
    loadUserDataAndSettings();

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'currentUser' || event.key === SESSION_TIMEOUT_KEY) {
            console.log(`[AdminLayout] '${event.key}' changed in localStorage, reloading user data and settings.`);
            if (isMountedRef.current) setAuthCheckComplete(false); // Reset for re-check
            loadUserDataAndSettings();
        }
    };

    const handleCurrentUserUpdated = () => {
        console.log("[AdminLayout] 'currentUserUpdated' event received, reloading user data.");
        if (isMountedRef.current) setAuthCheckComplete(false); // Reset for re-check
        loadUserDataAndSettings();
    };

    const handleSessionTimeoutChanged = () => {
        console.log("[AdminLayout] 'sessionTimeoutChanged' event received, reloading settings.");
        loadUserDataAndSettings(); // No need to reset authCheckComplete for this
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('currentUserUpdated', handleCurrentUserUpdated);
    window.addEventListener('sessionTimeoutChanged', handleSessionTimeoutChanged);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('currentUserUpdated', handleCurrentUserUpdated);
      window.removeEventListener('sessionTimeoutChanged', handleSessionTimeoutChanged);
    };
  }, [loadUserDataAndSettings]);


  const handleLogout = React.useCallback(() => {
    console.log("[AdminLayout] handleLogout called");
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    setCurrentUserName("Kullanıcı");
    setCurrentUserAvatar("https://picsum.photos/seed/default-avatar/32/32");
    setCurrentUserId(null);
    setCurrentUserRoleName(null);
    if (isMountedRef.current) setAuthCheckComplete(false); // Re-trigger auth check process
    loadUserDataAndSettings(); // This will now set authCheckComplete after loading
    toast({ title: "Oturum Kapatıldı", description: "Başarıyla çıkış yaptınız." });
    router.push('/login'); // Redirect to login page after logout
  }, [router, loadUserDataAndSettings]);


  useIdleTimeout({ onIdle: handleLogout, idleTimeInMinutes: sessionTimeoutMinutes });

  React.useEffect(() => {
    console.log(`[AdminLayout] Redirection Effect: authComplete=${authCheckComplete}, permLoading=${permissionsLoading}, userId=${currentUserId}, roleName=${currentUserRoleName}, pathname=${typeof window !== 'undefined' ? window.location.pathname : 'server'}`);

    if (!authCheckComplete) { // Only check this first
      console.log("[AdminLayout] Redirection Effect: Waiting for auth check to complete.");
      return;
    }

    // If auth check is complete, then check for user ID
    if (!currentUserId) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/login' && !window.location.pathname.startsWith('/admin/preview')) {
        console.log("[AdminLayout] Redirection Effect: User not authenticated, redirecting to /login from:", window.location.pathname);
        toast({
            title: "Erişim Reddedildi",
            description: "Lütfen admin paneline erişmek için giriş yapın.",
            variant: "destructive"
        });
        router.replace('/login');
      }
      return; // Stop further checks if no user ID
    }

    // If user ID exists, then wait for permissions to load
    if (permissionsLoading) {
      console.log("[AdminLayout] Redirection Effect: User authenticated, waiting for permissions check.");
      return;
    }

    // At this point, auth is complete, user ID exists, and permissions are loaded (or failed to load)
    // Specific page permission checks are handled by the pages themselves.
    // The main purpose here is to ensure non-logged-in users are redirected.
    // If a logged-in user (e.g. Admin) still can't see content, it's a permission definition issue (usePermissions or mock-data)

  }, [authCheckComplete, permissionsLoading, currentUserId, currentUserRoleName, router]);


  if (!authCheckComplete || (currentUserId && permissionsLoading)) { // Show loading if auth not complete OR user logged in but perms still loading
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Yönetim paneli yükleniyor...</p>
      </div>
    );
  }

  // This case should be handled by the redirect in useEffect now
  if (!currentUserId && typeof window !== 'undefined' && window.location.pathname !== '/login' && !window.location.pathname.startsWith('/admin/preview')) {
     console.warn("[AdminLayout] Render block: Attempting to render admin layout without user ID and not on login/preview. Redirecting...");
     // router.replace('/login'); // This might cause issues if called during render cycle. Effect handles it.
     return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Giriş sayfasına yönlendiriliyor...</p>
        </div>
     );
  }


  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex flex-col items-center justify-center p-4 mt-2">
          <Link href="/admin" className="flex flex-col items-center group" title="Gösterge Paneline Git">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-10 w-10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 transition-all">
            <defs>
              <linearGradient id="adminDnaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))">
                  <animate attributeName="stop-color" values="hsl(var(--primary));hsl(var(--accent));hsl(var(--primary))" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="hsl(var(--accent))">
                  <animate attributeName="stop-color" values="hsl(var(--accent));hsl(var(--primary));hsl(var(--accent))" dur="4s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            <g transform="translate(50,50) scale(0.8)">
              <path
                d="M0,-40 Q 20,-20 0,0 Q -20,20 0,40"
                stroke="url(#adminDnaGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 0 0"
                  to="360 0 0"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d="M0,-40 Q -20,-20 0,0 Q 20,20 0,40"
                stroke="url(#adminDnaGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 0 0"
                  to="360 0 0"
                  dur="12s"
                  repeatCount="indefinite"
                />
                 <animate attributeName="stroke-width" values="6;7;6" dur="2.5s" repeatCount="indefinite" />
              </path>
              {[...Array(7)].map((_, i) => (
                <line
                  key={`admin-dna-base-${i}`}
                  x1={Math.sin(i * Math.PI / 3.5) * (12 + (i%2 === 0 ? 2: 0) )}
                  y1={-35 + i * (70/6)}
                  x2={Math.sin(i * Math.PI / 3.5 + Math.PI) * (12 + (i%2 === 0 ? 2: 0))}
                  y2={-35 + i * (70/6)}
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="stroke-primary/60 dark:stroke-accent/50"
                >
                  <animate attributeName="stroke" values="hsl(var(--primary)/0.6);hsl(var(--accent)/0.7);hsl(var(--primary)/0.5);hsl(var(--primary)/0.6)" dur="5s" repeatCount="indefinite" begin={`${i * 0.25}s`} />
                   <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 0 0"
                    to="360 0 0"
                    dur="12s"
                    repeatCount="indefinite"
                  />
                </line>
              ))}
            </g>
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
                          <span className="flex items-center gap-2">
                            <Avatar className="size-5">
                              <AvatarImage src={currentUserAvatar} alt={currentUserName} data-ai-hint="user avatar placeholder"/>
                              <AvatarFallback>{currentUserName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{currentUserName}</span>
                          </span>
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
