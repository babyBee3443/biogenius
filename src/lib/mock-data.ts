
import type { Block } from "@/components/admin/template-selector";

// --- Category Data Structure ---
export interface Category {
    id: string;
    name: string;
}

// --- Article Data Structure ---
export interface ArticleData {
    id:string;
    title: string;
    excerpt?: string;
    blocks: Block[];
    category: string;
    status: 'Taslak' | 'İncelemede' | 'Hazır' | 'Yayınlandı' | 'Arşivlendi';
    mainImageUrl: string | null;
    seoTitle?: string;
    seoDescription?: string;
    slug: string;
    isFeatured: boolean;
    isHero: boolean;
    keywords?: string[];
    canonicalUrl?: string;
    authorId: string;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
}

// --- Biology Note Data Structure ---
export interface NoteData {
    id: string;
    title: string;
    slug: string;
    category: string;
    level: 'Lise 9' | 'Lise 10' | 'Lise 11' | 'Lise 12' | 'Genel';
    tags: string[];
    summary: string;
    contentBlocks: Block[];
    relatedNotes?: string[];
    imageUrl?: string | null;
    authorId: string;
    status: 'Taslak' | 'İncelemede' | 'Hazır' | 'Yayınlandı' | 'Arşivlendi';
    createdAt: string;
    updatedAt: string;
}

// --- User Data Structure ---
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'Admin' | 'Editor' | 'User' | string;
  joinedAt: string;
  avatar?: string;
  lastLogin?: string;
  bio?: string;
  website?: string;
  twitterHandle?: string;
  linkedinProfile?: string;
  instagramProfile?: string;
  facebookProfile?: string;
  youtubeChannel?: string;
  xProfile?: string;
}

// --- Role Data Structure ---
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

// --- Template Structure ---
export interface Template {
  id: string;
  name: string;
  description: string;
  previewImageUrl: string;
  blocks: Block[];
  type: 'article' | 'note' | 'page';
  category?: 'Biyoloji' | 'Genel Sayfa'; // Adjusted category for templates
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  excerpt?: string;
}

// --- Page Data Structure ---
export interface PageData {
    id: string;
    title: string;
    slug: string;
    blocks: Block[];
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    imageUrl?: string;
    settings?: Record<string, any>;
    heroSettings?: {
        enabled: boolean;
        articleSource: 'latest' | 'featured';
        intervalSeconds: number;
        maxArticles: number;
    };
    status: 'Taslak' | 'Hazır' | 'Yayınlandı';
    createdAt: string;
    updatedAt: string;
}


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateSlug = (text: string) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-').replace(/-+/g, '-');
};

const generateId = () => `mock-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`;

// Start with empty or minimal essential data
let mockCategories: Category[] = [];

// --- Category CRUD ---
export const getCategories = async (): Promise<Category[]> => {
    await delay(5);
    const storedCategories = typeof window !== 'undefined' ? localStorage.getItem(CATEGORY_STORAGE_KEY) : null;
    if (storedCategories) {
        try {
            return JSON.parse(storedCategories);
        } catch (e) {
            console.error("Error parsing categories from localStorage", e);
            return [];
        }
    }
    return [];
};

export const addCategory = async (data: Omit<Category, 'id'>): Promise<Category> => {
    await delay(30);
    const newCategory: Category = {
        ...data,
        id: generateSlug(data.name) + '-' + Date.now().toString(36),
    };
    const currentCategories = await getCategories();
    currentCategories.push(newCategory);
    if (typeof window !== 'undefined') {
        localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(currentCategories));
    }
    mockCategories = currentCategories;
    return JSON.parse(JSON.stringify(newCategory));
};

export const updateCategory = async (id: string, data: Partial<Omit<Category, 'id'>>): Promise<Category | null> => {
    await delay(30);
    const currentCategories = await getCategories();
    const index = currentCategories.findIndex(cat => cat.id === id);
    if (index !== -1) {
        currentCategories[index] = { ...currentCategories[index], ...data };
        if (typeof window !== 'undefined') {
            localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(currentCategories));
        }
        mockCategories = currentCategories;
        return JSON.parse(JSON.stringify(currentCategories[index]));
    }
    return null;
};

export const deleteCategory = async (id: string): Promise<boolean> => {
    await delay(50);
    let currentCategories = await getCategories();
    const initialLength = currentCategories.length;
    currentCategories = currentCategories.filter(cat => cat.id !== id);
    if (currentCategories.length < initialLength) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(currentCategories));
        }
        mockCategories = currentCategories;
        return true;
    }
    return false;
};


let mockArticles: ArticleData[] = [];
let mockNotes: NoteData[] = [];
let mockUsers: User[] = [];
let mockRoles: Role[] = [
    { id: 'admin', name: 'Admin', description: 'Tam sistem erişimi.', permissions: ['Dashboard Görüntüleme', 'Makaleleri Görüntüleme', 'Makale Oluşturma', 'Makale Düzenleme', 'Makale Silme', 'Biyoloji Notlarını Görüntüleme', 'Yeni Biyoloji Notu Ekleme', 'Biyoloji Notlarını Düzenleme', 'Biyoloji Notlarını Silme', 'Hazır İçeriği Görüntüleme','Kategorileri Yönetme', 'Sayfaları Yönetme', 'Kullanıcıları Görüntüleme', 'Kullanıcı Ekleme', 'Kullanıcı Düzenleme', 'Kullanıcı Silme', 'Rolleri Yönetme', 'Ayarları Görüntüleme', 'Menü Yönetimi', 'Kullanım Kılavuzunu Görüntüleme'], userCount: 0 },
    { id: 'editor', name: 'Editor', description: 'İçerik yönetimi ve düzenleme yetkileri.', permissions: ['Dashboard Görüntüleme', 'Makaleleri Görüntüleme', 'Makale Oluşturma', 'Makale Düzenleme', 'Biyoloji Notlarını Görüntüleme', 'Yeni Biyoloji Notu Ekleme', 'Biyoloji Notlarını Düzenleme', 'Hazır İçeriği Görüntüleme', 'Kategorileri Yönetme', 'Kullanım Kılavuzunu Görüntüleme'], userCount: 0 },
    { id: 'user', name: 'User', description: 'Standart kullanıcı, içerik görüntüleme ve yorum yapma.', permissions: [], userCount: 0 },
];

