
"use client"; // Add this line because we're using Framer Motion client-side

import * as React from 'react'; // Import React for useState/useEffect if needed elsewhere
import { motion } from 'framer-motion'; // Import motion
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { ArrowRight } from "lucide-react";
import Hero from "@/components/hero"; // Import the Hero component
import { cn } from '@/lib/utils'; // Import cn for conditional classes

interface Article {
  id: string;
  title: string;
  description: string;
  category: 'Teknoloji' | 'Biyoloji';
  imageUrl: string;
}

const featuredArticles: Article[] = [
  {
    id: '1',
    title: 'Yapay Zeka Devrimi: Yeni Bir Çağın Başlangıcı',
    description: 'Yapay zeka teknolojilerinin günümüzdeki ve gelecekteki etkilerini keşfedin.',
    category: 'Teknoloji',
    imageUrl: 'https://picsum.photos/seed/ai/600/400',
  },
  {
    id: '2',
    title: 'Gen Düzenleme Teknolojileri: CRISPR ve Ötesi',
    description: 'CRISPR gibi gen düzenleme teknolojilerinin potansiyelini ve etik boyutlarını inceleyin.',
    category: 'Biyoloji',
    imageUrl: 'https://picsum.photos/seed/crispr/600/400',
  },
  {
    id: '3',
    title: 'Kuantum Bilgisayarlar: Hesaplamanın Geleceği',
    description: 'Kuantum bilgisayarların nasıl çalıştığını ve hangi alanlarda devrim yaratabileceğini öğrenin.',
    category: 'Teknoloji',
    imageUrl: 'https://picsum.photos/seed/quantum/600/400',
  },
];

const recentArticles: Article[] = [
    {
      id: '4',
      title: 'Mikrobiyom: İçimizdeki Gizli Dünya',
      description: 'İnsan vücudundaki mikroorganizmaların sağlığımız üzerindeki etkileri.',
      category: 'Biyoloji',
      imageUrl: 'https://picsum.photos/seed/microbiome/600/400',
    },
     {
      id: '5',
      title: 'Blockchain Teknolojisi ve Uygulama Alanları',
      description: 'Blockchain\'in finans dışındaki potansiyel kullanım alanları.',
      category: 'Teknoloji',
      imageUrl: 'https://picsum.photos/seed/blockchain/600/400',
    },
     {
      id: '6',
      title: 'Sentetik Biyoloji: Yaşamı Yeniden Tasarlamak',
      description: 'Sentetik biyolojinin tıp, enerji ve malzeme bilimindeki uygulamaları.',
      category: 'Biyoloji',
      imageUrl: 'https://picsum.photos/seed/syntheticbio/600/400',
    },
];


// Animation variants for the title reveal
const titleContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04, // Stagger the appearance of each letter
      delayChildren: 0.2,
    },
  },
};

const letterRevealVariants = {
  hidden: { opacity: 0, y: 15 }, // Initial state: invisible, slightly down
  visible: { // Target state: visible, original position
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.2, 0.65, 0.3, 0.9], // Custom easing for a smooth reveal
    },
  },
};

// Define the text parts and their styles, including images for masking
const titleParts = [
  {
      text: "Teknoloji",
      colorClass: "text-blue-600 dark:text-blue-400", // Base color (fallback)
      masked: true,
      imageUrl: "https://picsum.photos/seed/techblue/1200/300", // Updated URL
      aiHint: "blue technology circuit abstract", // Updated hint
   },
  { text: " ve ", colorClass: "text-foreground" }, // Use default foreground color
  {
      text: "Biyolojinin",
      colorClass: "text-green-600 dark:text-green-400", // Base color (fallback)
      masked: true,
      imageUrl: "https://picsum.photos/seed/biogreen/1200/300", // Updated URL
      aiHint: "green biology nature plants dna abstract", // Updated hint
   },
  { text: " Kesişim Noktası", colorClass: "text-foreground" }, // Use default foreground color
];


