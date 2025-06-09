
"use client";

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Menu, Search, X, BookCopy, ShieldCheck, LogIn, UserPlus, UserCircle, Settings, LogOut as LogOutIcon, Home as HomeIcon, Microscope, ChevronDown, FileText as DerslerIcon, Newspaper } from 'lucide-react';
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
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
  // This is still mock data. In a real app, this would be an API call.
  const mockData: ArticleStub[] = [
    { id: 'gen-duzenleme', title: 'Gen Düzenleme Teknolojileri', category: 'Biyoloji' },
    { id: 'mikrobiyom', title: 'Mikrobiyom: İçimizdeki Dünya', category: 'Biyoloji' },
    { id: 'hucre-dongusu', title: 'Hücre Döngüsü ve Kontrol Noktaları', category: 'Biyoloji' },
    { id: 'protein-sentezi', title: 'Protein Sentezi: Transkripsiyon ve Translasyon', category: 'Biyoloji' },
    // Add more mock articles if needed, especially for Teknoloji to test filtering
    { id: 'yapay-zeka-etik', title: 'Yapay Zeka Etiği', category: 'Teknoloji' },
    { id: 'kuantum-bilgisayarlar', title: 'Kuantum Bilgisayarlar ve Geleceği', category: 'Teknoloji' },
  ];
  return mockData.filter(article =>
    (article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.category.toLowerCase().includes(query.toLowerCase())) &&
    article.category === 'Biyoloji' // Keeping Biyoloji filter for now as per original search
  ).slice(0, 5);
};