let mockPages: PageData[] = [
    {
        id: 'anasayfa',
        title: 'Anasayfa',
        slug: '',
        blocks: [
            { id: generateId(), type: 'text', content: 'TeknoBiyo\'ya hoş geldiniz! İçeriğinizi buraya ekleyebilirsiniz.' }
        ],
        status: 'Yayınlandı',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        heroSettings: { enabled: false, articleSource: 'latest', intervalSeconds: 5, maxArticles: 0 }
    },
    {
        id: 'hakkimizda',
        title: 'Hakkımızda',
        slug: 'hakkimizda',
        blocks: [{id: generateId(), type: 'text', content: 'Hakkımızda sayfa içeriği buraya gelecek.'}],
        status: 'Taslak',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'iletisim',
        title: 'İletişim',
        slug: 'iletisim',
        blocks: [{id: generateId(), type: 'text', content: 'İletişim sayfa içeriği buraya gelecek.'}],
        status: 'Taslak',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'kullanim-kilavuzu',
        title: 'Kullanım Kılavuzu',
        slug: 'kullanim-kilavuzu',
        blocks: [
            {id: generateId(), type: 'heading', level: 1, content: 'Admin Paneli Kullanım Kılavuzu'},
            {id: generateId(), type: 'text', content: 'Bu kılavuz, admin panelinin çeşitli özelliklerini ve işlevlerini nasıl kullanacağınız konusunda size yol gösterecektir. Herhangi bir sorunuz olursa, lütfen destek ekibimizle iletişime geçmekten çekinmeyin.'}
        ],
        status: 'Yayınlandı',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// --- Re-populated Default Templates ---
let defaultArticleTemplates: Template[] = [
    {
        id: 'standard-article',
        name: 'Standart Makale',
        description: 'Giriş, ana görsel, alt başlıklar ve sonuç bölümü içeren temel makale düzeni.',
        previewImageUrl: 'https://picsum.photos/seed/std-article-bio/300/200',
        type: 'article',
        category: 'Biyoloji',
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: '[Makale Başlığı]' },
            { id: generateId(), type: 'text', content: '[Makaleye giriş paragrafı. Konuyu tanıtın ve okuyucunun ilgisini çekin.]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/std-main-image/800/450', alt: '[Ana Görsel Açıklaması]', caption: '[İsteğe Bağlı Görsel Alt Yazısı]' },
            { id: generateId(), type: 'text', content: '[İlk ana bölüm. Konuyu detaylandırmaya başlayın. Önemli noktaları vurgulayın.]' },
            { id: generateId(), type: 'heading', level: 3, content: '[Alt Başlık 1]' },
            { id: generateId(), type: 'text', content: '[Alt başlıkla ilgili detaylı açıklama. Örnekler veya kanıtlar sunabilirsiniz.]' },
            { id: generateId(), type: 'heading', level: 3, content: '[Alt Başlık 2]' },
            { id: generateId(), type: 'text', content: '[İkinci alt başlıkla ilgili içerik. Farklı bir perspektif veya ek bilgi sağlayabilirsiniz.]' },
            { id: generateId(), type: 'video', url: '', youtubeId: '' },
            { id: generateId(), type: 'quote', content: '[Makalenin ana fikrini destekleyen veya vurgulayan bir alıntı.]', citation: '[Alıntı Kaynağı]' },
            { id: generateId(), type: 'text', content: '[Sonuç paragrafı. Makaledeki ana noktaları özetleyin ve okuyucuya bir çıkarım sunun.]' },
        ],
        seoTitle: '[SEO Başlığı]',
        seoDescription: '[Meta Açıklama - Kısa ve ilgi çekici olmalı]',
        keywords: ['anahtar kelime 1', 'anahtar kelime 2', 'anahtar kelime 3'],
        excerpt: '[Makalenin kısa bir özeti, listeleme sayfalarında görünecek.]'
    },
    {
        id: 'listicle',
        name: 'Listeleme Makalesi',
        description: 'Belirli bir konuda numaralı veya madde işaretli öneriler/bilgiler sunan format.',
        previewImageUrl: 'https://picsum.photos/seed/list-article-bio/300/200',
        type: 'article',
        category: 'Biyoloji',
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: '[Listeleme Makalesi Başlığı]' },
            { id: generateId(), type: 'text', content: '[Listelemeye giriş. Listenin ne hakkında olduğunu ve neden önemli olduğunu açıklayın.]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/listicle-main/800/400', alt: '[Liste Ana Görseli]', caption: '[Liste görseli için alt yazı]' },
            { id: generateId(), type: 'heading', level: 3, content: '1. [Liste Öğesi Başlığı 1]' },
            { id: generateId(), type: 'text', content: '[Birinci liste öğesinin detaylı açıklaması.]' },
            { id: generateId(), type: 'heading', level: 3, content: '2. [Liste Öğesi Başlığı 2]' },
            { id: generateId(), type: 'text', content: '[İkinci liste öğesinin detaylı açıklaması.]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-item-image/600/350', alt: '[Liste Öğesi Görseli]', caption: '[İsteğe bağlı görsel alt yazısı]' },
            { id: generateId(), type: 'heading', level: 3, content: '3. [Liste Öğesi Başlığı 3]' },
            { id: generateId(), type: 'text', content: '[Üçüncü liste öğesinin detaylı açıklaması.]' },
            { id: generateId(), type: 'text', content: '[Listelemeyi sonlandıran genel bir yorum veya ek bilgi.]' },
        ],
        seoTitle: '[SEO Başlığı - Listeleme Makalesi]',
        seoDescription: '[Meta Açıklama - Liste içeriğini özetleyin]',
        keywords: ['listeleme', 'ipuçları', 'öneriler', 'madde işaretleri'],
        excerpt: '[Listeleme makalesinin kısa bir tanıtımı.]'
    },
    {
        id: 'image-gallery-article',
        name: 'Görsel Galerisi',
        description: 'Görsellerin ön planda olduğu, açıklamalı ve tematik galeri düzeni.',
        previewImageUrl: 'https://picsum.photos/seed/gallery-article-nature/300/200',
        type: 'article',
        category: 'Biyoloji',
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: '[Galeri Başlığı]' },
            { id: generateId(), type: 'text', content: '[Galeriye giriş. Galerinin konusu ve içeriği hakkında kısa bilgi.]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-img1/800/500', alt: '[Görsel 1 Açıklaması]', caption: '[Görsel 1 Alt Yazısı]' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-img2/800/500', alt: '[Görsel 2 Açıklaması]', caption: '[Görsel 2 Alt Yazısı]' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-img3/800/500', alt: '[Görsel 3 Açıklaması]', caption: '[Görsel 3 Alt Yazısı]' },
            { id: generateId(), type: 'text', content: '[Galeri hakkında son notlar veya ek açıklamalar.]' },
        ],
        seoTitle: '[SEO Galeri Başlığı]',
        seoDescription: '[Meta Açıklama - Galeri içeriğini özetleyin]',
        keywords: ['galeri', 'görsel', 'fotoğraf', 'resimler'],
        excerpt: '[Görsel galerisinin kısa bir tanıtımı.]'
    },
     {
        id: 'faq-article',
        name: 'SSS Makalesi',
        description: 'Belirli bir konudaki sıkça sorulan sorulara net cevaplar veren format.',
        previewImageUrl: 'https://picsum.photos/seed/faq-article-genetics/300/200',
        type: 'article',
        category: 'Biyoloji',
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: '[SSS Konu Başlığı]' },
            { id: generateId(), type: 'text', content: '[SSS bölümüne giriş. Bu bölümde hangi soruların cevaplanacağını belirtin.]' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru 1: [İlk Soru Metni]' },
            { id: generateId(), type: 'text', content: 'Cevap: [İlk sorunun detaylı cevabı.]' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru 2: [İkinci Soru Metni]' },
            { id: generateId(), type: 'text', content: 'Cevap: [İkinci sorunun detaylı cevabı.]' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru 3: [Üçüncü Soru Metni]' },
            { id: generateId(), type: 'text', content: 'Cevap: [Üçüncü sorunun detaylı cevabı.]' },
            { id: generateId(), type: 'text', content: '[SSS bölümü için ek notlar veya yönlendirmeler.]' },
        ],
        seoTitle: '[SEO SSS Başlığı]',
        seoDescription: '[Meta Açıklama - SSS içeriğini özetleyin]',
        keywords: ['sss', 'sıkça sorulan sorular', 'cevaplar', 'bilgi'],
        excerpt: '[SSS makalesinin kısa bir tanıtımı.]'
    },
    {
        id: 'how-to-guide',
        name: 'Nasıl Yapılır Rehberi',
        description: 'Belirli bir işlemi adım adım anlatan, öğretici içerikler için ideal.',
        previewImageUrl: 'https://picsum.photos/seed/howto-microscope/300/200',
        type: 'article',
        category: 'Biyoloji',
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: '[Rehber Başlığı: Nasıl Yapılır?]' },
            { id: generateId(), type: 'text', content: '[Rehbere giriş. Ne yapılacağını ve neden önemli olduğunu açıklayın. Gerekli malzemeler veya ön bilgiler listelenebilir.]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-main-image/700/300', alt: '[Rehber Ana Görseli]', caption: '[Görsel için alt yazı]' },
            { id: generateId(), type: 'heading', level: 3, content: 'Adım 1: [Birinci Adımın Açıklaması]' },
            { id: generateId(), type: 'text', content: '[Birinci adımın detaylı anlatımı.]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-step1-image/500/250', alt: '[Adım 1 Görseli]', caption: '[İsteğe bağlı adım görseli alt yazısı]' },
            { id: generateId(), type: 'heading', level: 3, content: 'Adım 2: [İkinci Adımın Açıklaması]' },
            { id: generateId(), type: 'text', content: '[İkinci adımın detaylı anlatımı.]' },
            { id: generateId(), type: 'video', url: '', youtubeId: '' },
            { id: generateId(), type: 'heading', level: 3, content: 'Adım 3: [Üçüncü Adımın Açıklaması]' },
            { id: generateId(), type: 'text', content: '[Üçüncü adımın detaylı anlatımı.]' },
            { id: generateId(), type: 'quote', content: '[Rehberle ilgili önemli bir ipucu veya uyarı.]', citation: '[Kaynak veya İpucu Sahibi]' },
            { id: generateId(), type: 'heading', level: 2, content: 'Sonuç ve İpuçları' },
            { id: generateId(), type: 'text', content: '[Rehberi tamamladıktan sonra elde edilecek sonuç ve ek ipuçları.]' },
        ],
        seoTitle: '[SEO Nasıl Yapılır Başlığı]',
        seoDescription: '[Meta Açıklama - Rehberin amacını ve adımlarını özetleyin]',
        keywords: ['nasıl yapılır', 'rehber', 'adım adım', 'öğretici'],
        excerpt: '[Nasıl yapılır rehberinin kısa bir tanıtımı.]'
    },
    {
        id: 'interview-article',
        name: 'Röportaj Makalesi',
        description: 'Bir uzmanla yapılan söyleşiyi soru-cevap formatında detaylı bir şekilde sunar.',
        previewImageUrl: 'https://picsum.photos/seed/interview-expert/300/200',
        type: 'article',
        category: 'Biyoloji',
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: '[Röportaj Konusu ve Kişisi]' },
            { id: generateId(), type: 'text', content: '[Röportaja giriş. Röportaj yapılan kişi ve konu hakkında kısa bilgi.]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/interviewee-photo/600/400', alt: '[Röportaj Yapılan Kişinin Fotoğrafı]', caption: '[Kişinin Adı ve Ünvanı]' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru 1: [İlk Soru]' },
            { id: generateId(), type: 'quote', content: '[İlk sorunun cevabı.]', citation: '[Röportaj Yapılan Kişi]' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru 2: [İkinci Soru]' },
            { id: generateId(), type: 'quote', content: '[İkinci sorunun cevabı.]', citation: '[Röportaj Yapılan Kişi]' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru 3: [Üçüncü Soru]' },
            { id: generateId(), type: 'quote', content: '[Üçüncü sorunun cevabı.]', citation: '[Röportaj Yapılan Kişi]' },
            { id: generateId(), type: 'heading', level: 2, content: 'Röportajdan Önemli Notlar' },
            { id: generateId(), type: 'text', content: '[Röportajın ana çıkarımlarını veya önemli noktalarını özetleyin.]' },
        ],
        seoTitle: '[SEO Röportaj Başlığı]',
        seoDescription: '[Meta Açıklama - Röportajın konusunu ve kiminle yapıldığını belirtin]',
        keywords: ['röportaj', 'söyleşi', 'uzman', 'görüş'],
        excerpt: '[Röportaj makalesinin kısa bir tanıtımı.]'
    },
    {
        id: 'product-review-article', // New template
        name: 'Ürün İnceleme Makalesi',
        description: 'Bir ürünü veya hizmeti detaylı bir şekilde inceleyen, artılarını ve eksilerini belirten format.',
        previewImageUrl: 'https://picsum.photos/seed/product-review-tech/300/200',
        type: 'article',
        category: 'Biyoloji', // Can be adapted
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: '[Ürün Adı] İncelemesi' },
            { id: generateId(), type: 'text', content: '[İncelemeye giriş. Ürünün ne olduğu, kimin için olduğu ve neden incelendiği hakkında kısa bilgi.]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/product-main/700/400', alt: '[Ürün Fotoğrafı]', caption: '[Ürünün genel görünümü]' },
            { id: generateId(), type: 'heading', level: 3, content: 'Temel Özellikler' },
            { id: generateId(), type: 'text', content: '- Özellik 1\n- Özellik 2\n- Özellik 3' },
            { id: generateId(), type: 'heading', level: 3, content: 'Artıları' },
            { id: generateId(), type: 'text', content: '- Pozitif yön 1\n- Pozitif yön 2' },
            { id: generateId(), type: 'heading', level: 3, content: 'Eksileri' },
            { id: generateId(), type: 'text', content: '- Negatif yön 1\n- Negatif yön 2' },
            { id: generateId(), type: 'heading', level: 3, content: 'Kullanım Deneyimi' },
            { id: generateId(), type: 'text', content: '[Ürünün kullanımıyla ilgili detaylı deneyimleriniz ve gözlemleriniz.]' },
            { id: generateId(), type: 'video', url: '', youtubeId: ''}, // Optional video review
            { id: generateId(), type: 'heading', level: 3, content: 'Sonuç ve Değerlendirme' },
            { id: generateId(), type: 'text', content: '[Ürün hakkındaki genel değerlendirmeniz, kimlere tavsiye ettiğiniz ve puanınız (isteğe bağlı).]' },
        ],
        seoTitle: '[Ürün Adı] Detaylı İnceleme ve Kullanıcı Deneyimi',
        seoDescription: '[Ürün Adı] ürününün özelliklerini, artılarını, eksilerini ve kullanım deneyimini keşfedin.',
        keywords: ['ürün incelemesi', 'teknoloji incelemesi', 'değerlendirme', '[ürün adı]'],
        excerpt: '[Ürün Adı] için kapsamlı bir inceleme.'
    }
];

