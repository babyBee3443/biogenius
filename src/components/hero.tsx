
"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
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
          className="absolute text-green-400/10 dark:text-emerald-500/10"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: `calc(${Math.random() * 100}% - ${size / 2}px)`,
            y: `calc(${Math.random() * 100}% - ${size / 2}px)`,
            opacity: [0, 0.2, 0.4, 0.2, 0],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 12 + 12,
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
    if (!isMounted) return [];
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
           <section className="relative overflow-hidden bg-gradient-to-br from-green-800/90 via-emerald-700/80 to-teal-800/70 h-[40vh] sm:h-[45vh] md:h-[50vh] flex items-center justify-center text-center mb-12 sm:mb-16 rounded-lg shadow-2xl border border-emerald-600/30">
              <AnimatedDnaBackground />
              <div className="container relative z-10 px-4 text-white">
                 <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                     className="space-y-4 sm:space-y-6"
                 >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-shadow-md">
                      Bilimin ışığında hücrelerden evrene bir yolculuk.
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-emerald-100/90 max-w-md sm:max-w-lg md:max-w-2xl mx-auto text-shadow-sm">
                      Biyohox, biyoloji severler için bir alan – yaşam dünyasını keşfetmek için notlar, quizler ve kısa derslerle dolu.
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-green-200/80 max-w-sm sm:max-w-md md:max-w-xl mx-auto font-light">
                      Hox genleri canlıyı şekillendirir, biz öğrenmeyi.
                    </p>
                    <Button
                        size="sm"
                        md-size="lg"
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-6 py-2.5 text-base sm:px-8 sm:py-3 sm:text-lg rounded-lg shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-emerald-500/50 active:bg-emerald-600"
                        asChild
                    >
                        <Link href="/biyoloji-notlari">
                            Derse Başla <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                        </Link>
                    </Button>
                 </motion.div>
              </div>
           </section>
      );
  }

  const currentArticle = displayArticles[currentIndex];

  if (!currentArticle) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-green-800/90 via-emerald-700/80 to-teal-800/70 h-[40vh] sm:h-[45vh] md:h-[50vh] flex items-center justify-center text-center mb-12 sm:mb-16 rounded-lg shadow-2xl border border-emerald-600/30">
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
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/30 h-[40vh] sm:h-[45vh] md:h-[50vh] flex items-center justify-center text-center mb-12 sm:mb-16 rounded-lg shadow-inner">
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
        <motion.div
            key={`text-content-${currentArticle.id}`}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center justify-center p-4" // Added padding for content
        >
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-shadow-md">
                {currentArticle.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm md:text-base lg:text-lg max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl mx-auto text-gray-200 dark:text-gray-300 text-shadow-sm line-clamp-2 sm:line-clamp-3">
            {currentArticle.excerpt}
            </p>
            <Button size="sm" md-size="lg" asChild className="mt-4 sm:mt-6">
            <Link href={`/articles/${currentArticle.id}`}>
                Devamını Oku <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Link>
            </Button>
        </motion.div>
      </div>

      {displayArticles.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-2 sm:space-x-3">
          <Button variant="ghost" size="icon" onClick={togglePlay} className="h-7 w-7 sm:h-8 sm:w-8 text-white/70 hover:text-white hover:bg-white/10 rounded-full">
              {isPlaying ? <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              <span className="sr-only">{isPlaying ? "Durdur" : "Oynat"}</span>
          </Button>
          {displayArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={cn(
                'h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-colors duration-300',
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
