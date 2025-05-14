
"use client";

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Menu, Search, X, BookCopy, ShieldCheck, LogIn, UserPlus, UserCircle, Settings, LogOut as LogOutIcon, Home as HomeIcon, Microscope } from 'lucide-react';
import * as React from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { LoginModal } from '@/components/login-modal';
import { CreateAccountModal } from '@/components/create-account-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


interface ArticleStub {
  id: string;
  title: string;
  category: string;
}

const searchArticles = async (query: string): Promise<ArticleStub[]> => {
  if (!query) return [];
  // This is mock data. In a real application, you'd fetch this from your backend.
  const mockData: ArticleStub[] = [
    // Only Biyoloji articles are relevant for the main site search now
    { id: 'gen-duzenleme', title: 'Gen Düzenleme Teknolojileri', category: 'Biyoloji' },
    { id: 'mikrobiyom', title: 'Mikrobiyom: İçimizdeki Dünya', category: 'Biyoloji' },
    { id: 'hucre-dongusu', title: 'Hücre Döngüsü ve Kontrol Noktaları', category: 'Biyoloji' },
    { id: 'protein-sentezi', title: 'Protein Sentezi: Transkripsiyon ve Translasyon', category: 'Biyoloji' },
  ];
  return mockData.filter(article =>
    (article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.category.toLowerCase().includes(query.toLowerCase())) &&
    article.category === 'Biyoloji' // Ensure only biology articles are searched
  ).slice(0, 5);
};


const DnaLogo = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="h-10 w-10 group-hover:animate-spin-slow mr-0"
    >
        <defs>
            <linearGradient id="dnaGradientHeader" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))">
                    <animate attributeName="stop-color" values="hsl(var(--primary));hsl(145 60% 40%);hsl(var(--primary))" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="hsl(145 75% 45%)">
                    <animate attributeName="stop-color" values="hsl(145 75% 45%);hsl(var(--primary));hsl(145 75% 45%)" dur="4s" repeatCount="indefinite" />
                </stop>
            </linearGradient>
        </defs>
        <g transform="translate(50,50) scale(0.9) rotate(15)">
            <path
                d="M0,-40 Q 20,-20 0,0 Q -20,20 0,40"
                stroke="url(#dnaGradientHeader)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 0 0"
                    to="360 0 0"
                    dur="10s"
                    repeatCount="indefinite"
                />
                <animate attributeName="stroke-width" values="5;7;5" dur="3s" repeatCount="indefinite" />
            </path>
            <path
                d="M0,-40 Q -20,-20 0,0 Q 20,20 0,40"
                stroke="url(#dnaGradientHeader)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 0 0"
                    to="360 0 0"
                    dur="10s"
                    repeatCount="indefinite"
                />
                <animate attributeName="stroke-width" values="5;7;5" dur="3s" repeatCount="indefinite" begin="0.5s" />
            </path>
            {[...Array(7)].map((_, i) => {
                const yPos = -35 + i * (70 / 6);
                const angle = (i * Math.PI) / 3.5;
                const amplitude = 10 + (i % 2 === 0 ? Math.sin(Date.now() / 700 + i * 0.5) * 2 : Math.cos(Date.now() / 700 + i * 0.5) * 2);
                const x1 = Math.sin(angle) * amplitude;
                const x2 = Math.sin(angle + Math.PI) * amplitude;
                return (
                    <line
                        key={`header-dna-base-${i}`}
                        x1={x1}
                        y1={yPos}
                        x2={x2}
                        y2={yPos}
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="stroke-green-500/50 dark:stroke-green-400/30"
                    >
                         <animate
                            attributeName="stroke"
                            values="hsl(var(--primary)/0.5);hsl(145 80% 40% / 0.7);hsl(145 75% 45% / 0.5);hsl(var(--primary)/0.5)"
                            dur="5s"
                            repeatCount="indefinite"
                            begin={`${i * 0.2}s`}
                        />
                         <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" begin={`${i*0.15}s`} />
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 0 0"
                            to="360 0 0"
                            dur="10s"
                            repeatCount="indefinite"
                        />
                    </line>
                );
            })}
        </g>
    </svg>
);


