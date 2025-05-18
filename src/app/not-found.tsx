
"use client";

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Zap, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input'; // Added Input import

const AnimatedBrokenDna = () => {
  const strandVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut" }
    },
  };

  const dotVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: 1 + i * 0.1, duration: 0.5, type: "spring", stiffness: 300 }
    }),
  };

  const flyingPieceVariants = {
    initial: { y: 0, x:0, rotate: 0, opacity: 0.8 },
    animate: {
      y: [0, -10, 0, -5, 0],
      x: [0, 5, -5, 5, 0],
      rotate: [0, 5, -5, 10, 0],
      opacity: [0.8, 1, 0.8, 1, 0.8],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      }
    }
  };

  return (
    <svg
      width="150"
      height="150"
      viewBox="-10 -10 120 120"
      className="text-primary drop-shadow-lg mb-8 mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main unbroken part */}
      <motion.path
        d="M50 10 C 70 30, 30 50, 50 70"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        variants={strandVariants}
        initial="initial"
        animate="animate"
      />
      <motion.path
        d="M50 10 C 30 30, 70 50, 50 70"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        variants={strandVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
      />
      {/* Bases for unbroken part */}
      {[1,2,3].map(i => (
        <motion.line
          key={`base-${i}`}
          x1={40 - i*2} y1={20 + i*15}
          x2={60 - i*2} y2={20 + i*15 + 5}
          stroke="hsl(var(--foreground) / 0.5)"
          strokeWidth="3"
          strokeLinecap="round"
          variants={dotVariants}
          initial="initial"
          custom={i}
          animate="animate"
        />
      ))}

      {/* Broken flying piece */}
      <motion.g variants={flyingPieceVariants} initial="initial" animate="animate">
        <path
          d="M50 70 C 70 90, 30 110, 50 100" // Adjusted to look like it broke off from the bottom
          transform="translate(5,15) rotate(15)" // Position and rotate it a bit
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
         <line
          x1={40} y1={85}
          x2={60} y2={90}
          transform="translate(5,15) rotate(15)"
          stroke="hsl(var(--foreground) / 0.5)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </motion.g>
    </svg>
  );
};


export default function NotFoundPage() {
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center text-center p-6 overflow-hidden selection:bg-primary/20">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <AnimatedBrokenDna />

        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 150 }}
          className="text-8xl font-extrabold text-primary mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl font-semibold text-foreground mb-6"
        >
          Oops! Sayfa Kayıp... Genlerde mi Bozukluk Var?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-muted-foreground mb-8 text-lg"
        >
          Aradığınız sayfa, sanki bir genetik mutasyona uğramış ve evrimleşip başka bir yere gitmiş gibi. Belki de sadece yanlış bir kromozoma tıkladınız!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:scale-105">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Anasayfaya Dön (Hücreye Geri Dönüş)
            </Link>
          </Button>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Sitede Ara (Genomu Tara)..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.trim()) {
                  window.location.href = `/arama?q=${encodeURIComponent(searchTerm.trim())}`; // Placeholder, needs actual search page
                }
              }}
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="text-xs text-muted-foreground/70"
        >
          Eğer bu bir hataysa, lütfen laboratuvar teknisyenlerimize (yani bize) bildirin. Belki de sadece yeni bir tür keşfettiniz!
        </motion.p>
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="mt-10"
        >
            <Zap className="h-12 w-12 text-yellow-400 mx-auto animate-pulse" />
        </motion.div>
      </motion.div>
    </div>
  );
}

