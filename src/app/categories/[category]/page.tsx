import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from "lucide-react"; // Added icons

interface Article {
  id: string;
  title: string;
  description: string;
  category: 'Teknoloji' | 'Biyoloji';
  imageUrl: string;
}

// Mock data - replace with actual data fetching
const allArticles: Article[] = [
  { id: '1', title: 'Yapay Zeka Devrimi', description: 'AI etkileri...', category: 'Teknoloji', imageUrl: 'https://picsum.photos/seed/ai/600/400' },
  { id: '2', title: 'Gen Düzenleme Teknolojileri', description: 'CRISPR ve ötesi...', category: 'Biyoloji', imageUrl: 'https://picsum.photos/seed/crispr/600/400' },
  { id: '3', title: 'Kuantum Bilgisayarlar', description: 'Hesaplamanın geleceği...', category: 'Teknoloji', imageUrl: 'https://picsum.photos/seed/quantum/600/400' },
  { id: '4', title: 'Mikrobiyom: İçimizdeki Dünya', description: 'Sağlık etkileri...', category: 'Biyoloji', imageUrl: 'https://picsum.photos/seed/microbiome/600/400' },
  { id: '5', title: 'Blockchain Teknolojisi', description: 'Uygulama alanları...', category: 'Teknoloji', imageUrl: 'https://picsum.photos/seed/blockchain/600/400' },
  { id: '6', title: 'Sentetik Biyoloji', description: 'Yaşamı yeniden tasarlamak...', category: 'Biyoloji', imageUrl: 'https://picsum.photos/seed/syntheticbio/600/400' },
   // Add more articles
];

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export function generateStaticParams() {
  // Define the categories for static generation
  return [{ category: 'teknoloji' }, { category: 'biyoloji' }];
}


export default function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = params;
  const categoryName = categorySlug === 'teknoloji' ? 'Teknoloji' : categorySlug === 'biyoloji' ? 'Biyoloji' : null;

  if (!categoryName) {
    notFound();
  }

  const articles = allArticles.filter(article => article.category === categoryName);

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
                   src={article.imageUrl}
                   alt={article.title}
                   width={600}
                   height={400}
                   className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" // Slight zoom on hover
                 />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
               </CardHeader>
               <CardContent className="p-6 flex flex-col flex-grow"> {/* Increased padding */}
                 <CardTitle className="text-xl font-semibold mb-3">{article.title}</CardTitle> {/* Increased margin bottom */}
                 <CardDescription className="text-muted-foreground mb-5 flex-grow">{article.description}</CardDescription> {/* Increased margin bottom */}
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
