import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  description: string;
  category: 'Teknoloji' | 'Biyoloji';
  imageUrl: string;
  content: string; // Add detailed content
}

// Mock data - replace with actual data fetching
const allArticles: Article[] = [
   { id: '1', title: 'Yapay Zeka Devrimi', description: 'AI etkileri...', category: 'Teknoloji', imageUrl: 'https://picsum.photos/seed/ai/800/400', content: '<p>Yapay zeka (AI), makinelerin insan benzeri zeka sergileme yeteneğidir. Günümüzde AI, sağlık hizmetlerinden finansa, eğlenceden ulaşıma kadar birçok alanda kullanılmaktadır...</p><p>Gelecekte AI\'nın potansiyeli daha da büyüktür...</p><h2>Alt Başlık</h2><p>Detaylı açıklamalar burada yer alacak.</p>' },
   { id: '2', title: 'Gen Düzenleme Teknolojileri', description: 'CRISPR ve ötesi...', category: 'Biyoloji', imageUrl: 'https://picsum.photos/seed/crispr/800/400', content: '<p>Gen düzenleme, DNA diziliminde değişiklik yapma teknolojisidir. CRISPR-Cas9 sistemi, bu alanda devrim yaratmıştır...</p><p>Etik tartışmalar devam etmektedir...</p>' },
   { id: '3', title: 'Kuantum Bilgisayarlar', description: 'Hesaplamanın geleceği...', category: 'Teknoloji', imageUrl: 'https://picsum.photos/seed/quantum/800/400', content: '<p>Kuantum bilgisayarlar, klasik bilgisayarların çözemeyeceği problemleri çözme potansiyeline sahiptir. Kübitler kullanarak çalışırlar...</p>' },
   { id: '4', title: 'Mikrobiyom: İçimizdeki Dünya', description: 'Sağlık etkileri...', category: 'Biyoloji', imageUrl: 'https://picsum.photos/seed/microbiome/800/400', content: '<p>İnsan vücudu trilyonlarca mikroorganizmaya ev sahipliği yapar. Bu mikrobiyomun sağlığımız üzerindeki etkileri giderek daha iyi anlaşılmaktadır...</p>' },
   { id: '5', title: 'Blockchain Teknolojisi', description: 'Uygulama alanları...', category: 'Teknoloji', imageUrl: 'https://picsum.photos/seed/blockchain/800/400', content: '<p>Blockchain, dağıtık ve değiştirilemez bir kayıt defteri teknolojisidir. Kripto paraların ötesinde tedarik zinciri yönetimi, oy verme sistemleri gibi alanlarda kullanılabilir...</p>' },
   { id: '6', title: 'Sentetik Biyoloji', description: 'Yaşamı yeniden tasarlamak...', category: 'Biyoloji', imageUrl: 'https://picsum.photos/seed/syntheticbio/800/400', content: '<p>Sentetik biyoloji, biyolojik sistemleri mühendislik prensipleriyle tasarlama ve inşa etme alanıdır. Yeni ilaçların geliştirilmesinden biyoyakıt üretimine kadar geniş bir uygulama alanı vardır...</p>' },
   // Add more articles
];


interface ArticlePageProps {
  params: {
    id: string;
  };
}

// Function to safely render HTML content
function createMarkup(htmlContent: string) {
  return { __html: htmlContent };
}


export async function generateStaticParams() {
  // Generate static paths for all articles
  return allArticles.map((article) => ({
    id: article.id,
  }));
}


export default function ArticlePage({ params }: ArticlePageProps) {
  const article = allArticles.find(a => a.id === params.id);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
         <Link href={`/categories/${article.category.toLowerCase()}`} className={`text-sm font-medium mb-2 inline-block ${article.category === 'Teknoloji' ? 'text-blue-600 hover:text-blue-800' : 'text-green-600 hover:text-green-800'}`}>
           {article.category}
         </Link>
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <p className="text-lg text-muted-foreground">{article.description}</p>
      </header>

      <Image
        src={article.imageUrl}
        alt={article.title}
        width={800}
        height={400}
        className="w-full h-auto rounded-lg mb-8 shadow-md"
        priority // Prioritize loading the main image
      />

      {/* Render article content using dangerouslySetInnerHTML */}
      <div
         className="prose dark:prose-invert max-w-none space-y-4"
         dangerouslySetInnerHTML={createMarkup(article.content)}
      />


      {/* Placeholder for Related Articles, Sharing Buttons, Comments */}
       <div className="mt-12 border-t pt-8">
         <h2 className="text-2xl font-semibold mb-4">İlgili Makaleler</h2>
         {/* Add related articles component here */}
         <p className="text-muted-foreground">Yakında ilgili makaleler burada olacak.</p>
       </div>

       <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Paylaş</h2>
          {/* Add sharing buttons component here */}
           <div className="flex space-x-2">
              <Button variant="outline" size="sm">Twitter</Button>
              <Button variant="outline" size="sm">Facebook</Button>
              <Button variant="outline" size="sm">LinkedIn</Button>
           </div>
       </div>

       <div className="mt-12">
         <h2 className="text-2xl font-semibold mb-4">Yorumlar</h2>
         {/* Add comments component here */}
         <p className="text-muted-foreground">Yorum sistemi yakında eklenecektir.</p>
       </div>

       <div className="mt-12 text-center">
           <Button asChild variant="outline">
               <Link href="/">Ana Sayfaya Dön</Link>
           </Button>
       </div>
    </article>
  );
}

// Basic CSS for prose styling (add to globals.css or use Tailwind Typography plugin if installed)
/*
@layer utilities {
  .prose {
    color: hsl(var(--foreground));
  }
  .prose h2 {
    @apply text-2xl font-semibold mt-8 mb-4;
  }
  .prose p {
    @apply leading-relaxed mb-4;
  }
  .prose a {
    @apply text-primary hover:underline;
  }
  .dark .prose-invert {
     color: hsl(var(--foreground));
  }
   .dark .prose-invert a {
     @apply text-primary hover:underline;
   }
}
*/

