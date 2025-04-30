import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { BookOpenText, Atom } from 'lucide-react'; // Use appropriate icons

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          {/* Replace with a proper logo if available */}
           <svg
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             strokeWidth="2"
             strokeLinecap="round"
             strokeLinejoin="round"
             className="h-6 w-6 text-primary"
           >
             <path d="M12 2a10 10 0 0 0-7.5 16.84" />
             <path d="M17.16 17.16a10 10 0 0 0-10.32 0" />
             <path d="M12 22a10 10 0 0 0 7.5-16.84" />
             <path d="M6.84 6.84a10 10 0 0 0 10.32 0" />
             <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
             <path d="M12 2l1.4 4.6L18 8l-3.4 3.4L16 16l-4-2.4L8 16l1.4-4.6L6 8l4.6-1.4L12 2z" />
           </svg>
          <span className="font-bold">TeknoBiyo</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/categories/teknoloji" className="flex items-center gap-1">
               {/* <Laptop className="h-4 w-4" /> */}
              <BookOpenText className="h-4 w-4" /> {/* Use BookOpenText as Laptop is not in lucide-react */}
              Teknoloji
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/categories/biyoloji" className="flex items-center gap-1">
              <Atom className="h-4 w-4" />
              Biyoloji
            </Link>
          </Button>
          {/* Add more navigation links here if needed */}
        </nav>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {/* Add Search, Login/Profile buttons here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
