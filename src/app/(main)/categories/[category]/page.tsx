
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from "lucide-react"; // Added icons
import { getArticles, type ArticleData } from '@/lib/mock-data'; // Import real data fetching
import { ArticleCard } from '@/components/article-card'; // Import ArticleCard

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// No need for generateStaticParams if we fetch data dynamically based on URL

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = params;
  const categoryName = categorySlug === 'teknoloji' ? 'Teknoloji' : categorySlug === 'biyoloji' ? 'Biyoloji' : null;

  if (!categoryName) {
    notFound();
  }

  // Fetch all articles and filter them
  const allArticles = await getArticles();
  const articles = allArticles.filter(article =>
      article.category === categoryName && article.status === 'Yayınlandı' // Filter by category AND status
  );

  return (
    <div className="space-y-12"> {/* Increased spacing */}
      <h1 className="text-4xl font-bold mb-8">{categoryName} Makaleleri</h1> {/* Added margin bottom */}
      {articles.length === 0 ? (
        <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Bu kategoride henüz makale bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap */}
          {articles.map((article, index) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              priority={index < 3}
              imageHint="category article abstract"
            />
          ))}
        </div>
      )}
       <div className="mt-12 text-center"> {/* Increased margin top */}
           <Button asChild variant="outline">
             <Link href="/" className="inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> Ana Sayfaya Dön
             </Link>
           </Button>
       </div>
    </div>
  );
}