let defaultNoteTemplates: Template[] = [
    {
        id: 'standard-note',
        name: 'Standart Not Şablonu',
        description: 'Başlık, özet, anahtar kavramlar ve detaylı açıklamalar için temel not düzeni.',
        previewImageUrl: 'https://picsum.photos/seed/std-note-bio/300/200',
        type: 'note',
        category: 'Biyoloji',
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: '[Not Başlığı]' },
            { id: generateId(), type: 'text', content: '[Notun genel bir özeti veya giriş cümlesi.]' },
            { id: generateId(), type: 'heading', level: 3, content: 'Anahtar Kavramlar' },
            { id: generateId(), type: 'text', content: '- Kavram 1\n- Kavram 2\n- Kavram 3' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/note-diagram/600/300', alt: '[İlgili Şema veya Görsel]', caption: '[Görsel açıklaması]' },
            { id: generateId(), type: 'heading', level: 3, content: 'Detaylı Açıklamalar' },
            { id: generateId(), type: 'text', content: '[Konuyla ilgili daha ayrıntılı açıklamalar ve örnekler.]' },
            { id: generateId(), type: 'quote', content: '[Konuyla ilgili önemli bir hatırlatma veya alıntı.]', citation: '[Kaynak]' },
            { id: generateId(), type: 'heading', level: 2, content: 'Özet ve Sonuç' },
            { id: generateId(), type: 'text', content: '[Notun ana çıkarımları ve genel bir özet.]' },
        ],
        seoTitle: '[Not Başlığı] - Ders Notları',
        seoDescription: '[Notun kısa bir özeti ve anahtar kavramları içeren açıklama.]',
        keywords: ['ders notu', 'biyoloji', 'eğitim', '[konu]'],
        excerpt: '[Notun kısa bir tanıtımı.]'
    },
    {
        id: 'process-explanation-note',
        name: 'Süreç Açıklama Notu',
        description: 'Bir biyolojik süreci adım adım açıklayan, şemalar ve görsellerle desteklenmiş not düzeni.',
        previewImageUrl: 'https://picsum.photos/seed/process-note-bio/300/200',
        type: 'note',
        category: 'Biyoloji',
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: '[Süreç Adı]' },
            { id: generateId(), type: 'text', content: '[Sürecin genel bir özeti veya amacı.]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/process-overview-diagram/700/350', alt: '[Süreç Genel Bakış Şeması]', caption: '[Sürecin aşamalarını gösteren genel bir şema.]' },
            { id: generateId(), type: 'heading', level: 3, content: 'Adım 1: [Adımın Adı]' },
            { id: generateId(), type: 'text', content: '[Adımın açıklaması.]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/process-step1-img/500/250', alt: '[Adım 1 Görseli]' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 3, content: 'Adım 2: [Adımın Adı]' },
            { id: generateId(), type: 'text', content: '[Adımın açıklaması.]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/process-step2-img/500/250', alt: '[Adım 2 Görseli]' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 3, content: '[... Diğer Adımlar ...]' },
            { id: generateId(), type: 'text', content: '[Sürecin sonucu veya önemi.]' },
        ],
        seoTitle: '[Süreç Adı] - Adım Adım Açıklama',
        seoDescription: '[Sürecin] aşamalarının detaylı açıklaması ve önemi.',
        keywords: ['süreç', 'biyolojik süreç', 'adım adım', '[konu]'],
        excerpt: '[Sürecin] aşamalarının detaylı açıklaması.'
    },
];

