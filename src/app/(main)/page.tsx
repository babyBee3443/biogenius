
"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getArticles, type ArticleData } from '@/lib/data/articles'; // Updated import
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

// Dynamically import sections
const Hero = dynamic(() => import('@/components/hero'), {
  loading: () => <Skeleton className="h-[50vh] md:h-[55vh] w-full mb-12 rounded-lg" />,
  ssr: false
});

const FeaturedArticlesSection = dynamic(() => import('@/components/featured-articles-section'), {
  loading: () => (
    <section className="w-full py-8">
      <Skeleton className="h-8 w-48 mb-8 rounded-lg" />
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
      <Skeleton className="h-8 w-40 mb-8 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8"> {/* Ensure single column for biyoloji only */}
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </section>
  ),
  ssr: false
});

const RecommendedContentSection = dynamic(() => import('@/components/recommended-content-section'), {
  loading: () => (
    <section className="w-full py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <Skeleton className="h-10 w-72 mb-2 rounded-lg" />
          <Skeleton className="h-5 w-96 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-36 mt-4 md:mt-0 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </section>
  ),
  ssr: false
});


const RecentArticlesSection = dynamic(() => import('@/components/recent-articles-section'), {
  loading: () => (
    <section className="w-full py-8">
      <Skeleton className="h-8 w-56 mb-8 rounded-lg" />
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
  const title = "Öğrenmenin genetik temeli";
  const subtitleParts = [
    { text: "Hox genleri canlıyı şekillendirir, ", colorClass: "text-muted-foreground" },
    { text: "Biyohox", colorClass: "text-primary animate-text-rgb-cycle-fast" },
    { text: " ise öğrenmeni", colorClass: "text-muted-foreground" },
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
        staggerChildren: 0.03, // Reduced stagger for faster appearance
        delayChildren: 0.5,
      },
    },
  };

  const subtitleCharVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }, // Faster char animation
  };

  return (
    <section className="relative flex flex-col items-center justify-center text-center py-6 px-4 overflow-hidden mb-6"> {/* Reduced padding and margin */}
      <div className="relative z-10">
        <motion.h1
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-primary" // Reduced mb
        >
          {title}
        </motion.h1>

        <motion.h2
          variants={subtitleContainerVariants}
          initial="hidden"
          animate="visible"
          className="text-md sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto" // Reduced max-width
        >
          {subtitleParts.map((part, partIndex) => (
            <span key={`subpart-${partIndex}`} className={part.colorClass}>
              {part.text.split("").map((char, charIndex) => (
                <motion.span
                  key={`char-${charIndex}`}
                  variants={subtitleCharVariants}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
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
        <div className="space-y-12">
            <Skeleton className="h-[30vh] w-full mb-8 rounded-lg" />
            <Skeleton className="h-[50vh] md:h-[55vh] w-full mb-12 rounded-lg" />
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
                <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                    <Skeleton className="h-40 w-full rounded-lg" />
                </div>
            </section>
            {/* Skeleton for RecommendedContentSection */}
            <section className="w-full py-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                    <Skeleton className="h-10 w-72 mb-2 rounded-lg" />
                    <Skeleton className="h-5 w-96 rounded-lg" />
                    </div>
                    <Skeleton className="h-10 w-36 mt-4 md:mt-0 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-64 w-full rounded-lg" />
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
    <div className="space-y-12">
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

      <RecommendedContentSection />

      {recentArticles.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-8">En Son Eklenenler</h2>
          <RecentArticlesSection articles={recentArticles} />
        </section>
      )}

    </div>
  );
}