export default function Home() {
  let charIndex = 0; // Keep track of the global character index for stagger delay

  return (
    <div className="space-y-16">
      {/* Animated Static Title Above Hero */}
      <motion.h1
        className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl mb-8 overflow-hidden py-2" // Adjusted whitespace-nowrap for wrapping
        variants={titleContainerVariants}
        initial="hidden"
        animate="visible"
        aria-label="Teknoloji ve Biyolojinin Kesişim Noktası"
      >
        {titleParts.map((part, partIndex) => {
            // Generate a unique key for the part to help React with updates
            const partKey = `part-${partIndex}-${part.text}`;

            // Prepare inline style for masked parts
            const maskStyle = part.masked && part.imageUrl ? {
                backgroundImage: `url(${part.imageUrl})`,
            } : {};

            return (
                 // Use a span for the whole word part if masked, to apply background correctly
                 <span
                     key={partKey}
                     className={cn(
                         "inline-block", // Ensure spans behave correctly
                         part.masked ? 'bg-cover bg-center bg-clip-text text-transparent' : part.colorClass
                     )}
                     style={maskStyle}
                     {...(part.masked && { "data-ai-hint": part.aiHint })}
                 >
                     {part.text.split("").map((char) => {
                        const currentIndex = charIndex++;

                         // Shimmer animation remains the same
                         const shimmerAnimation = {
                             textShadow: [
                               "0 0 1px hsl(var(--foreground) / 0.1)",
                               `0 0 5px ${part.masked ? 'hsl(var(--foreground) / 0.6)' : (part.colorClass.includes('blue') ? 'hsl(var(--primary) / 0.8)' : part.colorClass.includes('green') ? 'hsl(120 70% 45% / 0.8)' : 'hsl(var(--foreground) / 0.5)')}`, // Adjusted glow for masked text
                               "0 0 1px hsl(var(--foreground) / 0.1)",
                             ],
                         };

                         const shimmerTransition = {
                              textShadow: {
                                 delay: currentIndex * 0.2, // Slowed down delay further
                                 duration: 8, // Slowed down duration further
                                 repeat: Infinity,
                                 repeatType: "mirror",
                                 ease: "easeInOut",
                               },
                         };

                         // Render each character within its own motion.span for individual animation
                         return (
                            <motion.span
                                key={`${partKey}-char-${currentIndex}`}
                                variants={letterRevealVariants}
                                className={cn(
                                    "inline-block",
                                     // Apply base color if not masked, otherwise handled by parent span
                                     !part.masked ? part.colorClass : ''
                                )}
                                animate={shimmerAnimation}
                                transition={shimmerTransition}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                        );
                    })}
                </span>
            );
        })}
      </motion.h1>

       {/* Hero Section - No longer includes the static title */}
       <Hero />

      {/* Featured Articles Showcase */}
      <section id="featured-articles"> {/* Added ID for linking from Hero button */}
        <h2 className="text-3xl font-bold mb-8">Öne Çıkanlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col group">
              <CardHeader className="p-0 relative">
                 <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={featuredArticles.indexOf(article) < 3}
                  data-ai-hint="technology biology abstract"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </CardHeader>
              <CardContent className="p-6 flex flex-col flex-grow">
                 <CardTitle className="text-xl font-semibold mb-3">{article.title}</CardTitle>
                <CardDescription className="text-muted-foreground mb-5 flex-grow">{article.description}</CardDescription>
                 <div className="mt-auto flex justify-between items-center">
                   <span className={`text-xs font-semibold px-2 py-1 rounded ${article.category === 'Teknoloji' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                     {article.category}
                   </span>
                   <Button asChild variant="link" className="p-0 h-auto text-primary hover:text-primary/80 transition-colors">
                     <Link href={`/articles/${article.id}`} className="flex items-center">
                       Devamını Oku <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                   </Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

       {/* Category-Based Browsing Teaser */}
       <section>
         <h2 className="text-3xl font-bold mb-8">Kategoriler</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-secondary/70 p-8 rounded-lg shadow-sm text-center border border-transparent hover:border-primary/30 transition-colors duration-300">
             <h3 className="text-2xl font-semibold mb-3">Teknoloji</h3>
             <p className="text-muted-foreground mb-6">Yapay zeka, kuantum bilişim, yazılım geliştirme ve daha fazlası hakkında en son makaleler.</p>
             <Button asChild>
               <Link href="/categories/teknoloji">Teknoloji Makaleleri <ArrowRight className="ml-2 h-4 w-4" /></Link>
             </Button>
           </div>
           <div className="bg-secondary/70 p-8 rounded-lg shadow-sm text-center border border-transparent hover:border-primary/30 transition-colors duration-300">
             <h3 className="text-2xl font-semibold mb-3">Biyoloji</h3>
             <p className="text-muted-foreground mb-6">Genetik, mikrobiyoloji, evrim, ekoloji ve yaşam bilimlerinin diğer dallarındaki gelişmeler.</p>
             <Button asChild>
               <Link href="/categories/biyoloji">Biyoloji Makaleleri <ArrowRight className="ml-2 h-4 w-4" /></Link>
             </Button>
           </div>
         </div>
       </section>


      {/* Recent Articles */}
      <section>
        <h2 className="text-3xl font-bold mb-8">En Son Eklenenler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {recentArticles.map((article) => (
             <Card key={article.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col group">
               <CardHeader className="p-0 relative">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="recent abstract data"
                 />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
               </CardHeader>
               <CardContent className="p-6 flex flex-col flex-grow">
                  <CardTitle className="text-xl font-semibold mb-3">{article.title}</CardTitle>
                 <CardDescription className="text-muted-foreground mb-5 flex-grow">{article.description}</CardDescription>
                  <div className="mt-auto flex justify-between items-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${article.category === 'Teknoloji' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                      {article.category}
                    </span>
                    <Button asChild variant="link" className="p-0 h-auto text-primary hover:text-primary/80 transition-colors">
                      <Link href={`/articles/${article.id}`} className="flex items-center">
                        Devamını Oku <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
               </CardContent>
             </Card>
           ))}
         </div>
      </section>

    </div>
  );
}