let defaultPageTemplates: Template[] = [
    {
        id: 'standard-page',
        name: 'Standart Sayfa',
        description: 'Genel amaçlı sayfalar için başlık, metin ve görsel içeren temel düzen.',
        previewImageUrl: 'https://picsum.photos/seed/std-page-gen/300/200',
        type: 'page',
        category: 'Genel Sayfa',
        blocks: [
            { id: generateId(), type: 'heading', level: 1, content: 'Standart Sayfa Başlığı' },
            { id: generateId(), type: 'text', content: 'Bu, standart bir sayfa şablonudur ve çeşitli içerik türleri için kullanılabilir. Metin paragrafları, başlıklar, görseller ve diğer blokları ekleyerek sayfanızı zenginleştirebilirsiniz.' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/page-main-image/800/400', alt: 'Sayfa Ana Görseli', caption: 'Sayfanızla ilgili açıklayıcı bir görsel.' },
            { id: generateId(), type: 'heading', level: 2, content: 'Alt Başlık 1' },
            { id: generateId(), type: 'text', content: 'Bu alt başlık altında daha detaylı bilgiler sunabilirsiniz. Örneğin, bir hizmeti, ürünü veya konsepti açıklayabilirsiniz.' },
            { id: generateId(), type: 'heading', level: 2, content: 'Alt Başlık 2' },
            { id: generateId(), type: 'text', content: 'Farklı bir konuya değinmek veya mevcut konuyu daha da derinleştirmek için bu bölümü kullanın. Liste elemanları da ekleyebilirsiniz:\n- Önemli nokta 1\n- Önemli nokta 2\n- Önemli nokta 3' },
            { id: generateId(), type: 'quote', content: 'Sayfanızla ilgili vurgulamak istediğiniz önemli bir alıntı veya mesaj.', citation: 'Kaynak veya Yazar' },
        ],
    },
    {
        id: 'contact-page',
        name: 'İletişim Sayfası',
        description: 'İletişim formu ve iletişim bilgileri için düzenlenmiş sayfa yapısı.',
        previewImageUrl: 'https://picsum.photos/seed/contact-page-gen/300/200',
        type: 'page',
        category: 'Genel Sayfa',
        blocks: [
            { id: generateId(), type: 'heading', level: 1, content: 'Bizimle İletişime Geçin' },
            { id: generateId(), type: 'text', content: 'Sorularınız, önerileriniz veya işbirliği talepleriniz için aşağıdaki formu doldurarak veya doğrudan iletişim bilgilerimiz üzerinden bize ulaşabilirsiniz. En kısa sürede size geri dönüş yapacağız.' },
            { id: generateId(), type: 'section', sectionType: 'contact-form', settings: { title: 'Mesaj Gönderin', recipientEmail: 'info@teknobiyo.example.com'} },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 2, content: 'Diğer İletişim Kanalları' },
            { id: generateId(), type: 'text', content: '**E-posta:** info@teknobiyo.example.com\n**Telefon:** +90 (212) 123 45 67\n**Adres:** Teknoloji Vadisi, Biyoloji Sokak No:1, İstanbul, Türkiye' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/map-placeholder/800/300', alt: 'Konum Haritası Placeholder', caption: 'Ofisimizin konumu (Harita entegrasyonu eklenebilir).' },
        ],
    },
     {
        id: 'about-us-page',
        name: 'Hakkımızda Sayfası',
        description: 'Ekip, misyon ve vizyon gibi bilgileri içeren kurumsal sayfa düzeni.',
        previewImageUrl: 'https://picsum.photos/seed/about-us-team/300/200',
        type: 'page',
        category: 'Genel Sayfa',
        blocks: [
            { id: generateId(), type: 'heading', level: 1, content: 'TeknoBiyo Hakkında' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/team-collaboration/800/350', alt: 'TeknoBiyo Ekip Çalışması', caption: 'Yenilikçi çözümler üreten dinamik bir ekibiz.' },
            { id: generateId(), type: 'text', content: 'TeknoBiyo, teknoloji ve biyoloji dünyalarının heyecan verici kesişim noktasında bilgi ve ilham sunan bir platformdur. Amacımız, karmaşık bilimsel ve teknolojik konuları herkes için anlaşılır ve erişilebilir kılmaktır.' },
            { id: generateId(), type: 'heading', level: 2, content: 'Misyonumuz' },
            { id: generateId(), type: 'text', content: 'En güncel ve doğru bilgileri sunarak, bilimsel merakı teşvik etmek, öğrenmeyi kolaylaştırmak ve geleceği şekillendiren yenilikler hakkında toplumu bilinçlendirmek.' },
            { id: generateId(), type: 'heading', level: 2, content: 'Vizyonumuz' },
            { id: generateId(), type: 'text', content: 'Teknoloji ve biyoloji alanlarında Türkiye\'nin ve dünyanın önde gelen, güvenilir ve yenilikçi bilgi kaynağı olmak; bilim ve teknoloji okuryazarlığını artırarak daha bilinçli bir toplum oluşumuna katkıda bulunmak.' },
            { id: generateId(), type: 'heading', level: 2, content: 'Değerlerimiz' },
            { id: generateId(), type: 'text', content: '- **Doğruluk ve Güvenilirlik:** Bilgiyi titizlikle araştırır ve doğruluğunu teyit ederiz.\n- **Erişilebilirlik:** Herkesin anlayabileceği açık ve sade bir dil kullanırız.\n- **Yenilikçilik:** Alanımızdaki en son gelişmeleri takip eder ve okuyucularımıza sunarız.\n- **Merak ve Keşif:** Öğrenme tutkusunu ve bilimsel merakı destekleriz.\n- **Topluma Katkı:** Bilginin gücüyle toplumsal fayda sağlamayı hedefleriz.' },
            { id: generateId(), type: 'quote', content: 'Bilim, gerçeğe giden yoldur.', citation: 'Carl Sagan (Uyarlanmıştır)'}
        ],
    },
    {
        id: 'faq-page',
        name: 'SSS Sayfası',
        description: 'Sıkça sorulan soruları ve cevaplarını düzenli bir şekilde sunar.',
        previewImageUrl: 'https://picsum.photos/seed/faq-page-generic/300/200',
        type: 'page',
        category: 'Genel Sayfa',
        blocks: [
            { id: generateId(), type: 'heading', level: 1, content: 'Sıkça Sorulan Sorular (SSS)' },
            { id: generateId(), type: 'text', content: 'Hizmetlerimiz, ürünlerimiz veya web sitemiz hakkında en sık aldığımız soruların cevaplarını burada bulabilirsiniz. Aradığınız cevabı bulamazsanız, lütfen bizimle iletişime geçmekten çekinmeyin.' },
            { id: generateId(), type: 'heading', level: 2, content: 'Genel Sorular' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru: [Genel Soru 1 Metni]' },
            { id: generateId(), type: 'text', content: 'Cevap: [Genel soru 1 için detaylı cevap.]' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru: [Genel Soru 2 Metni]' },
            { id: generateId(), type: 'text', content: 'Cevap: [Genel soru 2 için detaylı cevap.]' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 2, content: 'Teknik Sorular' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru: [Teknik Soru 1 Metni]' },
            { id: generateId(), type: 'text', content: 'Cevap: [Teknik soru 1 için detaylı cevap.]' },
            { id: generateId(), type: 'text', content: 'Daha fazla sorunuz varsa, lütfen [İletişim Sayfası](#) üzerinden bize ulaşın.' },
        ],
    },
    {
        id: 'services-page',
        name: 'Hizmetler Sayfası',
        description: 'Sunulan hizmetleri detaylı bir şekilde listeleyen ve açıklayan sayfa.',
        previewImageUrl: 'https://picsum.photos/seed/services-page-corp/300/200',
        type: 'page',
        category: 'Genel Sayfa',
        blocks: [
            { id: generateId(), type: 'heading', level: 1, content: 'Hizmetlerimiz' },
            { id: generateId(), type: 'text', content: 'Müşterilerimize sunduğumuz çeşitli hizmetler hakkında detaylı bilgi edinin. Her bir hizmetimiz, ihtiyaçlarınıza özel çözümler sunmak üzere tasarlanmıştır.' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/services-overview/800/350', alt: 'Hizmetler Genel Bakış', caption: 'Sunduğumuz profesyonel hizmetler.' },
            { id: generateId(), type: 'heading', level: 2, content: 'Hizmet Alanı 1: [Hizmet Adı]' },
            { id: generateId(), type: 'text', content: '[Bu hizmetin detaylı açıklaması. Faydaları, süreçleri ve kimler için uygun olduğu belirtilebilir.]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/service1-detail/600/300', alt: '[Hizmet 1 Detay Görseli]' },
            { id: generateId(), type: 'heading', level: 2, content: 'Hizmet Alanı 2: [Hizmet Adı]' },
            { id: generateId(), type: 'text', content: '[Bu hizmetin detaylı açıklaması.]' },
            { id: generateId(), type: 'heading', level: 2, content: 'Hizmet Alanı 3: [Hizmet Adı]' },
            { id: generateId(), type: 'text', content: '[Bu hizmetin detaylı açıklaması.]' },
            { id: generateId(), type: 'text', content: 'Hizmetlerimiz hakkında daha fazla bilgi almak veya özel bir talepte bulunmak için bizimle iletişime geçin.' },
        ],
    },
    {
        id: 'portfolio-page',
        name: 'Portfolyo Sayfası',
        description: 'Tamamlanmış projeleri veya çalışmaları sergilemek için galeri tarzı sayfa.',
        previewImageUrl: 'https://picsum.photos/seed/portfolio-creative/300/200',
        type: 'page',
        category: 'Genel Sayfa',
        blocks: [
            { id: generateId(), type: 'heading', level: 1, content: 'Portfolyomuz' },
            { id: generateId(), type: 'text', content: 'Bugüne kadar başarıyla tamamladığımız projelerden bazılarını aşağıda bulabilirsiniz. Her bir proje, müşterilerimizin hedeflerine ulaşmalarına yardımcı olmak için özenle yürütülmüştür.' },
            { id: generateId(), type: 'heading', level: 2, content: 'Proje 1: [Proje Adı]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/project1-showcase/700/400', alt: '[Proje 1 Görseli]', caption: '[Proje 1 için kısa açıklama ve kullanılan teknolojiler.]' },
            { id: generateId(), type: 'text', content: '[Proje 1 hakkında daha detaylı bilgi, karşılaşılan zorluklar ve elde edilen sonuçlar.]' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 2, content: 'Proje 2: [Proje Adı]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/project2-showcase/700/400', alt: '[Proje 2 Görseli]', caption: '[Proje 2 için kısa açıklama.]' },
            { id: generateId(), type: 'text', content: '[Proje 2 hakkında daha detaylı bilgi.]' },
            { id: generateId(), type: 'text', content: 'Yeni projelerinizde size nasıl yardımcı olabileceğimizi görüşmek için bizimle iletişime geçin.' },
        ],
    },
    {
        id: 'landing-page',
        name: 'Ürün Tanıtım Sayfası (Landing)',
        description: 'Belirli bir ürünü veya hizmeti tanıtmak için tasarlanmış odaklı sayfa.',
        previewImageUrl: 'https://picsum.photos/seed/landing-page-product/300/200',
        type: 'page',
        category: 'Genel Sayfa',
        blocks: [
            { id: generateId(), type: 'heading', level: 1, content: '[Ürün/Hizmet Adı]: [Etkileyici Ana Başlık]' },
            { id: generateId(), type: 'text', content: '[Ürünün/hizmetin ana faydasını veya çözdüğü problemi vurgulayan kısa ve etkili bir alt başlık.]' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/product-hero-shot/800/450', alt: '[Ürün/Hizmet Ana Görseli]', caption: '[Ürününüzün en iyi açısını gösteren bir görsel.]' },
            { id: generateId(), type: 'text', content: '[Call to Action Butonu için metin - Örn: Hemen Deneyin, Daha Fazla Bilgi Alın]' }, // Placeholder for a button block or custom HTML
            { id: generateId(), type: 'heading', level: 2, content: 'Neden [Ürün/Hizmet Adı]?' },
            { id: generateId(), type: 'text', content: '- Fayda 1: [Açıklama]\n- Fayda 2: [Açıklama]\n- Fayda 3: [Açıklama]' },
            { id: generateId(), type: 'heading', level: 2, content: 'Müşteri Yorumları' },
            { id: generateId(), type: 'quote', content: '[Memnun bir müşteriden etkileyici bir yorum.]', citation: '[Müşteri Adı, Şirketi]' },
            { id: generateId(), type: 'quote', content: '[Başka bir olumlu müşteri yorumu.]', citation: '[Müşteri Adı, Şirketi]' },
            { id: generateId(), type: 'text', content: '[Son bir Call to Action veya teklif.]' },
        ],
    },
     {
        id: 'blog-overview-page',
        name: 'Blog Anasayfası',
        description: 'Blog yazılarını listeleyen ve kategorilere ayıran sayfa.',
        previewImageUrl: 'https://picsum.photos/seed/blog-home-generic/300/200',
        type: 'page',
        category: 'Genel Sayfa',
        blocks: [
            { id: generateId(), type: 'heading', level: 1, content: 'Blogumuz' },
            { id: generateId(), type: 'text', content: 'En son makalelerimizi, haberlerimizi ve düşüncelerimizi buradan takip edebilirsiniz. Farklı kategorilerdeki yazılarımıza göz atın.' },
            { id: generateId(), type: 'section', sectionType: 'recent-articles', settings: { title: 'Son Yazılar', count: 6 } },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'section', sectionType: 'category-teaser', settings: { title: 'Kategoriler', techButtonLabel: 'Teknoloji Yazıları', bioButtonLabel: 'Biyoloji Yazıları' } },
            { id: generateId(), type: 'text', content: 'Daha fazla yazı için ilgili kategori sayfalarını ziyaret edebilirsiniz.' },
        ],
    },
    {
        id: 'careers-page',
        name: 'Kariyer Sayfası',
        description: 'Açık pozisyonları listeleyen ve şirket kültürünü tanıtan sayfa.',
        previewImageUrl: 'https://picsum.photos/seed/careers-hiring/300/200',
        type: 'page',
        category: 'Genel Sayfa',
        blocks: [
            { id: generateId(), type: 'heading', level: 1, content: 'Bize Katılın!' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/team-working/800/350', alt: 'Çalışan Ekip', caption: 'Dinamik ve yenilikçi bir ortamda kariyerinize yön verin.' },
            { id: generateId(), type: 'text', content: 'TeknoBiyo olarak, tutkulu ve yetenekli bireylerle büyümeye devam ediyoruz. Şirket kültürümüz, değerlerimiz ve açık pozisyonlarımız hakkında daha fazla bilgi edinin.' },
            { id: generateId(), type: 'heading', level: 2, content: 'Neden TeknoBiyo?' },
            { id: generateId(), type: 'text', content: '- Yenilikçi projelerde çalışma fırsatı.\n- Sürekli öğrenme ve gelişim imkanları.\n- Destekleyici ve işbirlikçi bir ekip ortamı.\n- Rekabetçi maaş ve yan haklar.' },
            { id: generateId(), type: 'heading', level: 2, content: 'Açık Pozisyonlar' },
            { id: generateId(), type: 'text', content: 'Şu anda aktif bir pozisyon bulunmamaktadır. Ancak, gelecekteki fırsatlar için CV\'nizi [kariyer@teknobiyo.example.com](mailto:kariyer@teknobiyo.example.com) adresine gönderebilirsiniz.' }, // Placeholder for dynamic job listings
            { id: generateId(), type: 'text', content: 'TeknoBiyo ailesinin bir parçası olmak için sabırsızlanıyoruz!' },
        ],
    }
];

let allMockTemplates: Template[] = [...defaultArticleTemplates, ...defaultNoteTemplates, ...defaultPageTemplates];
// --- End Re-populated Default Templates ---

// --- Article CRUD ---
export const getArticles = async (): Promise<ArticleData[]> => {
    await delay(10);
    const storedArticles = typeof window !== 'undefined' ? localStorage.getItem(ARTICLE_STORAGE_KEY) : null;
    if (storedArticles) {
        try {
            return JSON.parse(storedArticles);
        } catch (e) {
            console.error("Error parsing articles from localStorage", e);
            return [];
        }
    }
    return [];
};

export const getArticleById = async (id: string): Promise<ArticleData | null> => {
    await delay(10);
    const articles = await getArticles();
    const article = articles.find(a => a.id === id);
    return article ? JSON.parse(JSON.stringify(article)) : null;
};

export const createArticle = async (data: Omit<ArticleData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ArticleData> => {
    await delay(50);
    const newArticle: ArticleData = {
        ...data,
        isHero: data.isHero ?? false,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const currentArticles = await getArticles();
    currentArticles.push(newArticle);
    if (typeof window !== 'undefined') {
        localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(currentArticles));
    }
    mockArticles = currentArticles;
    return JSON.parse(JSON.stringify(newArticle));
};

export const updateArticle = async (id: string, data: Partial<Omit<ArticleData, 'id' | 'createdAt'>>): Promise<ArticleData | null> => {
    await delay(50);
    const currentArticles = await getArticles();
    const index = currentArticles.findIndex(a => a.id === id);
    if (index !== -1) {
        currentArticles[index] = { ...currentArticles[index], ...data, updatedAt: new Date().toISOString() };
        if (typeof window !== 'undefined') {
            localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(currentArticles));
        }
        mockArticles = currentArticles;
        return JSON.parse(JSON.stringify(currentArticles[index]));
    }
    return null;
};

export const deleteArticle = async (id: string): Promise<boolean> => {
    await delay(80);
    let currentArticles = await getArticles();
    const initialLength = currentArticles.length;
    currentArticles = currentArticles.filter(a => a.id !== id);
    if (currentArticles.length < initialLength) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(currentArticles));
        }
        mockArticles = currentArticles;
        return true;
    }
    return false;
};

// --- Note CRUD ---
export const getNotes = async (): Promise<NoteData[]> => {
    await delay(10);
    const storedNotes = typeof window !== 'undefined' ? localStorage.getItem(NOTE_STORAGE_KEY) : null;
    if (storedNotes) {
        try {
            return JSON.parse(storedNotes);
        } catch (e) {
            console.error("Error parsing notes from localStorage", e);
            return [];
        }
    }
    return [];
};

export const getNoteById = async (id: string): Promise<NoteData | null> => {
    await delay(10);
    const notes = await getNotes();
    const note = notes.find(n => n.id === id || n.slug === id);
    return note ? JSON.parse(JSON.stringify(note)) : null;
};

export const createNote = async (data: Omit<NoteData, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'status'>): Promise<NoteData> => {
    await delay(50);
    const newNote: NoteData = {
        ...data,
        id: `note-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`,
        status: 'Taslak',
        authorId: 'admin001', // Default author for new notes, should be dynamic in real app
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const currentNotes = await getNotes();
    currentNotes.push(newNote);
    if (typeof window !== 'undefined') {
        localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(currentNotes));
    }
    mockNotes = currentNotes;
    return JSON.parse(JSON.stringify(newNote));
};

export const updateNote = async (id: string, data: Partial<Omit<NoteData, 'id' | 'createdAt'>>): Promise<NoteData | null> => {
    await delay(50);
    const currentNotes = await getNotes();
    const index = currentNotes.findIndex(n => n.id === id);
    if (index !== -1) {
        currentNotes[index] = { ...currentNotes[index], ...data, updatedAt: new Date().toISOString() };
        if (typeof window !== 'undefined') {
            localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(currentNotes));
        }
        mockNotes = currentNotes;
        return JSON.parse(JSON.stringify(currentNotes[index]));
    }
    return null;
};

export const deleteNote = async (id: string): Promise<boolean> => {
    await delay(80);
    let currentNotes = await getNotes();
    const initialLength = currentNotes.length;
    currentNotes = currentNotes.filter(n => n.id !== id);
    if (currentNotes.length < initialLength) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(currentNotes));
        }
        mockNotes = currentNotes;
        return true;
    }
    return false;
};

