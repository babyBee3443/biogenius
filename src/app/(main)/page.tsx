
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
    { text: "Hox genleri canlıyı şekillendirir, ", colorClass: "text-gray-300 dark:text-gray-400" },
    { text: "Biyohox", colorClass: "text-cyan-400 animate-text-rgb-cycle-fast" },
    { text: " ise öğrenmeni.", colorClass: "text-gray-300 dark:text-gray-400" },
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
    <section className="relative flex flex-col items-center justify-center text-center min-h-[60vh] md:min-h-[70vh] py-16 px-4 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white mb-16 rounded-lg shadow-2xl border border-purple-700/50">
      {/* Subtle Animated Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Minimal DNA Helix (conceptual representation) */}
        <motion.svg
          className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 opacity-30"
          viewBox="0 0 400 400"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <path
            d="M100,50 Q150,100 100,150 Q50,200 100,250 Q150,300 100,350"
            stroke="url(#dna-gradient-1)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M300,50 Q250,100 300,150 Q350,200 300,250 Q250,300 300,350"
            stroke="url(#dna-gradient-2)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="dna-gradient-1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 255, 255, 0.5)" />
              <stop offset="100%" stopColor="rgba(128, 0, 128, 0.5)" />
            </linearGradient>
            <linearGradient id="dna-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 255, 128, 0.5)" />
              <stop offset="100%" stopColor="rgba(75, 0, 130, 0.5)" />
            </linearGradient>
          </defs>
        </motion.svg>
        {/* Floating Particles (conceptual representation) */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-cyan-400/30"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 20 - 10, 0],
              y: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "mirror",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <motion.h1
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 animate-text-glow"
          style={{ filter: "drop-shadow(0 0 0.75rem rgba(0, 255, 255, 0.3))" }}
        >
          {title}
        </motion.h1>

        <motion.h2
          variants={subtitleContainerVariants}
          initial="hidden"
          animate="visible"
          className="text-lg sm:text-xl md:text-2xl text-gray-300 dark:text-gray-400 max-w-2xl mx-auto"
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
            <Skeleton className="h-[60vh] md:h-[70vh] w-full mb-16 rounded-lg" />
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
