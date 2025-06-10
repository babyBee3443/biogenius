
"use client";

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
import { LayoutDashboard, Newspaper, Users, Settings, PlusCircle, LogOut, ShieldCheck, MenuSquare, Layers, BookCopy, Tag, Home as HomeIcon, Loader2, BookOpen as DerslerIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { toast } from '@/hooks/use-toast';
// import { usePermissions } from "@/hooks/usePermissions"; // Artık layout seviyesinde kullanılmayacak
import { ThemeToggle } from '@/components/theme-toggle';

const SESSION_TIMEOUT_KEY = 'adminSessionTimeoutMinutes';
const DEFAULT_SESSION_TIMEOUT_MINUTES = 30;


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUserName, setCurrentUserName] = React.useState("Kullanıcı");
  const [currentUserAvatar, setCurrentUserAvatar] = React.useState("https://placehold.co/32x32.png");
  const [currentUserId, setCurrentUserId] = React.useState<string | null | undefined>(undefined); // Initial undefined state
  const [currentUserRoleName, setCurrentUserRoleName] = React.useState<string | null>(null);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = React.useState(DEFAULT_SESSION_TIMEOUT_MINUTES);
  const [authCheckComplete, setAuthCheckComplete] = React.useState(false); // New state
  const router = useRouter();
  // const { permissions, isLoading: permissionsLoading, error: permissionsError, hasPermission } = usePermissions(currentUserId === undefined ? null : currentUserId);


  const loadUserDataAndSettings = React.useCallback(() => {
    let userFound = false;
    let newUserId: string | null = null;
    let newUserName = "Kullanıcı";
    let newUserAvatar = "https://placehold.co/32x32.png";
    let newUserRoleName: string | null = null;

    if (typeof window !== 'undefined') {
      const storedUserString = localStorage.getItem('currentUser');
      if (storedUserString) {
        try {
          const userData = JSON.parse(storedUserString);
          if (userData && userData.id) {
            newUserName = userData.name || "Kullanıcı";
            newUserAvatar = userData.avatar || `https://placehold.co/32x32.png?text=${(userData.name || 'U').charAt(0)}`;
            newUserId = userData.id;
            newUserRoleName = userData.role || null; // Ensure role is read
            userFound = true;
          }
        } catch (e) {
          console.error("AdminLayout: Error parsing currentUser from localStorage", e);
          localStorage.removeItem('currentUser');
        }
      }

      setCurrentUserId(newUserId);
      setCurrentUserName(newUserName);
      setCurrentUserAvatar(newUserAvatar);
      setCurrentUserRoleName(newUserRoleName);


      const storedTimeout = localStorage.getItem(SESSION_TIMEOUT_KEY);
      if (storedTimeout) {
        const timeoutValue = parseInt(storedTimeout, 10);
        setSessionTimeoutMinutes(!isNaN(timeoutValue) && timeoutValue > 0 ? timeoutValue : DEFAULT_SESSION_TIMEOUT_MINUTES);
      } else {
        setSessionTimeoutMinutes(DEFAULT_SESSION_TIMEOUT_MINUTES);
      }
    }
    setAuthCheckComplete(true); // Mark auth check as complete
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
            if (isMountedRef.current) setAuthCheckComplete(false); // Reset to allow re-check
            loadUserDataAndSettings();
        }
    };

    const handleCurrentUserUpdated = () => {
        if (isMountedRef.current) setAuthCheckComplete(false); // Reset to allow re-check
        loadUserDataAndSettings();
    };

    const handleSessionTimeoutChanged = () => {
         if (typeof window !== 'undefined') {
            const storedTimeout = localStorage.getItem(SESSION_TIMEOUT_KEY);
            if (storedTimeout) {
                const timeoutValue = parseInt(storedTimeout, 10);
                if(isMountedRef.current) setSessionTimeoutMinutes(!isNaN(timeoutValue) && timeoutValue > 0 ? timeoutValue : DEFAULT_SESSION_TIMEOUT_MINUTES);
            } else {
                if(isMountedRef.current) setSessionTimeoutMinutes(DEFAULT_SESSION_TIMEOUT_MINUTES);
            }
        }
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    if (isMountedRef.current) {
        setCurrentUserId(null);
        setCurrentUserName("Kullanıcı");
        setCurrentUserAvatar("https://placehold.co/32x32.png");
        setCurrentUserRoleName(null);
        setAuthCheckComplete(false); // Reset auth check state
    }
    toast({ title: "Oturum Kapatıldı", description: "Başarıyla çıkış yaptınız." });
    router.replace('/login');
  }, [router]);


  useIdleTimeout({ onIdle: handleLogout, idleTimeInMinutes: sessionTimeoutMinutes });

  React.useEffect(() => {
    if (!authCheckComplete) { // Wait until the initial auth check from localStorage is done
      return;
    }

    const currentPathname = window.location.pathname;
    const isAdminAreaPage = currentPathname.startsWith('/admin');
    const isLoginPage = currentPathname === '/login';
    const isPreviewPage = currentPathname.startsWith('/admin/preview');

    if (isPreviewPage) { // Always allow access to preview pages
        return;
    }

    const isUserAdmin = currentUserId !== null && currentUserRoleName === 'Admin';

    if (isAdminAreaPage && !isLoginPage) { // Trying to access an admin page (that's not login)
      if (!isUserAdmin) { // If not logged in as Admin (covers null user or non-Admin role)
        console.log(`[AdminLayout Effect] User not admin or not logged in. Redirecting to /login. User ID: ${currentUserId}, Role: ${currentUserRoleName}, Path: ${currentPathname}`);
        router.replace('/login');
      }
      // If isUserAdmin, they are allowed on admin pages.
    } else if (isUserAdmin && isLoginPage) { // If Admin is on the login page
      console.log("[AdminLayout Effect] Admin on login page, redirecting to /admin");
      router.replace('/admin');
    }
    // Other cases are handled implicitly:
    // - User not admin (or not logged in), on login page: stays on login.
    // - User not admin (or not logged in), not on admin page: this layout doesn't apply to them.
  }, [authCheckComplete, currentUserId, currentUserRoleName, router]);


  if (currentUserId === undefined || !authCheckComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Yönetim paneli yükleniyor...</p>
      </div>
    );
  }
  
   if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/login' && window.location.pathname !== '/admin/preview' &&
       (currentUserId === null || (currentUserRoleName && currentUserRoleName !== 'Admin'))) {
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
            <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Gösterge Paneli">
                <Link href="/admin">
                <LayoutDashboard />
                <span>Gösterge Paneli</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarGroup className="p-0">
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">İçerik</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Tüm Makaleler">
                            <Link href="/admin/articles">
                            <Newspaper />
                            <span>Makaleler</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Yeni Makale Ekle">
                            <Link href="/admin/articles/new">
                            <PlusCircle />
                            <span>Yeni Makale</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Biyoloji Notları">
                            <Link href="/admin/biyoloji-notlari">
                            <BookCopy />
                            <span>Biyoloji Notları</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Yeni Biyoloji Notu Ekle">
                            <Link href="/admin/biyoloji-notlari/new">
                            <PlusCircle />
                            <span>Yeni Not Ekle</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Ders Yönetimi">
                            <Link href="/admin/dersler">
                            <DerslerIcon />
                            <span>Dersler</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Kategoriler">
                            <Link href="/admin/categories">
                            <Tag />
                            <span>Kategoriler</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Sayfa Yönetimi">
                            <Link href="/admin/pages">
                            <Layers />
                            <span>Sayfa Yönetimi</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="p-0">
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Yönetim</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Kullanıcılar">
                            <Link href="/admin/users">
                            <Users />
                            <span>Kullanıcılar</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Roller">
                            <Link href="/admin/roles">
                            <ShieldCheck />
                            <span>Roller</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="p-0">
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Sistem</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Genel Ayarlar">
                            <Link href="/admin/settings">
                            <Settings />
                            <span>Genel Ayarlar</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Menü Yönetimi">
                            <Link href="/admin/settings/navigation">
                            <MenuSquare />
                            <span>Menü Yönetimi</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Kullanım Kılavuzu">
                    <Link href="/admin/pages/edit/kullanim-kilavuzu">
                       <Layers />
                       <span>Kullanım Kılavuzu</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
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
                    <HomeIcon className="mr-2 h-4 w-4" /> Siteyi Görüntüle
                </Link>
            </Button>
            <ThemeToggle />
            <Link href={currentUserId ? `/admin/profile` : '/login'} passHref>
                <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={currentUserAvatar} alt={currentUserName} data-ai-hint="user avatar placeholder"/>
                    <AvatarFallback>{currentUserName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                </Avatar>
            </Link>
           </div>
         </header>
         <main className="flex-1 p-4 md:p-6 pt-[calc(theme(spacing.14)_+_0.5rem)] md:pt-[calc(theme(spacing.14)_+_1.5rem)]">
             {(currentUserId && currentUserRoleName === 'Admin') ? children : (
                <div className="flex flex-col items-center justify-center h-full">
                    {currentUserId === undefined || !authCheckComplete ? ( // Show loading if auth check not complete
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    ) : ( // Otherwise, imply redirection or already redirected, so no specific message here is needed
                        <p className="text-muted-foreground">Erişim için lütfen giriş yapın veya yönlendiriliyorsunuz...</p>
                    )}
                </div>
             )}
         </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
    
    

    