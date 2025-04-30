import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Twitter, Facebook, Linkedin } from 'lucide-react'; // Added icons

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
   { id: '1', title: 'Yapay Zeka Devrimi', description: 'AI etkileri ve geleceği üzerine derinlemesine bir bakış.', category: 'Teknoloji', imageUrl: 'https://picsum.photos/seed/ai/1200/600', content: '<p>Yapay zeka (AI), makinelerin öğrenme, problem çözme ve karar verme gibi tipik olarak insan zekası gerektiren görevleri yerine getirme yeteneğidir. Günümüzde AI, akıllı telefonlarımızdaki sanal asistanlardan, sürücüsüz araçlara, tıbbi teşhislerden finansal piyasa analizlerine kadar hayatımızın birçok alanında devrim yaratmaktadır.</p><p>Makine öğrenimi, derin öğrenme ve doğal dil işleme gibi alt dallarıyla AI, veriden anlam çıkarma ve karmaşık örüntüleri tanıma konusunda giderek daha yetenekli hale gelmektedir. Bu ilerlemeler, bilimsel keşiflerden iş süreçlerinin otomasyonuna kadar geniş bir yelpazede yeni olanaklar sunmaktadır.</p><h2>AI\'nın Etki Alanları</h2><p>Sağlık hizmetlerinde AI, hastalıkların daha erken teşhis edilmesine, kişiselleştirilmiş tedavi planlarının oluşturulmasına ve ilaç geliştirme süreçlerinin hızlandırılmasına yardımcı olmaktadır. Finans sektöründe ise dolandırıcılık tespiti, algoritmik ticaret ve risk yönetimi gibi alanlarda kullanılmaktadır.</p><h3>Etik ve Toplumsal Boyutlar</h3><p>AI\'nın hızlı gelişimi, iş gücü piyasaları üzerindeki etkileri, veri gizliliği endişeleri ve algoritmik önyargı gibi önemli etik ve toplumsal soruları da beraberinde getirmektedir. Bu teknolojilerin sorumlu bir şekilde geliştirilmesi ve kullanılması büyük önem taşımaktadır.</p><p>Gelecekte, genel yapay zekanın (AGI) ortaya çıkma potansiyeli, insanlığın geleceği üzerinde derin etkiler yaratabilecek bir olasılık olarak tartışılmaktadır.</p>' },
   { id: '2', title: 'Gen Düzenleme Teknolojileri', description: 'CRISPR ve diğer gen düzenleme araçlarının bilim ve tıp üzerindeki etkileri.', category: 'Biyoloji', imageUrl: 'https://picsum.photos/seed/crispr/1200/600', content: '<p>Gen düzenleme, canlı organizmaların DNA dizilimlerinde hedeflenen değişiklikleri yapmayı sağlayan bir dizi teknolojiyi ifade eder. Bu teknolojilerin en bilineni ve devrim niteliğinde olanı CRISPR-Cas9 sistemidir.</p><p>CRISPR, bakterilerin virüslere karşı geliştirdiği doğal bir savunma mekanizmasından esinlenerek geliştirilmiştir. Cas9 enzimi, rehber bir RNA molekülü tarafından yönlendirilerek DNA\'nın belirli bir bölgesine bağlanır ve orada bir kesik oluşturur. Hücrenin doğal tamir mekanizmaları daha sonra bu kesiği onarırken, istenen genetik değişiklikler (gen silme, ekleme veya değiştirme) gerçekleştirilebilir.</p><h2>Uygulama Alanları ve Potansiyel</h2><p>Gen düzenleme teknolojileri, kalıtsal hastalıkların tedavisinden, kanserle mücadeleye, tarımsal verimliliğin artırılmasından yeni biyoyakıtların geliştirilmesine kadar çok çeşitli alanlarda büyük bir potansiyel sunmaktadır.</p><h3>Etik Tartışmalar</h3><p>Ancak, özellikle insan embriyolarında genetik değişiklikler yapma (germline düzenleme) olasılığı, ciddi etik tartışmaları da beraberinde getirmektedir. Bu tür değişikliklerin gelecek nesillere aktarılacak olması, öngörülemeyen sonuçlara yol açabileceği ve toplumsal eşitsizlikleri artırabileceği endişelerini doğurmaktadır.</p>' },
   { id: '3', title: 'Kuantum Bilgisayarlar', description: 'Kuantum mekaniği prensiplerini kullanan yeni nesil hesaplama makineleri.', category: 'Teknoloji', imageUrl: 'https://picsum.photos/seed/quantum/1200/600', content: '<p>Kuantum bilgisayarlar, klasik bilgisayarların bitler (0 veya 1) yerine kübitleri (qubit) kullanarak hesaplama yapan makinelerdir. Kübitler, kuantum mekaniğinin süperpozisyon ve dolanıklık gibi tuhaf prensiplerinden yararlanarak aynı anda hem 0 hem de 1 değerini temsil edebilir ve birbirleriyle karmaşık şekillerde bağlantılı olabilirler.</p><p>Bu özellikler, kuantum bilgisayarların belirli türdeki problemleri (örneğin, büyük sayıları çarpanlarına ayırma, karmaşık molekülleri simüle etme, optimizasyon problemleri) klasik bilgisayarlardan çok daha hızlı çözme potansiyeline sahip olmasını sağlar.</p><h2>Zorluklar ve Gelecek</h2><p>Kuantum bilgisayarları inşa etmek ve çalıştırmak son derece zordur. Kübitler, çevresel gürültüye (sıcaklık değişimleri, titreşimler vb.) karşı çok hassastır ve "koharens" adı verilen kuantum durumlarını korumak için aşırı düşük sıcaklıklara ve izolasyona ihtiyaç duyarlar.</p><p>Hata düzeltme mekanizmaları geliştirmek, kuantum algoritmalarını tasarlamak ve donanımı ölçeklendirmek, bu alandaki başlıca araştırma konularıdır. Kuantum bilgisayarlar henüz emekleme aşamasında olsa da, gelecekte bilim, tıp, malzeme bilimi ve kriptografi gibi alanlarda devrim yaratma potansiyeline sahiptir.</p>' },
   { id: '4', title: 'Mikrobiyom: İçimizdeki Dünya', description: 'İnsan vücudunda yaşayan mikroorganizmaların sağlık ve hastalık üzerindeki şaşırtıcı etkileri.', category: 'Biyoloji', imageUrl: 'https://picsum.photos/seed/microbiome/1200/600', content: '<p>İnsan vücudu, kendi hücrelerimizden kat kat fazla sayıda bakteri, virüs, mantar ve diğer mikroorganizmalara ev sahipliği yapar. Bu mikroskobik canlıların oluşturduğu topluluğa "mikrobiyom" adı verilir. Özellikle bağırsaklarımızda yoğunlaşan bu mikrobiyom, sağlığımız üzerinde derin ve karmaşık etkilere sahiptir.</p><h2>Sağlık Üzerindeki Rolü</h2><p>Bağırsak mikrobiyomu, sindirime yardımcı olmaktan, bağışıklık sistemini eğitmeye, vitamin üretmekten zararlı patojenlere karşı korumaya kadar birçok önemli işlevi yerine getirir. Son yıllardaki araştırmalar, mikrobiyomdaki dengesizliklerin (disbiyozis) obezite, diyabet, inflamatuar bağırsak hastalığı, otoimmün hastalıklar, alerjiler ve hatta depresyon gibi birçok kronik hastalıkla ilişkili olabileceğini göstermektedir.</p><h3>Mikrobiyomu Etkileyen Faktörler</h3><p>Doğum şekli (vajinal veya sezaryen), beslenme alışkanlıkları, antibiyotik kullanımı, yaş, coğrafya ve yaşam tarzı gibi birçok faktör mikrobiyomun yapısını etkileyebilir. Probiyotikler, prebiyotikler ve dışkı nakli gibi yöntemlerle mikrobiyomu olumlu yönde değiştirme potansiyeli araştırılmaktadır.</p>' },
   { id: '5', title: 'Blockchain Teknolojisi', description: 'Kripto paraların ötesinde, dağıtık defter teknolojisinin potansiyel uygulama alanları.', category: 'Teknoloji', imageUrl: 'https://picsum.photos/seed/blockchain/1200/600', content: '<p>Blockchain (blok zinciri), en basit tanımıyla, şifrelenmiş işlem takibini sağlayan dağıtık bir veri tabanıdır. Bu teknoloji, bir ağ üzerindeki işlemlerin değiştirilemez ve şeffaf bir şekilde kaydedilmesini mümkün kılar. Her yeni işlem grubu (blok), önceki bloğa kriptografik olarak bağlanarak bir zincir oluşturur.</p><p>Bitcoin gibi kripto paralarla popülerlik kazanan blockchain, sadece finansal işlemler için değil, birçok farklı sektörde güven, şeffaflık ve verimlilik sağlama potansiyeline sahiptir.</p><h2>Uygulama Alanları</h2><p>Tedarik zinciri yönetimi (ürünlerin kaynağını ve hareketini takip etme), oy verme sistemleri (güvenli ve şeffaf seçimler), kimlik doğrulama, akıllı sözleşmeler (belirli koşullar sağlandığında otomatik olarak yürütülen sözleşmeler), sağlık kayıtları yönetimi ve telif hakkı koruması gibi alanlarda blockchain tabanlı çözümler geliştirilmektedir.</p><h3>Zorluklar ve Gelecek Vizyonu</h3><p>Ölçeklenebilirlik (saniyede işlenebilen işlem sayısı), enerji tüketimi (bazı blockchain ağlarının yüksek enerji ihtiyacı) ve yasal düzenlemelerin eksikliği gibi zorluklar hala mevcuttur. Ancak, teknolojinin olgunlaşması ve yeni konsensüs mekanizmalarının geliştirilmesiyle blockchain\'in daha yaygın bir şekilde benimsenmesi beklenmektedir.</p>' },
   { id: '6', title: 'Sentetik Biyoloji', description: 'Biyolojik sistemleri mühendislik prensipleriyle tasarlama ve inşa etme alanı.', category: 'Biyoloji', imageUrl: 'https://picsum.photos/seed/syntheticbio/1200/600', content: '<p>Sentetik biyoloji, biyolojiyi bir mühendislik disiplini olarak ele alan, nispeten yeni ve hızla gelişen bir alandır. Amacı, biyolojik parçaları (genler, proteinler, metabolik yollar vb.) standartlaştırılmış bileşenler gibi kullanarak yeni biyolojik sistemler tasarlamak, inşa etmek ve test etmektir.</p><p>Moleküler biyoloji, genetik mühendisliği, sistem biyolojisi ve bilgisayar bilimi gibi birçok farklı disiplinden yararlanan sentetik biyoloji, canlı organizmalara yeni işlevler kazandırmayı veya tamamen yapay biyolojik sistemler oluşturmayı hedefler.</p><h2>Potansiyel Uygulamalar</h2><p>Bu alanın potansiyel uygulamaları oldukça geniştir: <br/><ul><li>Yeni ilaçların ve terapilerin geliştirilmesi (örneğin, kanser hücrelerini hedef alan tasarlanmış bakteriler)</li><li>Biyoyakıtların ve biyoplastiklerin üretimi</li><li>Çevresel kirliliği temizleyen mikroorganizmaların tasarlanması</li><li>Yeni tanı araçlarının geliştirilmesi</li><li>Tarımda verimliliği ve dayanıklılığı artırma</li></ul></p><h3>Etik ve Güvenlik Endişeleri</h3><p>Sentetik biyoloji, yaşamın temel yapı taşlarına müdahale etme potansiyeli nedeniyle önemli etik ve güvenlik tartışmalarını da beraberinde getirir. Biyogüvenlik riskleri (örneğin, tehlikeli patojenlerin kazara veya kasıtlı olarak salınması) ve "tasarımcı bebekler" gibi etik ikilemler, bu alandaki ilerlemelerin dikkatli bir şekilde yönetilmesini gerektirmektedir.</p>' },
   // Add more articles
];