// --- User CRUD Functions ---
export const getUsers = async (): Promise<User[]> => {
    await delay(10);
    const storedUsers = typeof window !== 'undefined' ? localStorage.getItem(USER_STORAGE_KEY) : null;
    if (storedUsers) {
        try {
            return JSON.parse(storedUsers);
        } catch (e) {
            console.error("Error parsing users from localStorage", e);
            return [];
        }
    }
    return [];
};

export const getUserById = async (id: string): Promise<User | null> => {
    await delay(10);
    const users = await getUsers();
    const user = users.find(u => u.id === id);
    return user ? JSON.parse(JSON.stringify(user)) : null;
};

export const createUser = async (data: Omit<User, 'id' | 'joinedAt' | 'lastLogin'>): Promise<User> => {
    await delay(50);
    const newUser: User = {
        ...data,
        id: `user-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`,
        joinedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        avatar: data.avatar || `https://picsum.photos/seed/${data.username || 'avatar'}/128/128`,
    };
    const currentUsers = await getUsers();
    currentUsers.push(newUser);
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUsers));
    }
    mockUsers = currentUsers;

    const currentRoles = await getRoles();
    const roleIndex = currentRoles.findIndex(r => r.id === newUser.role.toLowerCase() || r.name.toLowerCase() === newUser.role.toLowerCase());
    if (roleIndex !== -1) {
        currentRoles[roleIndex].userCount = (currentRoles[roleIndex].userCount || 0) + 1;
        if (typeof window !== 'undefined') {
            localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(currentRoles));
        }
        mockRoles = currentRoles;
    }
    return JSON.parse(JSON.stringify(newUser));
};

