
"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight, Pause, Play } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Define the structure for articles to be displayed
interface Article {
  id: string;
  title: string;
  description: string;
  category: 'Teknoloji' | 'Biyoloji';
  imageUrl: string;
}

// Mock data for featured articles (replace with actual data fetching)
const featuredArticles: Article[] = [
  {
    id: '1',
    title: 'Yapay Zeka Devrimi: Yeni Bir Çağın Başlangıcı',
    description: 'Yapay zeka teknolojilerinin günümüzdeki ve gelecekteki etkilerini keşfedin.',
    category: 'Teknoloji',
    imageUrl: 'https://picsum.photos/seed/ai-hero/1920/1080',
  },
  {
    id: '2',
    title: 'Gen Düzenleme Teknolojileri: CRISPR ve Ötesi',
    description: 'CRISPR gibi gen düzenleme teknolojilerinin potansiyelini ve etik boyutlarını inceleyin.',
    category: 'Biyoloji',
    imageUrl: 'https://picsum.photos/seed/crispr-hero/1920/1080',
  },
  {
    id: '3',
    title: 'Kuantum Bilgisayarlar: Hesaplamanın Geleceği',
    description: 'Kuantum bilgisayarların nasıl çalıştığını ve hangi alanlarda devrim yaratabileceğini öğrenin.',
    category: 'Teknoloji',
    imageUrl: 'https://picsum.photos/seed/quantum-hero/1920/1080',
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredArticles.length);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying]); // Re-run effect if isPlaying changes

  const currentArticle = featuredArticles[currentIndex];

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false); // Pause auto-play on manual interaction
    // Optional: Resume playing after a delay
    // setTimeout(() => setIsPlaying(true), 10000);
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
      {/* Animated Background Image */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex} // Change key to trigger animation
          className="absolute inset-0 z-0"
          variants={backgroundVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Image
            src={currentArticle.imageUrl}
            alt={currentArticle.title}
            layout="fill"
            objectFit="cover"
            quality={85}
            className="filter brightness-50 dark:brightness-[0.4]" // Darken image for text contrast
            data-ai-hint="technology biology abstract background"
            priority // Load the first image eagerly
          />
          {/* Gradient overlay for better text readability */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
        </motion.div>
      </AnimatePresence>

      <div className="container relative z-10 text-white dark:text-foreground px-4">
        {/* Animated Article Content */}
        <div className="relative h-48 md:h-40"> {/* Fixed height container */}
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentIndex} // Change key to trigger animation
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
                <h2 className="mt-2 text-xl font-semibold md:text-2xl text-shadow-md">
                    {currentArticle.title}
                </h2>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-200 dark:text-gray-300 sm:text-lg md:mt-4 md:text-xl md:max-w-3xl text-shadow-sm">
                {currentArticle.description}
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

      {/* Navigation Dots & Play/Pause */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-3">
        <Button variant="ghost" size="icon" onClick={togglePlay} className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 rounded-full">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="sr-only">{isPlaying ? "Durdur" : "Oynat"}</span>
        </Button>
        {featuredArticles.map((_, index) => (
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
    </section>
  );
};

export default Hero;
