

"use client"; 

import * as React from 'react';
import { motion } from 'framer-motion'; 
import { cn } from '@/lib/utils'; 
import { getArticles, type ArticleData } from '@/lib/mock-data'; 
import { Skeleton } from '@/components/ui/skeleton'; 
import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/hero'), {
  loading: () => <Skeleton className="h-[50vh] md:h-[60vh] w-full mb-16 rounded-lg" />,
  ssr: false 
});

const FeaturedArticlesSection = dynamic(() => import('@/components/featured-articles-section'), {
  loading: () => (
    <section>
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    </section>
  ),
  ssr: false
});

const CategoryTeaserSection = dynamic(() => import('@/components/category-teaser-section'), {
  loading: () => (
    <section>
      <Skeleton className="h-8 w-40 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </section>
  ),
  ssr: false
});

const RecentArticlesSection = dynamic(() => import('@/components/recent-articles-section'), {
  loading: () => (
    <section>
      <Skeleton className="h-8 w-56 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    </section>
  ),
  ssr: false
});


// Define the text parts and their styles
const titleParts = [
    {
        text: "Teknoloji",
        colorClass: "text-blue-600 dark:text-blue-400",
    },
    { text: " ve ", colorClass: "text-foreground" },
    {
        text: "Biyolojinin",
        colorClass: "text-green-600 dark:text-green-400",
    },
    { text: " Kesişim Noktası", colorClass: "text-foreground" },
];

// Animation variants for the title reveal
const titleContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03, 
      delayChildren: 0.2,
    },
  },
};

const letterRevealVariants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(2px)' }, 
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6, 
      ease: [0.6, -0.05, 0.01, 0.99], 
    },
  },
};


export default function Home() {
  const [allArticles, setAllArticles] = React.useState<ArticleData[]>([]);
  const [filteredArticlesForDisplay, setFilteredArticlesForDisplay] = React.useState<ArticleData[]>([]);
  const [loadingArticles, setLoadingArticles] = React.useState(true);
  const [currentUserRole, setCurrentUserRole] = React.useState<string | null>(null);
  const [loadingRole, setLoadingRole] = React.useState(true);

  React.useEffect(() => {
    // Fetch articles
    getArticles()
      .then(data => {
        setAllArticles(data);
      })
      .catch(err => {
        console.error("Error fetching articles:", err);
      })
      .finally(() => {
        setLoadingArticles(false);
      });

    // Fetch user role from localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUserRole(user.role || null);
        } catch (e) {
          console.error("Error parsing current user from localStorage", e);
          setCurrentUserRole(null); // Fallback
        }
      }
      setLoadingRole(false);
    } else {
      setLoadingRole(false); // Not in browser, role won't be available this way
    }
  }, []); // Run once on mount

  React.useEffect(() => {
    if (!loadingArticles && !loadingRole) { // Only process once both are loaded
      let visibleArticles;
      if (currentUserRole === 'Admin' || currentUserRole === 'Editor') {
        visibleArticles = allArticles.filter(article =>
          article.status === 'Yayınlandı' || article.status === 'Hazır'
        );
      } else {
        visibleArticles = allArticles.filter(article => article.status === 'Yayınlandı');
      }
      setFilteredArticlesForDisplay(visibleArticles);
    }
  }, [allArticles, currentUserRole, loadingArticles, loadingRole]);


  const heroArticles: ArticleData[] = filteredArticlesForDisplay
    .filter(article => article.isHero === true)
    .slice(0, 5);

  const featuredArticles: ArticleData[] = filteredArticlesForDisplay
    .filter(article => article.isFeatured === true) 
    .slice(0, 3);

  const recentArticles: ArticleData[] = filteredArticlesForDisplay
    .filter(article => !article.isHero && !article.isFeatured) 
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const pageIsLoading = loadingArticles || loadingRole;

  // --- Loading State ---
  if (pageIsLoading) {
     return (
        <div className="space-y-16">
             {/* Title Skeleton */}
            <Skeleton className="h-16 w-3/4 mx-auto mb-8" />
            {/* Hero Skeleton is handled by dynamic import's loading state */}
            <Skeleton className="h-[50vh] md:h-[60vh] w-full mb-16 rounded-lg" />
             {/* Featured Articles Skeletons */}
             <section>
                <Skeleton className="h-8 w-48 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-72 w-full" />
                    <Skeleton className="h-72 w-full" />
                    <Skeleton className="h-72 w-full" />
                </div>
            </section>
             {/* Category Teaser Skeletons */}
            <section>
                 <Skeleton className="h-8 w-40 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </section>
             {/* Recent Articles Skeletons */}
            <section>
                <Skeleton className="h-8 w-56 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-72 w-full" />
                    <Skeleton className="h-72 w-full" />
                    <Skeleton className="h-72 w-full" />
                </div>
            </section>
        </div>
     );
  }
  // --- End Loading State ---

  return (
    <div className="space-y-16">
      {/* Animated Title */}
      <motion.h1
        className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl mb-8 overflow-hidden py-2"
        variants={titleContainerVariants}
        initial="hidden"
        animate="visible"
        aria-label="Teknoloji ve Biyolojinin Kesişim Noktası"
      >
        {titleParts.map((part, partIndex) => (
          <span key={`part-${partIndex}`} className="inline-block relative overflow-hidden group">
            {part.text.split("").map((char, charIndex) => (
              <motion.span
                key={`${partIndex}-${charIndex}`}
                variants={letterRevealVariants}
                className={cn(
                  "inline-block",
                  part.colorClass
                )}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
            {/* Removed the background sheen animation span here */}
          </span>
        ))}
      </motion.h1>

       <Hero articles={heroArticles} />

      {/* Featured Articles Showcase */}
      <section id="featured-articles"> 
        <h2 className="text-3xl font-bold mb-8">Öne Çıkanlar</h2>
        <FeaturedArticlesSection articles={featuredArticles} />
      </section>

       <section>
         <h2 className="text-3xl font-bold mb-8">Kategoriler</h2>
         <CategoryTeaserSection />
       </section>


      <section>
        <h2 className="text-3xl font-bold mb-8">En Son Eklenenler</h2>
        <RecentArticlesSection articles={recentArticles} />
      </section>

    </div>
  );
}