export const updateUser = async (id: string, data: Partial<Omit<User, 'id' | 'joinedAt' | 'email'>>): Promise<User | null> => {
    await delay(50);
    const currentUsers = await getUsers();
    const index = currentUsers.findIndex(u => u.id === id);
    if (index !== -1) {
        const oldRole = currentUsers[index].role;
        currentUsers[index] = { ...currentUsers[index], ...data, lastLogin: new Date().toISOString() };

        if (typeof window !== 'undefined') {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUsers));
        }
        mockUsers = currentUsers;

        if (data.role && data.role !== oldRole) {
            const currentRoles = await getRoles();
            const oldRoleIndex = currentRoles.findIndex(r => r.id === oldRole.toLowerCase() || r.name.toLowerCase() === oldRole.toLowerCase());
            if (oldRoleIndex !== -1) {
                currentRoles[oldRoleIndex].userCount = Math.max(0, (currentRoles[oldRoleIndex].userCount || 0) - 1);
            }
            const newRoleIndex = currentRoles.findIndex(r => r.id === data.role!.toLowerCase() || r.name.toLowerCase() === data.role!.toLowerCase());
            if (newRoleIndex !== -1) {
                currentRoles[newRoleIndex].userCount = (currentRoles[newRoleIndex].userCount || 0) + 1;
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(currentRoles));
            }
            mockRoles = currentRoles;
        }
        return JSON.parse(JSON.stringify(currentUsers[index]));
    }
    return null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  await delay(80);
  let currentUsers = await getUsers();
  const userIndex = currentUsers.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    const userRole = currentUsers[userIndex].role;
    currentUsers.splice(userIndex, 1);
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUsers));
    }
    mockUsers = currentUsers;

    const currentRoles = await getRoles();
    const roleIndex = currentRoles.findIndex(r => r.id === userRole.toLowerCase() || r.name.toLowerCase() === userRole.toLowerCase());
    if (roleIndex !== -1) {
        currentRoles[roleIndex].userCount = Math.max(0, (currentRoles[roleIndex].userCount || 0) - 1);
        if (typeof window !== 'undefined') {
            localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(currentRoles));
        }
        mockRoles = currentRoles;
    }
    return true;
  }
  return false;
};


