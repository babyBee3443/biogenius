
"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getArticles, type ArticleData } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

// Dynamically import sections
const Hero = dynamic(() => import('@/components/hero'), {
  loading: () => <Skeleton className="h-[50vh] md:h-[60vh] w-full mb-16 rounded-lg" />,
  ssr: false
});

const FeaturedArticlesSection = dynamic(() => import('@/components/featured-articles-section'), {
  loading: () => (
    <section className="w-full py-8">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Skeleton className="h-72 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    </section>
  ),
  ssr: false
});

const CategoryTeaserSection = dynamic(() => import('@/components/category-teaser-section'), {
  loading: () => (
    <section className="w-full py-8">
      <Skeleton className="h-8 w-40 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8"> {/* Ensure single column for biyoloji only */}
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </section>
  ),
  ssr: false
});

const RecentArticlesSection = dynamic(() => import('@/components/recent-articles-section'), {
  loading: () => (
    <section className="w-full py-8">
      <Skeleton className="h-8 w-56 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Skeleton className="h-72 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    </section>
  ),
  ssr: false
});

// --- Welcome Screen Component ---
const WelcomeScreen = () => {
  const title = "Öğrenmenin genetik temeli.";
  const subtitleParts = [
    { text: "Hox genleri canlıyı şekillendirir, ", colorClass: "text-muted-foreground" },
    { text: "Biyohox", colorClass: "text-primary animate-text-rgb-cycle-fast" },
    { text: " ise öğrenmeni.", colorClass: "text-muted-foreground" },
  ];

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const subtitleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.5,
      },
    },
  };

  const subtitleCharVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <section className="relative flex flex-col items-center justify-center text-center py-8 px-4 overflow-hidden mb-8"> {/* Reduced mb from 16 to 8 */}
      {/* Removed dark background classes, rounded-lg, shadow-2xl, border */}
      {/* Removed background SVG and particle animations as they were designed for dark background */}

      <div className="relative z-10">
        <motion.h1
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-primary" // Reduced mb from 6 to 4
        >
          {title}
        </motion.h1>

        <motion.h2
          variants={subtitleContainerVariants}
          initial="hidden"
          animate="visible"
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
        >
          {subtitleParts.map((part, partIndex) => (
            <span key={`subpart-${partIndex}`} className={part.colorClass}>
              {part.text.split("").map((char, charIndex) => (
                <motion.span
                  key={`char-${charIndex}`}
                  variants={subtitleCharVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h2>
      </div>
    </section>
  );
};
// --- End Welcome Screen ---


export default function Home() {
  const [allArticles, setAllArticles] = React.useState<ArticleData[]>([]);
  const [filteredArticlesForDisplay, setFilteredArticlesForDisplay] = React.useState<ArticleData[]>([]);
  const [loadingArticles, setLoadingArticles] = React.useState(true);
  const [currentUserRole, setCurrentUserRole] = React.useState<string | null>(null);
  const [loadingRole, setLoadingRole] = React.useState(true);

  React.useEffect(() => {
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

    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUserRole(user.role || null);
        } catch (e) {
          console.error("Error parsing current user from localStorage", e);
          setCurrentUserRole(null);
        }
      }
      setLoadingRole(false);
    } else {
      setLoadingRole(false);
    }
  }, []);

  React.useEffect(() => {
    if (!loadingArticles && !loadingRole) {
      let visibleArticles;
      if (currentUserRole === 'Admin' || currentUserRole === 'Editor') {
        visibleArticles = allArticles.filter(article =>
          (article.status === 'Yayınlandı' || article.status === 'Hazır') && article.category === 'Biyoloji'
        );
      } else {
        visibleArticles = allArticles.filter(article => article.status === 'Yayınlandı' && article.category === 'Biyoloji');
      }
      setFilteredArticlesForDisplay(visibleArticles);
    }
  }, [allArticles, currentUserRole, loadingArticles, loadingRole]);


  const heroArticles: ArticleData[] = filteredArticlesForDisplay
    .filter(article => article.isHero === true && article.status === 'Yayınlandı')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const featuredArticles: ArticleData[] = filteredArticlesForDisplay
    .filter(article => article.isFeatured === true && !article.isHero && article.status === 'Yayınlandı')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const recentArticles: ArticleData[] = filteredArticlesForDisplay
    .filter(article => !article.isHero && !article.isFeatured && article.status === 'Yayınlandı')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const pageIsLoading = loadingArticles || loadingRole;

  if (pageIsLoading) {
     return (
        <div className="space-y-16">
            <Skeleton className="h-[30vh] w-full mb-8 rounded-lg" /> {/* Adjusted welcome screen skeleton height */}
            <Skeleton className="h-[50vh] md:h-[60vh] w-full mb-16 rounded-lg" />
             <section className="w-full py-8">
                <Skeleton className="h-8 w-48 mb-8 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-72 w-full rounded-lg" />
                    <Skeleton className="h-72 w-full rounded-lg" />
                    <Skeleton className="h-72 w-full rounded-lg" />
                </div>
            </section>
            <section className="w-full py-8">
                 <Skeleton className="h-8 w-40 mb-8 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-1 gap-8"> {/* Single column skeleton */}
                    <Skeleton className="h-40 w-full rounded-lg" />
                </div>
            </section>
            <section className="w-full py-8">
                <Skeleton className="h-8 w-56 mb-8 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-72 w-full rounded-lg" />
                    <Skeleton className="h-72 w-full rounded-lg" />
                    <Skeleton className="h-72 w-full rounded-lg" />
                </div>
            </section>
        </div>
     );
  }

  return (
    <div className="space-y-12"> {/* Reduced space-y from 16 to 12 */}
      <WelcomeScreen />

       <Hero articles={heroArticles} />

      {featuredArticles.length > 0 && (
        <section id="featured-articles">
          <h2 className="text-3xl font-bold mb-8">Öne Çıkanlar</h2>
          <FeaturedArticlesSection articles={featuredArticles} />
        </section>
      )}

       <section>
         <h2 className="text-3xl font-bold mb-8">Kategoriler</h2>
         <CategoryTeaserSection />
       </section>


      {recentArticles.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-8">En Son Eklenenler</h2>
          <RecentArticlesSection articles={recentArticles} />
        </section>
      )}

    </div>
  );
}
