import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';

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

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Featured Articles Showcase */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Öne Çıkanlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="p-0">
                 <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                  priority={featuredArticles.indexOf(article) < 3} // Prioritize loading images for the first few articles
                />
              </CardHeader>
              <CardContent className="p-4 flex flex-col flex-grow">
                 <CardTitle className="text-xl font-semibold mb-2">{article.title}</CardTitle>
                <CardDescription className="text-muted-foreground mb-4 flex-grow">{article.description}</CardDescription>
                 <div className="mt-auto flex justify-between items-center">
                   <span className={`text-sm font-medium ${article.category === 'Teknoloji' ? 'text-blue-600' : 'text-green-600'}`}>
                     {article.category}
                   </span>
                   <Button asChild variant="link" className="p-0 h-auto text-primary">
                     <Link href={`/articles/${article.id}`}>Devamını Oku →</Link>
                   </Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

       {/* Category-Based Browsing Teaser */}
       <section>
         <h2 className="text-3xl font-bold mb-6">Kategoriler</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-secondary p-8 rounded-lg shadow-md text-center">
             <h3 className="text-2xl font-semibold mb-4">Teknoloji</h3>
             <p className="text-muted-foreground mb-6">Yapay zeka, kuantum bilişim, yazılım geliştirme ve daha fazlası hakkında en son makaleler.</p>
             <Button asChild>
               <Link href="/categories/teknoloji">Teknoloji Makaleleri</Link>
             </Button>
           </div>
           <div className="bg-secondary p-8 rounded-lg shadow-md text-center">
             <h3 className="text-2xl font-semibold mb-4">Biyoloji</h3>
             <p className="text-muted-foreground mb-6">Genetik, mikrobiyoloji, evrim, ekoloji ve yaşam bilimlerinin diğer dallarındaki gelişmeler.</p>
             <Button asChild>
               <Link href="/categories/biyoloji">Biyoloji Makaleleri</Link>
             </Button>
           </div>
         </div>
       </section>


      {/* Recent Articles */}
      <section>
        <h2 className="text-3xl font-bold mb-6">En Son Eklenenler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {recentArticles.map((article) => (
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
                    <span className={`text-sm font-medium ${article.category === 'Teknoloji' ? 'text-blue-600' : 'text-green-600'}`}>
                      {article.category}
                    </span>
                    <Button asChild variant="link" className="p-0 h-auto text-primary">
                      <Link href={`/articles/${article.id}`}>Devamını Oku →</Link>
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
