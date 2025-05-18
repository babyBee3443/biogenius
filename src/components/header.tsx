
"use client";

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Menu, Search, X, BookCopy, ShieldCheck, LogIn, UserPlus, UserCircle, Settings, LogOut as LogOutIcon, Home as HomeIcon, Microscope, ChevronDown, FileText as DerslerIcon } from 'lucide-react';
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
  const mockData: ArticleStub[] = [
    { id: 'gen-duzenleme', title: 'Gen Düzenleme Teknolojileri', category: 'Biyoloji' },
    { id: 'mikrobiyom', title: 'Mikrobiyom: İçimizdeki Dünya', category: 'Biyoloji' },
    { id: 'hucre-dongusu', title: 'Hücre Döngüsü ve Kontrol Noktaları', category: 'Biyoloji' },
    { id: 'protein-sentezi', title: 'Protein Sentezi: Transkripsiyon ve Translasyon', category: 'Biyoloji' },
  ];
  return mockData.filter(article =>
    (article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.category.toLowerCase().includes(query.toLowerCase())) &&
    article.category === 'Biyoloji'
  ).slice(0, 5);
};


const DnaLogo = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [baseAmplitudes, setBaseAmplitudes] = React.useState<number[]>([]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
        setBaseAmplitudes(Array(7).fill(0).map(() => 10 + Math.random() * 4 - 2)); // Initial random amplitudes

        const intervalId = setInterval(() => {
            setBaseAmplitudes(prevAmplitudes =>
                prevAmplitudes.map(amp => 10 + Math.random() * 4 - 2) // Continuously update for subtle movement
            );
        }, 200); // Update every 200ms for a smooth, subtle "breathing" effect
        return () => clearInterval(intervalId);
    }, []);


    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="h-10 w-10 group-hover:animate-spin-slow mr-0"
    >
        <defs>
            <linearGradient id="dnaGradientHeader" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))">
                    <animate attributeName="stop-color" values="hsl(175 80% 30%);hsl(145 60% 40%);hsl(175 80% 30%)" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="hsl(145 75% 45%)">
                    <animate attributeName="stop-color" values="hsl(145 75% 45%);hsl(175 80% 30%);hsl(145 75% 45%)" dur="4s" repeatCount="indefinite" />
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
                    dur="12s" // Slower rotation
                    repeatCount="indefinite"
                />
                <animate attributeName="stroke-width" values="5;6;5" dur="3.5s" repeatCount="indefinite" />
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
                    dur="12s" // Slower rotation
                    repeatCount="indefinite"
                />
                <animate attributeName="stroke-width" values="5;6;5" dur="3.5s" repeatCount="indefinite" begin="0.3s" />
            </path>
            {baseAmplitudes.map((amplitude, i) => {
                const yPos = -35 + i * (70 / 6);
                const angle = (i * Math.PI) / 3.5;
                const x1 = Math.sin(angle) * amplitude;
                const x2 = Math.sin(angle + Math.PI) * amplitude;
                return (
                    <line
                        key={`header-dna-base-${i}`}
                        x1={x1}
                        y1={yPos}
                        x2={x2}
                        y2={yPos}
                        strokeWidth="2.5" // Slightly thinner bases
                        strokeLinecap="round"
                        className="stroke-green-500/40 dark:stroke-green-400/20" // Softer colors
                    >
                         <animate
                            attributeName="stroke"
                            values="hsl(var(--primary)/0.4);hsl(145 80% 40% / 0.6);hsl(145 75% 45% / 0.4);hsl(var(--primary)/0.4)"
                            dur="6s" // Slower color animation
                            repeatCount="indefinite"
                            begin={`${i * 0.25}s`}
                        />
                         <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite" begin={`${i*0.2}s`} />
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 0 0"
                            to="360 0 0"
                            dur="12s" // Slower rotation
                            repeatCount="indefinite"
                        />
                    </line>
                );
            })}
        </g>
    </svg>
    );
};


