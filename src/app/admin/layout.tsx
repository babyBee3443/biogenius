
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
import { LayoutDashboard, Newspaper, Users, Settings } from 'lucide-react'; // Icons for navigation
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';

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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7 text-primary flex-shrink-0 group-data-[collapsible=icon]:ml-1"
          >
            <path d="M12 2 L12 6" />
            <path d="M12 18 L12 22" />
            <path d="M4.93 4.93 L7.76 7.76" />
            <path d="M16.24 16.24 L19.07 19.07" />
            <path d="M2 12 L6 12" />
            <path d="M18 12 L22 12" />
            <path d="M4.93 19.07 L7.76 16.24" />
            <path d="M16.24 7.76 L19.07 4.93" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
            TeknoBiyo
          </span>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={true} tooltip="Gösterge Paneli">
                <Link href="/admin">
                  <LayoutDashboard />
                  <span>Gösterge Paneli</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Makaleler">
                <Link href="/admin/articles">
                  <Newspaper />
                  <span>Makaleler</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Kullanıcılar">
                <Link href="/admin/users">
                  <Users />
                  <span>Kullanıcılar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Ayarlar">
                <Link href="/admin/settings">
                  <Settings />
                  <span>Ayarlar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
           <SidebarGroup className="p-0">
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Hesap</SidebarGroupLabel>
              <SidebarGroupContent>
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
                 </SidebarMenu>
              </SidebarGroupContent>
           </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
         {/* Header for mobile and top bar content */}
         <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:justify-end">
           <SidebarTrigger className="md:hidden" />
           {/* Add other header elements like search or user menu here if needed */}
           <div className="flex items-center gap-2">
             <ThemeToggle />
             {/* Example User Dropdown Trigger */}
             <Button variant="ghost" size="icon" className="rounded-full border w-8 h-8">
                <Avatar className="size-7">
                   <AvatarImage src="https://picsum.photos/seed/admin-avatar/32/32" alt="Admin" />
                   <AvatarFallback>AD</AvatarFallback>
                 </Avatar>
             </Button>
           </div>
         </header>
         <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
