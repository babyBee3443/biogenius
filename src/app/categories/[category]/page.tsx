import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from "lucide-react"; // Added icons
import { getArticles, type ArticleData } from '@/lib/mock-data'; // Import real data fetching

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
          {articles.map((article) => (
             <Card key={article.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col group"> {/* Subtle shadow, ease transition, group for hover */}
               <CardHeader className="p-0 relative">
                 <Image
                   src={article.mainImageUrl || 'https://picsum.photos/seed/placeholder-cat/600/400'} // Fallback image
                   alt={article.title}
                   width={600}
                   height={400}
                   className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" // Slight zoom on hover
                   data-ai-hint="category article abstract"
                 />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
               </CardHeader>
               <CardContent className="p-6 flex flex-col flex-grow"> {/* Increased padding */}
                 <CardTitle className="text-xl font-semibold mb-3">{article.title}</CardTitle>
                 <CardDescription className="text-muted-foreground mb-5 flex-grow line-clamp-3">{article.excerpt}</CardDescription> {/* Limit excerpt lines */}
                 <div className="mt-auto flex justify-end items-center"> {/* Aligned button to the right */}
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
