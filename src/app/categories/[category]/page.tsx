import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { notFound } from 'next/navigation';

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
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">{categoryName} Makaleleri</h1>
      {articles.length === 0 ? (
        <p className="text-muted-foreground">Bu kategoride henüz makale bulunmamaktadır.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
             <Card key={article.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
               <CardHeader className="p-0">
                 <Image
                   src={article.imageUrl}
                   alt={article.title}
                   width={600}
                   height={400}
                   className="w-full h-48 object-cover"
                 />
               </CardHeader>
               <CardContent className="p-4 flex flex-col flex-grow">
                 <CardTitle className="text-xl font-semibold mb-2">{article.title}</CardTitle>
                 <CardDescription className="text-muted-foreground mb-4 flex-grow">{article.description}</CardDescription>
                 <div className="mt-auto flex justify-between items-center">
                    {/* Category tag can be omitted here as we are already in the category page */}
                    <Button asChild variant="link" className="p-0 h-auto text-primary">
                       <Link href={`/articles/${article.id}`}>Devamını Oku →</Link>
                    </Button>
                 </div>
               </CardContent>
             </Card>
          ))}
        </div>
      )}
       <div className="mt-8 text-center">
           <Button asChild variant="outline">
             <Link href="/">Ana Sayfaya Dön</Link>
           </Button>
       </div>
    </div>
  );
}
