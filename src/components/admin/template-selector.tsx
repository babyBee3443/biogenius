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
    previewImageUrl: 'https://picsum.photos/seed/template-std-v2/300/200', // New preview seed
    category: 'Teknoloji',
    excerpt: 'Kuantum bilgisayarların potansiyelini ele alan temel bir makale yapısı.', // Updated excerpt
    seoTitle: 'Kuantum Bilgisayarların Temelleri', // Updated SEO Title
    seoDescription: 'Standart makale şablonu kullanılarak kuantum bilgisayarların temelleri.', // Updated SEO Desc
    blocks: [
      { id: generateId(), type: 'heading', level: 1, content: 'Kuantum Bilgisayarlar: Yeni Bir Hesaplama Çağı' }, // Updated content
      { id: generateId(), type: 'text', content: 'Kuantum bilgisayarlar, klasik bilgisayarların çözemediği problemleri çözme potansiyeli taşıyan devrim niteliğinde makinelerdir. Bu makalede, kuantum hesaplamanın temellerine ve olası uygulama alanlarına göz atacağız.' }, // Updated content
      { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/std-quantum-main/800/400', alt: 'Kuantum Bilgisayar Konsepti', caption: 'Kübitler ve süperpozisyon.' }, // Updated image & caption
      { id: generateId(), type: 'text', content: 'Klasik bilgisayarlar bitleri (0 veya 1) kullanırken, kuantum bilgisayarlar **kübitleri** kullanır. Kübitler, süperpozisyon sayesinde aynı anda hem 0 hem de 1 değerini alabilirler. Bu özellik, belirli hesaplamalarda üstel bir hız artışı sağlar.' }, // Updated content
      { id: generateId(), type: 'heading', level: 2, content: 'Kuantum Üstünlüğü ve Uygulamalar' },
      { id: generateId(), type: 'text', content: 'Kuantum üstünlüğü, bir kuantum bilgisayarın en gelişmiş klasik bilgisayarın pratik olarak çözemeyeceği bir problemi çözdüğü noktayı ifade eder. İlaç keşfi, malzeme bilimi, finansal modelleme ve kriptografi gibi alanlarda devrim yaratabilir.' }, // Updated content
      { id: generateId(), type: 'heading', level: 2, content: 'Zorluklar ve Gelecek' },
      { id: generateId(), type: 'video', url: 'https://www.youtube.com/watch?v=WVv5OAR4Nik', youtubeId: 'WVv5OAR4Nik' }, // Different video
      { id: generateId(), type: 'text', content: 'Kuantum bilgisayarların geliştirilmesi hala birçok teknik zorluk içermektedir. Kübitlerin kararlılığını sağlamak ve hata düzeltme mekanizmalarını geliştirmek önemlidir. Gelecekte, kuantum ve klasik bilgisayarların hibrit sistemlerde birlikte çalışması beklenmektedir.' }, // Updated content
      { id: generateId(), type: 'quote', content: 'Geleceği tahmin etmenin en iyi yolu, onu icat etmektir.', citation: 'Alan Kay' }, // Updated quote
      { id: generateId(), type: 'text', content: 'Sonuç olarak, kuantum bilgisayarlar hesaplama paradigmalarını değiştirme potansiyeline sahiptir ve bilim ve teknoloji için heyecan verici yeni kapılar açmaktadır.' }, // Updated content
    ]
  },
   {
    id: 'listicle',
    name: 'Listeleme Makalesi',
    description: 'Numaralı veya madde işaretli listeler içeren makaleler için uygundur.',
    previewImageUrl: 'https://picsum.photos/seed/template-list-bio-v2/300/200', // New preview seed
    category: 'Biyoloji', // Changed category
    excerpt: 'Sağlıklı bir yaşam için uygulanabilecek temel adımları listeleyen bir şablon.', // Updated excerpt
    seoTitle: 'Daha Sağlıklı Bir Yaşam İçin 5 Öneri', // Updated SEO Title
    seoDescription: 'Listeleme makalesi şablonu ile sağlıklı yaşam önerileri.', // Updated SEO Desc
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Daha Sağlıklı Bir Yaşam İçin 5 Öneri' }, // Updated content
        { id: generateId(), type: 'text', content: 'Sağlığınızı iyileştirmek ve daha enerjik hissetmek için hayatınıza katabileceğiniz basit ama etkili 5 öneriyi sizin için derledik.' }, // Updated content
        { id: generateId(), type: 'heading', level: 2, content: '1. Dengeli Beslenin' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-food-healthy/600/300', alt: 'Sağlıklı Beslenme Tabağı', caption: 'Bol sebze, meyve ve tam tahıl tüketin.' }, // Updated image & caption
        { id: generateId(), type: 'text', content: 'İşlenmiş gıdalar yerine taze ve doğal besinlere odaklanın. Öğünlerinizde protein, karbonhidrat ve sağlıklı yağ dengesini kurmaya özen gösterin. Yeterli lif alımı sindirim sisteminiz için kritiktir.' }, // Updated content
        { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'heading', level: 2, content: '2. Düzenli Egzersiz Yapın' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-exercise-out/600/300', alt: 'Doğada Egzersiz Yapan Kişi', caption: 'Haftada en az 150 dakika orta yoğunlukta aktivite.' }, // Updated image & caption
        { id: generateId(), type: 'text', content: 'Fiziksel aktivite sadece kilo kontrolü için değil, aynı zamanda kalp sağlığı, ruh hali ve genel zindelik için de önemlidir. Sevdiğiniz bir egzersiz türünü bulun ve düzenli olarak yapın.' }, // Updated content
         { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'heading', level: 2, content: '3. Yeterli Uyku Alın' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-sleep-peace/600/300', alt: 'Huzurlu Uyku Ortamı' }, // Updated image
        { id: generateId(), type: 'text', content: 'Yetişkinler için genellikle 7-9 saat kaliteli uyku önerilir. Yetersiz uyku, bağışıklık sistemini zayıflatabilir, konsantrasyonu düşürebilir ve kronik hastalıklara yol açabilir.' }, // Updated content
         { id: generateId(), type: 'divider'},
         { id: generateId(), type: 'heading', level: 2, content: '4. Stresi Yönetin' },
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-stress-relax/600/300', alt: 'Meditasyon Yapan Kişi' }, // Updated image
         { id: generateId(), type: 'text', content: 'Kronik stres, sağlığınız üzerinde olumsuz etkilere neden olabilir. Meditasyon, yoga, derin nefes egzersizleri veya hobilerinizle ilgilenmek gibi stres yönetimi tekniklerini deneyin.' }, // Updated content
         { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'heading', level: 2, content: `5. Bol Su İçin` },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-water-glass/600/300', alt: 'Bir Bardak Su' }, // Updated image
        { id: generateId(), type: 'text', content: 'Vücudumuzun düzgün çalışması için su hayati öneme sahiptir. Gün boyunca yeterli miktarda su içmek, enerji seviyenizi yüksek tutar, cildinizi sağlıklı tutar ve toksinlerin atılmasına yardımcı olur.' }, // Updated content
        { id: generateId(), type: 'text', content: 'Bu basit adımları hayatınıza entegre ederek genel sağlığınızı ve yaşam kalitenizi önemli ölçüde artırabilirsiniz.'}, // Updated content
    ]
  },
  {
    id: 'image-gallery',
    name: 'Görsel Galerisi',
    description: 'Görsellerin ön planda olduğu, açıklamalı galeri düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/template-gallery-arch-v2/300/200', // New preview seed
    category: 'Teknoloji', // Changed category
    excerpt: 'Modern mimarinin etkileyici örneklerini sergileyen bir görsel galeri.', // Updated excerpt
    seoTitle: 'Modern Mimari Harikaları Galerisi', // Updated SEO Title
    seoDescription: 'Görsel galerisi şablonu ile modern mimari örnekleri.', // Updated SEO Desc
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Modern Mimari Harikaları Galerisi' }, // Updated content
        { id: generateId(), type: 'text', content: 'Dünyanın farklı köşelerinden, yenilikçi tasarımları ve etkileyici yapılarıyla öne çıkan modern mimari örneklerini sizin için derledik.' }, // Updated content
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-arch-futur/800/500', alt: 'Fütüristik Bina Cephesi', caption: 'Görsel 1: Cesur çizgiler ve cam kullanımıyla dikkat çeken fütüristik bir yapı.' }, // Updated image & caption
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-arch-minimal/800/500', alt: 'Minimalist Konut Tasarımı', caption: 'Görsel 2: Doğal malzemeler ve sade formların birleşimiyle minimalist bir estetik.' }, // Updated image & caption
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-arch-bridge/800/500', alt: 'Asma Köprü Detayı', caption: 'Görsel 3: Mühendislik ve estetiği bir araya getiren modern bir köprü tasarımı.' }, // Updated image & caption
         { id: generateId(), type: 'divider' },
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-arch-interior/800/500', alt: 'Modern İç Mekan', caption: 'Görsel 4: Geniş ve aydınlık, fonksiyonel bir modern iç mekan düzenlemesi.' }, // Updated image & caption
        { id: generateId(), type: 'text', content: 'Modern mimari, sadece estetik değil, aynı zamanda fonksiyonellik ve sürdürülebilirlik gibi konulara da odaklanarak yaşam alanlarımızı şekillendiriyor.' }, // Updated content
    ]
  },
  {
    id: 'faq-article',
    name: 'SSS Makalesi',
    description: 'Sıkça sorulan sorular ve cevapları formatında bir düzen.',
    previewImageUrl: 'https://picsum.photos/seed/template-faq-bio-v2/300/200', // New preview seed
    category: 'Biyoloji', // Changed category
    excerpt: 'Genetik testler hakkında sıkça sorulan soruları yanıtlayan bir şablon.', // Updated excerpt
    seoTitle: 'Genetik Testler Hakkında SSS', // Updated SEO Title
    seoDescription: 'SSS makalesi şablonu ile genetik testler hakkında merak edilenler.', // Updated SEO Desc
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Genetik Testler Hakkında Sıkça Sorulan Sorular' }, // Updated content
        { id: generateId(), type: 'text', content: 'Genetik testler, sağlık durumunuz, hastalık riskleriniz ve soy ağacınız hakkında bilgi edinmenizi sağlayabilir. Ancak bu testlerle ilgili birçok soru işareti de bulunmaktadır. İşte en yaygın sorular ve cevapları:' }, // Updated content
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 1: Genetik test nedir ve ne işe yarar?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Genetik testler, DNA\'nızdaki belirli değişiklikleri (varyasyonlar, mutasyonlar) analiz eden tıbbi testlerdir. Hastalık risklerini belirlemek, taşıyıcılık durumunu öğrenmek, ilaçlara verilen yanıtı tahmin etmek veya soy ağacını araştırmak gibi amaçlarla kullanılır.'}, // Updated content
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 2: Genetik testlerin türleri nelerdir?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Teşhis testleri, taşıyıcılık testleri, doğum öncesi testler, yenidoğan tarama testleri, farmakogenetik testler ve doğrudan tüketiciye yönelik (DTC) testler gibi çeşitli türleri vardır. Her testin amacı ve sağladığı bilgi farklıdır.'}, // Updated content
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 3: Genetik testler ne kadar güvenilirdir?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Testin güvenilirliği, testin türüne, yapıldığı laboratuvarın kalitesine ve analiz edilen spesifik genetik değişikliğe bağlıdır. Klinik amaçlı testler genellikle yüksek doğruluk oranına sahiptir, ancak DTC testlerinin sonuçları dikkatli yorumlanmalıdır. Sonuçlar mutlaka bir sağlık uzmanı veya genetik danışman ile değerlendirilmelidir.'}, // Updated content
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 4: Genetik bilgilerimin gizliliği nasıl korunur?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Klinik testlerde genetik bilgiler genellikle tıbbi gizlilik yasalarıyla korunur. Ancak DTC testlerde gizlilik politikaları şirketten şirkete değişebilir. Test yaptırmadan önce ilgili şirketin gizlilik politikasını dikkatlice incelemek önemlidir.'}, // Updated content
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'text', content: 'Genetik testler hakkında daha fazla bilgi veya kişisel danışmanlık için bir genetik uzmanına başvurmanız önerilir.' }, // Updated content
    ]
  },
  {
    id: 'how-to-guide',
    name: 'Nasıl Yapılır Rehberi',
    description: 'Adım adım talimatlar içeren öğretici makaleler için.',
    previewImageUrl: 'https://picsum.photos/seed/template-howto-photo-v2/300/200', // New preview seed
    category: 'Teknoloji', // Kept category
    excerpt: 'Akıllı telefonla daha iyi fotoğraflar çekmek için adım adım ipuçları.', // Updated excerpt
    seoTitle: 'Telefonunuzla Daha İyi Fotoğraflar Nasıl Çekilir?', // Updated SEO Title
    seoDescription: 'Nasıl yapılır rehberi şablonu ile mobil fotoğrafçılık ipuçları.', // Updated SEO Desc
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Akıllı Telefonunuzla Daha İyi Fotoğraflar Nasıl Çekilir?' }, // Updated content
        { id: generateId(), type: 'text', content: 'Profesyonel bir makineye ihtiyacınız yok! Akıllı telefonunuzun kamerasını daha etkili kullanarak harika fotoğraflar çekebilirsiniz. İşte size yol gösterecek bazı temel adımlar:' }, // Updated content
        { id: generateId(), type: 'heading', level: 2, content: 'Temel İpuçları' },
        { id: generateId(), type: 'text', content: 'Başlamadan önce birkaç temel noktaya dikkat edelim:\n- **Lensinizi Temizleyin:** Parmak izleri ve kir, fotoğraf kalitesini düşürür.\n- **Dijital Zoomdan Kaçının:** Görüntüyü kırparak kaliteyi bozar. Onun yerine konuya yaklaşın.\n- **Işığı Anlayın:** İyi ışıklandırma, fotoğrafın temelidir. Doğal ışığı tercih edin.' }, // Updated content
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 1: Kompozisyon Kurallarını Kullanın (Üçler Kuralı)' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-ruleofthirds/600/350', alt: 'Üçler Kuralı Izgarası', caption:'Konuyu kesişim noktalarına yerleştirin.' }, // Updated image & caption
        { id: generateId(), type: 'text', content: 'Telefonunuzun kamera ayarlarından kılavuz çizgilerini (grid) açın. Önemli öğeleri veya konunuzu bu çizgilerin kesiştiği noktalara yerleştirmek, daha dengeli ve ilgi çekici fotoğraflar oluşturmanıza yardımcı olur.' }, // Updated content
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 2: Odak ve Pozlamayı Ayarlayın' },
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-focus-tap/600/350', alt: 'Ekrana Dokunarak Odaklama', caption:'Netlemek istediğiniz noktaya dokunun.' }, // Updated image & caption
        { id: generateId(), type: 'text', content: 'Çoğu akıllı telefon, ekrana dokunarak odak noktasını ve pozlamayı (parlaklığı) ayarlamanıza olanak tanır. Net olmasını istediğiniz alana dokunun ve gerekirse parlaklığı kaydırarak ayarlayın.' }, // Updated content
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 3: Farklı Açılardan Deneyin' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-angles-low/600/350', alt: 'Alçak Açıdan Fotoğraf Çekimi' }, // Updated image
        { id: generateId(), type: 'text', content: 'Her zaman göz hizasından çekim yapmak zorunda değilsiniz. Alçaktan, yüksekten veya farklı perspektiflerden çekim yaparak daha dinamik ve yaratıcı kareler yakalayabilirsiniz.' }, // Updated content
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 4: Düzenleme Araçlarını Kullanın' },
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-edit-app/600/350', alt: 'Fotoğraf Düzenleme Uygulaması', caption:'Basit düzenlemeler büyük fark yaratabilir.' }, // Updated image & caption
        { id: generateId(), type: 'text', content: 'Fotoğraf çektikten sonra, telefonunuzdaki veya üçüncü parti uygulamalardaki düzenleme araçlarını kullanarak küçük ayarlamalar yapın. Parlaklık, kontrast, keskinlik ve renk doygunluğu gibi ayarlar fotoğrafınızı daha etkili hale getirebilir.' }, // Updated content
        { id: generateId(), type: 'heading', level: 2, content: 'Bonus İpucu' },
        { id: generateId(), type: 'text', content: '- **Portre Modu:** Arka planı bulanıklaştırarak konuyu öne çıkarmak için portre modunu kullanın.\n- **HDR Modu:** Yüksek kontrastlı sahnelerde (parlak gökyüzü, gölgeli alanlar) hem aydınlık hem de karanlık bölgelerdeki detayları korumak için HDR\'yi etkinleştirin.' }, // Updated content
    ]
  },
   {
    id: 'interview-article',
    name: 'Röportaj Makalesi',
    description: 'Bir kişiyle yapılan röportajı soru-cevap formatında sunar.',
    previewImageUrl: 'https://picsum.photos/seed/template-interview-tech-v2/300/200', // New preview seed
    category: 'Teknoloji', // Changed category
    excerpt: 'Yapay zeka etiği uzmanı ile yapılan bir röportajı içeren şablon.', // Updated excerpt
    seoTitle: 'Röportaj: Prof. Dr. Can Demir ile Yapay Zeka Etiği', // Updated SEO Title
    seoDescription: 'Röportaj makalesi şablonu ile yapay zeka etiği üzerine bir söyleşi.', // Updated SEO Desc
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Prof. Dr. Can Demir ile Yapay Zeka Etiği Üzerine Söyleşi' }, // Updated content
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/interview-can-demir/400/400', alt: 'Prof. Dr. Can Demir Portresi', caption:'Prof. Dr. Can Demir, Yapay Zeka Etiği Uzmanı' }, // Updated image & caption
        { id: generateId(), type: 'text', content: 'Yapay zeka (AI) teknolojilerinin hızla geliştiği günümüzde, etik konular giderek daha fazla önem kazanıyor. Bu alandaki çalışmalarıyla tanınan Prof. Dr. Can Demir ile AI etiğinin temel sorunlarını ve geleceğini konuştuk.' }, // Updated content
        { id: generateId(), type: 'heading', level: 2, content: 'Yapay Zeka Etiğinin Önemi' },
        { id: generateId(), type: 'text', content: '**Soru:** Yapay zeka etiği neden bu kadar önemli hale geldi?' },
        { id: generateId(), type: 'text', content: '**Cevap:** AI sistemleri artık hayatımızın birçok alanında karar alma süreçlerine dahil oluyor; sağlıktan finansa, ulaşımdan işe alıma kadar. Bu sistemlerin adil, şeffaf, hesap verebilir ve insan haklarına saygılı bir şekilde tasarlanıp kullanılması gerekiyor. Aksi takdirde, mevcut eşitsizlikleri derinleştirebilir veya yeni etik sorunlar yaratabilirler.' }, // Updated content
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Algoritmik Önyargı ve Adalet' },
        { id: generateId(), type: 'text', content: '**Soru:** Algoritmik önyargı en çok tartışılan konulardan biri. Bu sorunu nasıl çözebiliriz?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Algoritmik önyargı, genellikle AI sistemlerinin eğitildiği verilerdeki mevcut toplumsal önyargılardan kaynaklanır. Çözüm, sadece teknik değil, aynı zamanda sosyal bir yaklaşım gerektiriyor. Daha çeşitli ve temsili veri setleri kullanmak, algoritmaların adalet metriklerine göre değerlendirilmesi, şeffaflık ve denetlenebilirlik mekanizmaları geliştirmek önemli adımlar.' }, // Updated content
        { id: generateId(), type: 'quote', content: "Yapay zekayı geliştirirken, insanlığımızı kaybetmemeliyiz.", citation:"Prof. Dr. Can Demir" }, // Updated quote
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Gelecekteki Zorluklar ve Fırsatlar' },
        { id: generateId(), type: 'text', content: '**Soru:** Yapay zeka etiği alanında bizi gelecekte neler bekliyor?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Otonom sistemlerin (örneğin sürücüsüz araçlar) karar alma mekanizmalarındaki etik ikilemler, yapay genel zekanın (AGI) potansiyel etkileri ve AI\'ın iş gücü üzerindeki dönüşümü gibi konular daha fazla gündemde olacak. Aynı zamanda, AI\'ı toplumsal fayda için kullanma, örneğin iklim değişikliğiyle mücadele veya sağlık hizmetlerini iyileştirme gibi büyük fırsatlar da var. Önemli olan, bu teknolojiyi etik bir çerçevede geliştirmek ve yönlendirmek.' }, // Updated content
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'text', content: 'Prof. Dr. Can Demir\'e değerli görüşleri için teşekkür ederiz. Yapay zeka etiği, hepimizin düşünmesi gereken kritik bir konu olmaya devam edecek.' }, // Updated content
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
        }
    });
    return html;
};


