
import type { Metadata } from 'next';
import Link from 'next/link';
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

export const metadata: Metadata = {
  title: 'TeknoBiyo Admin',
  description: 'TeknoBiyo Yönetim Paneli',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex items-center justify-center p-2"> {/* Centered the logo */}
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
          {/* TeknoBiyo text moved out of here */}
        </SidebarHeader>

        {/* Moved TeknoBiyo text here, below the logo and above the menu */}
        <div className="py-4 text-center group-data-[collapsible=icon]:hidden"> {/* Increased py-2 to py-4 */}
          <span className="font-bold text-lg">
            TeknoBiyo
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
                            <AvatarImage src="https://picsum.photos/seed/admin-avatar/32/32" alt="Admin" />
                            <AvatarFallback>AD</AvatarFallback>
                          </Avatar>
                          <span>Admin User</span>
                        </Link>
                     </SidebarMenuButton>
                   </SidebarMenuItem>
                    <SidebarMenuItem>
                     <SidebarMenuButton asChild tooltip="Çıkış Yap">
                        <Link href="/login">
                           <LogOut />
                           <span>Çıkış Yap</span>
                        </Link>
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
                   <AvatarImage src="https://picsum.photos/seed/admin-avatar/32/32" alt="Admin" />
                   <AvatarFallback>AD</AvatarFallback>
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

