"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Eye } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import type { ArticleData } from '@/lib/mock-data'; // Import ArticleData

// --- Block Types (Should match the editor's block types) ---
export type Block =
  | { id: string; type: 'text'; content: string }
  | { id: string; type: 'heading'; level: number; content: string }
  | { id: string; type: 'image'; url: string; alt: string; caption?: string }
  | { id: string; type: 'gallery'; images: { url: string; alt: string }[] }
  | { id: string; type: 'video'; url: string; youtubeId?: string | null }
  | { id: string; type: 'quote'; content: string; citation?: string }
  | { id: string; type: 'code'; language: string; content: string }
  | { id: string; type: 'divider' }
  | { id: string; type: 'section'; sectionType: string; settings: Record<string, any> };

// Define Template Structure
interface Template {
  id: string;
  name: string;
  description: string;
  previewImageUrl: string;
  blocks: Block[];
  category?: 'Teknoloji' | 'Biyoloji';
  // Add other ArticleData fields that are relevant for a template
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  excerpt?: string;
}

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  /** @deprecated Use onSelectTemplateBlocks instead */
  onSelectTemplate?: (content: string) => void;
  onSelectTemplateBlocks: (blocks: Block[]) => void;
}


// --- Mock Templates (Using Block Structure) ---
const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;

