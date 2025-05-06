
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
import { LayoutDashboard, Newspaper, Users, Settings, PlusCircle, LogOut, ShieldCheck, MenuSquare, Layers, BookCopy, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Metadata cannot be dynamic in client components this way.
// export const metadata: Metadata = {
//   title: 'TeknoBiyo Admin',
//   description: 'TeknoBiyo Yönetim Paneli',
// };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUserName, setCurrentUserName] = React.useState("Kullanıcı");
  const [currentUserAvatar, setCurrentUserAvatar] = React.useState("https://picsum.photos/seed/default-avatar/32/32");
  const router = useRouter();

  React.useEffect(() => {
    // Set document title (alternative for metadata in client components)
    document.title = 'TeknoBiyo Admin';
    
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setCurrentUserName(userData.name || "Kullanıcı");
          setCurrentUserAvatar(userData.avatar || "https://picsum.photos/seed/default-avatar/32/32");
        } catch (e) {
          console.error("Error parsing user data from localStorage", e);
          setCurrentUserName("Kullanıcı"); // Fallback
          setCurrentUserAvatar("https://picsum.photos/seed/default-avatar/32/32");
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    router.push('/login');
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex items-center justify-center p-4 mt-4">
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
        </SidebarHeader>

        <div className="py-4 text-center group-data-[collapsible=icon]:hidden">
          <span className="font-semibold text-md text-muted-foreground">
            Hoşgeldiniz
          </span>
          <span className="block font-bold text-lg mt-1">
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

          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
           <SidebarGroup className="p-0">
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Hesap</SidebarGroupLabel>
                 <SidebarMenu>
                   <SidebarMenuItem>
                     <SidebarMenuButton asChild tooltip="Profil">
                        <Link href="/admin/profile">
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
                        {/* Link removed as onClick is handled directly by Button */}
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
             <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8">
                <Avatar className="size-7">
                   <AvatarImage src={currentUserAvatar} alt={currentUserName} />
                   <AvatarFallback>{currentUserName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                 </Avatar>
             </Button>
           </div>
         </header>
         <main className="flex-1 p-4 md:p-6 pt-[calc(3.5rem+1rem)] md:pt-[calc(3.5rem+1.5rem)]">
            {children}
         </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
