
"use client"; // Add "use client" for useState and useEffect

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { BookOpenText, Atom, Menu, Search, X } from 'lucide-react'; // Added Search, X
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // Import Sheet components
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Import Popover
import { Input } from '@/components/ui/input'; // Import Input
import { Badge } from '@/components/ui/badge'; // Import Badge
import * as React from 'react'; // Import React for state
import { ScrollArea } from './ui/scroll-area'; // Import ScrollArea

interface ArticleStub {
  id: string;
  title: string;
  category: string;
}

// Mock search function - replace with actual API call
const searchArticles = async (query: string): Promise<ArticleStub[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  if (!query) return [];
  const mockData: ArticleStub[] = [
    { id: '1', title: 'Yapay Zeka Devrimi', category: 'Teknoloji' },
    { id: '2', title: 'Gen Düzenleme Teknolojileri', category: 'Biyoloji' },
    { id: '3', title: 'Kuantum Bilgisayarlar', category: 'Teknoloji' },
    { id: '4', title: 'Mikrobiyom: İçimizdeki Dünya', category: 'Biyoloji' },
    { id: '5', title: 'Blockchain Teknolojisi', category: 'Teknoloji' },
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

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        const results = await searchArticles(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms debounce

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
  };


  const navItems = [
    { href: "/categories/teknoloji", label: "Teknoloji", icon: BookOpenText },
    { href: "/categories/biyoloji", label: "Biyoloji", icon: Atom },
    // Add more navigation links here if needed
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center"> {/* Increased height */}
        <Link href="/" className="mr-8 flex items-center space-x-2">
          {/* Increased margin */}
          {/* Refined Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7 text-primary" // Slightly larger icon
          >
            {/* Simplified and modern logo concept */}
            <path d="M12 2 L12 6" />
            <path d="M12 18 L12 22" />
            <path d="M4.93 4.93 L7.76 7.76" />
            <path d="M16.24 16.24 L19.07 19.07" />
            <path d="M2 12 L6 12" />
            <path d="M18 12 L22 12" />
            <path d="M4.93 19.07 L7.76 16.24" />
            <path d="M16.24 7.76 L19.07 4.93" />
            <circle cx="12" cy="12" r="3" /> {/* Central element */}
          </svg>
          <span className="font-bold text-lg">TeknoBiyo</span> {/* Slightly larger text */}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-2">
          {/* Hide on small screens */}
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              <Button
                variant="ghost"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                <span className="capitalize">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Adjusted spacing */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <div className="relative p-2"> {/* Added relative positioning */}
                <Input
                  type="text"
                  placeholder="Ara..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pr-8" // Add padding for the clear button
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 h-7 w-7" // Position clear button
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {/* Search Results */}
              {isSearching && searchQuery && (
                 <div className="p-2 text-sm text-muted-foreground">Aranıyor...</div>
              )}
               {!isSearching && searchQuery && searchResults.length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground">Sonuç bulunamadı.</div>
               )}
              {!isSearching && searchResults.length > 0 && searchQuery && (
                <ScrollArea className="h-[200px]"> {/* Added ScrollArea */}
                   <ul className="p-2 space-y-1">
                     {searchResults.map((result) => (
                        <li key={result.id}>
                            <Link href={`/articles/${result.id}`} className="block p-2 rounded-md hover:bg-accent" onClick={clearSearch}>
                               <div className="flex items-center justify-between">
                                   <span className="text-sm font-medium truncate">{result.title}</span>
                                   <Badge variant="secondary" className="capitalize text-xs ml-2 flex-shrink-0">
                                       {result.category}
                                   </Badge>
                               </div>
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
              </SheetTrigger>{" "}
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col space-y-4 pt-8">
                  {navItems.map((item) => (
                    <Link href={item.href} key={item.href}>
                      <Button
                        variant="ghost"
                        className="justify-start flex items-center gap-2 text-base"
                      >
                        {" "}
                        <item.icon className="h-5 w-5" />
                        <span className="capitalize">{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                  {/* You can add other links like About, Contact here for mobile */}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Add Search, Login/Profile buttons here (optional) */}
          {/* <Button variant="ghost" size="icon"> <Search className="h-5 w-5"/> </Button> */}
          {/* <Button>Giriş Yap</Button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