// --- Role CRUD Functions ---
export const getRoles = async (): Promise<Role[]> => {
  await delay(10);
  const storedRoles = typeof window !== 'undefined' ? localStorage.getItem(ROLE_STORAGE_KEY) : null;
  if (storedRoles) {
      try {
          return JSON.parse(storedRoles);
      } catch (e) {
          console.error("Error parsing roles from localStorage", e);
          return mockRoles;
      }
  }
  return mockRoles;
};

export const getRoleById = async (id: string): Promise<Role | null> => {
  await delay(10);
  const roles = await getRoles();
  const role = roles.find(r => r.id === id);
  return role ? JSON.parse(JSON.stringify(role)) : null;
};

export const createRole = async (data: Omit<Role, 'id' | 'userCount'>): Promise<Role> => {
  await delay(50);
  const newRole: Role = {
    ...data,
    id: generateSlug(data.name) + '-' + Date.now().toString(36),
    userCount: 0,
  };
  const currentRoles = await getRoles();
  currentRoles.push(newRole);
  if (typeof window !== 'undefined') {
      localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(currentRoles));
  }
  mockRoles = currentRoles;
  return JSON.parse(JSON.stringify(newRole));
};

export const updateRole = async (id: string, data: Partial<Omit<Role, 'id'>>): Promise<Role | null> => {
  await delay(50);
  const currentRoles = await getRoles();
  const index = currentRoles.findIndex(r => r.id === id);
  if (index !== -1) {
      let updatedUserCount = currentRoles[index].userCount;
      if (data.userCount !== undefined) {
          updatedUserCount = data.userCount;
      }
      currentRoles[index] = { ...currentRoles[index], ...data, userCount: updatedUserCount };
      if (typeof window !== 'undefined') {
          localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(currentRoles));
      }
      mockRoles = currentRoles;
      return JSON.parse(JSON.stringify(currentRoles[index]));
  }
  return null;
};

export const deleteRole = async (id: string): Promise<boolean> => {
  await delay(80);
  let currentRoles = await getRoles();
  const roleToDelete = currentRoles.find(r => r.id === id);
  if (roleToDelete && ['admin', 'editor', 'user'].includes(roleToDelete.id.toLowerCase()) && roleToDelete.userCount > 0) {
    console.warn(`Cannot delete core role "${roleToDelete.name}" as it has ${roleToDelete.userCount} users.`);
    return false;
  }
  const initialLength = currentRoles.length;
  currentRoles = currentRoles.filter(r => r.id !== id);
  if (currentRoles.length < initialLength) {
      if (typeof window !== 'undefined') {
          localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(currentRoles));
      }
      mockRoles = currentRoles;
      return true;
  }
  return false;
};

