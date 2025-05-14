
import type { Block } from "@/components/admin/template-selector";
import { generateId } from '@/lib/mock-data';

// --- Template Structure ---
export interface Template {
  id: string;
  name: string;
  description: string;
  previewImageUrl: string;
  blocks: Block[];
  type: 'article' | 'note' | 'page';
  category?: 'Biyoloji' | 'Genel Sayfa'; // Adapted for new categories
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  excerpt?: string;
}

export const TEMPLATE_STORAGE_KEY = 'biyohox_mock_templates_v3';

const defaultArticleTemplates: Template[] = [
    {
        id: 'standard-article', name: 'Standart Makale', description: 'Giriş, ana görsel, alt başlıklar ve sonuç bölümü içeren temel makale düzeni.', previewImageUrl: 'https://picsum.photos/seed/std-article-bio/300/200', type: 'article', category: 'Biyoloji',
        blocks: [ { id: generateId(), type: 'heading', level: 2, content: 'Makale Başlığı Buraya Gelecek' }, { id: generateId(), type: 'text', content: 'Makalenizin ilgi çekici giriş paragrafını buraya yazın. Okuyucunun dikkatini çekecek ve konuya genel bir bakış sunacak bilgiler ekleyin.' }, { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/article-main-placeholder/800/450', alt: 'Makale Ana Görseli', caption: 'Görsel açıklaması (isteğe bağlı)' }, { id: generateId(), type: 'heading', level: 3, content: 'Alt Başlık 1' }, { id: generateId(), type: 'text', content: 'Bu bölümde konunun ilk önemli alt başlığını detaylandırın. Kanıtlar, örnekler veya açıklamalarla destekleyin.' }, { id: generateId(), type: 'heading', level: 3, content: 'Alt Başlık 2' }, { id: generateId(), type: 'text', content: 'İkinci önemli alt başlık ve içeriği. Konuyu farklı bir açıdan ele alabilir veya ilk alt başlığı tamamlayabilirsiniz.' }, { id: generateId(), type: 'quote', content: 'Konuyla ilgili etkileyici veya önemli bir alıntıyı buraya ekleyebilirsiniz.', citation: 'Alıntı Kaynağı (isteğe bağlı)' }, { id: generateId(), type: 'heading', level: 3, content: 'Sonuç' }, { id: generateId(), type: 'text', content: 'Makalenizi özetleyen ve ana mesajı vurgulayan bir sonuç paragrafı yazın. Okuyucuya son bir düşünce veya çağrı bırakabilirsiniz.' }, ],
        seoTitle: 'Örnek Standart Makale Başlığı', seoDescription: 'Bu, standart makale şablonu kullanılarak oluşturulmuş bir örnek makalenin SEO açıklamasıdır.', keywords: ['standart', 'makale', 'şablon', 'örnek'], excerpt: 'Standart makale şablonu ile hızlıca içerik oluşturmaya başlayın. Bu şablon, temel bir makale yapısı sunar.'
    },
    {
        id: 'listicle', name: 'Listeleme Makalesi', description: 'Belirli bir konuda numaralı veya madde işaretli öneriler/bilgiler sunan format.', previewImageUrl: 'https://picsum.photos/seed/list-article-bio/300/200', type: 'article', category: 'Biyoloji',
        blocks: [ { id: generateId(), type: 'heading', level: 2, content: '[Sayı] Adımda [Konu Başlığı]' }, { id: generateId(), type: 'text', content: 'Bu listeleme makalesinde, [konu] hakkında bilmeniz gereken [sayı] önemli noktayı/adımı/öneriyi bulacaksınız.' }, { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/listicle-header-image/800/400', alt: 'Listeleme Makalesi Konsept Görseli', caption: 'Her adımda yeni bir bilgi keşfedin.' }, { id: generateId(), type: 'heading', level: 3, content: '1. [İlk Madde/Adım Başlığı]' }, { id: generateId(), type: 'text', content: 'İlk maddenin veya adımın detaylı açıklaması. Neden önemli olduğunu veya nasıl uygulanacağını belirtin.' }, { id: generateId(), type: 'heading', level: 3, content: '2. [İkinci Madde/Adım Başlığı]' }, { id: generateId(), type: 'text', content: 'İkinci maddenin açıklaması. Örnekler veya ek bilgilerle zenginleştirin.' }, { id: generateId(), type: 'divider' }, { id: generateId(), type: 'heading', level: 3, content: '3. [Üçüncü Madde/Adım Başlığı]' }, { id: generateId(), type: 'text', content: 'Üçüncü maddenin detayları.' }, { id: generateId(), type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeId: 'dQw4w9WgXcQ'}, { id: generateId(), type: 'text', content: 'Listeleme makalesinin sonunda genel bir özet veya ek tavsiyeler sunabilirsiniz.' }, ],
        seoTitle: '[Konu Başlığı] Hakkında [Sayı] Önemli Bilgi | Listeleme Makalesi', seoDescription: '[Konu Başlığı] ile ilgili en önemli [sayı] maddeyi/adımı öğrenin. Bu listeleme makalesi size pratik bilgiler sunar.', keywords: ['listeleme', 'ipuçları', 'rehber', 'adım adım'], excerpt: '[Konu Başlığı] hakkında bilmeniz gerekenleri adım adım veya madde madde açıklayan pratik bir rehber.'
    },
    {
        id: 'image-gallery-article', name: 'Görsel Galerisi', description: 'Görsellerin ön planda olduğu, açıklamalı ve tematik galeri düzeni.', previewImageUrl: 'https://picsum.photos/seed/gallery-article-nature/300/200', type: 'article', category: 'Biyoloji',
        blocks: [ { id: generateId(), type: 'heading', level: 2, content: '[Konu] Görsel Galerisi' }, { id: generateId(), type: 'text', content: 'Bu galeride [konu] ile ilgili etkileyici görselleri bir araya getirdik. Her bir görsel, konunun farklı bir yönünü aydınlatıyor.' }, { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-img1/800/500', alt: '[Konu] ile ilgili Görsel 1', caption: 'Görsel 1 Açıklaması: Bu görselde [detay] vurgulanmaktadır.' }, { id: generateId(), type: 'divider' }, { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-img2/800/500', alt: '[Konu] ile ilgili Görsel 2', caption: 'Görsel 2 Açıklaması: Burada [farklı bir detay] görebilirsiniz.' }, { id: generateId(), type: 'divider' }, { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-img3/800/500', alt: '[Konu] ile ilgili Görsel 3', caption: 'Görsel 3 Açıklaması: [Ek bir perspektif].' }, { id: generateId(), type: 'text', content: 'Umarız bu görsel galeri [konu] hakkındaki anlayışınızı derinleştirmiştir.' }, ],
        seoTitle: '[Konu] Temalı Etkileyici Görsel Galerisi', seoDescription: '[Konu] ile ilgili en çarpıcı görsellerden oluşan bir koleksiyon. Her bir görselin detaylı açıklamalarını keşfedin.', keywords: ['görsel galeri', 'fotoğraf', 'resim', 'koleksiyon'], excerpt: '[Konu] hakkında büyüleyici görsellerden oluşan bir galeri. Her bir fotoğrafın hikayesini ve detaylarını öğrenin.'
    },
     {
        id: 'faq-article', name: 'SSS Makalesi', description: 'Belirli bir konudaki sıkça sorulan sorulara net cevaplar veren format.', previewImageUrl: 'https://picsum.photos/seed/faq-article-genetics/300/200', type: 'article', category: 'Biyoloji',
        blocks: [ { id: generateId(), type: 'heading', level: 2, content: '[Konu] Hakkında Sıkça Sorulan Sorular (SSS)' }, { id: generateId(), type: 'text', content: '[Konu] ile ilgili en sık merak edilen soruları ve uzmanlarımızın verdiği cevapları bu bölümde bulabilirsiniz.' }, { id: generateId(), type: 'heading', level: 3, content: 'Soru 1: [İlk Sık Sorulan Soru Metni]' }, { id: generateId(), type: 'text', content: 'Cevap: [İlk sorunun detaylı ve anlaşılır cevabı.]' }, { id: generateId(), type: 'divider' }, { id: generateId(), type: 'heading', level: 3, content: 'Soru 2: [İkinci Sık Sorulan Soru Metni]' }, { id: generateId(), type: 'text', content: 'Cevap: [İkinci sorunun kapsamlı cevabı. Örnekler veya ek bilgilerle desteklenebilir.]' }, { id: generateId(), type: 'divider' }, { id: generateId(), type: 'heading', level: 3, content: 'Soru 3: [Üçüncü Sık Sorulan Soru Metni]' }, { id: generateId(), type: 'text', content: 'Cevap: [Üçüncü sorunun cevabı.]' }, { id: generateId(), type: 'text', content: 'Daha fazla sorunuz varsa, lütfen bizimle iletişime geçmekten çekinmeyin.' }, ],
        seoTitle: '[Konu] Hakkında En Çok Sorulan Sorular ve Cevapları', seoDescription: '[Konu] ile ilgili merak ettiğiniz her şey! Sıkça sorulan sorulara uzmanlarımızın verdiği net ve anlaşılır cevapları keşfedin.', keywords: ['sss', 'sıkça sorulan sorular', 'cevaplar', 'bilgi'], excerpt: '[Konu] hakkında en çok merak edilen soruların ve uzman cevaplarının bulunduğu kapsamlı bir SSS rehberi.'
    },
    {
        id: 'how-to-guide', name: 'Nasıl Yapılır Rehberi', description: 'Belirli bir işlemi adım adım anlatan, öğretici içerikler için ideal.', previewImageUrl: 'https://picsum.photos/seed/howto-microscope/300/200', type: 'article', category: 'Biyoloji',
        blocks: [ { id: generateId(), type: 'heading', level: 2, content: '[İşlem/Konu] Nasıl Yapılır: Adım Adım Rehber' }, { id: generateId(), type: 'text', content: 'Bu rehberde, [işlem/konu] adım adım nasıl gerçekleştireceğinizi öğreneceksiniz. Başlangıç seviyesinden ileri seviyeye kadar herkesin faydalanabileceği pratik bilgiler içerir.' }, { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-main-visual/700/300', alt: '[İşlem/Konu] ile ilgili bir görsel', caption: 'Gerekli malzemeler veya sürecin bir aşaması.' }, { id: generateId(), type: 'heading', level: 3, content: 'Adım 1: Hazırlık' }, { id: generateId(), type: 'text', content: '[İlk adımın detaylı açıklaması. Gerekli malzemeler, ön bilgiler veya dikkat edilmesi gerekenler.]' }, { id: generateId(), type: 'heading', level: 3, content: 'Adım 2: Uygulama' }, { id: generateId(), type: 'text', content: '[İkinci adımın açıklaması. İşlemin nasıl yapılacağı, püf noktaları.]' }, { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-step2-visual/500/250', alt: 'Adım 2 Görseli', caption: 'İkinci adımın görselleştirilmiş hali.'}, { id: generateId(), type: 'heading', level: 3, content: 'Adım 3: Kontrol ve Sonuç' }, { id: generateId(), type: 'text', content: '[Son adımın açıklaması. Sonuçların nasıl değerlendirileceği, olası sorunlar ve çözümleri.]' }, { id: generateId(), type: 'video', url: 'https://www.youtube.com/watch?v=A_gAJ_L4p1A', youtubeId: 'A_gAJ_L4p1A' }, { id: generateId(), type: 'text', content: 'Bu rehberle [işlem/konu] artık sizin için çok daha kolay olacak. Başarılar!' }, ],
        seoTitle: '[İşlem/Konu] Nasıl Yapılır? Adım Adım Kolay Rehber', seoDescription: '[İşlem/Konu] hakkında detaylı ve adım adım bir nasıl yapılır rehberi. Pratik ipuçları ve görsellerle desteklenmiştir.', keywords: ['nasıl yapılır', 'rehber', 'adım adım', 'öğretici', 'pratik bilgi'], excerpt: '[İşlem/Konu] için kapsamlı bir nasıl yapılır rehberi. Adımları takip ederek kolayca sonuca ulaşın.'
    },
     {
        id: 'interview-article', name: 'Röportaj Makalesi', description: 'Bir uzmanla yapılan söyleşiyi soru-cevap formatında detaylı bir şekilde sunar.', previewImageUrl: 'https://picsum.photos/seed/interview-expert/300/200', type: 'article', category: 'Biyoloji',
        blocks: [ { id: generateId(), type: 'heading', level: 2, content: '[Uzman Adı] ile [Konu] Üzerine Özel Röportaj' }, { id: generateId(), type: 'text', content: '[Konu] alanındaki uzmanlığıyla tanınan [Uzman Adı] ile [konu]nun dünü, bugünü ve yarını hakkında keyifli bir söyleşi gerçekleştirdik.' }, { id: generateId(), type: 'image', url: 'httpsum.photos/seed/expert-interview-photo/600/400', alt: '[Uzman Adı]', caption: '[Uzman Adı], [Unvanı]' }, { id: generateId(), type: 'heading', level: 3, content: 'Soru: [İlk Röportaj Sorusu]' }, { id: generateId(), type: 'quote', content: '[Uzmanın ilk soruya verdiği cevap. Önemli noktaları vurgulayabilirsiniz.]', citation: '[Uzman Adı]' }, { id: generateId(), type: 'divider' }, { id: generateId(), type: 'heading', level: 3, content: 'Soru: [İkinci Röportaj Sorusu]' }, { id: generateId(), type: 'quote', content: '[Uzmanın ikinci soruya verdiği cevap. Farklı bir bakış açısı veya derinlemesine bilgi.]', citation: '[Uzman Adı]' }, { id: generateId(), type: 'text', content: 'Röportajın devamında [ek konulara] da değinildi. Bu keyifli söyleşi için [Uzman Adı]\'na teşekkür ederiz.' }, ],
        seoTitle: '[Uzman Adı] ile [Konu] Röportajı | Uzman Görüşleri', seoDescription: '[Konu] alanının önde gelen isimlerinden [Uzman Adı] ile yapılan özel röportaj. [Konu] hakkındaki en son gelişmeler ve uzman yorumları.', keywords: ['röportaj', 'söyleşi', 'uzman görüşü', 'konu uzmanı'], excerpt: '[Uzman Adı] ile [konu] üzerine derinlemesine bir söyleşi. Alanındaki en son trendleri ve geleceği uzmanından dinleyin.'
    }
];

const defaultNoteTemplates: Template[] = [
    {
        id: 'standard-note', name: 'Standart Not Şablonu', description: 'Başlık, özet, anahtar kavramlar ve detaylı açıklamalar için temel not düzeni.', previewImageUrl: 'https://picsum.photos/seed/std-note-bio/300/200', type: 'note', category: 'Biyoloji',
        blocks: [ { id: generateId(), type: 'heading', level: 2, content: 'Konu Başlığı' }, { id: generateId(), type: 'text', content: 'Konunun genel bir özeti veya giriş cümlesi.' }, { id: generateId(), type: 'heading', level: 3, content: 'Anahtar Kavramlar' }, { id: generateId(), type: 'text', content: '- Kavram 1\n- Kavram 2\n- Kavram 3' }, { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/note-diagram/600/300', alt: 'Konuyla ilgili şema veya görsel', caption: 'Görsel açıklaması.' }, { id: generateId(), type: 'heading', level: 3, content: 'Detaylı Açıklamalar' }, { id: generateId(), type: 'text', content: 'Konunun daha derinlemesine açıklamaları, örnekler ve önemli detaylar.' }, { id: generateId(), type: 'quote', content: 'Konuyla ilgili önemli bir alıntı veya tanım.', citation: 'Kaynak (isteğe bağlı)' }, ],
        seoTitle: 'Örnek Not Başlığı | Biyoloji Ders Notları', seoDescription: 'Bu, standart not şablonu kullanılarak oluşturulmuş bir biyoloji ders notu örneğidir.', keywords: ['ders notu', 'biyoloji', 'eğitim', 'şablon'], excerpt: 'Standart not şablonu ile biyoloji konularını kolayca not alın ve düzenleyin.'
    },
    {
        id: 'process-explanation-note', name: 'Süreç Açıklama Notu', description: 'Bir biyolojik süreci adım adım açıklayan, şemalar ve görsellerle desteklenmiş not düzeni.', previewImageUrl: 'https://picsum.photos/seed/process-note-bio/300/200', type: 'note', category: 'Biyoloji',
        blocks: [ { id: generateId(), type: 'heading', level: 2, content: '[Süreç Adı]' }, { id: generateId(), type: 'text', content: '[Sürecin genel bir özeti veya amacı.]' }, { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/process-overview-diagram/700/350', alt: '[Süreç] genel bakış şeması', caption: 'Sürecin aşamalarını gösteren genel bir şema.' }, { id: generateId(), type: 'heading', level: 3, content: 'Adım 1: [Adımın Adı]' }, { id: generateId(), type: 'text', content: '[Adımın açıklaması.]' }, { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/process-step1-detail/500/250', alt: 'Adım 1 Detay Görseli'},{ id: generateId(), type: 'divider' }, { id: generateId(), type: 'heading', level: 3, content: 'Adım 2: [Adımın Adı]' }, { id: generateId(), type: 'text', content: '[Adımın açıklaması.]' }, { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/process-step2-detail/500/250', alt: 'Adım 2 Detay Görseli'},{ id: generateId(), type: 'divider' }, { id: generateId(), type: 'heading', level: 3, content: '[... Diğer Adımlar ...]' }, { id: generateId(), type: 'text', content: '[Sürecin sonucu veya önemi.]' }, ],
        seoTitle: '[Süreç Adı] Adım Adım Açıklaması | Biyoloji Notları', seoDescription: '[Süreç Adı]nın tüm adımlarını, şemalarını ve önemli detaylarını içeren kapsamlı bir biyoloji notu.', keywords: ['süreç', 'adım adım', 'biyolojik süreç', 'şema', 'açıklama'], excerpt: 'Karmaşık bir biyolojik süreci adım adım ve görsellerle anlamak için ideal bir not şablonu.'
    },
];

const defaultPageTemplates: Template[] = [
    {
        id: 'standard-page', name: 'Standart Sayfa', description: 'Genel amaçlı sayfalar için başlık, metin ve görsel içeren temel düzen.', previewImageUrl: 'https://picsum.photos/seed/std-page-gen/300/200', type: 'page', category: 'Genel Sayfa',
        blocks: [ { id: generateId(), type: 'heading', level: 1, content: 'Sayfa Başlığı' }, { id: generateId(), type: 'text', content: 'Bu sayfa için giriş metni veya genel açıklama.' }, { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/page-placeholder-img/800/400', alt: 'Sayfa Ana Görseli', caption: 'Görsel açıklaması.' }, { id: generateId(), type: 'heading', level: 2, content: 'Alt Başlık' }, { id: generateId(), type: 'text', content: 'Alt başlıkla ilgili detaylı içerik.' }, ]
    },
    {
        id: 'contact-page', name: 'İletişim Sayfası', description: 'İletişim formu ve iletişim bilgileri için düzenlenmiş sayfa yapısı.', previewImageUrl: 'https://picsum.photos/seed/contact-page-gen/300/200', type: 'page', category: 'Genel Sayfa',
        blocks: [ { id: generateId(), type: 'heading', level: 1, content: 'İletişim' }, { id: generateId(), type: 'text', content: 'Bizimle iletişime geçmek için aşağıdaki formu kullanabilir veya iletişim bilgilerimizden bize ulaşabilirsiniz.' }, { id: generateId(), type: 'section', sectionType: 'contact-form', settings: { title: 'İletişim Formu', recipientEmail: 'iletisim@example.com'} }, { id: generateId(), type: 'text', content: 'Adres: Örnek Cad. No:123, Şehir\nTelefon: 0212 123 4567' }, ]
    },
];

export const ALL_MOCK_TEMPLATES_SOURCE: ReadonlyArray<Template> = Object.freeze([
    ...defaultArticleTemplates,
    ...defaultNoteTemplates,
    ...defaultPageTemplates
]);

let mockTemplates: Template[] = [...ALL_MOCK_TEMPLATES_SOURCE.map(t => ({...t}))]; // Initialize with deep copy

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const allMockTemplatesGetter = async (): Promise<Template[]> => {
    await delay(5);
    if (typeof window === 'undefined') {
        return [...ALL_MOCK_TEMPLATES_SOURCE.map(t => ({...t}))]; // Return deep copy for server
    }
    const storedTemplates = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (storedTemplates) {
        try {
            const parsed = JSON.parse(storedTemplates) as Template[];
            // Basic validation
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.id && parsed[0]?.name && parsed[0]?.blocks) {
                mockTemplates = parsed.map(t => ({...t})); // Update in-memory cache with deep copy
                return parsed;
            }
        } catch (e) {
            console.error("Error parsing templates from localStorage, returning defaults.", e);
        }
    }
    // If not in localStorage or parsing failed, set defaults to localStorage and in-memory cache
    const defaultCopy = [...ALL_MOCK_TEMPLATES_SOURCE.map(t => ({...t}))];
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(defaultCopy));
    mockTemplates = defaultCopy;
    return defaultCopy;
};

export const initializeTemplates = (initialTemplates: Template[]) => {
    mockTemplates = initialTemplates;
    if (typeof window !== 'undefined') {
        localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(mockTemplates));
    }
};
