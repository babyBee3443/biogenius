"use client"; // Add "use client" for useState and useEffect

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Menu, Search, X, BookCopy, ShieldCheck } from 'lucide-react'; // Replaced UserShield with ShieldCheck
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // Import Sheet components
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Import Popover
import { Input } from '@/components/ui/input'; // Import Input
import { Badge } from '@/components/ui/badge'; // Import Badge
import * as React from 'react'; // Import React for state
import { ScrollArea } from './ui/scroll-area'; // Import ScrollArea
import { cn } from '@/lib/utils'; // Import cn utility

interface ArticleStub {
  id: string;
  title: string;
  category: string;
}

// Mock search function - replace with actual API call
const searchArticles = async (query: string): Promise<ArticleStub[]> => {
  if (!query) return [];
  const mockData: ArticleStub[] = [
    { id: '1', title: 'Yapay Zeka Devrimi', category: 'Teknoloji' },
    { id: '2', title: 'Gen Düzenleme Teknolojileri', category: 'Biyoloji' },
    { id: '3', title: 'Kuantum Bilgisayarlar', category: 'Teknoloji' },
    { id: '4', title: 'Mikrobiyom: İçimizdeki Dünya', category: 'Biyoloji' },
    { id: '5', title: 'Blockchain Teknolojisi', category: 'Teknoloji' },
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
    checkAdminStatus(); // Initial check

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'currentUser') {
            console.log("Header: 'currentUser' changed in localStorage (another tab), checking admin status.");
            checkAdminStatus();
        }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('currentUserUpdated', checkAdminStatus); // Listen for same-tab updates

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
    { href: "/categories/teknoloji", label: "Teknoloji" },
    { href: "/categories/biyoloji", label: "Biyoloji" },
    { href: "/biyoloji-notlari", label: "Biyoloji Notları" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" },
  ];

  const getCategoryClass = (category: string): string => {
     switch (category) {
        case 'Teknoloji': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'Biyoloji': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        default: return 'bg-muted text-muted-foreground';
    }
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7 text-primary animate-spin-slow"
          >
            <path d="M4 4C4 4 6 12 12 12C18 12 20 20 20 20" />
            <path d="M4 20C4 20 6 12 12 12C18 12 20 4 20 4" />
            <path d="M6.5 7.5L9.5 5.5" />
            <path d="M14.5 18.5L17.5 16.5" />
            <path d="M6.5 16.5L9.5 18.5" />
            <path d="M14.5 5.5L17.5 7.5" />
            <path d="M10 12H14" />
          </svg>
          <span className="font-bold text-lg">TeknoBiyo</span>
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
               <div className="relative w-full max-w-xs">
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
                className="w-[350px] p-2 mt-1 rounded-lg shadow-lg border border-border/50"
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
            <Button variant="outline" size="sm" asChild className="ml-2">
              <Link href="/admin">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin Paneli
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