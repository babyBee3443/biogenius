
"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const Hero = () => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/30 py-20 md:py-32 mb-16 rounded-lg shadow-inner">
      {/* Background animated shapes (optional) */}
      <motion.div
        className="absolute inset-0 z-0 opacity-10 dark:opacity-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
          <Image
            src="https://picsum.photos/seed/herobackground/1920/1080"
            alt="Abstract background"
            layout="fill"
            objectFit="cover"
            quality={75}
            className="filter blur-sm"
            data-ai-hint="abstract technology biology background"
            priority
          />
        {/* Simple animated shapes example */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full filter blur-xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
           className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent/10 rounded-lg filter blur-lg"
          animate={{ scale: [1, 0.9, 1], x: [0, 5, 0] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", delay: 2 }}
        />
      </motion.div>

      <div className="container relative z-10 text-center">
        <motion.h1
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="block xl:inline">Teknoloji ve Biyolojinin</span>{' '}
          <span className="block text-primary xl:inline">Kesişim Noktası</span>
        </motion.h1>
        <motion.p
          className="mt-4 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-6 md:text-xl md:max-w-3xl"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Yapay zekadan gen düzenlemeye, kuantum bilişimden sentetik biyolojiye kadar bilimin ve teknolojinin sınırlarını zorlayan en son gelişmeleri keşfedin.
        </motion.p>
        <motion.div
          className="mt-8 flex justify-center gap-4"
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button size="lg" asChild>
            <Link href="#featured-articles">
              Makaleleri Keşfet <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/hakkimizda">
              Daha Fazla Bilgi
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