export function TemplateSelector({ isOpen, onClose, onSelectTemplate, onSelectTemplateBlocks }: TemplateSelectorProps) {

    const handleSelect = (blocks: Block[]) => {
        // Use the primary callback for block-based editors
        onSelectTemplateBlocks(blocks);

        // Call deprecated function for backward compatibility (with warning)
        if (onSelectTemplate) {
             console.warn("TemplateSelector: onSelectTemplate is deprecated and may not accurately represent block structure. Use onSelectTemplateBlocks instead.");
             const htmlContent = blocksToHtml(blocks);
             onSelectTemplate(htmlContent);
        }
        onClose();
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
            mainImageUrl: template.blocks.find(b => b.type === 'image')?.url || template.previewImageUrl,
            seoTitle: template.seoTitle || template.name,
            seoDescription: template.seoDescription || template.description,
            slug: template.id,
            isFeatured: false, // Default values for flags
            isHero: false,
            keywords: template.keywords || [],
            canonicalUrl: '',
            authorId: 'template-preview', // Placeholder author
            createdAt: new Date().toISOString(), // Use current time for preview
            updatedAt: new Date().toISOString(),
        };

        try {
            const localStorageKey = "articlePreviewData"; // Use a fixed key
            console.log(`[TemplateSelector] Setting localStorage key: ${localStorageKey}`);
            localStorage.setItem(localStorageKey, JSON.stringify(previewData));

            const previewUrl = '/admin/preview';
            console.log(`[TemplateSelector] Opening preview URL: ${previewUrl}`);
            const previewWindow = window.open(previewUrl, '_blank');

            if (!previewWindow) {
                toast({ variant: "destructive", title: "Önizleme Açılamadı", description: "Lütfen tarayıcınızda açılır pencerelere izin verin." });
            }
        } catch (error) {
            console.error("[TemplateSelector] Error saving preview data to localStorage:", error);
            toast({ variant: "destructive", title: "Önizleme Hatası", description: "Önizleme verisi kaydedilemedi." });
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
