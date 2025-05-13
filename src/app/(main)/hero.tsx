
"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight, Pause, Play, Sparkles, Atom, Brain, Dna } from 'lucide-react'; // Added new icons
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
          className="absolute text-primary/10 dark:text-teal-400/10"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: `calc(${Math.random() * 100}% - ${size / 2}px)`,
            y: `calc(${Math.random() * 100}% - ${size / 2}px)`,
            opacity: [0, 0.3, 0.5, 0.3, 0],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: Math.random() * 5,
          }}
        >
          <Icon style={{ width: size, height: size }} strokeWidth={0.5 + Math.random()} />
        </motion.div>
      );
    })}
  </div>
);


const HeroComponent: React.FC<HeroProps> = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);

  const displayArticles = articles
    .filter(article => article.status === 'Yayınlandı' && article.isHero === true)
    .slice(0, 5);

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

  const shouldShowAd = displayArticles.length === 0;

  if (shouldShowAd) {
      return (
           <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/80 to-teal-900/70 h-[65vh] md:h-[70vh] flex items-center justify-center text-center mb-16 rounded-lg shadow-2xl border border-primary/20">
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
                    <p className="text-lg md:text-xl text-teal-200/90 max-w-2xl mx-auto text-shadow-sm">
                      Biyohox, biyoloji severler için bir alan – yaşam dünyasını keşfetmek için notlar, quizler ve kısa derslerle dolu.
                    </p>
                    <p className="text-base md:text-lg text-purple-300/80 max-w-xl mx-auto font-light">
                      Hox genleri canlıyı şekillendirir, biz öğrenmeyi.
                    </p>
                    <Button
                        size="lg"
                        className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold px-8 py-3 text-lg rounded-lg shadow-lg hover:shadow-teal-500/40 transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-teal-500/50 active:bg-teal-600"
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

  if (!currentArticle) return null;

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
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/30 h-[50vh] md:h-[60vh] flex items-center justify-center text-center mb-16 rounded-lg shadow-inner">
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