interface ArticlePageProps {
  params: {
    id: string;
  };
}

// Function to safely render HTML content
function createMarkup(htmlContent: string) {
  // Basic sanitization (consider a more robust library for production)
  // const sanitizedHtml = htmlContent.replace(/<script.*?>.*?<\/script>/gi, '');
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

  const categoryLinkClass = article.category === 'Teknoloji'
    ? 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
    : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300';

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Increased max-width and added padding */}
      <header className="mb-10 pt-4"> {/* Increased margin bottom and added padding top */}
         <Link href={`/categories/${article.category.toLowerCase()}`} className={`text-sm font-medium mb-3 inline-block tracking-wide uppercase ${categoryLinkClass}`}>
           {article.category}
         </Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{article.title}</h1> {/* Larger title on medium screens */}
        <p className="text-lg md:text-xl text-muted-foreground">{article.description}</p> {/* Larger description */}
      </header>

      <div className="mb-10 shadow-xl rounded-lg overflow-hidden"> {/* Added shadow and rounded corners */}
          <Image
            src={article.imageUrl}
            alt={article.title}
            width={1200} // Increased width
            height={600} // Increased height
            className="w-full h-auto object-cover" // Maintain aspect ratio
            priority // Prioritize loading the main image
          />
      </div>


      {/* Render article content using dangerouslySetInnerHTML */}
      <div
         className="prose dark:prose-invert lg:prose-lg max-w-none mb-12" // Applied prose styling, larger text on lg screens
         dangerouslySetInnerHTML={createMarkup(article.content)}
      />


      {/* Related Articles, Sharing Buttons, Comments */}
       <div className="mt-16 border-t border-border/50 pt-10"> {/* Increased top margin/padding */}
         <h2 className="text-2xl font-semibold mb-6">İlgili Makaleler</h2>
         {/* Add related articles component here */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Placeholder related articles */}
           <div className="bg-secondary/50 p-4 rounded-lg">
             <h3 className="font-semibold mb-1">İlgili Makale Başlığı 1</h3>
             <p className="text-sm text-muted-foreground">Kısa açıklama...</p>
           </div>
           <div className="bg-secondary/50 p-4 rounded-lg">
             <h3 className="font-semibold mb-1">İlgili Makale Başlığı 2</h3>
             <p className="text-sm text-muted-foreground">Başka bir kısa açıklama...</p>
           </div>
         </div>
       </div>

       <div className="mt-10"> {/* Adjusted margin */}
          <h2 className="text-2xl font-semibold mb-4">Paylaş</h2>
           <div className="flex space-x-3"> {/* Increased spacing */}
              <Button variant="outline" size="icon" aria-label="Twitter'da paylaş"> {/* Use icon buttons */}
                  <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Facebook'ta paylaş">
                  <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" aria-label="LinkedIn'de paylaş">
                 <Linkedin className="h-5 w-5" />
              </Button>
           </div>
       </div>

       <div className="mt-16"> {/* Increased margin */}
         <h2 className="text-2xl font-semibold mb-6">Yorumlar</h2>
         {/* Add comments component here */}
         <div className="bg-secondary/50 p-6 rounded-lg">
           <p className="text-muted-foreground">Yorum yapma özelliği yakında aktif olacaktır. Fikirlerinizi paylaşmak için sabırsızlanıyoruz!</p>
           {/* Placeholder for comment form/list */}
         </div>
       </div>

       <div className="mt-16 mb-8 text-center"> {/* Adjusted margins */}
           <Button asChild variant="outline">
               <Link href="/" className="inline-flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Ana Sayfaya Dön
               </Link>
           </Button>
       </div>
    </article>
  );
}