const Header = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<ArticleStub[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();

  const [isLessonsPopoverOpen, setIsLessonsPopoverOpen] = React.useState(false);
  const lessonsPopoverEnterTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const lessonsPopoverLeaveTimerRef = React.useRef<NodeJS.Timeout | null>(null);


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
    setIsSearchPopoverOpen(searchQuery.length > 0);
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
    setIsSearchPopoverOpen(false);
  };

   const closeSearchPopover = () => {
    setIsSearchPopoverOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }

  const handleLoginSuccess = () => {
    checkUserStatus();
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    setCurrentUser(null);
    window.dispatchEvent(new CustomEvent('currentUserUpdated'));
    toast({ title: "Çıkış Başarılı", description: "Başarıyla çıkış yaptınız." });
    router.replace('/');
  };

  const handleCreateAccountSuccess = () => {
    checkUserStatus();
    setIsCreateAccountModalOpen(false);
    setTimeout(() => setIsLoginModalOpen(true), 100);
  };

  const openCreateAccountModal = () => {
    setIsLoginModalOpen(false);
    setIsCreateAccountModalOpen(true);
  };

  const openLoginModalFromCreate = () => {
    setIsCreateAccountModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleLessonsMouseEnter = () => {
    if (lessonsPopoverLeaveTimerRef.current) {
      clearTimeout(lessonsPopoverLeaveTimerRef.current);
      lessonsPopoverLeaveTimerRef.current = null;
    }
    lessonsPopoverEnterTimerRef.current = setTimeout(() => {
      setIsLessonsPopoverOpen(true);
    }, 150); // Slightly longer delay to open
  };

  const handleLessonsMouseLeave = () => {
    if (lessonsPopoverEnterTimerRef.current) {
      clearTimeout(lessonsPopoverEnterTimerRef.current);
      lessonsPopoverEnterTimerRef.current = null;
    }
    lessonsPopoverLeaveTimerRef.current = setTimeout(() => {
      setIsLessonsPopoverOpen(false);
    }, 300); // Slightly longer delay to close
  };


  const navItems = [
    { href: "/", label: "Anasayfa", icon: <HomeIcon className="h-4 w-4" /> },
    {
      label: "Dersler",
      href: "/dersler", // Main link for the Popover/Dropdown trigger
      icon: <DerslerIcon className="h-4 w-4" />,
      isPopover: true, // Indicate this item should use Popover on desktop
      subItems: [
        { href: "/dersler/9-sinif", label: "9. Sınıf" },
        { href: "/dersler/10-sinif", label: "10. Sınıf" },
        { href: "/dersler/11-sinif", label: "11. Sınıf" },
        { href: "/dersler/12-sinif", label: "12. Sınıf" },
      ]
    },
    { href: "/biyoloji-notlari", label: "Biyoloji Notları", icon: <BookCopy className="h-4 w-4" /> },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
  ];

  const getCategoryClass = (category: string): string => {
     const lowerCaseName = category.toLowerCase();
     if (lowerCaseName.includes('biyoloji') || lowerCaseName.includes('genetik') || lowerCaseName.includes('hücre')) {
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
     }
     return 'bg-muted text-muted-foreground';
  }


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center group">
            <DnaLogo />
             <div className="flex flex-col items-start ml-1 -mt-1">
                <span className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">BiyoHox</span>
                <span className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors leading-tight -mt-0.5">
                    Öğrenmenin DNA’sı
                </span>
            </div>
          </Link>

          <nav className="hidden md:flex flex-1 items-center space-x-1">
            {navItems.map((item) =>
              item.isPopover ? (
                <Popover key={item.label} open={isLessonsPopoverOpen} onOpenChange={setIsLessonsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 flex items-center"
                      onMouseEnter={handleLessonsMouseEnter}
                      onMouseLeave={handleLessonsMouseLeave}
                      onClick={() => setIsLessonsPopoverOpen(prev => !prev)} // Toggle on click
                    >
                      {item.icon && <span className="mr-1.5">{item.icon}</span>}
                      <span className="capitalize">{item.label}</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-64 p-4 shadow-xl rounded-lg border border-border/50 bg-card text-card-foreground"
                    align="start"
                    onMouseEnter={handleLessonsMouseEnter} // Keep open if mouse enters content
                    onMouseLeave={handleLessonsMouseLeave} // Close if mouse leaves content
                  >
                    <div className="grid gap-3">
                        <p className="text-sm text-muted-foreground px-1">Farklı seviyelerdeki biyoloji derslerini keşfedin.</p>
                        <div className="grid grid-cols-2 gap-2">
                           {item.subItems?.map(subItem => (
                             <Link
                               key={subItem.href}
                               href={subItem.href}
                               className="block rounded-md p-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                               onClick={() => setIsLessonsPopoverOpen(false)}
                              >
                               {subItem.label}
                             </Link>
                           ))}
                        </div>
                        <DropdownMenuSeparator />
                        <Link
                           href="/dersler"
                           className="block rounded-md p-2 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground transition-colors"
                           onClick={() => setIsLessonsPopoverOpen(false)}
                         >
                           Tüm Dersler
                         </Link>
                        <DropdownMenuSeparator />
                        <div className="px-1">
                            <p className="text-xs font-semibold text-muted-foreground mb-1.5">Popüler Kurslar</p>
                            <Link href="#" className="block text-xs text-foreground hover:underline mb-1" onClick={() => {setIsLessonsPopoverOpen(false); toast({title:"Yakında!"})}}>Hücrenin Temelleri (Yakında)</Link>
                            <Link href="#" className="block text-xs text-foreground hover:underline" onClick={() => {setIsLessonsPopoverOpen(false); toast({title:"Yakında!"})}}>Genetik Bilimine Giriş (Yakında)</Link>
                        </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Link href={item.href} key={item.href} passHref legacyBehavior>
                     <Button
                        variant="ghost"
                        className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 flex items-center"
                        as="a"
                     >
                       {item.icon && <span className="mr-1.5">{item.icon}</span>}
                       <span className="capitalize">{item.label}</span>
                     </Button>
                </Link>
              )
            )}
          </nav>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <div className="hidden md:flex items-center space-x-2">
              <Popover open={isSearchPopoverOpen} onOpenChange={setIsSearchPopoverOpen}>
                <PopoverTrigger asChild>
                   <div className="relative w-full max-w-[150px] sm:max-w-[180px]">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Ara..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-9 pr-8 h-9 rounded-md bg-secondary/70 border-transparent focus:bg-background focus:border-border" // Adjusted for better contrast
                        onFocus={() => setIsSearchPopoverOpen(true)}
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
                    onOpenAutoFocus={(e) => e.preventDefault()}
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
                                    onClick={closeSearchPopover}
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

               {isMounted && currentUser && (currentUser.role === 'Admin') && (
                    <Button variant="outline" size="sm" asChild className="ml-1 shrink-0">
                       <Link href="/admin" passHref>
                          <ShieldCheck className="mr-1.5 h-4 w-4" />
                          <span className="hidden sm:inline">Admin Paneli</span>
                          <span className="sm:hidden">Admin</span>
                      </Link>
                  </Button>
               )}
              {isMounted && currentUser && (currentUser.role !== 'Admin') && (
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
              {isMounted && !currentUser && (
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
                                <div className="flex flex-col items-start ml-1 -mt-1">
                                    <span className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">BiyoHox</span>
                                     <span className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors leading-tight -mt-0.5">
                                        Öğrenmenin DNA’sı
                                    </span>
                                </div>
                            </Link>
                        </div>
                   </SheetClose>
                  <ScrollArea className="h-[calc(100vh-65px)]">
                    <div className="p-6 space-y-4">
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
                                            onClick={closeSearchPopover}
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
                          item.isPopover && item.subItems ? ( // Use isPopover to identify it as a Dropdown in mobile
                            <DropdownMenu key={`mobile-${item.label}`}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="justify-start flex items-center gap-2 text-base w-full px-3 py-2"
                                >
                                  {item.icon}
                                  <span className="capitalize flex-grow text-left">{item.label}</span>
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-[calc(100%-2rem)] ml-3 mr-3">
                                <DropdownMenuLabel>{item.label} Seviyeleri</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {item.subItems.map(subItem => (
                                  <SheetClose asChild key={`mobile-sub-${subItem.href}`}>
                                    <DropdownMenuItem asChild>
                                      <Link href={subItem.href}>{subItem.label}</Link>
                                    </DropdownMenuItem>
                                  </SheetClose>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
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
                          )
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
