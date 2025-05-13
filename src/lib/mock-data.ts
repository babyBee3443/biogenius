
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
            { id: generateId(), type: 'heading', level: 2, content: 'Yapay Zeka ve Etik Sorumluluklar' },
            { id: generateId(), type: 'text', content: 'Yapay zeka (AI) hayatımızı dönüştürürken, beraberinde önemli etik soruları ve toplumsal sorumlulukları da getiriyor. Bu makalede, AI etiğinin temel ilkelerini ve karşılaşılan zorlukları inceleyeceğiz.' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/ai-ethics-main/800/450', alt: 'Yapay Zeka Etiği Ana Görsel', caption: 'AI ve etik karar alma süreçleri.' },
            { id: generateId(), type: 'text', content: 'AI sistemlerinin karar alma süreçlerindeki **şeffaflık**, **hesap verebilirlik** ve **adalet** gibi ilkeler, etik tartışmaların merkezinde yer alıyor. Algoritmik önyargılar, veri gizliliği ve otonom sistemlerin sorumluluğu gibi konular acil çözümler gerektiriyor.' },
            { id: generateId(), type: 'heading', level: 3, content: 'Algoritmik Önyargılar ve Adalet' },
            { id: generateId(), type: 'text', content: 'AI modelleri, eğitildikleri verilerdeki mevcut toplumsal önyargıları yansıtabilir ve hatta güçlendirebilir. Bu durum, işe alım süreçlerinden kredi başvurularına kadar birçok alanda ayrımcılığa yol açabilir. Önyargısız veri setleri oluşturmak ve adil algoritmalar geliştirmek kritik önem taşımaktadır.' },
            { id: generateId(), type: 'video', url: 'https://www.youtube.com/watch?v=SJm5suVpOK0', youtubeId: 'SJm5suVpOK0' },
            { id: generateId(), type: 'heading', level: 3, content: 'Geleceğe Yönelik Çözümler' },
            { id: generateId(), type: 'text', content: 'Yapay zeka etiği konusunda küresel standartların oluşturulması, multidisipliner yaklaşımların benimsenmesi ve kamuoyu bilincinin artırılması gerekiyor. Teknoloji geliştiricileri, politika yapıcılar ve toplum olarak birlikte çalışarak AI\'ın insanlık yararına kullanılmasını sağlamalıyız.' },
            { id: generateId(), type: 'quote', content: 'Etik olmayan bir yapay zeka, insanlığın karşılaştığı en büyük tehditlerden biri olabilir.', citation: 'Elon Musk (Uyarlanmıştır)' },
            { id: generateId(), type: 'text', content: 'Sonuç olarak, yapay zeka etiği, teknolojinin geleceğini şekillendirecek en önemli tartışma alanlarından biridir ve sürekli dikkat gerektirir.' },
        ],
        seoTitle: 'Yapay Zeka ve Etik Sorumluluklar',
        seoDescription: 'Yapay zeka etiğinin temel ilkeleri, karşılaşılan zorluklar ve geleceğe yönelik çözümler.',
        keywords: ['yapay zeka', 'etik', 'algoritma', 'önyargı', 'adalet', 'sorumluluk'],
        excerpt: 'Yapay zeka etiğinin temel ilkeleri, karşılaşılan zorluklar ve geleceğe yönelik çözümler.'
    },
    {
        id: 'listicle',
        name: 'Listeleme Makalesi',
        description: 'Belirli bir konuda numaralı veya madde işaretli öneriler/bilgiler sunan format.',
        previewImageUrl: 'https://picsum.photos/seed/list-article-bio/300/200',
        type: 'article',
        category: 'Biyoloji',
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: 'Sağlıklı Yaşam İçin 5 Altın Kural' },
            { id: generateId(), type: 'text', content: 'Sağlıklı ve dengeli bir yaşam sürdürmek için dikkat etmeniz gereken 5 temel prensip:' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/healthy-lifestyle/800/400', alt: 'Sağlıklı Yaşam İpuçları', caption: 'Sağlıklı yaşam tarzı ve alışkanlıkları.' },
            { id: generateId(), type: 'heading', level: 3, content: '1. Dengeli Beslenme' },
            { id: generateId(), type: 'text', content: 'Vücudunuzun ihtiyaç duyduğu tüm besin ögelerini içeren çeşitli ve dengeli bir diyet uygulayın. Bol sebze, meyve, tam tahıl ve yağsız protein tüketin.' },
            { id: generateId(), type: 'heading', level: 3, content: '2. Düzenli Egzersiz' },
            { id: generateId(), type: 'text', content: 'Haftada en az 150 dakika orta yoğunlukta veya 75 dakika yüksek yoğunlukta aerobik egzersiz yapmayı hedefleyin. Kas güçlendirme aktivitelerini de unutmayın.' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/exercise-benefits/600/350', alt: 'Egzersizin Faydaları' },
            { id: generateId(), type: 'heading', level: 3, content: '3. Yeterli Uyku' },
            { id: generateId(), type: 'text', content: 'Her gece 7-9 saat kaliteli uyku, fiziksel ve zihinsel sağlığınız için kritik öneme sahiptir. Düzenli bir uyku programı oluşturun.' },
            { id: generateId(), type: 'heading', level: 3, content: '4. Stres Yönetimi' },
            { id: generateId(), type: 'text', content: 'Kronik stres, sağlığınızı olumsuz etkileyebilir. Meditasyon, yoga, derin nefes egzersizleri gibi stres azaltma tekniklerini deneyin.' },
            { id: generateId(), type: 'heading', level: 3, content: '5. Düzenli Sağlık Kontrolleri' },
            { id: generateId(), type: 'text', content: 'Potansiyel sağlık sorunlarını erken teşhis etmek için düzenli olarak doktor kontrolünden geçin ve önerilen taramaları yaptırın.' },
        ],
        seoTitle: 'Sağlıklı Yaşam İçin 5 Altın Kural',
        seoDescription: 'Dengeli beslenme, egzersiz, uyku, stres yönetimi ve sağlık kontrolleri ile daha sağlıklı bir yaşam sürün.',
        keywords: ['sağlıklı yaşam', 'beslenme', 'egzersiz', 'uyku', 'stres'],
        excerpt: 'Dengeli beslenme, egzersiz, uyku, stres yönetimi ve sağlık kontrolleri ile daha sağlıklı bir yaşam sürün.'
    },
    {
        id: 'image-gallery-article',
        name: 'Görsel Galerisi Makalesi',
        description: 'Görsellerin ön planda olduğu, açıklamalı ve tematik galeri düzeni.',
        previewImageUrl: 'https://picsum.photos/seed/gallery-article-nature/300/200',
        type: 'article',
        category: 'Biyoloji',
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: 'Evrenin Derinliklerinden: James Webb Teleskobu Görüntüleri' },
            { id: generateId(), type: 'text', content: 'James Webb Uzay Teleskobu (JWST), evrenin şimdiye kadar görülmemiş detaylarını gözler önüne seriyor. İşte bu güçlü teleskop tarafından yakalanan en büyüleyici görüntülerden bazıları:' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/jwst-carina/800/500', alt: 'Karina Bulutsusu', caption: 'Karina Bulutsusu\'ndaki "Kozmik Uçurumlar". JWST, yıldız doğum bölgelerini eşsiz bir netlikte gösteriyor.' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/jwst-stephan/800/500', alt: 'Stephan Beşlisi', caption: 'Stephan Beşlisi galaksi grubu. Galaksilerin etkileşimini ve birleşmesini detaylı bir şekilde inceleme fırsatı sunuyor.' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/jwst-southern-ring/800/500', alt: 'Güney Halka Bulutsusu', caption: 'Ölen bir yıldızın etrafındaki gaz ve toz bulutlarını gösteren Güney Halka Bulutsusu.' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/jwst-exoplanet/800/500', alt: 'WASP-96 b Ötegezegen Spektrumu', caption: 'WASP-96 b adlı bir ötegezegenin atmosferindeki su buharının tespiti, yaşam arayışında önemli bir adım.' },
            { id: generateId(), type: 'text', content: 'JWST, kızılötesi gözlem yetenekleri sayesinde evrenin ilk zamanlarına ışık tutuyor ve yıldızların, galaksilerin oluşumu hakkındaki bilgilerimizi derinleştiriyor.' },
        ],
        seoTitle: 'James Webb Teleskobu: Evrenin Muhteşem Görüntüleri',
        seoDescription: 'James Webb Uzay Teleskobu tarafından çekilen en büyüleyici ve bilimsel açıdan önemli uzay görüntüleri galerisi.',
        keywords: ['james webb', 'uzay teleskobu', 'galaksi', 'bulutsu', 'evren', 'astronomi'],
        excerpt: 'James Webb Uzay Teleskobu tarafından çekilen en büyüleyici uzay görüntüleri galerisi.'
    },
     {
        id: 'faq-article',
        name: 'SSS Makalesi',
        description: 'Belirli bir konudaki sıkça sorulan sorulara net cevaplar veren format.',
        previewImageUrl: 'https://picsum.photos/seed/faq-article-genetics/300/200',
        type: 'article',
        category: 'Biyoloji',
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: 'Genetik ve Kalıtım Hakkında Sıkça Sorulan Sorular' },
            { id: generateId(), type: 'text', content: 'Genetik ve kalıtım konuları hakkında merak edilen yaygın sorular ve bilimsel cevapları:' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru 1: Gen nedir ve ne işe yarar?' },
            { id: generateId(), type: 'text', content: 'Cevap: Gen, DNA\'nın belirli bir bölümüdür ve canlıların özelliklerini (örneğin göz rengi, boy) belirleyen proteinlerin sentezlenmesi için talimatlar içerir. Kalıtımın temel birimidir.' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru 2: Alel nedir? Dominant ve resesif alel ne anlama gelir?' },
            { id: generateId(), type: 'text', content: 'Cevap: Alel, bir genin farklı versiyonlarıdır. Örneğin, bezelyelerde çiçek rengi geninin mor ve beyaz olmak üzere iki aleli olabilir. Dominant alel, etkisini tek bir kopyasıyla bile gösterebilen aleldir (örn: Mor çiçek). Resesif alel ise etkisini ancak iki kopyası bulunduğunda gösterebilir (örn: Beyaz çiçek).' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru 3: Genetik hastalıklar nasıl ortaya çıkar?' },
            { id: generateId(), type: 'text', content: 'Cevap: Genetik hastalıklar, genlerdeki mutasyonlar (değişiklikler) veya kromozom sayısındaki ya da yapısındaki anormallikler nedeniyle ortaya çıkabilir. Bazı genetik hastalıklar ebeveynlerden çocuklara aktarılırken, bazıları ise sonradan gelişebilir.' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru 4: CRISPR nedir ve gen düzenlemede nasıl kullanılır?' },
            { id: generateId(), type: 'text', content: 'Cevap: CRISPR-Cas9, DNA dizilerini hassas bir şekilde kesip değiştirebilen bir gen düzenleme teknolojisidir. Genetik hastalıkların tedavisi, tarımda verimliliğin artırılması gibi birçok potansiyel uygulaması bulunmaktadır.' },
            { id: generateId(), type: 'text', content: 'Genetik ve kalıtım hakkında daha fazla sorunuz varsa, uzman bir genetik danışmanına başvurmanız önerilir.' },
        ],
        seoTitle: 'Genetik ve Kalıtım SSS - Merak Edilen Tüm Sorular ve Cevapları',
        seoDescription: 'Gen, alel, genetik hastalıklar ve CRISPR gibi genetik ve kalıtım konuları hakkında sıkça sorulan soruların detaylı ve anlaşılır cevapları.',
        keywords: ['genetik', 'kalıtım', 'DNA', 'alel', 'CRISPR', 'genetik hastalıklar', 'sss'],
        excerpt: 'Gen, alel, genetik hastalıklar ve CRISPR gibi genetik ve kalıtım konuları hakkında sıkça sorulan soruların cevapları.'
    },
    {
        id: 'how-to-guide',
        name: 'Nasıl Yapılır Rehberi',
        description: 'Belirli bir işlemi adım adım anlatan, öğretici içerikler için ideal.',
        previewImageUrl: 'https://picsum.photos/seed/howto-microscope/300/200',
        type: 'article',
        category: 'Biyoloji',
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: 'Basit Bir Mikroskop Preparatı Nasıl Hazırlanır?' },
            { id: generateId(), type: 'text', content: 'Bu rehberde, okul laboratuvarında veya evde basit bir mikroskop preparatının nasıl hazırlanacağını adım adım öğreneceksiniz. Başlamadan önce temiz bir lam, lamel, damlalık, su ve incelenecek örneğe (örneğin soğan zarı) ihtiyacınız olacak.' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/microscope-setup/700/300', alt: 'Mikroskop Preparatı Hazırlama Malzemeleri', caption: 'Gerekli malzemeler: Lam, lamel, damlalık, su, örnek.' },
            { id: generateId(), type: 'heading', level: 3, content: 'Adım 1: Lamı Temizleyin' },
            { id: generateId(), type: 'text', content: 'Temiz bir bez veya kağıt havlu ile lamın (dikdörtgen cam) her iki yüzeyini de silerek parmak izi ve tozlardan arındırın.' },
            { id: generateId(), type: 'heading', level: 3, content: 'Adım 2: Örneği Lama Yerleştirin' },
            { id: generateId(), type: 'text', content: 'İncelenecek örnekten küçük bir parça alın (örneğin, soğan zarını cımbızla dikkatlice soyun) ve lamın ortasına yerleştirin.' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/onion-peel/500/250', alt: 'Soğan Zarı Lama Yerleştiriliyor' },
            { id: generateId(), type: 'heading', level: 3, content: 'Adım 3: Bir Damla Su Ekleyin' },
            { id: generateId(), type: 'text', content: 'Damlalık kullanarak örneğin üzerine bir damla su damlatın. Su, örneğin kurumasını önler ve daha net görüntü sağlar.' },
            { id: generateId(), type: 'heading', level: 3, content: 'Adım 4: Lameli Kapatın' },
            { id: generateId(), type: 'text', content: 'Lameli (küçük kare cam) bir kenarından başlayarak 45 derecelik bir açıyla yavaşça su damlasının üzerine doğru indirin. Bu, hava kabarcığı oluşumunu engeller. Lamel tamamen kapandığında fazla suyu kenardan bir kağıt havlu ile alın.' },
            { id: generateId(), type: 'video', url: 'https://www.youtube.com/watch?v=-b3E6MDgoP0', youtubeId: '-b3E6MDgoP0', }, // Placeholder video for coverslip
            { id: generateId(), type: 'heading', level: 3, content: 'Adım 5: Mikroskopta İnceleyin' },
            { id: generateId(), type: 'text', content: 'Hazırladığınız preparatı mikroskop tablasına yerleştirin ve en düşük büyütme ayarıyla başlayarak incelemeye başlayın. Net bir görüntü elde etmek için odaklama ayarlarını kullanın.' },
            { id: generateId(), type: 'quote', content: 'Unutmayın: Preparat hazırlarken dikkatli ve nazik olun. Lam ve lamel kırılgandır.', citation: 'Laboratuvar Güvenliği' },
            { id: generateId(), type: 'heading', level: 2, content: 'İpuçları ve Sonuç' },
            { id: generateId(), type: 'text', content: 'Başarılı bir preparat hazırladınız! Artık mikroskop altında hücreleri ve dokuları inceleyebilirsiniz. Gerekirse metilen mavisi gibi boyalar kullanarak hücre yapılarını daha belirgin hale getirebilirsiniz.' },
        ],
        seoTitle: 'Adım Adım Mikroskop Preparatı Hazırlama Rehberi',
        seoDescription: 'Okul veya evde basit mikroskop preparatlarını nasıl hazırlayacağınızı öğrenin. Soğan zarı örneği ile detaylı anlatım.',
        keywords: ['mikroskop', 'preparat', 'nasıl yapılır', 'biyoloji deneyi', 'soğan zarı', 'lam lamel'],
        excerpt: 'Okul veya evde basit mikroskop preparatlarını nasıl hazırlayacağınızı öğrenin.'
    },
    {
        id: 'interview-article',
        name: 'Röportaj Makalesi',
        description: 'Bir uzmanla yapılan söyleşiyi soru-cevap formatında detaylı bir şekilde sunar.',
        previewImageUrl: 'https://picsum.photos/seed/interview-expert/300/200',
        type: 'article',
        category: 'Biyoloji',
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: 'Prof. Dr. Canan Dağdeviren ile Biyomedikal Teknolojiler Üzerine' },
            { id: generateId(), type: 'text', content: 'Medikal teknoloji alanında çığır açan çalışmalarıyla tanınan Prof. Dr. Canan Dağdeviren ile giyilebilir ve yutulabilir sensörler, yapay zeka destekli teşhis yöntemleri ve biyomedikal mühendisliğin geleceği hakkında konuştuk.' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/canan-dagdeviren/600/400', alt: 'Prof. Dr. Canan Dağdeviren', caption: 'Prof. Dr. Canan Dağdeviren, MIT Media Lab Öğretim Üyesi.' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru: Biyomedikal teknolojiler alanındaki en heyecan verici gelişmeler nelerdir?' },
            { id: generateId(), type: 'quote', content: 'Şu anda en heyecan verici gelişmelerden biri, kişiye özel tıp ve giyilebilir teknolojilerin birleşimi. Vücudumuzla uyumlu, sürekli veri toplayabilen ve hastalıkları erken teşhis edebilen sensörler geliştiriyoruz. Bu, tedavi süreçlerini kökten değiştirebilir.', citation: 'Prof. Dr. Canan Dağdeviren' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru: Genç araştırmacılara bu alanda neler tavsiye edersiniz?' },
            { id: generateId(), type: 'quote', content: 'Meraklarını asla kaybetmesinler ve hayallerinin peşinden gitsinler. Multidisipliner çalışmanın önemi çok büyük; farklı alanlardan insanlarla işbirliği yapmaktan çekinmesinler. En önemlisi, başarısızlıktan korkmasınlar, çünkü her başarısızlık yeni bir öğrenme fırsatıdır.', citation: 'Prof. Dr. Canan Dağdeviren' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 3, content: 'Soru: Yapay zekanın biyomedikal alandaki rolü hakkında ne düşünüyorsunuz?' },
            { id: generateId(), type: 'quote', content: 'Yapay zeka, teşhis ve tedavide devrim yaratma potansiyeline sahip. Özellikle büyük veri analizinde ve karmaşık hastalıkların anlaşılmasında bize inanılmaz olanaklar sunuyor. Ancak etik kurallar ve veri güvenliği konularına da büyük özen göstermemiz gerekiyor.', citation: 'Prof. Dr. Canan Dağdeviren' },
            { id: generateId(), type: 'heading', level: 2, content: 'Röportajdan Notlar' },
            { id: generateId(), type: 'text', content: 'Prof. Dr. Dağdeviren, biyomedikal teknolojilerin gelecekte sağlık alanında büyük dönüşümlere yol açacağını ve gençlerin bu alana yönelmesinin önemini vurguladı.' },
        ],
        seoTitle: 'Prof. Dr. Canan Dağdeviren ile Biyomedikal Teknolojiler Röportajı',
        seoDescription: 'MIT Media Lab Öğretim Üyesi Prof. Dr. Canan Dağdeviren ile giyilebilir sensörler, yapay zeka ve biyomedikal mühendisliğin geleceği üzerine özel bir röportaj.',
        keywords: ['Canan Dağdeviren', 'biyomedikal', 'teknoloji', 'röportaj', 'MIT', 'giyilebilir teknoloji', 'yapay zeka'],
        excerpt: 'Prof. Dr. Canan Dağdeviren ile giyilebilir sensörler, yapay zeka ve biyomedikal mühendisliğin geleceği üzerine özel bir röportaj.'
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
            { id: generateId(), type: 'heading', level: 2, content: 'Hücre Teorisi ve Temel Kavramlar' },
            { id: generateId(), type: 'text', content: 'Hücre teorisi, biyolojinin temel taşlarından biridir ve tüm canlıların hücrelerden oluştuğunu belirtir. Bu notta, hücre teorisinin temel ilkelerini ve hücrelerle ilgili önemli kavramları inceleyeceğiz.' },
            { id: generateId(), type: 'heading', level: 3, content: 'Hücre Teorisinin Temel İlkeleri' },
            { id: generateId(), type: 'text', content: '- Tüm canlılar bir veya daha fazla hücreden oluşur.\n- Hücre, canlılığın temel yapısal ve işlevsel birimidir.\n- Tüm hücreler, var olan diğer hücrelerin bölünmesiyle meydana gelir.' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/cell-theory-diagram/600/300', alt: 'Hücre Tipleri Şeması', caption: 'Prokaryotik ve ökaryotik hücrelerin temel farkları.' },
            { id: generateId(), type: 'heading', level: 3, content: 'Hücre Çeşitleri' },
            { id: generateId(), type: 'text', content: '**Prokaryotik Hücreler:** Zarla çevrili organelleri ve çekirdeği bulunmayan basit yapılı hücrelerdir (örn: bakteriler).\n**Ökaryotik Hücreler:** Zarla çevrili organellere ve belirgin bir çekirdeğe sahip daha karmaşık yapılı hücrelerdir (örn: bitki ve hayvan hücreleri).' },
            { id: generateId(), type: 'quote', content: 'Unutmayın: Virüsler, hücresel yapıya sahip olmadıkları için canlı olarak kabul edilmezler.', citation: 'Biyoloji Notları' },
            { id: generateId(), type: 'heading', level: 2, content: 'Özet' },
            { id: generateId(), type: 'text', content: 'Hücre teorisi, yaşamın temelini anlamamız için kritik bir çerçeve sunar. Prokaryotik ve ökaryotik hücreler arasındaki farkları bilmek, canlıların çeşitliliğini ve karmaşıklığını anlamamıza yardımcı olur.' },
        ],
        seoTitle: 'Hücre Teorisi ve Temel Kavramlar Ders Notları',
        seoDescription: 'Hücre teorisinin temel ilkeleri, prokaryotik ve ökaryotik hücreler arasındaki farklar ve hücrelerle ilgili önemli kavramlar.',
        keywords: ['hücre teorisi', 'prokaryot', 'ökaryot', 'hücre', 'biyoloji notları'],
        excerpt: 'Hücre teorisinin temel ilkeleri ve hücrelerle ilgili önemli kavramlar.'
    },
    {
        id: 'process-explanation-note',
        name: 'Süreç Açıklama Notu',
        description: 'Bir biyolojik süreci adım adım açıklayan, şemalar ve görsellerle desteklenmiş not düzeni.',
        previewImageUrl: 'https://picsum.photos/seed/photosynthesis-note/300/200',
        type: 'note',
        category: 'Biyoloji',
        blocks: [
            { id: generateId(), type: 'heading', level: 2, content: 'Fotosentez Süreci' },
            { id: generateId(), type: 'text', content: 'Fotosentez, bitkilerin ve bazı diğer organizmaların ışık enerjisini kimyasal enerjiye dönüştürerek besin ürettiği hayati bir süreçtir. Bu notta fotosentezin aşamalarını inceleyeceğiz.' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/photosynthesis-overview/700/350', alt: 'Fotosentez Genel Bakış Şeması', caption: 'Fotosentezin ışığa bağımlı ve ışıktan bağımsız reaksiyonları.' },
            { id: generateId(), type: 'heading', level: 3, content: 'Aşama 1: Işığa Bağımlı Reaksiyonlar' },
            { id: generateId(), type: 'text', content: 'Kloroplastların tilakoit zarlarında gerçekleşir. Işık enerjisi emilir, su molekülleri parçalanır (oksijen açığa çıkar) ve ATP ile NADPH gibi enerji taşıyıcı moleküller üretilir.' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/light-reactions/500/250', alt: 'Işığa Bağımlı Reaksiyonlar Şeması' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 3, content: 'Aşama 2: Işıktan Bağımsız Reaksiyonlar (Calvin Döngüsü)' },
            { id: generateId(), type: 'text', content: 'Kloroplastların stroma sıvısında gerçekleşir. Işığa bağımlı reaksiyonlarda üretilen ATP ve NADPH kullanılarak karbondioksit, glikoz gibi organik moleküllere dönüştürülür.' },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/calvin-cycle/500/250', alt: 'Calvin Döngüsü Şeması' },
            { id: generateId(), type: 'divider' },
            { id: generateId(), type: 'heading', level: 2, content: 'Fotosentezin Önemi' },
            { id: generateId(), type: 'text', content: 'Fotosentez, yeryüzündeki yaşamın devamı için temeldir. Atmosferdeki oksijenin ana kaynağıdır ve besin zincirinin temelini oluşturur.' },
        ],
        seoTitle: 'Fotosentez Süreci Adım Adım Anlatım',
        seoDescription: 'Fotosentezin ışığa bağımlı ve ışıktan bağımsız reaksiyonlarının detaylı açıklaması ve önemi.',
        keywords: ['fotosentez', 'kloroplast', 'ışık reaksiyonları', 'calvin döngüsü', 'ATP', 'NADPH', 'biyoloji'],
        excerpt: 'Fotosentezin ışığa bağımlı ve ışıktan bağımsız reaksiyonlarının detaylı açıklaması.'
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
    // Daha fazla sayfa şablonu eklenebilir...
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

export const createNote = async (data: Omit<NoteData, 'id' | 'createdAt' | 'updatedAt'>): Promise<NoteData> => {
    await delay(50);
    const newNote: NoteData = {
        ...data,
        id: `note-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`,
        status: data.status || 'Taslak',
        authorId: data.authorId || 'unknown-author',
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
            return allMockTemplates; // Fallback to in-memory if parse fails
        }
    }
    return allMockTemplates; // Fallback to in-memory if not in localStorage
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
