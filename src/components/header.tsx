import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { BookOpenText, Atom, Menu } from 'lucide-react'; // Use appropriate icons, added Menu for mobile
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // Import Sheet components

const Header = () => {
  const navItems = [
    { href: "/categories/teknoloji", label: "Teknoloji", icon: BookOpenText },
    { href: "/categories/biyoloji", label: "Biyoloji", icon: Atom },
    // Add more navigation links here if needed
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center"> {/* Increased height */}
        <Link href="/" className="mr-8 flex items-center space-x-2"> {/* Increased margin */}
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
            <path d="M12 2 L12 6"/>
            <path d="M12 18 L12 22"/>
            <path d="M4.93 4.93 L7.76 7.76"/>
            <path d="M16.24 16.24 L19.07 19.07"/>
            <path d="M2 12 L6 12"/>
            <path d="M18 12 L22 12"/>
            <path d="M4.93 19.07 L7.76 16.24"/>
            <path d="M16.24 7.76 L19.07 4.93"/>
             <circle cx="12" cy="12" r="3" /> {/* Central element */}
           </svg>
          <span className="font-bold text-lg">TeknoBiyo</span> {/* Slightly larger text */}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-2"> {/* Hide on small screens */}
          {navItems.map((item) => (
            <Button variant="ghost" asChild key={item.href}>
              <Link href={item.href} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"> {/* Adjusted styling */}
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4"> {/* Adjusted spacing */}
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
                <nav className="flex flex-col space-y-4 pt-8">
                  {navItems.map((item) => (
                    <Button variant="ghost" asChild key={item.href} className="justify-start">
                      <Link href={item.href} className="flex items-center gap-2 text-base">
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </Button>
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
