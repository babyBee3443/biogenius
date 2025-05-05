
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  onSelectTemplate?: (content: string) => void; // Keep for potential backward compatibility if needed
  onSelectTemplateBlocks: (blocks: Block[]) => void;
  blocksCurrentlyExist: boolean; // Indicates if there are blocks in the editor
}


// --- Mock Templates (Using Block Structure) ---
// Ensure each template has unique content, topics, images, etc.
const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;

const templates: Template[] = [
  {
    id: 'standard-article',
    name: 'Standart Makale',
    description: 'Giriş, ana görsel, alt başlıklar ve sonuç bölümü içeren temel makale düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/template-std-ai/300/200',
    category: 'Teknoloji',
    excerpt: 'Yapay zeka etiği ve toplumsal etkileri üzerine odaklanan standart bir makale yapısı.',
    seoTitle: 'Yapay Zeka Etiği ve Toplumsal Sorumluluklar',
    seoDescription: 'Standart makale şablonu ile yapay zeka etiği, önyargılar ve gelecek perspektifleri.',
    keywords: ['yapay zeka', 'etik', 'toplum', 'sorumluluk', 'önyargı'],
    blocks: [
      { id: generateId(), type: 'heading', level: 1, content: 'Yapay Zeka Etiği: Teknoloji ve Toplum Dengesi' },
      { id: generateId(), type: 'text', content: 'Yapay zeka (AI) hayatımızı dönüştürürken, beraberinde önemli etik soruları ve toplumsal sorumlulukları da getiriyor. Bu makalede, AI etiğinin temel ilkelerini ve karşılaşılan zorlukları inceleyeceğiz.' },
      { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/std-ai-ethics-img/800/400', alt: 'Yapay Zeka ve Etik Sembolü', caption: 'AI geliştirirken etik değerleri gözetmek.' },
      { id: generateId(), type: 'text', content: 'AI sistemlerinin karar alma süreçlerindeki **şeffaflık**, **hesap verebilirlik** ve **adalet** gibi ilkeler, etik tartışmaların merkezinde yer alıyor. Algoritmik önyargılar, veri gizliliği ve otonom sistemlerin sorumluluğu gibi konular acil çözümler gerektiriyor.' },
      { id: generateId(), type: 'heading', level: 2, content: 'Algoritmik Önyargıların Tehlikeleri' },
      { id: generateId(), type: 'text', content: 'AI modelleri, eğitildikleri verilerdeki mevcut toplumsal önyargıları yansıtabilir ve hatta güçlendirebilir. Bu durum, işe alım süreçlerinden kredi başvurularına kadar birçok alanda ayrımcılığa yol açabilir. Önyargısız veri setleri oluşturmak ve adil algoritmalar geliştirmek kritik önem taşımaktadır.' },
       { id: generateId(), type: 'video', url: 'https://www.youtube.com/watch?v=ABd2-6hnwAI', youtubeId: 'ABd2-6hnwAI' }, // Relevant video on AI ethics
      { id: generateId(), type: 'heading', level: 2, content: 'Geleceğe Yönelik Adımlar' },
      { id: generateId(), type: 'text', content: 'Yapay zeka etiği konusunda küresel standartların oluşturulması, multidisipliner yaklaşımların benimsenmesi ve kamuoyu bilincinin artırılması gerekiyor. Teknoloji geliştiricileri, politika yapıcılar ve toplum olarak birlikte çalışarak AI\'ın insanlık yararına kullanılmasını sağlamalıyız.' },
      { id: generateId(), type: 'quote', content: 'Etik olmayan bir yapay zeka, insanlığın karşılaştığı en büyük tehditlerden biri olabilir.', citation: 'Stephen Hawking (uyarlanmıştır)' },
      { id: generateId(), type: 'text', content: 'Sonuç olarak, yapay zeka etiği, teknolojinin geleceğini şekillendirecek en önemli tartışma alanlarından biridir ve sürekli dikkat gerektirir.' },
    ]
  },
   {
    id: 'listicle',
    name: 'Listeleme Makalesi',
    description: 'Belirli bir konuda numaralı veya madde işaretli öneriler/bilgiler sunan format.',
    previewImageUrl: 'https://picsum.photos/seed/template-list-brain/300/200',
    category: 'Biyoloji',
    excerpt: 'Beyin sağlığınızı korumak ve geliştirmek için bilimsel temelli 7 basit yöntemi listeleyen bir şablon.',
    seoTitle: 'Beyin Sağlığınızı Güçlendirmek İçin 7 Bilimsel Yöntem',
    seoDescription: 'Listeleme makalesi şablonu ile beyin sağlığını destekleyen alışkanlıklar ve ipuçları.',
    keywords: ['beyin sağlığı', 'hafıza', 'nöroloji', 'bilişsel fonksiyon', 'sağlıklı yaşam'],
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Beyin Sağlığınızı Güçlendirmek İçin 7 Bilimsel Yöntem' },
        { id: generateId(), type: 'text', content: 'Yaş aldıkça bilişsel fonksiyonlarımızı korumak ve beyin sağlığımızı optimize etmek hepimizin hedefi. İşte bilimsel araştırmalarla desteklenen 7 etkili yöntem:' },
        { id: generateId(), type: 'heading', level: 2, content: '1. Zihinsel Olarak Aktif Kalın' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-brain-puzzle-img/600/300', alt: 'Yapboz Yapan Kişi', caption: 'Yeni şeyler öğrenmek ve bulmacalar çözmek beyni uyarır.' },
        { id: generateId(), type: 'text', content: 'Okumak, yazmak, yeni bir dil veya müzik aleti öğrenmek, strateji oyunları oynamak gibi zihinsel aktiviteler, beyin hücreleri arasındaki bağlantıları güçlendirir ve bilişsel rezervinizi artırır.' },
        { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'heading', level: 2, content: '2. Fiziksel Egzersizi İhmal Etmeyin' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-brain-running-img/600/300', alt: 'Koşan Kişi', caption: 'Aerobik egzersiz beyne giden kan akışını artırır.' },
        { id: generateId(), type: 'text', content: 'Düzenli fiziksel aktivite, beyne oksijen ve besin taşıyan kan akışını iyileştirir. Hafıza ve öğrenme ile ilişkili beyin bölgelerinde yeni hücrelerin büyümesini teşvik edebilir.' },
         { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'heading', level: 2, content: '3. Sağlıklı ve Dengeli Beslenin' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-brain-food-img/600/300', alt: 'Beyin Dostu Besinler (Balık, Yemiş, Sebze)', caption:'Omega-3, antioksidanlar ve vitaminler önemlidir.' },
        { id: generateId(), type: 'text', content: 'Özellikle Akdeniz diyeti gibi, meyve, sebze, tam tahıllar, balık ve sağlıklı yağlar açısından zengin beslenme düzenleri beyin sağlığı ile ilişkilendirilmiştir.' },
         { id: generateId(), type: 'divider'},
         { id: generateId(), type: 'heading', level: 2, content: `4. Kaliteli Uyku Uyuyun` },
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-brain-sleep-img/600/300', alt: 'Uyuyan Kişi' },
         { id: generateId(), type: 'text', content: 'Uyku sırasında beyin, gün içinde öğrenilen bilgileri pekiştirir ve zararlı toksinleri temizler. Her gece 7-8 saat kesintisiz ve kaliteli uyku hedefleyin.' },
         { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'heading', level: 2, content: `5. Sosyal Bağlantıları Koruyun` },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-brain-social-img/600/300', alt: 'Sohbet Eden Arkadaşlar' },
        { id: generateId(), type: 'text', content: 'Güçlü sosyal ilişkiler, stresi azaltmaya ve beyin sağlığını korumaya yardımcı olabilir. Aile ve arkadaşlarla zaman geçirmek, sosyal aktivitelere katılmak önemlidir.' },
         { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'heading', level: 2, content: `6. Stresi Etkili Yönetin` },
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-brain-yoga-img/600/300', alt: 'Yoga Yapan Kişi' },
        { id: generateId(), type: 'text', content: 'Kronik stres, beyin hücrelerine zarar verebilir ve hafızayı olumsuz etkileyebilir. Meditasyon, yoga, doğa yürüyüşleri gibi rahatlama teknikleri stresi yönetmenize yardımcı olabilir.' },
         { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'heading', level: 2, content: `7. Kronik Hastalıkları Kontrol Altında Tutun` },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-brain-doctor-img/600/300', alt: 'Doktor ve Hasta' },
        { id: generateId(), type: 'text', content: 'Yüksek tansiyon, diyabet, yüksek kolesterol gibi kronik sağlık sorunları beyin sağlığını olumsuz etkileyebilir. Bu hastalıkları doktorunuzun önerileri doğrultusunda kontrol altında tutmak önemlidir.' },
        { id: generateId(), type: 'text', content: 'Bu yöntemleri yaşam tarzınıza entegre ederek beyin sağlığınızı koruyabilir ve bilişsel yeteneklerinizi uzun yıllar boyunca sürdürebilirsiniz.'},
    ]
  },
  {
    id: 'image-gallery',
    name: 'Görsel Galerisi',
    description: 'Görsellerin ön planda olduğu, açıklamalı ve tematik galeri düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/template-gallery-space/300/200',
    category: 'Teknoloji',
    excerpt: 'James Webb Uzay Teleskobu tarafından çekilen nefes kesici uzay fotoğraflarından oluşan bir galeri.',
    seoTitle: 'James Webb Teleskobu Harikaları: Uzay Galerisi',
    seoDescription: 'Görsel galerisi şablonu ile James Webb Uzay Teleskobu\'nun çektiği en iyi fotoğraflar.',
    keywords: ['james webb', 'uzay', 'teleskop', 'galaksi', 'nebula', 'astronomi'],
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'James Webb Uzay Teleskobu ile Evrenin Derinlikleri' },
        { id: generateId(), type: 'text', content: 'James Webb Uzay Teleskobu (JWST), evrenin şimdiye kadar görülmemiş detaylarını gözler önüne seriyor. İşte bu güçlü teleskop tarafından yakalanan en büyüleyici görüntülerden bazıları:' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-jwst-carina-img/800/500', alt: 'Karina Nebulası', caption: 'Görsel 1: Karina Nebulası\'nın "Kozmik Uçurumları". Yıldız oluşum bölgelerini inanılmaz ayrıntılarla gösteriyor.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-jwst-stephan-img/800/500', alt: 'Stephan Beşlisi', caption: 'Görsel 2: Stephan Beşlisi galaksi grubu. Galaksilerin etkileşimini ve birleşmesini gözlemliyoruz.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-jwst-ring-img/800/500', alt: 'Güney Halka Nebulası', caption: 'Görsel 3: Güney Halka Nebulası. Ölmekte olan bir yıldızın etrafındaki gaz ve toz bulutları.' },
         { id: generateId(), type: 'divider' },
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-jwst-phantom-img/800/500', alt: 'Hayalet Galaksi (M74)', caption: 'Görsel 4: Hayalet Galaksi (M74). Galaksinin kızılötesi ışıkta görünen spiral kollarındaki gaz ve toz yapıları.' },
        { id: generateId(), type: 'text', content: 'JWST, kızılötesi gözlem yetenekleri sayesinde evrenin ilk zamanlarına ışık tutuyor ve yıldızların, galaksilerin oluşumu hakkındaki bilgilerimizi derinleştiriyor.' },
    ]
  },
  {
    id: 'faq-article',
    name: 'SSS Makalesi',
    description: 'Belirli bir konudaki sıkça sorulan sorulara net cevaplar veren format.',
    previewImageUrl: 'https://picsum.photos/seed/template-faq-solar/300/200',
    category: 'Teknoloji',
    excerpt: 'Ev tipi güneş enerjisi sistemleri hakkında merak edilen temel sorular ve yanıtları.',
    seoTitle: 'Ev Tipi Güneş Enerjisi Sistemleri Hakkında SSS',
    seoDescription: 'SSS makalesi şablonu ile evler için güneş paneli kurulumu, maliyeti ve faydaları hakkında sıkça sorulan sorular.',
    keywords: ['güneş enerjisi', 'güneş paneli', 'ev', 'çatı tipi ges', 'yenilenebilir enerji', 'sss'],
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Ev Tipi Güneş Enerjisi Sistemleri Hakkında Sıkça Sorulan Sorular' },
        { id: generateId(), type: 'text', content: 'Evinizin çatısına güneş paneli kurmayı mı düşünüyorsunuz? Bu süreçle ilgili aklınıza takılabilecek yaygın soruları ve cevaplarını sizin için derledik.' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 1: Güneş paneli sistemi kurmak ne kadar maliyetli?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Maliyet, sistemin büyüklüğüne (kurulu güç), kullanılan panel ve invertör markasına, kurulumun yapılacağı çatının özelliklerine ve bulunduğunuz bölgeye göre değişiklik gösterir. Ortalama bir konut için maliyet [ortalama maliyet aralığı] arasında değişebilir, ancak uzun vadede elektrik faturalarından tasarruf sağlayarak kendini amorti edebilir.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 2: Sistem ne kadar elektrik üretir ve ihtiyacımı karşılar mı?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Üretilen elektrik miktarı, panel sayısı, güneşlenme süresi, panellerin açısı ve verimliliği gibi faktörlere bağlıdır. Kurulum öncesi yapılan keşif ve analizlerle, evinizin yıllık enerji tüketimine uygun bir sistem tasarlanır. Çoğu durumda, sistem yıllık tüketimin önemli bir kısmını veya tamamını karşılayabilir.' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 3: Devlet teşvikleri veya destekleri var mı?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Türkiye\'de ev tipi güneş enerjisi sistemleri için çeşitli devlet teşvikleri, mahsuplaşma (net metering) imkanları ve uygun kredi olanakları bulunmaktadır. Güncel teşvikler için Enerji ve Tabii Kaynaklar Bakanlığı veya ilgili dağıtım şirketinin web sitelerini takip etmek önemlidir.' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 4: Panellerin ömrü ne kadar ve bakımı nasıl yapılır?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Kaliteli güneş panellerinin genellikle 25-30 yıl performans garantisi bulunur. Bakımları oldukça basittir; genellikle yılda birkaç kez yüzeylerinin temizlenmesi yeterlidir. İnvertör gibi diğer bileşenlerin ömrü daha kısa olabilir ve belirli aralıklarla kontrol veya değişim gerektirebilir.' },
         { id: generateId(), type: 'divider' },
         { id: generateId(), type: 'heading', level: 2, content: 'Soru 5: Hava bulutlu veya yağmurlu olduğunda sistem çalışır mı?' },
         { id: generateId(), type: 'text', content: '**Cevap:** Evet, güneş panelleri doğrudan güneş ışığı olmadan da (düşük seviyede de olsa) elektrik üretebilirler. Ancak üretim miktarı güneşlenme yoğunluğuna bağlı olarak azalır. Şebeke bağlantılı sistemlerde, üretimin yetersiz kaldığı durumlarda elektrik şebekeden çekilir.' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'text', content: 'Daha detaylı bilgi ve kişiye özel teklifler için yetkili güneş enerjisi firmaları ile iletişime geçebilirsiniz.' },
    ]
  },
  {
    id: 'how-to-guide',
    name: 'Nasıl Yapılır Rehberi',
    description: 'Belirli bir işlemi adım adım anlatan, öğretici içerikler için ideal.',
    previewImageUrl: 'https://picsum.photos/seed/template-howto-plant/300/200',
    category: 'Biyoloji',
    excerpt: 'Evde kolayca mikro yeşillik yetiştirmek için adım adım pratik bir rehber.',
    seoTitle: 'Evde Mikro Yeşillik Nasıl Yetiştirilir? Adım Adım Rehber',
    seoDescription: 'Nasıl yapılır rehberi şablonu ile evde kendi mikro yeşilliklerinizi yetiştirmenin kolay yolu.',
    keywords: ['mikro yeşillik', 'evde tarım', 'nasıl yapılır', 'sağlıklı beslenme', 'bahçecilik'],
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Evde Mikro Yeşillik Nasıl Yetiştirilir? Adım Adım Rehber' },
        { id: generateId(), type: 'text', content: 'Mikro yeşillikler, genç sebze ve otların filizleridir ve besin değerleri oldukça yüksektir. Evde kolayca yetiştirebilir ve salatalarınıza, sandviçlerinize lezzet katabilirsiniz. İşte basit adımlar:' },
        { id: generateId(), type: 'heading', level: 2, content: 'Gerekli Malzemeler' },
        { id: generateId(), type: 'text', content: '- Sığ bir tepsi veya kap (drenaj delikli veya deliksiz olabilir)\n- Yetiştirme ortamı (torf, kokopit veya özel mikro yeşillik toprağı)\n- Mikro yeşillik tohumları (roka, turp, brokoli, ayçiçeği vb.)\n- Sprey şişesi (su püskürtmek için)\n- Makas (hasat için)' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 1: Yetiştirme Ortamını Hazırlayın' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-plant-soil-img/600/350', alt: 'Tepsiye Toprak Yayma', caption:'Toprağı nemlendirin ve düzleştirin.' },
        { id: generateId(), type: 'text', content: 'Tepsiyi yaklaşık 2-3 cm kalınlığında yetiştirme ortamı ile doldurun. Toprağı hafifçe bastırın ve sprey şişesiyle iyice nemlendirin, ancak çamurlaşmamasına dikkat edin.' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 2: Tohumları Ekin' },
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-plant-seeds-img/600/350', alt: 'Toprağa Tohum Serpme', caption:'Tohumları yüzeye eşit şekilde serpin.' },
        { id: generateId(), type: 'text', content: 'Tohumları nemli toprağın yüzeyine eşit bir şekilde serpin. Tohumların birbirine çok yakın olmamasına özen gösterin. Üzerlerini çok ince bir tabaka toprakla kapatabilir veya açık bırakabilirsiniz (tohum türüne bağlı).' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 3: Çimlenme Süreci' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-plant-cover-img/600/350', alt: 'Tepsiyi Kapatma', caption:'İlk birkaç gün karanlık ve nemli tutun.' },
        { id: generateId(), type: 'text', content: 'Tepsiyi başka bir tepsiyle veya karanlık bir bezle kapatarak tohumların çimlenmesini teşvik edin. Bu aşamada ışığa ihtiyaçları yoktur. Toprağın nemli kalması için günde bir veya iki kez kontrol edip su püskürtün. Genellikle 2-4 gün içinde çimlenme başlar.' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 4: Işığa Çıkarma ve Büyütme' },
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-plant-light-img/600/350', alt: 'Filizleri Işığa Koyma', caption:'Çimlenen filizleri aydınlık bir yere alın.' },
        { id: generateId(), type: 'text', content: 'Filizler görünmeye başlayınca tepsiyi aydınlık bir yere (doğrudan güneş ışığı almayan) veya bir bitki yetiştirme lambasının altına alın. Toprağı nemli tutmaya devam edin.' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 5: Hasat' },
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-plant-harvest-img/600/350', alt: 'Mikro Yeşillik Hasadı', caption:'İlk gerçek yapraklar çıktığında hasat edin.' },
        { id: generateId(), type: 'text', content: 'Mikro yeşillikler genellikle 7-14 gün içinde hasat edilebilir hale gelir. İlk gerçek yaprak çifti tamamen açıldığında, temiz bir makasla toprağın hemen üzerinden kesin. Yıkayıp hemen tüketebilir veya buzdolabında birkaç gün saklayabilirsiniz. Afiyet olsun!' },
    ]
  },
   {
    id: 'interview-article',
    name: 'Röportaj Makalesi',
    description: 'Bir uzmanla yapılan söyleşiyi soru-cevap formatında detaylı bir şekilde sunar.',
    previewImageUrl: 'https://picsum.photos/seed/template-interview-neuro/300/200',
    category: 'Biyoloji',
    excerpt: 'Nörobilim uzmanı Dr. Elif Aydın ile beyin plastisitesi ve öğrenme üzerine bir röportaj.',
    seoTitle: 'Röportaj: Dr. Elif Aydın ile Beyin Plastisitesi ve Öğrenme',
    seoDescription: 'Röportaj makalesi şablonu ile nörobilim uzmanı Dr. Elif Aydın\'ın beyin esnekliği ve öğrenme süreçleri hakkındaki görüşleri.',
    keywords: ['nörobilim', 'plastisite', 'beyin', 'öğrenme', 'hafıza', 'röportaj'],
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Dr. Elif Aydın ile Beyin Plastisitesi ve Öğrenme Üzerine Söyleşi' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/interview-elif-aydin-img/400/400', alt: 'Dr. Elif Aydın Portresi', caption:'Dr. Elif Aydın, Nörobilim Uzmanı' },
        { id: generateId(), type: 'text', content: 'Beynimizin yaşam boyu değişme ve adapte olma yeteneği olan nöroplastisite, öğrenme ve hafıza süreçlerimizin temelini oluşturuyor. Bu büyüleyici konuyu, alanın önde gelen isimlerinden Nörobilim Uzmanı Dr. Elif Aydın ile konuştuk.' },
        { id: generateId(), type: 'heading', level: 2, content: 'Nöroplastisite Tam Olarak Nedir?' },
        { id: generateId(), type: 'text', content: '**Soru:** Hocam, nöroplastisite kavramını basitçe nasıl açıklarsınız?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Nöroplastisite, beynin yapısını ve fonksiyonunu deneyimlere, öğrenmeye ve hatta yaralanmalara yanıt olarak değiştirme yeteneğidir. Yani beynimiz sabit bir yapı değil, sürekli olarak yeniden şekillenebilen dinamik bir organdır. Yeni sinirsel bağlantılar kurabilir, mevcut bağlantıları güçlendirebilir veya zayıflatabilir.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Öğrenme ve Hafıza ile İlişkisi' },
        { id: generateId(), type: 'text', content: '**Soru:** Öğrenme sürecinde nöroplastisitenin rolü nedir?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Öğrenme, aslında nöroplastisitenin bir sonucudur. Yeni bir bilgi veya beceri öğrendiğimizde, beynimizdeki nöronlar arasındaki bağlantılar (sinapslar) değişir. Tekrar ve pratikle bu bağlantılar güçlenir ve bilgi kalıcı hale gelir. Hafıza da benzer şekilde, bu sinaptik değişikliklerin korunmasıyla oluşur.' },
        { id: generateId(), type: 'quote', content: "Beyin, kullanıldıkça gelişen bir kas gibidir.", citation:"Dr. Elif Aydın" },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Plastisiteyi Nasıl Geliştirebiliriz?' },
        { id: generateId(), type: 'text', content: '**Soru:** Günlük hayatta beyin plastisitesini desteklemek için neler yapabiliriz?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Birkaç önemli faktör var: Sürekli yeni şeyler öğrenmeye açık olmak, zihinsel olarak zorlayıcı aktivitelerle meşgul olmak (bulmaca çözmek, yeni bir dil öğrenmek gibi), düzenli fiziksel egzersiz yapmak, kaliteli uyku uyumak ve sağlıklı beslenmek. Ayrıca, sosyal etkileşim ve stresi yönetmek de beyin sağlığı ve plastisitesi için önemlidir.' },
         { id: generateId(), type: 'divider' },
         { id: generateId(), type: 'heading', level: 2, content: 'Yaşlanma ve Plastisite' },
         { id: generateId(), type: 'text', content: '**Soru:** Yaş ilerledikçe beyin plastisitesi azalır mı?' },
         { id: generateId(), type: 'text', content: '**Cevap:** Evet, yaşla birlikte plastisite yeteneğinde bir miktar azalma olabilir, ancak beyin hiçbir zaman değişme yeteneğini tamamen kaybetmez. Yaşam boyu öğrenme ve yukarıda saydığım sağlıklı yaşam alışkanlıkları, yaşlılıkta bile bilişsel fonksiyonların korunmasına ve plastisitenin desteklenmesine yardımcı olabilir.' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'text', content: 'Dr. Elif Aydın\'a beyin plastisitesi konusundaki değerli bilgileri paylaştığı için teşekkür ediyoruz. Beynimizin bu inanılmaz uyum yeteneği, sürekli gelişim ve öğrenme için bize büyük bir potansiyel sunuyor.' },
    ]
  },
];

// --- Helper Functions ---

// Function to convert block structure to HTML (basic implementation for backward compatibility)
// NOTE: This function is deprecated and might not fully represent complex block types.
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
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n/g, '<br />'); // Basic newline handling
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
                 // Basic YouTube embed from youtubeId or URL
                 const videoId = block.youtubeId || block.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)?.pop();
                 if (videoId && videoId.length === 11) {
                     html += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n`;
                 } else if (block.url) {
                     html += `<p><a href="${block.url}" target="_blank" rel="noopener noreferrer">Video izle: ${block.url}</a></p>\n`;
                 }
                 break;
             case 'section':
                 // Section rendering depends heavily on implementation, basic comment here
                 html += `<!-- Section: ${block.sectionType} Settings: ${JSON.stringify(block.settings)} -->\n`;
                 // For custom text, render the content
                 if(block.sectionType === 'custom-text' && block.settings?.content) {
                    html += `<div>${block.settings.content}</div>\n`
                 }
                 break;
            default:
                 // Fallback for unknown block types
                 html += `<!-- Unsupported block type: ${block.type} -->\n`;
        }
    });
    return html;
};


export function TemplateSelector({
  isOpen,
  onClose,
  onSelectTemplate,
  onSelectTemplateBlocks,
  blocksCurrentlyExist
}: TemplateSelectorProps) {
    const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

    const handleSelectClick = (template: Template) => {
        setSelectedTemplate(template);
        if (blocksCurrentlyExist) {
            setIsConfirmOpen(true); // Show confirmation dialog if blocks exist
        } else {
            applyTemplate(template.blocks); // Apply directly if no blocks exist
        }
    };

    const applyTemplate = (blocks: Block[]) => {
        onSelectTemplateBlocks(blocks);
        if (onSelectTemplate) {
             console.warn("TemplateSelector: onSelectTemplate is deprecated. Use onSelectTemplateBlocks instead.");
             const htmlContent = blocksToHtml(blocks);
             onSelectTemplate(htmlContent);
        }
        onClose();
        setIsConfirmOpen(false); // Close confirmation dialog if open
        setSelectedTemplate(null); // Reset selected template
    };

     // Handle template preview - pass the specific template's data
     const handlePreview = (template: Template) => {
         // Construct the full ArticleData object for preview
         const previewData: Partial<ArticleData> = {
             id: `preview-${template.id}`, // Use a distinct preview ID
             title: template.seoTitle || template.name,
             excerpt: template.excerpt || template.description,
             blocks: template.blocks,
             category: template.category || 'Teknoloji', // Default category if not set
             status: 'Yayınlandı', // Preview as published
             // Try to find the first image block's URL to use as mainImageUrl
             mainImageUrl: template.blocks.find((b): b is Extract<Block, { type: 'image' }> => b.type === 'image')?.url || template.previewImageUrl,
             seoTitle: template.seoTitle,
             seoDescription: template.seoDescription,
             keywords: template.keywords,
             createdAt: new Date().toISOString(), // Use current date for preview
             updatedAt: new Date().toISOString(),
             authorId: 'template-author',
             slug: `template-${template.id}-preview`,
             isFeatured: false,
             isHero: false,
         };

         // Persist the preview data to localStorage using the template ID as part of the key
         try {
             const previewKey = `articlePreviewData_${template.id}_${Date.now()}`; // Unique key per preview
             localStorage.setItem(previewKey, JSON.stringify(previewData));
             console.log(`[TemplateSelector] Saved preview data with key: ${previewKey}`);

             // Open preview with the correct key
             window.open(`/admin/preview?templateKey=${previewKey}`, '_blank');
         } catch (error) {
             console.error("[TemplateSelector] Error saving preview data to localStorage:", error);
             toast({
                 variant: "destructive",
                 title: "Önizleme Hatası",
                 description: "Önizleme verisi kaydedilemedi. Tarayıcı depolama alanı dolu olabilir.",
             });
         }
     };

    return (
        <AlertDialog> {/* Wrap the entire structure with AlertDialog */}
            <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <DialogContent className="sm:max-w-[60%] lg:max-w-[70%] max-h-[80vh] flex flex-col"> {/* Wider dialog, height limit, flex */}
                    <DialogHeader>
                        <DialogTitle>Makale Şablonu Seç</DialogTitle>
                        <DialogDescription>
                            İçeriğinizi oluşturmaya başlamak için hazır bir şablon seçin.
                            {blocksCurrentlyExist && <span className="text-destructive font-medium"> Şablon içeriği mevcut içeriğinizin üzerine yazılabilir (onayınızla).</span>}
                        </DialogDescription>
                    </DialogHeader>
                     {/* Make ScrollArea take remaining space */}
                    <ScrollArea className="flex-grow w-full rounded-md border my-4">
                        <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                            {templates.map((template) => (
                                <Card key={template.id} className="flex flex-col">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">{template.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col flex-grow space-y-3">
                                        <div className="relative aspect-[3/2] w-full rounded overflow-hidden">
                                            <Image
                                                src={template.previewImageUrl}
                                                alt={template.description}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground flex-grow">{template.description}</p>
                                        <div className="flex justify-between items-center pt-2">
                                             <Button size="sm" variant="outline" onClick={() => handlePreview(template)}>
                                                  <Eye className="mr-2 h-4 w-4" />
                                                 Önizle
                                             </Button>
                                             {/* Trigger the AlertDialog when "Seç" is clicked */}
                                             <AlertDialogTrigger asChild>
                                                 <Button size="sm" onClick={() => setSelectedTemplate(template)}> {/* Only set selected template here */}
                                                     Seç
                                                 </Button>
                                             </AlertDialogTrigger>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Kapat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog Content - This is now correctly within AlertDialog context */}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Mevcut İçeriğin Üzerine Yazılsın mı?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Düzenleyicide zaten içerik bulunuyor. Seçili şablonu uygulamak mevcut içeriği silecektir.
                        Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                     <AlertDialogCancel onClick={() => setSelectedTemplate(null)}>İptal</AlertDialogCancel>
                     {/* Apply the template only when the confirmation action is clicked */}
                     <AlertDialogAction onClick={() => selectedTemplate && applyTemplate(selectedTemplate.blocks)}>
                         Evet, Üzerine Yaz
                     </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

    