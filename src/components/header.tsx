
"use client";

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Menu, Search, X, BookCopy, ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import * as React from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { LoginModal } from '@/components/login-modal';
import { CreateAccountModal } from '@/components/create-account-modal';

interface ArticleStub {
  id: string;
  title: string;
  category: string;
}

const searchArticles = async (query: string): Promise<ArticleStub[]> => {
  if (!query) return [];
  const mockData: ArticleStub[] = [
    { id: '2', title: 'Gen Düzenleme Teknolojileri', category: 'Biyoloji' },
    { id: '4', title: 'Mikrobiyom: İçimizdeki Dünya', category: 'Biyoloji' },
    { id: 's1', title: 'İnsan Bağışıklık Sistemi', category: 'Biyoloji' },
    { id: 's2', title: 'Beyin Nöroplastisitesi', category: 'Biyoloji' },
  ];
  return mockData.filter(article =>
    (article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.category.toLowerCase().includes(query.toLowerCase())) &&
    article.category === 'Biyoloji' // Only show Biyoloji articles
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
                <stop offset="0%" stopColor="cyan">
                    <animate attributeName="stop-color" values="cyan;magenta;lime;cyan" dur="6s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="lime">
                    <animate attributeName="stop-color" values="lime;cyan;magenta;lime" dur="6s" repeatCount="indefinite" />
                </stop>
            </linearGradient>
        </defs>
        <g transform="translate(50,50) scale(0.8) rotate(15)">
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
                let dynamicAmplitude = 0;
                if (typeof window !== 'undefined') {
                    dynamicAmplitude = Math.sin(Date.now() / 700 + i) * 2;
                }
                const amplitude = 10 + dynamicAmplitude;
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
                    >
                        <animate
                            attributeName="stroke"
                            values="cyan;magenta;lime;green;blue;cyan" // Vibrant RGB cycle
                            dur="5s" // Faster cycle for more dynamism
                            repeatCount="indefinite"
                            begin={`${i * 0.2}s`} // Staggered start
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
    checkUserStatus();
    setIsLoginModalOpen(false);
  };

  const handleCreateAccountSuccess = () => {
    checkUserStatus();
    setIsCreateAccountModalOpen(false);
    // Automatically open login modal after successful account creation
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


  const navItems = [
    { href: "/", label: "Anasayfa" },
    { href: "/biyoloji-notlari", label: "Biyoloji Notları" },
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
             <div className="flex flex-col items-start ml-1 -mt-0.5"> {/* Adjusted -mt-1 to -mt-0.5 */}
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
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                 <div className="relative w-full max-w-[120px] sm:max-w-[140px]">
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
                                  onClick={closePopover}
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

             {isMounted && currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Editor') && (
                <Button variant="outline" size="sm" asChild className="ml-1 shrink-0">
                    <Link href="/admin" passHref>
                        <ShieldCheck className="mr-1.5 h-4 w-4" />
                        <span className="hidden sm:inline">Admin Paneli</span>
                        <span className="sm:hidden">Admin</span>
                    </Link>
                </Button>
             )}
            {isMounted && !currentUser && (
                 <Button variant="outline" size="sm" onClick={() => setIsLoginModalOpen(true)} className="ml-1 shrink-0">
                    <LogIn className="mr-1.5 h-4 w-4" />
                    Giriş Yap
                </Button>
            )}


            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menüyü Aç</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                  <nav className="flex flex-col space-y-2 pt-8">
                    {navItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link href={item.href} passHref legacyBehavior>
                             <Button
                                variant="ghost"
                                className="justify-start flex items-center gap-2 text-base w-full"
                                 as="a"
                             >
                                {item.href === '/biyoloji-notlari' && <BookCopy className="h-4 w-4" />}
                               <span className="capitalize">{item.label}</span>
                             </Button>
                         </Link>
                       </SheetClose>
                    ))}
                    {isMounted && currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Editor') && (
                       <SheetClose asChild>
                          <Button variant="outline" asChild className="mt-4">
                              <Link href="/admin">
                                  <ShieldCheck className="mr-2 h-4 w-4" />
                                  Admin Paneli
                              </Link>
                          </Button>
                        </SheetClose>
                     )}
                     {isMounted && !currentUser && (
                       <>
                        <SheetClose asChild>
                           <Button variant="outline" onClick={() => setIsLoginModalOpen(true)} className="mt-4 w-full">
                               <LogIn className="mr-2 h-4 w-4" />
                               Giriş Yap
                           </Button>
                        </SheetClose>
                        <SheetClose asChild>
                           <Button variant="default" onClick={openCreateAccountModal} className="mt-2 w-full">
                               <UserPlus className="mr-2 h-4 w-4" />
                               Hesap Oluştur
                           </Button>
                        </SheetClose>
                       </>
                     )}
                  </nav>
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
