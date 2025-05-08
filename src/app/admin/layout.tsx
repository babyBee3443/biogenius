
"use client"; // Add "use client" for useState and useEffect

import type { Metadata } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter for logout redirect
import * as React from 'react'; // Import React for state

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
import { LayoutDashboard, Newspaper, Users, Settings, PlusCircle, LogOut, ShieldCheck, MenuSquare, Layers, BookCopy, Tag, Home } from 'lucide-react'; // Added Home icon
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIdleTimeout } from '@/hooks/useIdleTimeout'; // Import the new hook
import { toast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions'; // Import usePermissions hook

// Metadata cannot be dynamic in client components this way.
// export const metadata: Metadata = {
//   title: 'TeknoBiyo Admin',
//   description: 'TeknoBiyo Yönetim Paneli',
// };

const SESSION_TIMEOUT_KEY = 'adminSessionTimeoutMinutes';
const DEFAULT_SESSION_TIMEOUT_MINUTES = 5;


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUserName, setCurrentUserName] = React.useState("Kullanıcı");
  const [currentUserAvatar, setCurrentUserAvatar] = React.useState("https://picsum.photos/seed/default-avatar/32/32");
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = React.useState(DEFAULT_SESSION_TIMEOUT_MINUTES);
  const router = useRouter();
  const { permissions, isLoading: permissionsLoading, error: permissionsError, hasPermission } = usePermissions(); // Use the hook


  const loadUserDataAndSettings = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      // Load User Data
      const storedUserString = localStorage.getItem('currentUser');
      if (storedUserString) {
        try {
          const userData = JSON.parse(storedUserString);
          setCurrentUserName(userData.name || "Kullanıcı");
          setCurrentUserAvatar(userData.avatar || "https://picsum.photos/seed/default-avatar/32/32");
        } catch (e) {
          console.error("Error parsing user data from localStorage", e);
          setCurrentUserName("Kullanıcı"); // Fallback
          setCurrentUserAvatar("https://picsum.photos/seed/default-avatar/32/32");
        }
      } else {
        // If no user in localStorage, redirect to login
        toast({ variant: "destructive", title: "Oturum Yok", description: "Lütfen giriş yapın." });
        router.push('/login');
        return; // Exit early if not logged in
      }

      // Load Session Timeout Setting
      const storedTimeout = localStorage.getItem(SESSION_TIMEOUT_KEY);
      if (storedTimeout) {
        const timeoutValue = parseInt(storedTimeout, 10);
        if (!isNaN(timeoutValue) && timeoutValue > 0) {
          setSessionTimeoutMinutes(timeoutValue);
        } else {
          setSessionTimeoutMinutes(DEFAULT_SESSION_TIMEOUT_MINUTES);
        }
      } else {
        setSessionTimeoutMinutes(DEFAULT_SESSION_TIMEOUT_MINUTES);
      }
    }
  }, [router]);


  React.useEffect(() => {
    // Set document title (alternative for metadata in client components)
    document.title = 'TeknoBiyo Admin';
    loadUserDataAndSettings(); // Load user data and settings on initial mount

    // Listen for custom event to update user data or settings
    const handleStorageChange = () => {
        console.log("Storage change detected, reloading user data and settings.");
        loadUserDataAndSettings();
    };

    window.addEventListener('currentUserUpdated', loadUserDataAndSettings);
    window.addEventListener('storage', handleStorageChange); // Listen for direct localStorage changes from other tabs/windows
    window.addEventListener('sessionTimeoutChanged', loadUserDataAndSettings); // Custom event for timeout setting change


    return () => {
      window.removeEventListener('currentUserUpdated', loadUserDataAndSettings);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sessionTimeoutChanged', loadUserDataAndSettings);
    };
  }, [loadUserDataAndSettings]);

  const handleLogout = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      // Optionally remove other admin-specific session data
    }
    toast({ title: "Oturum Kapatıldı", description: "Başarıyla çıkış yaptınız." });
    router.push('/login');
  }, [router]);


  // Idle Timeout Logic
  const handleIdle = React.useCallback(() => {
    toast({
        variant: "destructive",
        title: "Oturum Zaman Aşımı",
        description: "Uzun süre işlem yapmadığınız için oturumunuz sonlandırıldı. Lütfen tekrar giriş yapın.",
        duration: 7000, // Show for 7 seconds
    });
    handleLogout();
  }, [handleLogout]);

  useIdleTimeout({ onIdle: handleIdle, idleTimeInMinutes: sessionTimeoutMinutes });


  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex flex-col items-center justify-center p-4 mt-2"> {/* Reduced mt-4 to mt-2, added flex-col */}
          {/* Logo SVG */}
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
                <path d="M4 4C4 4 6 12 12 12C18 12 20 20 20 20" />
                <path d="M4 20C4 20 6 12 12 12C18 12 20 4 20 4" />
                <path d="M6.5 7.5L9.5 5.5" />
                <path d="M14.5 18.5L17.5 16.5" />
                <path d="M6.5 16.5L9.5 18.5" />
                <path d="M14.5 5.5L17.5 7.5" />
                <path d="M10 12H14" />
            </svg>
            <span className="font-bold text-lg mt-1.5 group-data-[collapsible=icon]:hidden"> {/* Increased margin-top slightly */}
                TeknoBiyo
            </span>
          </Link>
        </SidebarHeader>

        {/* Welcome User Section */}
        <div className="py-2 text-center group-data-[collapsible=icon]:hidden mt-2"> {/* Added mt-2 for spacing */}
          <span className="font-semibold text-sm text-muted-foreground"> {/* Reduced text-md to text-sm */}
            Hoşgeldiniz
          </span>
          <span className="block font-bold text-md mt-0.5"> {/* Reduced text-lg to text-md, mt-1 to mt-0.5 */}
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
                        {hasPermission('Ayarları Görüntüleme') && ( // Assuming 'Ayarları Görüntüleme' is the permission for general settings
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
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
           <SidebarGroup className="p-0">
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Hesap</SidebarGroupLabel>
                 <SidebarMenu>
                   <SidebarMenuItem>
                     <SidebarMenuButton asChild tooltip="Profil">
                        <Link href={`/admin/profile`}> {/* Dynamically link to current user's profile */}
                          <Avatar className="size-5">
                            <AvatarImage src={currentUserAvatar} alt={currentUserName} />
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
            <Link href={`/admin/profile`} passHref>
              <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8">
                  <Avatar className="size-7">
                    <AvatarImage src={currentUserAvatar} alt={currentUserName} />
                    <AvatarFallback>{currentUserName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                  </Avatar>
              </Button>
            </Link>
           </div>
         </header>
         <main className="flex-1 p-4 md:p-6 pt-[calc(theme(spacing.14)+theme(spacing.6))] md:pt-[calc(theme(spacing.14)+theme(spacing.6))]"> {/* Adjusted padding-top */}
            {permissionsLoading ? <div>İzinler yükleniyor...</div> : children}
         </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
