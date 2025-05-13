"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight, Pause, Play, Sparkles, Atom, Brain, Dna } from 'lucide-react'; 
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ArticleData } from '@/lib/mock-data';

interface HeroProps {
  articles: ArticleData[];
}

const AnimatedDnaBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    {[...Array(15)].map((_, i) => {
      const Icon = [Atom, Brain, Dna, Sparkles][i % 4];
      const size = Math.random() * 20 + 10;
      return (
        <motion.div
          key={`particle-${i}`}
          className="absolute text-green-400/10 dark:text-emerald-500/10" // Changed color to fit green theme
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: `calc(${Math.random() * 100}% - ${size / 2}px)`,
            y: `calc(${Math.random() * 100}% - ${size / 2}px)`,
            opacity: [0, 0.2, 0.4, 0.2, 0], // Adjusted opacity for softer effect
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 12 + 12, // Slightly slower animation
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: Math.random() * 6,
          }}
        >
          <Icon style={{ width: size, height: size }} strokeWidth={0.4 + Math.random() * 0.8} />
        </motion.div>
      );
    })}
  </div>
);


const HeroComponent: React.FC<HeroProps> = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);


  const displayArticles = React.useMemo(() => {
    if (!isMounted) return []; // Prevent running filter on server for potentially empty/default articles
    return articles
      .filter(article => article.status === 'Yayınlandı' && article.isHero === true)
      .slice(0, 5);
  }, [articles, isMounted]);


  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && displayArticles.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % displayArticles.length);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, displayArticles.length]);

  React.useEffect(() => {
    if (displayArticles.length > 0 && currentIndex >= displayArticles.length) {
      setCurrentIndex(0);
    } else if (displayArticles.length === 0 && currentIndex !== 0) {
      setCurrentIndex(0);
    }
  }, [displayArticles, currentIndex]);

  const shouldShowAd = !isMounted || displayArticles.length === 0;


  if (shouldShowAd) {
      return (
           <section className="relative overflow-hidden bg-gradient-to-br from-green-800/90 via-emerald-700/80 to-teal-800/70 h-[50vh] md:h-[55vh] flex items-center justify-center text-center mb-16 rounded-lg shadow-2xl border border-emerald-600/30"> {/* Changed gradient */}
              <AnimatedDnaBackground />
              <div className="container relative z-10 px-4 text-white">
                 <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                     className="space-y-6"
                 >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-shadow-md">
                      Bilimin ışığında hücrelerden evrene bir yolculuk.
                    </h1>
                    <p className="text-lg md:text-xl text-emerald-100/90 max-w-2xl mx-auto text-shadow-sm"> {/* Changed text color */}
                      Biyohox, biyoloji severler için bir alan – yaşam dünyasını keşfetmek için notlar, quizler ve kısa derslerle dolu.
                    </p>
                    <p className="text-base md:text-lg text-green-200/80 max-w-xl mx-auto font-light"> {/* Changed text color */}
                      Hox genleri canlıyı şekillendirir, biz öğrenmeyi.
                    </p>
                    <Button
                        size="lg"
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-8 py-3 text-lg rounded-lg shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-emerald-500/50 active:bg-emerald-600" // Adjusted button color
                        asChild
                    >
                        <Link href="/biyoloji-notlari">
                            Derse Başla <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                 </motion.div>
              </div>
           </section>
      );
  }

  const currentArticle = displayArticles[currentIndex];

  // This should ideally not happen if shouldShowAd logic is correct and isMounted handles SSR correctly
  if (!currentArticle) {
    return ( // Fallback for safety, or render a loading state if preferred
      <section className="relative overflow-hidden bg-gradient-to-br from-green-800/90 via-emerald-700/80 to-teal-800/70 h-[50vh] md:h-[55vh] flex items-center justify-center text-center mb-16 rounded-lg shadow-2xl border border-emerald-600/30">
        <AnimatedDnaBackground />
        <div className="container relative z-10 px-4 text-white">
          <p>Yükleniyor...</p>
        </div>
      </section>
    );
  }


  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

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
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/30 h-[50vh] md:h-[55vh] flex items-center justify-center text-center mb-16 rounded-lg shadow-inner">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={`bg-${currentArticle.id}`}
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

      <div className="container relative z-10 text-white dark:text-gray-100 px-4">
        <div className="relative h-48 md:h-40">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={`text-${currentArticle.id}`}
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