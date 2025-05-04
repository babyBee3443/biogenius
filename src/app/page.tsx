
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
import { getArticles, type ArticleData } from '@/lib/mock-data'; // Import mock data functions

// Define the text parts and their styles
const titleParts = [
    {
        text: "Teknoloji",
        colorClass: "text-blue-600 dark:text-blue-400",
    },
    { text: " ve ", colorClass: "text-foreground" },
    {
        text: "Biyolojinin",
        colorClass: "text-green-600 dark:text-green-400",
    },
    { text: " Kesişim Noktası", colorClass: "text-foreground" },
];

// Animation variants for the title reveal
const titleContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03, // Slightly faster stagger
      delayChildren: 0.2,
    },
  },
};

const letterRevealVariants = {
  hidden: { opacity: 0.5, y: 10 }, // Start slightly faded and down
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Home() {
  const [allArticles, setAllArticles] = React.useState<ArticleData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getArticles()
      .then(data => {
        setAllArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching articles:", err);
        // Handle error state if needed
        setLoading(false);
      });
  }, []);

  // Filter articles for display only after data is loaded
  const publishedArticles = allArticles.filter(article => article.status === 'Yayınlandı');

  const featuredArticles: ArticleData[] = publishedArticles
    .filter(article => article.isFeatured === true)
    .slice(0, 3); // Limit to 3 featured

  const recentArticles: ArticleData[] = publishedArticles
    .filter(article => !article.isFeatured) // Exclude featured articles from recent
    // Sort by creation date descending (assuming createdAt is a valid date string)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3); // Limit to 3 recent

  if (loading) {
     // Optional: Render a loading state
     return <div className="container py-12 text-center">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-16">
      {/* Animated Title */}
      <motion.h1
        className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl mb-8 overflow-hidden py-2"
        variants={titleContainerVariants}
        initial="hidden"
        animate="visible"
        aria-label="Teknoloji ve Biyolojinin Kesişim Noktası"
      >
        {titleParts.map((part, partIndex) => (
            <span key={`part-${partIndex}`} className="inline-block"> {/* Wrap word parts */}
                {part.text.split("").map((char, charIndex) => (
                    <motion.span
                        key={`${partIndex}-${charIndex}`}
                        variants={letterRevealVariants}
                        className={cn(
                            "inline-block", // Keep inline-block for transform origin
                            part.colorClass,
                        )}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                ))}
            </span>
        ))}
      </motion.h1>

       {/* Hero Section - Pass only published articles */}
       <Hero articles={publishedArticles} />

      {/* Featured Articles Showcase */}
      <section id="featured-articles"> {/* Added ID for linking from Hero button */}
        <h2 className="text-3xl font-bold mb-8">Öne Çıkanlar</h2>
        {featuredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col group">
                <CardHeader className="p-0 relative">
                    <Image
                    src={article.mainImageUrl || 'https://picsum.photos/seed/placeholder/600/400'} // Fallback image
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
                    <CardDescription className="text-muted-foreground mb-5 flex-grow line-clamp-3">{article.excerpt}</CardDescription> {/* Limit excerpt lines */}
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
        ) : (
             <p className="text-muted-foreground">Şu anda öne çıkan makale bulunmamaktadır.</p>
        )}
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
        {recentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col group">
                <CardHeader className="p-0 relative">
                    <Image
                        src={article.mainImageUrl || 'https://picsum.photos/seed/placeholder-recent/600/400'} // Fallback image
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
                    <CardDescription className="text-muted-foreground mb-5 flex-grow line-clamp-3">{article.excerpt}</CardDescription> {/* Limit excerpt lines */}
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
         ) : (
             <p className="text-muted-foreground">Yakın zamanda yayınlanmış makale bulunmamaktadır.</p>
        )}
      </section>

    </div>
  );
}