const templates: Template[] = [
  {
    id: 'standard-article',
    name: 'Standart Makale',
    description: 'Başlık, ana görsel ve metin içeriği için temel düzen.',
    previewImageUrl: 'https://picsum.photos/seed/template-std/300/200',
    category: 'Teknoloji',
    excerpt: 'Bu şablon, genel konuları ele alan standart bir makale yapısı sunar.',
    seoTitle: 'Standart Makale Başlığı',
    seoDescription: 'Standart makale şablonu önizlemesi - temel yapı.',
    blocks: [
      { id: generateId(), type: 'heading', level: 1, content: 'Standart Makale Başlığı: Konuya Giriş' },
      { id: generateId(), type: 'text', content: 'Bu makale, **[Önemli Konu]** hakkında genel bir bakış sunmaktadır. Günümüzdeki etkilerini ve gelecekteki potansiyelini ele alacağız. Giriş paragrafında konunun önemi ve makalenin kapsamı belirtilir.' },
      { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/std-main-content/800/400', alt: 'Standart Makale Ana Görseli', caption: 'Konuyu temsil eden görsel (isteğe bağlı açıklama)' },
      { id: generateId(), type: 'text', content: 'Ana metin bölümü burada başlar. **[Alt Konu 1]** ile ilgili temel bilgiler, açıklamalar ve argümanlar bu kısımda yer alır. Paragraflar arasında mantıksal bir akış olmalıdır ve okuyucunun konuyu anlaması kolaylaştırılmalıdır.' },
      { id: generateId(), type: 'heading', level: 2, content: 'Konunun Derinlemesine İncelenmesi' },
      { id: generateId(), type: 'text', content: '**[Alt Konu 2]**\'nin daha detaylı incelendiği bölüm. Alt başlıklar kullanarak okunabilirliği artırın. İstatistikler, örnekler veya alıntılarla içeriği zenginleştirin. Örneğin, yapılan bir araştırmaya göre...' },
      { id: generateId(), type: 'heading', level: 2, content: 'Farklı Bir Perspektif ve Video İçerik' },
      { id: generateId(), type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeId: 'dQw4w9WgXcQ' }, // Example video
      { id: generateId(), type: 'text', content: 'Konuyla ilgili farklı görüşler veya alternatif yaklaşımlar bu bölümde ele alınabilir. Tartışmalı konular için dengeli bir sunum önemlidir. Videoda ise konunun [Video İçeriği Açıklaması] gösterilmektedir.' },
      { id: generateId(), type: 'quote', content: 'Bilgi güçtür, ancak paylaşıldığında daha da güçlenir.', citation: 'Francis Bacon (Uyarlanmış)' },
      { id: generateId(), type: 'text', content: 'Sonuç paragrafı, makalede ele alınan ana noktaları özetler (**[Alt Konu 1]** ve **[Alt Konu 2]** gibi) ve okuyucuya bir çıkarım veya geleceğe yönelik bir mesaj sunar.' },
    ]
  },
   {
    id: 'listicle',
    name: 'Listeleme Makalesi',
    description: 'Numaralı veya madde işaretli listeler içeren makaleler için uygundur.',
    previewImageUrl: 'https://picsum.photos/seed/template-list-preview/300/200',
    category: 'Teknoloji',
    excerpt: 'Bu şablon, belirli sayıda maddeyi listeleyen makaleler oluşturmak için idealdir.',
    seoTitle: 'Liste Makalesi Başlığı',
    seoDescription: 'Listeleme makalesi şablonu önizlemesi - numaralı öğeler.',
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Verimliliğinizi Artıracak 5 Basit Yöntem' },
        { id: generateId(), type: 'text', content: 'Günlük hayatınızda veya işinizde daha verimli olmak mı istiyorsunuz? İşte size yardımcı olabilecek, uygulaması kolay 5 yöntem!' },
        { id: generateId(), type: 'heading', level: 2, content: '1. Zaman Yönetimi Tekniklerini Kullanın (Pomodoro)' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-pomodoro/600/300', alt: 'Pomodoro Tekniği Zamanlayıcısı', caption: 'Çalışma ve mola sürelerini ayarlayın.' },
        { id: generateId(), type: 'text', content: 'Pomodoro tekniği gibi zaman yönetimi yöntemleri, dikkatinizi odaklamanıza ve işleri belirli zaman dilimlerinde tamamlamanıza yardımcı olur. 25 dakika çalışıp 5 dakika mola vererek başlayabilirsiniz.' },
        { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'heading', level: 2, content: '2. Önceliklendirme Yapın (Eisenhower Matrisi)' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-matrix/600/300', alt: 'Eisenhower Matrisi', caption: 'Görevleri sınıflandırın.' }, // Added specific image
        { id: generateId(), type: 'text', content: 'Görevlerinizi aciliyet ve önem derecelerine göre sınıflandırın. Eisenhower Matrisi (Acil/Önemli Matrisi) bu konuda size yol gösterebilir. Önemli ama acil olmayan işlere odaklanmak uzun vadede daha verimli olmanızı sağlar.' },
         { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'heading', level: 2, content: '3. Mola Vermeyi Unutmayın' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-break/600/300', alt: 'Mola Veren Kişi' },
        { id: generateId(), type: 'text', content: 'Sürekli çalışmak yerine düzenli aralıklarla kısa molalar vermek, zihinsel yorgunluğu azaltır ve odaklanmayı artırır. Kalkıp biraz hareket etmek veya farklı bir aktivite yapmak iyi gelecektir.' },
         { id: generateId(), type: 'divider'},
         { id: generateId(), type: 'heading', level: 2, content: '4. Dikkat Dağıtıcıları Azaltın' }, // Corrected heading
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-focus/600/300', alt: 'Odaklanmış Çalışma Ortamı' }, // Added specific image
         { id: generateId(), type: 'text', content: 'Çalışma ortamınızdaki dikkat dağıtıcı unsurları (sosyal medya bildirimleri, gereksiz sekmeler vb.) minimuma indirin. Odaklanmış çalışma süreleri belirleyin.' },
         { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'heading', level: 2, content: `5. "Hayır" Demeyi Öğrenin` },
        { id: generateId(), type: 'text', content: 'Her isteğe "evet" demek yerine, önceliklerinize ve zamanınıza uygun olmayan talepleri nazikçe reddetmeyi öğrenin. Bu, enerjinizi önemli işlere ayırmanızı sağlar.' },
        { id: generateId(), type: 'text', content: 'Bu yöntemleri uygulayarak verimliliğinizi önemli ölçüde artırabilirsiniz. Küçük adımlarla başlayın ve size en uygun olanları keşfedin!'},
    ]
  },
  {
    id: 'image-gallery',
    name: 'Görsel Galerisi',
    description: 'Görsellerin ön planda olduğu, açıklamalı galeri düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/template-gallery-show/300/200',
    category: 'Biyoloji',
    excerpt: 'Birden çok görseli açıklamalarıyla birlikte sergilemek için ideal bir yapı.',
    seoTitle: 'Görsel Galerisi Başlığı',
    seoDescription: 'Görsel galerisi şablonu önizlemesi - açıklayıcı resimler.',
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Doğanın Muhteşem Manzaraları Galerisi' },
        { id: generateId(), type: 'text', content: 'Dünyanın dört bir yanından nefes kesici doğa manzaralarını bir araya getirdik. Bu görsel şölende kaybolmaya hazır olun.' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-mountains/800/500', alt: 'Karlı Dağ Zirveleri', caption: 'Görsel 1: Yüksek dağların zirvesindeki huzur verici manzara.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-forest/800/500', alt: 'Sisli Orman Yolu', caption: 'Görsel 2: Sabah sisiyle kaplı gizemli bir orman yolu.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-beach/800/500', alt: 'Gün Batımında Kumsal', caption: 'Görsel 3: Tropik bir kumsalda romantik gün batımı renkleri.' },
         { id: generateId(), type: 'divider' },
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-waterfall/800/500', alt: 'Gürleyen Şelale', caption: 'Görsel 4: Yemyeşil doğanın ortasında güçlü bir şelale.' },
        { id: generateId(), type: 'text', content: 'Doğanın bu büyüleyici güzellikleri, bize dünyanın ne kadar çeşitli ve harika olduğunu hatırlatıyor. Hangi manzarayı en çok beğendiniz?' },
    ]
  },
  {
    id: 'faq-article',
    name: 'SSS Makalesi',
    description: 'Sıkça sorulan sorular ve cevapları formatında bir düzen.',
    previewImageUrl: 'https://picsum.photos/seed/template-faq-ask/300/200',
    category: 'Teknoloji',
    excerpt: 'Belirli bir konu hakkındaki sıkça sorulan soruları yanıtlamak için kullanılır.',
    seoTitle: 'SSS Makalesi Başlığı',
    seoDescription: 'SSS makalesi şablonu önizlemesi - soru cevap formatı.',
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Uzaktan Çalışma Hakkında Sıkça Sorulan Sorular' },
        { id: generateId(), type: 'text', content: 'Uzaktan çalışma modeline geçiş yapanlar veya bu modeli merak edenler için en sık sorulan soruları ve yanıtlarını derledik.' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 1: Uzaktan çalışmanın avantajları nelerdir?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Uzaktan çalışmanın başlıca avantajları arasında esnek çalışma saatleri, trafikten tasarruf, daha iyi iş-yaşam dengesi ve artan üretkenlik sayılabilir. Çalışanlar için daha fazla özerklik sağlar.'},
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 2: Uzaktan çalışırken nasıl motive kalınır?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Kendi çalışma rutininizi oluşturmak, belirli hedefler koymak, düzenli molalar vermek ve sosyal etkileşimi sürdürmek motivasyonu korumaya yardımcı olur. Özel bir çalışma alanı yaratmak da önemlidir.'},
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 3: Şirketler uzaktan çalışanları nasıl yönetebilir?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Açık iletişim kanalları kurmak, düzenli toplantılar yapmak, performansı sonuç odaklı değerlendirmek ve çalışanlara güvenmek etkili yönetim için kritiktir. Doğru teknolojik araçların kullanılması da süreci kolaylaştırır.'},
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 4: Uzaktan çalışmanın dezavantajları var mıdır?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Evet, bazı dezavantajları olabilir. Sosyal izolasyon hissi, evdeki dikkat dağıtıcılar, iş ve özel yaşam sınırlarının bulanıklaşması gibi zorluklar yaşanabilir. Bu zorlukların üstesinden gelmek için bilinçli çaba göstermek gerekir.'},
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'text', content: 'Uzaktan çalışma hakkında başka sorularınız varsa, yorumlar kısmında bize iletebilirsiniz.' },
    ]
  },
  {
    id: 'how-to-guide',
    name: 'Nasıl Yapılır Rehberi',
    description: 'Adım adım talimatlar içeren öğretici makaleler için.',
    previewImageUrl: 'https://picsum.photos/seed/template-howto-steps/300/200',
    category: 'Teknoloji',
    excerpt: 'Bir işlemi veya görevi adım adım açıklayan rehberler oluşturmak için kullanılır.',
    seoTitle: 'Nasıl Yapılır Rehberi Başlığı',
    seoDescription: 'Nasıl yapılır rehberi şablonu önizlemesi - adım adım talimatlar.',
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Basit Bir Web Sitesi Nasıl Yayınlanır?' },
        { id: generateId(), type: 'text', content: 'Kendi web sitenizi oluşturmak ve yayınlamak düşündüğünüzden daha kolay olabilir! Bu rehberde, temel adımları takip ederek basit bir web sitesini nasıl çevrimiçi hale getirebileceğinizi göstereceğiz.' },
        { id: generateId(), type: 'heading', level: 2, content: 'Gereksinimler' },
        { id: generateId(), type: 'text', content: 'Başlamadan önce şunlara ihtiyacınız olacak:\n- **Bir Alan Adı (Domain):** Sitenizin adresi (örn: www.siteadim.com).\n- **Bir Barındırma (Hosting) Hesabı:** Sitenizin dosyalarını depolayacağınız yer.\n- **Web Sitesi Dosyaları:** HTML, CSS, JavaScript dosyaları veya bir site oluşturucu çıktısı.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 1: Alan Adı ve Hosting Seçimi' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-domain/600/350', alt: 'Alan Adı ve Hosting Seçenekleri', caption:'Birçok farklı sağlayıcı bulunmaktadır.' },
        { id: generateId(), type: 'text', content: 'İlk olarak, siteniz için uygun bir alan adı seçin ve bir hosting sağlayıcısından hesap alın. GoDaddy, Namecheap, Bluehost gibi popüler seçenekler mevcuttur.' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 2: Hosting Hesabınıza Dosyaları Yükleme' },
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-ftp/600/350', alt: 'FTP İstemcisi Dosya Yükleme', caption:'Dosyaları public_html klasörüne sürükleyin.' }, // Specific image
        { id: generateId(), type: 'text', content: 'Hosting sağlayıcınızın kontrol paneli (cPanel, Plesk vb.) veya bir FTP istemcisi (FileZilla gibi) kullanarak web sitesi dosyalarınızı hosting hesabınızdaki genellikle `public_html` veya `www` adlı klasöre yükleyin.' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 3: Alan Adını Hosting Hesabına Yönlendirme' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-dns/600/350', alt: 'DNS Ayarları Ekranı' },
        { id: generateId(), type: 'text', content: 'Alan adınızı satın aldığınız yerdeki DNS (Domain Name System) ayarlarını, hosting sağlayıcınızın size verdiği nameserver adresleriyle güncelleyin. Bu işlem, alan adınızın sitenizin dosyalarının bulunduğu sunucuya işaret etmesini sağlar. (Bu işlemin tamamlanması birkaç saat sürebilir).' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 4: Sitenizi Test Etme' },
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-browser/600/350', alt: 'Tarayıcıda Web Sitesi Görüntüsü', caption:'Sitenizin yüklendiğini kontrol edin.' }, // Specific image
        { id: generateId(), type: 'text', content: 'DNS yönlendirmesi tamamlandıktan sonra, tarayıcınıza alan adınızı yazarak sitenizin doğru bir şekilde yüklenip yüklenmediğini kontrol edin.' },
        { id: generateId(), type: 'heading', level: 2, content: 'İpuçları' },
        { id: generateId(), type: 'text', content: '- Başlangıç için statik HTML siteleri veya WordPress gibi içerik yönetim sistemleri kullanabilirsiniz.\n- Güvenlik için SSL sertifikası (HTTPS) kurmayı unutmayın.' },
    ]
  },
   {
    id: 'interview-article',
    name: 'Röportaj Makalesi',
    description: 'Bir kişiyle yapılan röportajı soru-cevap formatında sunar.',
    previewImageUrl: 'https://picsum.photos/seed/template-interview-qa/300/200',
    category: 'Biyoloji',
    excerpt: 'Uzmanlarla veya ilginç kişilerle yapılan röportajları sunmak için kullanılır.',
    seoTitle: 'Röportaj: [Kişinin Adı]',
    seoDescription: 'Röportaj makalesi şablonu önizlemesi - soru cevap formatı.',
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Dr. Elif Aydın ile Biyoteknolojinin Geleceği Üzerine Söyleşi' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/interview-elif/400/400', alt: 'Dr. Elif Aydın Portresi', caption:'Dr. Elif Aydın, Biyoteknoloji Uzmanı' },
        { id: generateId(), type: 'text', content: 'Biyoteknoloji alanında yaptığı çalışmalarla tanınan Dr. Elif Aydın ile gen düzenleme, sentetik biyoloji ve bu teknolojilerin gelecekteki potansiyeli üzerine konuştuk.' },
        { id: generateId(), type: 'heading', level: 2, content: 'Biyoteknoloji Alanına Giriş' },
        { id: generateId(), type: 'text', content: '**Soru:** Biyoteknolojiye olan ilginiz nasıl başladı ve bu alanda uzmanlaşmaya nasıl karar verdiniz?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Çocukluğumdan beri biyolojiye büyük bir merakım vardı. Üniversitede genetik mühendisliği okurken, canlı sistemleri anlama ve onları iyileştirme potansiyeli beni büyüledi. Özellikle CRISPR teknolojisinin ilk çıktığı zamanlar, bu alana tamamen odaklanmama neden oldu.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Gen Düzenleme ve Etik Tartışmalar' },
        { id: generateId(), type: 'text', content: '**Soru:** CRISPR gibi gen düzenleme teknolojilerinin sunduğu olanaklar heyecan verici. Ancak etik tartışmaları da beraberinde getiriyor. Bu konudaki düşünceleriniz nelerdir?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Bu teknolojilerin potansiyeli muazzam, özellikle kalıtsal hastalıkların tedavisinde. Ancak, insan germ hattı hücrelerinde (sperm, yumurta) yapılacak değişiklikler gibi konular ciddi etik kaygılar doğuruyor. Dikkatli bir şekilde düzenlemeler yapılması ve toplumsal bir tartışma yürütülmesi gerektiğine inanıyorum. Bilimin sorumlu bir şekilde ilerlemesi şart.' },
        { id: generateId(), type: 'quote', content: "Teknolojinin kendisi ne iyi ne de kötüdür; onu nasıl kullandığımız belirleyicidir.", citation:"Dr. Elif Aydın" },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Biyoteknolojinin Geleceği' },
        { id: generateId(), type: 'text', content: '**Soru:** Önümüzdeki 10 yıl içinde biyoteknoloji alanında en büyük atılımları nerede bekliyorsunuz?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Kişiselleştirilmiş tıp alanında büyük ilerlemeler göreceğiz. Hastalıkların genetik yatkınlığa göre önlenmesi veya tedavi edilmesi yaygınlaşacak. Ayrıca, sentetik biyoloji sayesinde yeni malzemeler, yakıtlar ve ilaçlar üretebileceğiz. Yapay zekanın biyolojik veri analizindeki rolü de giderek artacak.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'text', content: 'Dr. Elif Aydın\'a bu aydınlatıcı söyleşi için teşekkür ediyoruz. Biyoteknolojinin geleceği hakkında daha fazla bilgi edinmek isteyenler, Dr. Aydın\'ın yayınlarını takip edebilirler.' },
    ]
  },
];

// --- Helper Functions ---

// Function to convert block structure to HTML (basic implementation for backward compatibility)
const blocksToHtml = (blocks: Block[]): string => {
    let html = '';
    blocks.forEach(block => {
        switch (block.type) {
            case 'heading':
                html += `<h${block.level}>${block.content}</h${block.level}>\n`;
                break;
            case 'text':
                const processedContent = block.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');
                html += `<p>${processedContent}</p>\n`;
                break;
            case 'image':
                 html += `<figure>\n  <img src="${block.url}" alt="${block.alt}" />\n`;
                if (block.caption) {
                    html += `  <figcaption>${block.caption}</figcaption>\n`;
                 }
                 html += `</figure>\n`;
                break;
             case 'quote':
                html += `<blockquote><p>${block.content}</p>`;
                if (block.citation) {
                    html += `<footer>— ${block.citation}</footer>`;
                }
                html += `</blockquote>\n`;
                break;
             case 'code':
                 html += `<pre><code class="language-${block.language}">${block.content}</code></pre>\n`;
                 break;
             case 'divider':
                 html += `<hr />\n`;
                 break;
             case 'gallery':
                 html += `<div class="gallery">\n`;
                 block.images.forEach(img => {
                     html += `  <figure><img src="${img.url}" alt="${img.alt}" /></figure>\n`;
                 });
                 html += `</div>\n`;
                 break;
             case 'video':
                 const videoId = block.youtubeId || block.url.split('v=')[1]?.split('&')[0] || block.url.split('/').pop();
                 if (videoId && videoId.length === 11) {
                     html += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n`;
                 } else if (block.url) {
                     html += `<p><a href="${block.url}" target="_blank" rel="noopener noreferrer">Video izle: ${block.url}</a></p>\n`;
                 }
                 break;
             case 'section':
                 html += `<!-- Section: ${block.sectionType} -->\n`;
                 break;
        }
    });
    return html;
};


export function TemplateSelector({ isOpen, onClose, onSelectTemplate, onSelectTemplateBlocks }: TemplateSelectorProps) {

    const handleSelect = (blocks: Block[]) => {
        onSelectTemplateBlocks(blocks);
        if (onSelectTemplate) {
             console.warn("TemplateSelector: onSelectTemplate is deprecated. Use onSelectTemplateBlocks instead.");
             const htmlContent = blocksToHtml(blocks);
             onSelectTemplate(htmlContent);
        }
        onClose();
    };

     // Handle template preview - pass the specific template's data
     const handlePreview = (template: Template) => {
        console.log(`[TemplateSelector] handlePreview called for template: ${template.id}`);
         // Construct the full ArticleData object for preview
         const previewData: Partial<ArticleData> = { // Use Partial as not all fields might be needed/defined in template
             id: `template-preview-${template.id}`, // Unique ID for preview
             title: template.name, // Use template name as title for preview list
             excerpt: template.excerpt || template.description,
             blocks: template.blocks,
             category: template.category || 'Teknoloji', // Use template category or default
             status: 'Yayınlandı', // Assume published for preview
             // Use first image block URL or template preview as mainImageUrl
             mainImageUrl: template.blocks.find(b => b.type === 'image')?.url || template.previewImageUrl,
             seoTitle: template.seoTitle || template.name,
             seoDescription: template.seoDescription || template.description,
             slug: template.id, // Use template ID as slug for preview link uniqueness
             isFeatured: false, // Default for preview
             isHero: false, // Default for preview
             keywords: template.keywords || [],
             canonicalUrl: '',
             authorId: 'template-author', // Placeholder author
             createdAt: new Date().toISOString(), // Current time for preview
             updatedAt: new Date().toISOString(),
         };
          console.log(`[TemplateSelector] Generated previewData for ${template.id}:`, JSON.stringify(previewData, null, 2).substring(0, 500) + "..."); // Log truncated preview data

         try {
              // Generate a unique key for localStorage for each template preview
             const localStorageKey = `articlePreviewData_${template.id}_${Date.now()}`;
             console.log(`[TemplateSelector] Generated localStorageKey for ${template.id}: ${localStorageKey}`);

             const dataString = JSON.stringify(previewData);
             // Add a check for data size if localStorage has limits (though unlikely for this amount of data)
             if (dataString.length > 4 * 1024 * 1024) { // Example limit: 4MB
                console.warn(`[TemplateSelector] Preview data for ${template.id} might be too large for localStorage (${dataString.length} bytes).`);
             }

             console.log(`[TemplateSelector] Attempting to save data to localStorage for key ${localStorageKey}. Data length: ${dataString.length}`);
             localStorage.setItem(localStorageKey, dataString);
             console.log(`[TemplateSelector] Finished attempting to save data for key ${localStorageKey}.`);

              // Verify data was saved correctly *immediately* after setting
             const savedData = localStorage.getItem(localStorageKey);
             if (savedData) {
                  console.log(`[TemplateSelector] Successfully retrieved data immediately after saving for key ${localStorageKey}. Length: ${savedData.length}.`);
                 // Optional: Verify content match (can be slow for large data)
                 // if (savedData === dataString) {
                 //    console.log(`[TemplateSelector] Data content verification successful for key ${localStorageKey}.`);
                 // } else {
                 //    console.error(`[TemplateSelector] Data content verification failed! Retrieved data doesn't match for key ${localStorageKey}.`);
                 // }
             } else {
                 console.error(`[TemplateSelector] Verification failed! Could not retrieve data immediately after saving for key ${localStorageKey}. LocalStorage might be disabled or full.`);
                  toast({
                     variant: "destructive",
                     title: "Önizleme Hatası",
                     description: "Önizleme verisi kaydedilemedi. Tarayıcı depolama alanı dolu veya devre dışı olabilir.",
                 });
                 return; // Stop if saving failed
             }


             // Open the preview page with the unique key as a query parameter
             const previewUrl = `/admin/preview?key=${localStorageKey}`;
             console.log(`[TemplateSelector] Opening preview window with URL: ${previewUrl}`);
             const previewWindow = window.open(previewUrl, '_blank');

             if (!previewWindow) {
                 console.error("[TemplateSelector] Failed to open preview window. Pop-up blocker likely active.");
                 toast({
                     variant: "destructive",
                     title: "Önizleme Açılamadı",
                     description: "Lütfen tarayıcınızda açılır pencerelere izin verin.",
                 });
             } else {
                 console.log("[TemplateSelector] Preview window opened successfully.");
             }
         } catch (error) {
             console.error("[TemplateSelector] Error during handlePreview:", error);
             let errorMessage = "Şablon önizleme verisi işlenirken bir hata oluştu.";
             if (error instanceof Error) {
                if (error.name === 'QuotaExceededError') {
                    errorMessage = "Tarayıcı depolama alanı dolu. Lütfen eski verileri temizleyin veya tarayıcı ayarlarınızı kontrol edin.";
                } else {
                    errorMessage = `Bir hata oluştu: ${error.message}`;
                }
             }
              toast({
                 variant: "destructive",
                 title: "Önizleme Hatası",
                 description: errorMessage,
             });
         }
     };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[60%] lg:max-w-[70%] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Makale Şablonu Seç</DialogTitle>
          <DialogDescription>
            İçeriğinizi oluşturmaya başlamak için hazır bir şablon seçin. Şablon içeriği mevcut içeriğinizin üzerine yazılabilir (onayınızla).
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-4 -mr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
                {templates.map((template) => (
                    <Card key={template.id} className="flex flex-col overflow-hidden group border hover:shadow-lg transition-shadow">
                        <CardHeader className="p-0 relative h-32 overflow-hidden cursor-pointer" onClick={() => handlePreview(template)}>
                             <Image
                                src={template.previewImageUrl}
                                alt={`${template.name} önizlemesi`}
                                width={300}
                                height={200}
                                className="w-full h-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint="template preview abstract design"
                             />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                              <CardTitle className="absolute bottom-2 left-3 text-sm font-semibold text-white p-1 bg-black/50 rounded text-shadow-sm">{template.name}</CardTitle>
                               <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                   <Eye className="h-8 w-8 text-white/80" />
                               </div>
                         </CardHeader>
                         <CardContent className="p-3 flex flex-col flex-grow">
                             <p className="text-xs text-muted-foreground flex-grow mb-3">{template.description}</p>
                             <div className="flex gap-2 mt-auto">
                                 <Button variant="outline" size="sm" className="flex-1" onClick={() => handlePreview(template)}>
                                    <Eye className="mr-1 h-3.5 w-3.5"/> Önizle
                                </Button>
                                <Button size="sm" className="flex-1" onClick={() => handleSelect(template.blocks)}>Seç</Button>
                             </div>
                         </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
