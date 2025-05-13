
"use client";

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Menu, Search, X, BookCopy, ShieldCheck } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import * as React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

interface ArticleStub {
  id: string;
  title: string;
  category: string;
}

const searchArticles = async (query: string): Promise<ArticleStub[]> => {
  if (!query) return [];
  // This is mock data. Replace with actual API call.
  const mockData: ArticleStub[] = [
    { id: '2', title: 'Gen Düzenleme Teknolojileri', category: 'Biyoloji' },
    { id: '4', title: 'Mikrobiyom: İçimizdeki Dünya', category: 'Biyoloji' },
    { id: 's1', title: 'İnsan Bağışıklık Sistemi', category: 'Biyoloji' },
    { id: 's2', title: 'Beyin Nöroplastisitesi', category: 'Biyoloji' },
  ];
  return mockData.filter(article =>
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
};


const Header = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<ArticleStub[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [isAdminOrEditor, setIsAdminOrEditor] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);


  const checkAdminStatus = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setIsAdminOrEditor(user && (user.role === 'Admin' || user.role === 'Editor'));
        } catch (e) {
          console.error("Error parsing current user from localStorage in Header", e);
          setIsAdminOrEditor(false);
        }
      } else {
        setIsAdminOrEditor(false);
      }
    }
  }, []);

  React.useEffect(() => {
    setIsMounted(true);
    checkAdminStatus();

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'currentUser') {
            console.log("Header: 'currentUser' changed in localStorage (another tab), checking admin status.");
            checkAdminStatus();
        }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('currentUserUpdated', checkAdminStatus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('currentUserUpdated', checkAdminStatus);
    };
  }, [checkAdminStatus]);


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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2 group">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-10 w-10 group-hover:animate-spin-slow">
            <defs>
              <linearGradient id="dnaGradientHeader" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(180 100% 40%)" className="group-hover:[stop-color:hsl(140,70%,50%)] transition-all duration-500 ease-in-out">
                  <animate attributeName="stop-color" values="hsl(180 100% 40%);hsl(140 70% 50%);hsl(200 80% 55%);hsl(180 100% 40%)" dur="5s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="hsl(140 70% 50%)" className="group-hover:[stop-color:hsl(180,100%,40%)] transition-all duration-500 ease-in-out">
                  <animate attributeName="stop-color" values="hsl(140 70% 50%);hsl(180 100% 40%);hsl(200 80% 55%);hsl(140 70% 50%)" dur="5s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            <g transform="translate(50,50) scale(0.8)">
              {/* Helix 1 (e.g., Teal to Green) */}
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
                  dur="12s"
                  repeatCount="indefinite"
                />
              </path>
              {/* Helix 2 (e.g., Green to Teal) */}
              <path
                d="M0,-40 Q -20,-20 0,0 Q 20,20 0,40"
                stroke="url(#dnaGradientHeader)" 
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                transform="rotate(180)" // Offset the second helix
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="180 0 0" // Start rotated
                  to="540 0 0" // End rotated
                  dur="12s"
                  repeatCount="indefinite"
                />
                 <animate attributeName="stroke-width" values="5;7;5" dur="3s" repeatCount="indefinite" />
              </path>
              {/* Bases - Adjusted for more biological feel */}
              {[...Array(7)].map((_, i) => (
                <line
                  key={`header-dna-base-${i}`}
                  x1={Math.sin(i * Math.PI / 3.5) * (12 + (i%2 === 0 ? 2: 0) )} // Varied length for bases
                  y1={-35 + i * (70/6)} // Spread along the Y axis
                  x2={Math.sin(i * Math.PI / 3.5 + Math.PI) * (12 + (i%2 === 0 ? 2: 0))}
                  y2={-35 + i * (70/6)}
                  strokeWidth="3" // Thinner bases
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-in-out group-hover:stroke-[hsl(160,80%,45%)]" // Softer hover
                >
                  <animate attributeName="stroke" values="hsl(160 80% 45%);hsl(190 90% 50%);hsl(130 60% 40%);hsl(160 80% 45%)" dur="5s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
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
          <span className="font-bold text-lg group-hover:text-primary transition-colors">BiyoHox</span>
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
               <div className="relative w-full max-w-[160px] sm:max-w-[180px]"> {/* Adjusted max-width for more space */}
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

          {isMounted && isAdminOrEditor && (
             <Button variant="ghost" size="sm" asChild className="ml-1 shrink-0">
                <Link href="/admin" passHref legacyBehavior>
                  <a className="flex items-center">
                    <ShieldCheck className="mr-1.5 h-4 w-4" />
                    <span className="hidden sm:inline">Admin Paneli</span>
                    <span className="sm:hidden">Admin</span>
                  </a>
                </Link>
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
                    <Link href={item.href} key={item.href} passHref legacyBehavior>
                         <Button
                            variant="ghost"
                            className="justify-start flex items-center gap-2 text-base w-full"
                             as="a"
                         >
                            {item.href === '/biyoloji-notlari' && <BookCopy className="h-4 w-4" />}
                           <span className="capitalize">{item.label}</span>
                         </Button>
                     </Link>
                  ))}
                  {isMounted && isAdminOrEditor && (
                    <Button variant="outline" asChild className="mt-4">
                        <Link href="/admin">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Admin Paneli
                        </Link>
                    </Button>
                   )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
