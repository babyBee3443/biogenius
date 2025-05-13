
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

// Define the text parts and their styles
const titleParts = [
    {
        text: "Biyolojinin",
        colorClass: "text-green-600 dark:text-green-400",
        animationClass: "animate-text-shimmer-green",
    },
    { text: " Derinliklerine Yolculuk", colorClass: "text-foreground" },
];


// Simplified animation variants for the title
const titleContainerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};


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
          article.status === 'Yayınlandı' || article.status === 'Hazır'
        );
      } else {
        visibleArticles = allArticles.filter(article => article.status === 'Yayınlandı');
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
            <Skeleton className="h-16 w-3/4 mx-auto mb-8 rounded-lg" />
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
    <div className="space-y-16">
      <motion.h1
        className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl mb-8 overflow-hidden py-2"
        variants={titleContainerVariants}
        initial="hidden"
        animate="visible"
        aria-label="Biyolojinin Derinliklerine Yolculuk"
      >
        {titleParts.map((part, partIndex) => (
          <motion.span
            key={`part-${partIndex}`}
            variants={wordVariants}
            className={cn("inline-block", part.colorClass, part.animationClass)}
          >
            {part.text.split("").map((char, charIndex) => (
              <motion.span
                key={`char-${charIndex}`}
                className="inline-block"
                variants={wordVariants} // You can create a specific charVariant if needed
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        ))}
      </motion.h1>

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