const Header = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<ArticleStub[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();


  const checkUserStatus = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
        } catch (e) {
          console.error("Error parsing current user from localStorage in Header", e);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    }
  }, []);

  React.useEffect(() => {
    setIsMounted(true);
    checkUserStatus();

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'currentUser') {
            console.log("Header: 'currentUser' changed in localStorage (another tab), checking user status.");
            checkUserStatus();
        }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('currentUserUpdated', checkUserStatus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('currentUserUpdated', checkUserStatus);
    };
  }, [checkUserStatus]);


  React.useEffect(() => {
    setIsPopoverOpen(searchQuery.length > 0);
    const handler = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        const results = await searchArticles(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsPopoverOpen(false);
  };

   const closePopover = () => {
    setIsPopoverOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }

  const handleLoginSuccess = () => {
    checkUserStatus(); // Re-check user status to update header
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    setCurrentUser(null);
    window.dispatchEvent(new CustomEvent('currentUserUpdated')); // Notify other components
    toast({ title: "Çıkış Başarılı", description: "Başarıyla çıkış yaptınız." });
    router.replace('/'); // Redirect to home on logout
  };

  const handleCreateAccountSuccess = () => {
    checkUserStatus(); // Re-check user status
    setIsCreateAccountModalOpen(false);
    // Optionally open login modal after successful account creation
    setTimeout(() => setIsLoginModalOpen(true), 100);
  };

  const openCreateAccountModal = () => {
    setIsLoginModalOpen(false); // Close login modal if open
    setIsCreateAccountModalOpen(true);
  };

  const openLoginModalFromCreate = () => {
    setIsCreateAccountModalOpen(false);
    setIsLoginModalOpen(true);
  };


  const navItems = [
    { href: "/", label: "Anasayfa", icon: <HomeIcon className="h-4 w-4" /> },
    { href: "/biyoloji-notlari", label: "Biyoloji Notları", icon: <BookCopy className="h-4 w-4" /> },
    { href: "/biyolojide-neler-oluyor", label: "Biyolojide Neler Oluyor?", icon: <Microscope className="h-4 w-4" /> },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
  ];

  const getCategoryClass = (category: string): string => {
     const lowerCaseName = category.toLowerCase();
     if (lowerCaseName.includes('biyoloji') || lowerCaseName.includes('genetik') || lowerCaseName.includes('hücre')) {
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
     }
     // Fallback or other category styles
     return 'bg-muted text-muted-foreground';
  }


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center group">
            <DnaLogo />
             <div className="flex flex-col items-start ml-1 -mt-0.5">
                <span className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">BiyoHox</span>
                <span className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors leading-tight -mt-0.5">
                    Öğrenmenin DNA’sı
                </span>
            </div>
          </Link>

          <nav className="hidden md:flex flex-1 items-center space-x-1">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href} passHref legacyBehavior>
                   <Button
                      variant="ghost"
                      className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      as="a"
                   >
                     <span className="capitalize">{item.label}</span>
                   </Button>
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end space-x-2">
            {/* Desktop Search, Theme Toggle, Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                   <div className="relative w-full max-w-[80px] sm:max-w-[100px]"> {/* Reduced max-width */}
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Ara..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-9 pr-8 h-9 rounded-full bg-secondary/70 border-transparent focus:bg-background focus:border-border"
                        onFocus={() => setIsPopoverOpen(true)}
                      />
                      {searchQuery && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 right-1 transform -translate-y-1/2 h-7 w-7 rounded-full"
                            onClick={clearSearch}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                   </div>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[280px] sm:w-[300px] p-2 mt-1 rounded-lg shadow-lg border border-border/50"
                    align="end"
                    onOpenAutoFocus={(e) => e.preventDefault()} // Prevent auto-focus on popover content
                 >
                  {isSearching && searchQuery && (
                     <div className="p-4 text-sm text-center text-muted-foreground">Aranıyor...</div>
                  )}
                   {!isSearching && searchQuery && searchResults.length === 0 && (
                      <div className="p-4 text-sm text-center text-muted-foreground">"{searchQuery}" için sonuç bulunamadı.</div>
                   )}
                  {!isSearching && searchResults.length > 0 && searchQuery && (
                    <ScrollArea className="max-h-[300px]">
                       <ul className="space-y-1">
                         {searchResults.map((result) => (
                            <li key={result.id}>
                                <Link
                                    href={`/articles/${result.id}`}
                                    className="flex items-center justify-between p-3 rounded-md hover:bg-accent transition-colors"
                                    onClick={closePopover} // Close popover on link click
                                 >
                                   <span className="text-sm font-medium truncate mr-2">{result.title}</span>
                                   <Badge variant="secondary" className={cn(getCategoryClass(result.category), "capitalize text-xs font-normal whitespace-nowrap")}>
                                       {result.category}
                                   </Badge>
                               </Link>
                           </li>
                         ))}
                       </ul>
                    </ScrollArea>
                  )}
                </PopoverContent>
              </Popover>

              <ThemeToggle />

               {isMounted && currentUser && (currentUser.role === 'Admin') && ( // Show Admin Paneli only for Admin
                    <Button variant="outline" size="sm" asChild className="ml-1 shrink-0">
                       <Link href="/admin" passHref>
                          <ShieldCheck className="mr-1.5 h-4 w-4" />
                          <span className="hidden sm:inline">Admin Paneli</span>
                          <span className="sm:hidden">Admin</span>
                      </Link>
                  </Button>
               )}
              {isMounted && currentUser && (currentUser.role !== 'Admin') && ( // User profile dropdown for non-Admins
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-2">
                              <Avatar className="h-8 w-8">
                                  <AvatarImage src={currentUser.avatar || `https://placehold.co/32x32.png?text=${(currentUser.name || 'U').charAt(0)}`} alt={currentUser.name || 'Kullanıcı'} data-ai-hint="user avatar placeholder"/>
                                  <AvatarFallback>{(currentUser.name || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                          <DropdownMenuLabel className="font-normal">
                              <div className="flex flex-col space-y-1">
                                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                                  <p className="text-xs leading-none text-muted-foreground">
                                      @{currentUser.username}
                                  </p>
                              </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                              <Link href="/profile">
                                  <UserCircle className="mr-2 h-4 w-4" />
                                  Profilim
                              </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast({ title: "Yakında!", description: "Kullanıcı ayarları yakında aktif olacak." })}>
                              <Settings className="mr-2 h-4 w-4" />
                              Ayarlarım
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleLogout}>
                              <LogOutIcon className="mr-2 h-4 w-4" />
                              Çıkış Yap
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              )}
              {isMounted && !currentUser && ( // Show Login/Register if no user
                   <>
                     <Button variant="outline" size="sm" onClick={() => setIsLoginModalOpen(true)} className="ml-1 shrink-0">
                        <LogIn className="mr-1.5 h-4 w-4" />
                        Giriş Yap
                    </Button>
                    <Button variant="default" size="sm" onClick={openCreateAccountModal} className="ml-1 shrink-0">
                        <UserPlus className="mr-1.5 h-4 w-4" />
                        Kayıt Ol
                    </Button>
                   </>
              )}
            </div>


            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menüyü Aç</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[300px] p-0">
                   <SheetClose asChild>
                        <div className="flex items-center p-4 border-b">
                            <Link href="/" className="flex items-center group">
                                <DnaLogo />
                                <div className="flex flex-col items-start ml-1 -mt-0.5">
                                    <span className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">BiyoHox</span>
                                     <span className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors leading-tight -mt-0.5">
                                        Öğrenmenin DNA’sı
                                    </span>
                                </div>
                            </Link>
                        </div>
                   </SheetClose>
                  <ScrollArea className="h-[calc(100vh-65px)]"> {/* Adjust height considering header */}
                    <div className="p-6 space-y-4">
                       {/* Mobile Search */}
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input
                             type="text"
                             placeholder="Ara..."
                             value={searchQuery}
                             onChange={handleSearchChange}
                             className="pl-9 pr-8 h-10 rounded-md bg-secondary/70 border-border/50 focus:bg-background focus:border-primary"
                           />
                           {searchQuery && (
                               <Button
                                 variant="ghost"
                                 size="icon"
                                 className="absolute top-1/2 right-1 transform -translate-y-1/2 h-7 w-7 rounded-full"
                                 onClick={clearSearch}
                               >
                                 <X className="h-4 w-4" />
                               </Button>
                             )}
                         </div>
                         {isSearching && searchQuery && (
                            <div className="p-2 text-sm text-center text-muted-foreground">Aranıyor...</div>
                         )}
                          {!isSearching && searchQuery && searchResults.length === 0 && (
                             <div className="p-2 text-sm text-center text-muted-foreground">"{searchQuery}" için sonuç bulunamadı.</div>
                          )}
                         {!isSearching && searchResults.length > 0 && searchQuery && (
                           <ul className="space-y-1 border-t border-border/30 pt-2 mt-2">
                             {searchResults.map((result) => (
                                <li key={result.id}>
                                    <SheetClose asChild>
                                        <Link
                                            href={`/articles/${result.id}`}
                                            className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors text-sm"
                                            onClick={closePopover} // Ensure popover closes when an item is clicked
                                         >
                                           <span className="font-medium truncate mr-2">{result.title}</span>
                                           <Badge variant="secondary" className={cn(getCategoryClass(result.category), "capitalize text-xs font-normal whitespace-nowrap")}>
                                               {result.category}
                                           </Badge>
                                       </Link>
                                    </SheetClose>
                               </li>
                             ))}
                           </ul>
                         )}

                      <nav className="flex flex-col space-y-1 border-t border-border/30 pt-4">
                        {navItems.map((item) => (
                          <SheetClose asChild key={`mobile-${item.href}`}>
                            <Link href={item.href} passHref legacyBehavior>
                                 <Button
                                    variant="ghost"
                                    className="justify-start flex items-center gap-2 text-base w-full px-3 py-2"
                                     as="a"
                                 >
                                   {item.icon}
                                   <span className="capitalize">{item.label}</span>
                                 </Button>
                             </Link>
                           </SheetClose>
                        ))}
                      </nav>

                      <div className="border-t border-border/30 pt-4 space-y-3">
                        {isMounted && currentUser && (currentUser.role === 'Admin') && (
                           <SheetClose asChild>
                              <Button variant="outline" asChild className="w-full">
                                  <Link href="/admin">
                                      <ShieldCheck className="mr-2 h-4 w-4" />
                                      Admin Paneli
                                  </Link>
                              </Button>
                            </SheetClose>
                         )}
                         {isMounted && currentUser && currentUser.role !== 'Admin' && (
                            <>
                              <SheetClose asChild>
                                  <Button variant="ghost" asChild className="justify-start flex items-center gap-2 text-base w-full px-3 py-2">
                                      <Link href="/profile">
                                          <UserCircle className="mr-2 h-4 w-4" /> Profilim
                                      </Link>
                                  </Button>
                              </SheetClose>
                               <SheetClose asChild>
                                 <Button variant="ghost" onClick={handleLogout} className="justify-start flex items-center gap-2 text-base w-full text-destructive hover:text-destructive px-3 py-2">
                                    <LogOutIcon className="mr-2 h-4 w-4" /> Çıkış Yap
                                 </Button>
                               </SheetClose>
                            </>
                         )}
                         {isMounted && !currentUser && (
                           <>
                            <SheetClose asChild>
                               <Button variant="outline" onClick={() => { setIsLoginModalOpen(true); }} className="w-full">
                                   <LogIn className="mr-2 h-4 w-4" />
                                   Giriş Yap
                               </Button>
                            </SheetClose>
                            <SheetClose asChild>
                               <Button variant="default" onClick={() => { openCreateAccountModal(); }} className="w-full">
                                   <UserPlus className="mr-2 h-4 w-4" />
                                   Hesap Oluştur
                               </Button>
                            </SheetClose>
                           </>
                         )}
                         <div className="pt-2 flex justify-center">
                            <ThemeToggle />
                         </div>
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} onLoginSuccess={handleLoginSuccess} openCreateAccount={openCreateAccountModal} />
      <CreateAccountModal isOpen={isCreateAccountModalOpen} setIsOpen={setIsCreateAccountModalOpen} onAccountCreateSuccess={handleCreateAccountSuccess} openLogin={openLoginModalFromCreate} />
    </>
  );
};

export default Header;
