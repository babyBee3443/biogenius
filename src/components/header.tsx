
"use client"; // Add "use client" for useState and useEffect

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Menu, Search, X } from 'lucide-react'; // Removed BookOpenText, Atom
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
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 300)); // Removed delay
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
  ).slice(0, 5); // Limit results
};


const Header = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<ArticleStub[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false); // Control popover state


  // Debounce search input
  React.useEffect(() => {
    setIsPopoverOpen(searchQuery.length > 0); // Open popover when typing starts
    const handler = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        const results = await searchArticles(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms debounce

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
    setIsPopoverOpen(false); // Close popover on clear
  };

   const closePopover = () => {
    setIsPopoverOpen(false);
    setSearchQuery(''); // Optionally clear search on close
    setSearchResults([]);
  }


  const navItems = [
    { href: "/", label: "Anasayfa" }, // Added Anasayfa
    { href: "/categories/teknoloji", label: "Teknoloji" },
    { href: "/categories/biyoloji", label: "Biyoloji" },
    { href: "/hakkimizda", label: "Hakkımızda" }, // Added Hakkımızda
    { href: "/iletisim", label: "İletişim" }, // Added İletişim
  ];

  const getCategoryClass = (category: string): string => {
     switch (category) {
        case 'Teknoloji': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'Biyoloji': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        default: return 'bg-muted text-muted-foreground';
    }
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2"> {/* Reduced margin */}
          {/* Animated Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7 text-primary animate-spin-slow" // Apply animation class
          >
            {/* Outer circle elements representing technology/connections */}
            <path d="M12 2 L12 6" />
            <path d="M12 18 L12 22" />
            <path d="M4.93 4.93 L7.76 7.76" />
            <path d="M16.24 16.24 L19.07 19.07" />
            <path d="M2 12 L6 12" />
            <path d="M18 12 L22 12" />
            <path d="M4.93 19.07 L7.76 16.24" />
            <path d="M16.24 7.76 L19.07 4.93" />
            {/* Inner circle representing biology/core */}
            <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
             {/* Inner dot for focus */}
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
          </svg>
          <span className="font-bold text-lg">TeknoBiyo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-1"> {/* Reduced space */}
          {navItems.map((item) => (
            <Link href={item.href} key={item.href} passHref legacyBehavior>
                 <Button
                    variant="ghost"
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50" // Added hover background
                    as="a" // Render as an anchor tag
                 >
                   <span className="capitalize">{item.label}</span>
                 </Button>
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2"> {/* Reduced spacing */}
          {/* Search Popover */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              {/* Use Input directly as the trigger for a cleaner look */}
               <div className="relative w-full max-w-xs">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Ara..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-9 pr-8 h-9 rounded-full bg-secondary/70 border-transparent focus:bg-background focus:border-border" // Rounded input
                    onFocus={() => setIsPopoverOpen(true)} // Open on focus
                  />
                  {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-1 transform -translate-y-1/2 h-7 w-7 rounded-full" // Position clear button
                        onClick={clearSearch}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
               </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-[350px] p-2 mt-1 rounded-lg shadow-lg border border-border/50" // Style popover content
                align="end"
                onOpenAutoFocus={(e) => e.preventDefault()} // Prevent focus stealing
             >
              {/* Search Results */}
              {isSearching && searchQuery && (
                 <div className="p-4 text-sm text-center text-muted-foreground">Aranıyor...</div>
              )}
               {!isSearching && searchQuery && searchResults.length === 0 && (
                  <div className="p-4 text-sm text-center text-muted-foreground">"{searchQuery}" için sonuç bulunamadı.</div>
               )}
              {!isSearching && searchResults.length > 0 && searchQuery && (
                <ScrollArea className="max-h-[300px]"> {/* Limit height */}
                   <ul className="space-y-1">
                     {searchResults.map((result) => (
                        <li key={result.id}>
                            <Link
                                href={`/articles/${result.id}`}
                                className="flex items-center justify-between p-3 rounded-md hover:bg-accent transition-colors"
                                onClick={closePopover} // Close popover on selection
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

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menüyü Aç</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col space-y-2 pt-8"> {/* Reduced space */}
                  {navItems.map((item) => (
                    <Link href={item.href} key={item.href} passHref legacyBehavior>
                         <Button
                            variant="ghost"
                            className="justify-start flex items-center gap-2 text-base w-full"
                             as="a"
                         >
                           <span className="capitalize">{item.label}</span>
                         </Button>
                     </Link>
                  ))}
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
