
"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight, Pause, Play, BadgePercent } from 'lucide-react'; // Added BadgePercent for Ad
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ArticleData } from '@/lib/mock-data'; // Import ArticleData type

interface HeroProps {
  articles: ArticleData[]; // Accept ArticleData[]
}

const HeroComponent: React.FC<HeroProps> = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);

  // Filter articles for Hero: Must be Published AND isHero
  const displayArticles = articles
    .filter(article => article.status === 'Yayınlandı' && article.isHero === true) // Filter by isHero
    .slice(0, 5); // Limit to max 5 for Hero display

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && displayArticles.length > 1) { // Only set interval if playing and more than one article
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % displayArticles.length);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, displayArticles.length]); // Re-run effect if isPlaying or articles change

  // Ensure currentIndex is valid after articles might change
  React.useEffect(() => {
    if (displayArticles.length > 0 && currentIndex >= displayArticles.length) {
      setCurrentIndex(0);
    } else if (displayArticles.length === 0) {
      setCurrentIndex(0); // Reset if no articles
    }
  }, [displayArticles, currentIndex]);


  // --- Ad Display Logic ---
  const shouldShowAd = displayArticles.length === 0;

  if (shouldShowAd) {
      return (
           <section className="relative overflow-hidden bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 h-[50vh] md:h-[60vh] flex items-center justify-center text-center mb-16 rounded-lg shadow-inner border border-primary/10">
              <div className="container relative z-10 px-4">
                 <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.5, ease: "easeOut" }}
                 >
                     <BadgePercent className="h-16 w-16 text-primary mb-4 mx-auto" />
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">TeknoBiyo'ya Özel İndirimler!</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">Bilim ve teknoloji dünyasını keşfederken avantajlı fırsatları kaçırmayın.</p>
                    <Button size="lg">
                        Fırsatları Gör <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                 </motion.div>
              </div>
           </section>
      );
  }
  // --- End Ad Display Logic ---


  const currentArticle = displayArticles[currentIndex];

  if (!currentArticle) {
    return null; 
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false); 
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeIn" } },
  };

  const backgroundVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.8, ease: "easeIn" } },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/30 h-[50vh] md:h-[60vh] flex items-center justify-center text-center mb-16 rounded-lg shadow-inner"> {/* Reduced height */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex} 
          className="absolute inset-0 z-0"
          variants={backgroundVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Image
            src={currentArticle.mainImageUrl || 'https://picsum.photos/seed/hero-placeholder/1920/1080'}
            alt={currentArticle.title}
            layout="fill"
            objectFit="cover"
            quality={85}
            className="filter brightness-50 dark:brightness-[0.4]"
            data-ai-hint="technology biology abstract background"
            priority={currentIndex === 0}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
        </motion.div>
      </AnimatePresence>

      <div className="container relative z-10 text-white dark:text-gray-100 px-4"> {/* Adjusted dark text color for better contrast */}
        <div className="relative h-48 md:h-40"> 
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentIndex} 
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
                <h2 className="mt-2 text-xl font-semibold md:text-2xl text-shadow-md">
                    {currentArticle.title}
                </h2>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-200 dark:text-gray-300 sm:text-lg md:mt-4 md:text-xl md:max-w-3xl text-shadow-sm line-clamp-3"> 
                {currentArticle.excerpt}
              </p>
              <Button size="lg" asChild className="mt-6">
                <Link href={`/articles/${currentArticle.id}`}>
                  Devamını Oku <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {displayArticles.length > 1 && ( 
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={togglePlay} className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 rounded-full">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span className="sr-only">{isPlaying ? "Durdur" : "Oynat"}</span>
          </Button>
          {displayArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={cn(
                'h-2 w-2 rounded-full transition-colors duration-300',
                currentIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
              )}
              aria-label={`Makaleye git ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export const Hero = React.memo(HeroComponent);
export default Hero;