// --- Permissions Data ---
export interface Permission {
  id: string;
  description: string;
}
export interface PermissionCategory {
  name: string;
  permissions: Permission[];
}
export const getAllPermissions = async (): Promise<PermissionCategory[]> => {
    await delay(5);
    return [
        {
            name: 'Genel Yönetim',
            permissions: [
                { id: 'Dashboard Görüntüleme', description: 'Yönetici gösterge panelini görüntüleyebilir.' },
                { id: 'Ayarları Görüntüleme', description: 'Site genel ayarlarını görüntüleyebilir ve değiştirebilir.' },
                { id: 'Menü Yönetimi', description: 'Site navigasyon menülerini yönetebilir.' },
                { id: 'Kullanım Kılavuzunu Görüntüleme', description: 'Admin paneli kullanım kılavuzunu görüntüleyebilir.' },
            ],
        },
        {
            name: 'İçerik Yönetimi',
            permissions: [
                { id: 'Makaleleri Görüntüleme', description: 'Tüm makaleleri listeleyebilir ve görüntüleyebilir.' },
                { id: 'Makale Oluşturma', description: 'Yeni makaleler oluşturabilir.' },
                { id: 'Makale Düzenleme', description: 'Mevcut makaleleri düzenleyebilir.' },
                { id: 'Makale Silme', description: 'Makaleleri silebilir.' },
                { id: 'Hazır İçeriği Görüntüleme', description: '"Hazır" durumundaki makale ve notları ana sitede görüntüleyebilir.' },
                { id: 'Biyoloji Notlarını Görüntüleme', description: 'Tüm biyoloji notlarını listeleyebilir ve görüntüleyebilir.' },
                { id: 'Yeni Biyoloji Notu Ekleme', description: 'Yeni biyoloji notları oluşturabilir.' },
                { id: 'Biyoloji Notlarını Düzenleme', description: 'Mevcut biyoloji notlarını düzenleyebilir.' },
                { id: 'Biyoloji Notlarını Silme', description: 'Biyoloji notlarını silebilir.' },
                { id: 'Kategorileri Yönetme', description: 'İçerik kategorilerini oluşturabilir, düzenleyebilir ve silebilir.' },
                { id: 'Sayfaları Yönetme', description: 'Site sayfalarını (Hakkımızda, İletişim vb.) yönetebilir.' },
            ],
        },
        {
            name: 'Kullanıcı Yönetimi',
            permissions: [
                { id: 'Kullanıcıları Görüntüleme', description: 'Tüm kullanıcıları listeleyebilir.' },
                { id: 'Kullanıcı Ekleme', description: 'Yeni kullanıcılar oluşturabilir.' },
                { id: 'Kullanıcı Düzenleme', description: 'Kullanıcı bilgilerini ve rollerini düzenleyebilir.' },
                { id: 'Kullanıcı Silme', description: 'Kullanıcıları silebilir.' },
                { id: 'Rolleri Yönetme', description: 'Kullanıcı rollerini ve bu rollere atanmış izinleri yönetebilir.' },
            ],
        },
    ];
};


// --- Page CRUD ---
export const getPages = async (): Promise<PageData[]> => {
    await delay(5);
    const storedPages = typeof window !== 'undefined' ? localStorage.getItem(PAGE_STORAGE_KEY) : null;
    if (storedPages) {
        try {
            return JSON.parse(storedPages);
        } catch (e) {
            console.error("Error parsing pages from localStorage", e);
            return mockPages;
        }
    }
    return mockPages;
};

export const getPageById = async (id: string): Promise<PageData | null> => {
    await delay(5);
    const pages = await getPages();
    const page = pages.find(p => p.id === id || p.slug === id);
    return page ? JSON.parse(JSON.stringify(page)) : null;
};

export const createPage = async (data: Omit<PageData, 'id' | 'createdAt' | 'updatedAt'>): Promise<PageData> => {
    await delay(50);
    const newPage: PageData = {
        ...data,
        id: generateSlug(data.title) + '-' + Date.now().toString(36),
        slug: generateSlug(data.slug || data.title),
        status: data.status || 'Taslak',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const currentPages = await getPages();
    currentPages.push(newPage);
    if (typeof window !== 'undefined') {
        localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(currentPages));
    }
    mockPages = currentPages;
    return JSON.parse(JSON.stringify(newPage));
};

export const updatePage = async (id: string, data: Partial<Omit<PageData, 'id' | 'createdAt'>>): Promise<PageData | null> => {
    await delay(50);
    const currentPages = await getPages();
    const index = currentPages.findIndex(p => p.id === id);
    if (index !== -1) {
        currentPages[index] = { ...currentPages[index], ...data, updatedAt: new Date().toISOString() };
        if (typeof window !== 'undefined') {
            localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(currentPages));
        }
        mockPages = currentPages;
        return JSON.parse(JSON.stringify(currentPages[index]));
    }
    return null;
};

export const deletePage = async (id: string): Promise<boolean> => {
    await delay(80);
    if (id === 'anasayfa' || id === 'kullanim-kilavuzu' || id === 'hakkimizda' || id === 'iletisim') return false;
    let currentPages = await getPages();
    const initialLength = currentPages.length;
    currentPages = currentPages.filter(p => p.id !== id);
    if (currentPages.length < initialLength) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(currentPages));
        }
        mockPages = currentPages;
        return true;
    }
    return false;
};
// --- End Page CRUD ---

// --- Templates ---
export const allMockTemplatesGetter = async (): Promise<Template[]> => {
    await delay(5);
     const storedTemplates = typeof window !== 'undefined' ? localStorage.getItem(TEMPLATE_STORAGE_KEY) : null;
    if (storedTemplates) {
        try {
            return JSON.parse(storedTemplates);
        } catch (e) {
            console.error("Error parsing templates from localStorage", e);
            // If parsing fails, re-initialize with defaults and save them.
            if (typeof window !== 'undefined') {
                localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(allMockTemplates));
            }
            return allMockTemplates;
        }
    }
     // If no templates in localStorage, initialize with defaults and save them.
    if (typeof window !== 'undefined') {
        localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(allMockTemplates));
    }
    return allMockTemplates;
};


export const ARTICLE_STORAGE_KEY = 'teknobiyo_mock_articles_v3';
export const NOTE_STORAGE_KEY = 'teknobiyo_mock_notes_v3';
export const CATEGORY_STORAGE_KEY = 'teknobiyo_mock_categories_v3';
export const USER_STORAGE_KEY = 'teknobiyo_mock_users_v3';
export const ROLE_STORAGE_KEY = 'teknobiyo_mock_roles_v3';
export const PAGE_STORAGE_KEY = 'teknobiyo_mock_pages_v3';
export const TEMPLATE_STORAGE_KEY = 'teknobiyo_mock_templates_v3';

export const loadInitialData = () => {
    if (typeof window !== 'undefined') {
        if (!localStorage.getItem(ARTICLE_STORAGE_KEY)) {
            localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(mockArticles));
        }
        if (!localStorage.getItem(NOTE_STORAGE_KEY)) {
            localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(mockNotes));
        }
        if (!localStorage.getItem(CATEGORY_STORAGE_KEY)) {
            localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(mockCategories));
        }
        if (!localStorage.getItem(USER_STORAGE_KEY)) {
            const defaultAdminUser: User = {
                 id: 'admin001', name: 'Admin User', username: 'admin',
                 email: 'admin@teknobiyo.example.com', role: 'Admin',
                 joinedAt: new Date().toISOString(),
                 avatar: 'https://picsum.photos/seed/admin-avatar/128/128'
            };
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify([defaultAdminUser]));
            console.log("Default admin user created in localStorage for initial login.");
        }
        if (!localStorage.getItem(ROLE_STORAGE_KEY)) {
            // Ensure user counts are updated based on default users
            const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
            const rolesWithCounts = mockRoles.map(role => {
                const count = users.filter((u: User) => u.role.toLowerCase() === role.name.toLowerCase() || u.role === role.id).length;
                return {...role, userCount: count};
            });
            localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(rolesWithCounts));
        }
        if (!localStorage.getItem(PAGE_STORAGE_KEY)) {
            localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(mockPages));
        }
        if (!localStorage.getItem(TEMPLATE_STORAGE_KEY)) {
            localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(allMockTemplates)); // Initialize with default templates
        }
    }
};

loadInitialData();

export { loadInitialData as reloadMockData };