const DnaLogo = () => {
    const [baseAmplitudes, setBaseAmplitudes] = React.useState<number[]>([]);

    React.useEffect(() => {
        // Initialize amplitudes with a bit of randomness
        setBaseAmplitudes(Array(7).fill(0).map(() => 10 + Math.random() * 4 - 2)); // Values between 8 and 12

        // Optional: Animate amplitudes over time
        const intervalId = setInterval(() => {
            setBaseAmplitudes(prevAmplitudes =>
                prevAmplitudes.map(amp => 10 + Math.random() * 4 - 2)
            );
        }, 2000); // Change amplitudes every 2 seconds for a subtle effect
        return () => clearInterval(intervalId);
    }, []);


    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="h-10 w-10 group-hover:animate-spin-slow mr-0" // Removed -mr-1
    >
        <defs>
            <linearGradient id="dnaGradientHeader" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))">
                    {/* Animate the color of the gradient stop */}
                    <animate attributeName="stop-color" values="hsl(175 80% 30%);hsl(145 60% 40%);hsl(175 80% 30%)" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="hsl(145 75% 45%)">
                    {/* Animate the color of the gradient stop */}
                    <animate attributeName="stop-color" values="hsl(145 75% 45%);hsl(175 80% 30%);hsl(145 75% 45%)" dur="4s" repeatCount="indefinite" />
                </stop>
            </linearGradient>
        </defs>
        {/* Apply rotation to the group for a subtle tilt */}
        <g transform="translate(50,50) scale(0.9) rotate(15)">
            {/* DNA Strand 1 */}
            <path
                d="M0,-40 Q 20,-20 0,0 Q -20,20 0,40" // Standard DNA curve
                stroke="url(#dnaGradientHeader)"
                strokeWidth="5" // Slightly thinner for a cleaner look
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
            {/* DNA Strand 2 */}
            <path
                d="M0,-40 Q -20,-20 0,0 Q 20,20 0,40" // Mirrored DNA curve
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
                    dur="12s"
                    repeatCount="indefinite"
                />
                 <animate attributeName="stroke-width" values="5;6;5" dur="3.5s" repeatCount="indefinite" begin="0.3s"/>
            </path>
            {/* DNA Bases with subtle animation */}
            {baseAmplitudes.map((amplitude, i) => {
                const yPos = -35 + i * (70 / 6); // 7 bases, evenly spaced
                const angle = (i * Math.PI) / 3.5; // Angle for slight curve in bases
                const x1 = Math.sin(angle) * amplitude; // Use dynamic amplitude
                const x2 = Math.sin(angle + Math.PI) * amplitude; // Use dynamic amplitude
                return (
                    <line
                        key={`header-dna-base-${i}`}
                        x1={x1}
                        y1={yPos}
                        x2={x2}
                        y2={yPos}
                        strokeWidth="2.5" // Thinner bases
                        strokeLinecap="round"
                        className="stroke-green-500/40 dark:stroke-green-400/20" // Muted base color
                    >
                         <animate
                            attributeName="stroke"
                            values="hsl(var(--primary)/0.4);hsl(145 80% 40% / 0.6);hsl(145 75% 45% / 0.4);hsl(var(--primary)/0.4)"
                            dur="6s" // Slower color transition
                            repeatCount="indefinite"
                            begin={`${i * 0.25}s`} // Staggered start
                        />
                         <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite" begin={`${i*0.2}s`} />
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 0 0"
                            to="360 0 0"
                            dur="12s"
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


  const checkUserStatus = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
        } catch (e) {
          console.error("Error parsing current user from localStorage in Header", e);
          setCurrentUser(null); // Clear if parsing fails
        }
      } else {
        setCurrentUser(null);
      }
    }
  }, []);

  React.useEffect(() => {
    setIsMounted(true); // Component is now mounted on the client
    checkUserStatus();

    // Listen for storage changes (e.g., user logs in/out in another tab)
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'currentUser') {
            checkUserStatus();
        }
    };

    // Listen for custom event dispatched after login/logout/account creation
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('currentUserUpdated', checkUserStatus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('currentUserUpdated', checkUserStatus);
    };
  }, [checkUserStatus]);


  React.useEffect(() => {
    // Only show popover if there's a query
    setIsSearchPopoverOpen(searchQuery.length > 0);
    const handler = setTimeout(async () => {
      if (searchQuery.length > 1) { // Start searching after 1 character
        setIsSearching(true);
        const results = await searchArticles(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300); // Debounce search

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
    setIsSearchPopoverOpen(false); // Close popover when search is cleared
  };

   const closeSearchPopover = () => {
    // We still want the popover to close when a link is clicked,
    // but its open state is primarily controlled by searchQuery.length
    setIsSearchPopoverOpen(false);
  }

  const handleLoginSuccess = () => {
    checkUserStatus(); // Re-check user status
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    setCurrentUser(null);
    window.dispatchEvent(new CustomEvent('currentUserUpdated')); // Notify other components
    toast({ title: "Çıkış Başarılı", description: "Başarıyla çıkış yaptınız." });
    router.replace('/'); // Redirect to home after logout
  };

  const handleCreateAccountSuccess = () => {
    checkUserStatus(); // Re-check user status
    setIsCreateAccountModalOpen(false);
    // Optionally, directly open login modal after successful account creation
    setTimeout(() => setIsLoginModalOpen(true), 100);
  };

  const openCreateAccountModal = () => {
    setIsLoginModalOpen(false); // Ensure login modal is closed
    setIsCreateAccountModalOpen(true);
  };

  const openLoginModalFromCreate = () => {
    setIsCreateAccountModalOpen(false);
    setIsLoginModalOpen(true);
  };

  // Define navigation items including those with sub-menus
  const navItems = [
    { href: "/", label: "Anasayfa", icon: <HomeIcon className="h-4 w-4" /> },
    { href: "/dersler", label: "Dersler", icon: <DerslerIcon className="h-4 w-4" /> },
    { href: "/biyoloji-notlari", label: "Biyoloji Notları", icon: <BookCopy className="h-4 w-4" /> },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
  ];

  const getCategoryClass = (category: string): string => {
     const lowerCaseName = category.toLowerCase();
     if (lowerCaseName.includes('biyoloji') || lowerCaseName.includes('genetik') || lowerCaseName.includes('hücre')) {
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
     }
     // Add other category color rules if needed
     return 'bg-muted text-muted-foreground'; // Default
  }


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center group">
            <DnaLogo />
             <div className="flex flex-col items-start ml-1 -mt-1"> {/* Adjusted margin for closer text to logo */}
                <span className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">BiyoHox</span>
                <span className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors leading-tight -mt-0.5">
                    Öğrenmenin DNA’sı
                </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 items-center space-x-1">
            {navItems.map((item) =>
              item.isDropdown && item.subItems ? ( // This part is for future sub-menus, not currently used by new navItems
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 flex items-center"
                    >
                      {item.icon && <span className="mr-1.5">{item.icon}</span>}
                      <span className="capitalize">{item.label}</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.subItems.map(subItem => (
                      <DropdownMenuSub key={subItem.label}>
                        <DropdownMenuSubTrigger>
                          <Link href={subItem.href} className="flex-grow text-left">{subItem.label}</Link>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {subItem.topics?.map(topic => (
                              <DropdownMenuItem key={topic.label} asChild>
                                <Link href={topic.href}>{topic.label}</Link>
                              </DropdownMenuItem>
                            ))}
                             <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={subItem.href}>Tüm {subItem.label} Konuları</Link>
                              </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href={item.href} key={item.href} passHref legacyBehavior>
                     <Button
                        variant="ghost"
                        className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 flex items-center"
                        as="a" // Important for legacyBehavior with Button
                     >
                       {item.icon && <span className="mr-1.5">{item.icon}</span>}
                       <span className="capitalize">{item.label}</span>
                     </Button>
                </Link>
              )
            )}
          </nav>

          {/* Right side actions - Desktop */}
          <div className="ml-auto flex items-center space-x-2">
            <div className="hidden lg:flex items-center space-x-2"> {/* This div will be hidden on mobile and medium screens */}
              <Popover open={isSearchPopoverOpen} onOpenChange={setIsSearchPopoverOpen}>
                <PopoverTrigger asChild>
                   <div className="relative w-full max-w-[150px] sm:max-w-[180px]"> {/* Responsive width for search */}
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Ara..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-9 pr-8 h-9 rounded-md bg-secondary/70 border-transparent focus:bg-background focus:border-border" // Adjusted styles
                        onFocus={() => setIsSearchPopoverOpen(true)} // Open popover on focus
                      />
                      {searchQuery && ( // Show clear button only if there's a query
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
                    onOpenAutoFocus={(e) => e.preventDefault()} // Prevent auto-focus on popover open for better UX
                 >
                  {isSearching && searchQuery && (
                     <div className="p-4 text-sm text-center text-muted-foreground">Aranıyor...</div>
                  )}
                   {!isSearching && searchQuery && searchResults.length === 0 && (
                      <div className="p-4 text-sm text-center text-muted-foreground">"{searchQuery}" için sonuç bulunamadı.</div>
                   )}
                  {!isSearching && searchResults.length > 0 && searchQuery && (
                    <ScrollArea className="max-h-[300px]"> {/* Scrollable results */}
                       <ul className="space-y-1">
                         {searchResults.map((result) => (
                            <li key={result.id}>
                                <Link
                                    href={`/articles/${result.id}`}
                                    className="flex items-center justify-between p-3 rounded-md hover:bg-accent transition-colors"
                                    onClick={closeSearchPopover} // Close popover on link click
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
                          <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-2"> {/* Added margin */}
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
                                      @{currentUser.username} {/* Assuming username exists */}
                                  </p>
                              </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                              <Link href="/profile"> {/* Link to actual profile page */}
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
              {isMounted && !currentUser && ( // Show login/signup only if not logged in and component is mounted
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
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menüyü Aç</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[300px] p-0"> {/* Removed default padding */}
                   <SheetClose asChild>
                        <div className="flex items-center p-4 border-b"> {/* Header for mobile menu */}
                            <Link href="/" className="flex items-center group">
                                <DnaLogo /> {/* Re-use logo */}
                                <div className="flex flex-col items-start ml-1 -mt-1">
                                    <span className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">BiyoHox</span>
                                     <span className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors leading-tight -mt-0.5">
                                        Öğrenmenin DNA’sı
                                    </span>
                                </div>
                            </Link>
                        </div>
                   </SheetClose>
                  <ScrollArea className="h-[calc(100vh-65px)]"> {/* Adjust height for header */}
                    <div className="p-6 space-y-4">
                        {/* Search for Mobile */}
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
                         {/* Search results for mobile */}
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

                      {/* Navigation Links for Mobile */}
                      <nav className="flex flex-col space-y-1 border-t border-border/30 pt-4">
                        {navItems.map((item) => (
                           // For mobile, no dropdowns for now, direct links. Sub-menu handling for mobile can be complex.
                           // If sub-items are needed, they'd require a different UI pattern in mobile sheet.
                          <SheetClose asChild key={`mobile-${item.href || item.label}`}>
                            <Link href={item.href || "#"} passHref legacyBehavior>
                                   <Button
                                      variant="ghost"
                                      className="justify-start flex items-center gap-2 text-base w-full px-3 py-2"
                                       as="a" // Important for legacyBehavior with Button
                                   >
                                     {item.icon}
                                     <span className="capitalize">{item.label}</span>
                                   </Button>
                               </Link>
                             </SheetClose>
                        ))}
                      </nav>

                      {/* Auth and Theme for Mobile */}
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
                                      <Link href="/profile"> {/* Link to actual profile page */}
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
                         {isMounted && !currentUser && ( // Show login/signup only if not logged in
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
      {/* Modals remain outside the header but are controlled by its state */}
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} onLoginSuccess={handleLoginSuccess} openCreateAccount={openCreateAccountModal} />
      <CreateAccountModal isOpen={isCreateAccountModalOpen} setIsOpen={setIsCreateAccountModalOpen} onAccountCreateSuccess={handleCreateAccountSuccess} openLogin={openLoginModalFromCreate} />
    </>
  );
};

export default Header;

    

    