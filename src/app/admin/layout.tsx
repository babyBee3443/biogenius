
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
  // SidebarGroupContent, // This was correctly removed in a previous step, ensuring it stays removed.
} from '@/components/ui/sidebar';
import { LayoutDashboard, Newspaper, Users, Settings, PlusCircle, LogOut, ShieldCheck, MenuSquare, Layers, BookCopy, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { ThemeToggle } from '@/components/theme-toggle'; // Removed as per user request
// import { Card, CardContent } from '@/components/ui/card'; // This was unused

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
        <SidebarHeader className="items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5" // Adjusted from 2 to 1.5 for a slightly thinner look
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7 text-primary flex-shrink-0 group-data-[collapsible=icon]:ml-1 animate-spin-slow"
          >
            {/* More biology-themed paths - e.g. a stylized leaf or DNA strand */}
            <path d="M12 22A10 10 0 0 0 12 2" />
            <path d="M12 2a10 10 0 0 0-7.07 17.07" />
            <path d="M12 2a10 10 0 0 1 7.07 17.07" />
            <path d="M2 12A10 10 0 0 0 12 22" />
            <path d="M22 12a10 10 0 0 0-10 10" />
            <path d="M17.07 7.07A5 5 0 0 0 12 4.07" />
            <path d="M7.07 7.07A5 5 0 0 1 12 4.07" />
            <path d="M4.07 12A5 5 0 0 0 7.07 17.07" />
            <path d="M19.93 12a5 5 0 0 1-2.93 4.93" />
          </svg>
          <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
            TeknoBiyo
          </span>
        </SidebarHeader>
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
              {/* <SidebarGroupContent> - This component is not defined and was removed. The content is directly in SidebarMenu. */}
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
             {/* </SidebarGroupContent> */}
            </SidebarGroup>

            <SidebarGroup className="p-0">
               <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Yönetim</SidebarGroupLabel>
               {/* <SidebarGroupContent> */}
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
               {/* </SidebarGroupContent> */}
            </SidebarGroup>

             <SidebarGroup className="p-0">
               <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Sistem</SidebarGroupLabel>
               {/* <SidebarGroupContent> */}
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
              {/* </SidebarGroupContent> */}
             </SidebarGroup>

          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
           <SidebarGroup className="p-0">
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Hesap</SidebarGroupLabel>
              {/* <SidebarGroupContent> */}
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
               {/* </SidebarGroupContent> */}
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
         {/* Adjusted padding: pt-16 (h-14 for header + 0.5rem extra) ensures content starts below the header. */}
         {/* On medium screens and up, the padding will be pt-[calc(3.5rem+1.5rem)] = pt-20 */}
         <main className="flex-1 p-4 md:p-6 pt-[calc(3.5rem+1rem)] md:pt-[calc(3.5rem+1.5rem)]">
            {children}
         </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
