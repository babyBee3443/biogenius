
import type { Block } from "@/components/admin/template-selector";

// --- Category Data Structure ---
export interface Category {
    id: string;
    name: string;
}

// --- Article Data Structure ---
export interface ArticleData {
    id: string;
    title: string;
    excerpt?: string;
    blocks: Block[];
    category: string;
    status: 'Taslak' | 'İncelemede' | 'Hazır' | 'Yayınlandı' | 'Arşivlendi'; // Added "Hazır"
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
    authorId: string; // Added authorId
    status: 'Taslak' | 'İncelemede' | 'Hazır' | 'Yayınlandı' | 'Arşivlendi'; // Added status to NoteData
    createdAt: string;
    updatedAt: string;
}

// --- User Data Structure ---
export interface User {
  id: string;
  name: string; // Full name
  username: string; // Unique username for login and display
  email: string;
  role: 'Admin' | 'Editor' | 'User' | string; // Allow string for flexibility, but define common roles
  joinedAt: string; // ISO Date string
  avatar?: string; // Optional
  lastLogin?: string; // ISO Date string, optional
  bio?: string; // User's biography
  website?: string; // User's personal website
  twitterHandle?: string; // Twitter username (without @)
  linkedinProfile?: string; // LinkedIn profile URL or username part
  instagramProfile?: string; // Instagram username (without @)
  facebookProfile?: string; // Facebook profile URL or username part
  youtubeChannel?: string; // YouTube channel URL or ID
  xProfile?: string; // X (Twitter) profile URL or username part
}

// --- Role Data Structure ---
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Array of permission IDs/names
  userCount: number; // How many users have this role
}

// --- Template Structure (Used by TemplateSelector) ---
// This will now also include page templates.
export interface Template {
  id: string;
  name: string;
  description: string;
  previewImageUrl: string;
  blocks: Block[];
  type: 'article' | 'note' | 'page'; // Added 'page' type
  category?: 'Teknoloji' | 'Biyoloji' | 'Genel Sayfa'; // Added category for pages
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  excerpt?: string; // Could be used as meta description for pages too
}


// --- localStorage Setup ---
export const ARTICLE_STORAGE_KEY = 'teknobiyo_mock_articles';
export const NOTE_STORAGE_KEY = 'teknobiyo_mock_notes';
export const CATEGORY_STORAGE_KEY = 'teknobiyo_mock_categories';
export const USER_STORAGE_KEY = 'teknobiyo_mock_users';
export const ROLE_STORAGE_KEY = 'teknobiyo_mock_roles';
export const PAGE_STORAGE_KEY = 'teknobiyo_mock_pages';


// --- Initial Mock Data ---
let defaultMockCategories: Category[] = [
    { id: 'teknoloji', name: 'Teknoloji' },
    { id: 'biyoloji', name: 'Biyoloji' },
    { id: 'hücre-biyolojisi', name: 'Hücre Biyolojisi' },
    { id: 'genetik', name: 'Genetik' },
    { id: 'ekoloji', name: 'Ekoloji' },
    { id: 'insan-anatomisi', name: 'İnsan Anatomisi' },
    { id: 'bitki-biyolojisi', name: 'Bitki Biyolojisi' },
];

let defaultMockArticles: ArticleData[] = [
     {
        id: '1',
        title: 'Yapay Zeka Devrimi',
        excerpt: 'AI etkileri ve geleceği üzerine derinlemesine bir bakış.',
        blocks: [
            { id: 'b1', type: 'text', content: 'Yapay zeka (AI), makinelerin öğrenme, problem çözme ve karar verme gibi tipik olarak insan zekası gerektiren görevleri yerine getirme yeteneğidir.' },
            { id: 'b2', type: 'image', url: 'https://picsum.photos/seed/ai-edit/800/400', alt: 'Yapay Zeka Görseli', caption: 'AI teknolojileri gelişiyor.' },
            { id: 'b3', type: 'heading', level: 2, content: 'AI\'nın Etki Alanları' },
            { id: 'b4', type: 'text', content: 'Sağlık hizmetlerinde AI, hastalıkların daha erken teşhis edilmesine yardımcı olmaktadır...' },
            { id: 'b5', type: 'video', url: 'https://www.youtube.com/watch?v=SJm5suVpOK0', youtubeId: 'SJm5suVpOK0' },
        ],
        category: 'Teknoloji',
        status: 'Yayınlandı',
        mainImageUrl: 'https://picsum.photos/seed/ai/600/400',
        seoTitle: 'Yapay Zeka Devrimi | TeknoBiyo',
        seoDescription: 'AI etkileri ve geleceği üzerine derinlemesine bir bakış.',
        slug: 'yapay-zeka-devrimi',
        isFeatured: true,
        isHero: true,
        keywords: ['ai', 'makine öğrenimi', 'yapay zeka'],
        canonicalUrl: '',
        authorId: 'u1', // Ali Veli
        createdAt: '2024-07-20T10:00:00Z',
        updatedAt: '2024-07-25T14:30:00Z',
    },
    {
        id: '2',
        title: 'Gen Düzenleme Teknolojileri',
        excerpt: 'CRISPR ve diğer gen düzenleme araçlarının bilim ve tıp üzerindeki etkileri.',
        blocks: [
            { id: 'g1', type: 'text', content: 'Gen düzenleme, DNA dizilimlerinde hedeflenen değişiklikleri yapmayı sağlar.' },
             { id: 'g2', type: 'heading', level: 2, content: 'CRISPR-Cas9 Sistemi' },
             { id: 'g3', type: 'text', content: 'Bu sistem, bakterilerin doğal savunma mekanizmasından esinlenilmiştir...' },
        ],
        category: 'Biyoloji',
        status: 'Hazır', // Example of "Hazır" status
        mainImageUrl: 'https://picsum.photos/seed/crispr/600/400',
        seoTitle: 'Gen Düzenleme Teknolojileri | TeknoBiyo',
        seoDescription: 'CRISPR ve diğer gen düzenleme araçlarının bilim ve tıp üzerindeki etkileri.',
        slug: 'gen-duzenleme-teknolojileri',
        isFeatured: true, 
        isHero: false,
        keywords: ['crispr', 'genetik', 'biyoteknoloji'],
        canonicalUrl: '',
        authorId: 'u2', // Ayşe Kaya
        createdAt: '2024-07-19T11:00:00Z',
        updatedAt: '2024-07-24T09:15:00Z',
    },
    {
        id: '4',
        title: 'Mikrobiyom: İçimizdeki Gizli Dünya',
        excerpt: 'İnsan vücudundaki mikroorganizmaların sağlığımız üzerindeki etkileri.',
        blocks: [
            { id: 'm1', type: 'text', content: 'İnsan vücudu, kendi hücrelerimizden kat kat fazla sayıda mikroorganizmaya ev sahipliği yapar...' },
            { id: 'm2', type: 'heading', level: 2, content: 'Sağlık Üzerindeki Rolü' },
            { id: 'm3', type: 'text', content: 'Bağırsak mikrobiyomu, sindirime yardımcı olmaktan bağışıklık sistemini eğitmeye kadar birçok önemli işlevi yerine getirir.' },
            { id: 'm4', type: 'image', url: 'https://picsum.photos/seed/microbiome-edit/800/400', alt: 'Mikrobiyom Görseli', caption: 'Bağırsak florası.' },
        ],
        category: 'Biyoloji',
        status: 'Yayınlandı',
        mainImageUrl: 'https://picsum.photos/seed/microbiome/600/400',
        seoTitle: 'Mikrobiyom: İçimizdeki Dünya | TeknoBiyo',
        seoDescription: 'İnsan vücudundaki mikroorganizmaların sağlığımız üzerindeki etkileri ve mikrobiyom dengesinin önemi.',
        slug: 'mikrobiyom-icimizdeki-dunya',
        isFeatured: false,
        isHero: true,
        keywords: ['mikrobiyom', 'bağırsak', 'sağlık', 'bakteri', 'probiyotik'],
        canonicalUrl: '',
        authorId: 'u2', // Ayşe Kaya
        createdAt: '2024-07-21T08:00:00Z',
        updatedAt: '2024-07-26T10:00:00Z',
    },
     {
        id: '5',
        title: 'Blockchain Teknolojisi',
        excerpt: 'Kripto paraların ötesinde, dağıtık defter teknolojisinin potansiyel uygulama alanları.',
        blocks: [],
        category: 'Teknoloji',
        status: 'Arşivlendi',
        mainImageUrl: 'https://picsum.photos/seed/blockchain-archived/600/400',
        seoTitle: 'Blockchain Teknolojisi | TeknoBiyo',
        seoDescription: 'Kripto paraların ötesinde, dağıtık defter teknolojisinin potansiyel uygulama alanları.',
        slug: 'blockchain-teknolojisi',
        isFeatured: false,
        isHero: false,
        keywords: ['blockchain', 'kripto', 'dağıtık defter'],
        canonicalUrl: '',
        authorId: 'u1', // Ali Veli
        createdAt: '2024-06-15T14:00:00Z',
        updatedAt: '2024-07-01T10:00:00Z',
    },
    {
        id: '3',
        title: 'Kuantum Bilgisayarlar',
        excerpt: 'Hesaplamanın geleceği...',
        blocks: [],
        category: 'Teknoloji',
        status: 'Yayınlandı',
        mainImageUrl: 'https://picsum.photos/seed/quantum/600/400',
        seoTitle: 'Kuantum Bilgisayarlar | TeknoBiyo',
        seoDescription: 'Kuantum mekaniği prensiplerini kullanan yeni nesil hesaplama makineleri.',
        slug: 'kuantum-bilgisayarlar',
        isFeatured: true, 
        isHero: false,
        keywords: ['kuantum', 'hesaplama', 'kübit'],
        canonicalUrl: '',
        authorId: 'u1', // Ali Veli
        createdAt: '2024-07-18T09:00:00Z',
        updatedAt: '2024-07-18T09:00:00Z',
    },
     {
        id: '6',
        title: 'Sentetik Biyoloji',
        excerpt: 'Yaşamı yeniden tasarlamak...',
        blocks: [],
        category: 'Biyoloji',
        status: 'Yayınlandı',
        mainImageUrl: 'https://picsum.photos/seed/syntheticbio/600/400',
        seoTitle: 'Sentetik Biyoloji | TeknoBiyo',
        seoDescription: 'Biyolojik sistemleri mühendislik prensipleriyle tasarlama ve inşa etme alanı.',
        slug: 'sentetik-biyoloji',
        isFeatured: false,
        isHero: false,
        keywords: ['sentetik biyoloji', 'mühendislik', 'dna'],
        canonicalUrl: '',
        authorId: 'u2', // Ayşe Kaya
        createdAt: '2024-07-17T13:00:00Z',
        updatedAt: '2024-07-23T11:00:00Z',
    },
     {
        id: '7',
        title: 'Nöral Ağlar ve Derin Öğrenme',
        excerpt: 'Yapay zekanın temel taşları...',
        blocks: [],
        category: 'Teknoloji',
        status: 'Taslak',
        mainImageUrl: 'https://picsum.photos/seed/neural/600/400',
        seoTitle: 'Nöral Ağlar ve Derin Öğrenme | TeknoBiyo',
        seoDescription: 'Yapay sinir ağları ve derin öğrenme modellerinin çalışma prensipleri.',
        slug: 'nöral-ağlar-derin-öğrenme',
        isFeatured: false,
        isHero: false,
        keywords: ['nöral ağ', 'derin öğrenme', 'yapay zeka', 'makine öğrenimi'],
        canonicalUrl: '',
        authorId: 'u1', // Ali Veli
        createdAt: '2024-07-22T15:00:00Z',
        updatedAt: '2024-07-22T15:00:00Z',
    },
      {
        id: '8',
        title: 'Kanser İmmünoterapisi',
        excerpt: 'Bağışıklık sistemini kansere karşı kullanma.',
        blocks: [],
        category: 'Biyoloji',
        status: 'Yayınlandı',
        mainImageUrl: 'https://picsum.photos/seed/immunotherapy/600/400',
        seoTitle: 'Kanser İmmünoterapisi | TeknoBiyo',
        seoDescription: 'Vücudun kendi bağışıklık sistemini kanser hücreleriyle savaşmak için güçlendiren tedavi yöntemleri.',
        slug: 'kanser-immünoterapisi',
        isFeatured: true,
        isHero: true,
        keywords: ['kanser', 'immünoterapi', 'bağışıklık sistemi', 'tedavi'],
        canonicalUrl: '',
        authorId: 'u2', // Ayşe Kaya
        createdAt: '2024-07-16T10:00:00Z',
        updatedAt: '2024-07-26T09:30:00Z',
    },
    {
        id: '9',
        title: 'ASDASDASDSAD',
        excerpt: 'sadsadsad',
        blocks: [
            { id: 'block-1746446915238-87j9n5', type: 'text', content: 'sadsadsadasd' }
        ],
        category: 'Biyoloji',
        status: 'Taslak',
        mainImageUrl: '',
        seoTitle: 'ASDASDASDSAD',
        seoDescription: 'sadsadsad',
        slug: 'asdasdasdsad',
        isFeatured: false,
        isHero: false,
        keywords: [],
        canonicalUrl: '',
        authorId: 'u1', // Ali Veli
        createdAt: '2025-05-04T20:48:22.265Z',
        updatedAt: '2025-05-04T20:48:22.265Z'
    },

];

defaultMockArticles = defaultMockArticles.map(article => ({
    ...article,
    isHero: article.isHero ?? false,
}));

let defaultMockNotes: NoteData[] = [
    {
        id: 'note-hucre-zari',
        title: 'Hücre Zarının Yapısı ve Görevleri',
        slug: 'hucre-zarinin-yapisi-ve-gorevleri',
        category: 'Hücre Biyolojisi',
        level: 'Lise 9',
        tags: ['hücre zarı', 'fosfolipit', 'protein', 'madde geçişi', 'akıcı mozaik model'],
        summary: 'Hücre zarının yapısını (fosfolipit tabaka, proteinler, karbonhidratlar) ve temel görevlerini (madde alışverişi, hücre tanıma, iletişim) açıklar.',
        contentBlocks: [
            { id: 'nb1', type: 'heading', level: 2, content: 'Akıcı Mozaik Zar Modeli' },
            { id: 'nb2', type: 'text', content: 'Hücre zarı, **akıcı mozaik zar modeli** ile açıklanır. Bu modele göre zar, çift katlı **fosfolipit** tabakasından oluşur ve bu tabaka içinde hareket edebilen **proteinler** bulunur. Ayrıca zara bağlı **karbonhidratlar** (glikolipit, glikoprotein) da bulunur.' },
            { id: 'nb3', type: 'image', url: 'https://picsum.photos/seed/cell-membrane/600/300', alt: 'Hücre Zarı Modeli', caption: 'Akıcı Mozaik Zar Modeli şematik gösterimi.' },
            { id: 'nb4', type: 'heading', level: 2, content: 'Temel Görevleri' },
            { id: 'nb5', type: 'text', content: '- **Madde Alışverişi:** Hücrenin ihtiyaç duyduğu maddelerin alınmasını ve atıkların uzaklaştırılmasını sağlar (pasif taşıma, aktif taşıma, endositoz, ekzositoz).\n- **Hücreyi Koruma ve Şekil Verme:** Hücreyi dış ortamdan ayırır ve desteklik sağlar.\n- **Hücre Tanıma:** Zar yüzeyindeki glikoproteinler ve glikolipitler, hücrelerin birbirini tanımasında rol oynar.\n- **Sinyal İletimi:** Hücreler arası iletişimde görev alır.' },
        ],
        imageUrl: 'https://picsum.photos/seed/note-membrane/400/250',
        authorId: 'u1', // Ali Veli
        status: 'Yayınlandı',
        createdAt: '2024-07-28T10:00:00Z',
        updatedAt: '2024-07-28T11:00:00Z',
    },
    {
        id: 'note-mitokondri',
        title: 'Mitokondri: Hücrenin Enerji Santrali',
        slug: 'mitokondri-hucrenin-enerji-santrali',
        category: 'Hücre Biyolojisi',
        level: 'Lise 9',
        tags: ['mitokondri', 'oksijenli solunum', 'ATP', 'enerji', 'organel'],
        summary: 'Mitokondrinin yapısını, oksijenli solunumdaki rolünü ve ATP üretim sürecini özetler.',
        contentBlocks: [
            { id: 'nm1', type: 'heading', level: 2, content: 'Mitokondrinin Yapısı' },
            { id: 'nm2', type: 'text', content: 'Mitokondri, çift katlı zara sahip bir organeldir. Dış zar düz, iç zar ise **krista** adı verilen kıvrımlara sahiptir. İçini dolduran sıvıya **matriks** denir. Kendine ait DNA, RNA ve ribozomları bulunur.' },
            { id: 'nm3', type: 'image', url: 'https://picsum.photos/seed/mitochondria-structure/600/350', alt: 'Mitokondri Yapısı', caption: 'Mitokondri iç ve dış zarı, krista ve matriks.' },
            { id: 'nm4', type: 'heading', level: 2, content: 'Oksijenli Solunum ve ATP Üretimi' },
            { id: 'nm5', type: 'text', content: 'Mitokondri, **oksijenli solunumun** gerçekleştiği yerdir. Besin molekülleri (glikoz gibi) oksijen kullanılarak parçalanır ve bu süreçte açığa çıkan enerji, hücrenin kullanabileceği enerji formu olan **ATP**\'ye (Adenozin Trifosfat) dönüştürülür. Bu nedenle mitokondriye "hücrenin enerji santrali" denir.' },
        ],
        imageUrl: 'https://picsum.photos/seed/note-mitochondria/400/250',
        authorId: 'u2', // Ayşe Kaya
        status: 'Hazır',
        createdAt: '2024-07-27T14:00:00Z',
        updatedAt: '2024-07-27T15:30:00Z',
    },
    {
        id: 'note-dna-replikasyonu',
        title: 'DNA Replikasyonu (Eşlenmesi)',
        slug: 'dna-replikasyonu-eslenmesi',
        category: 'Genetik',
        level: 'Lise 12',
        tags: ['DNA', 'replikasyon', 'eşlenme', 'helikaz', 'DNA polimeraz', 'yarı korunumlu'],
        summary: 'DNA\'nın kendini yarı korunumlu olarak nasıl eşlediğini, görev alan enzimleri ve süreci açıklar.',
        contentBlocks: [
            { id: 'ndr1', type: 'heading', level: 2, content: 'Yarı Korunumlu Eşlenme Modeli' },
            { id: 'ndr2', type: 'text', content: 'DNA replikasyonu, **yarı korunumlu** olarak gerçekleşir. Bu, her yeni DNA molekülünün bir eski (kalıp) ve bir yeni zincirden oluştuğu anlamına gelir.' },
            { id: 'ndr3', type: 'heading', level: 2, content: 'Replikasyon Süreci ve Enzimler' },
             { id: 'ndr4', type: 'image', url: 'https://picsum.photos/seed/dna-replication-process/600/300', alt: 'DNA Replikasyon Süreci Şeması', caption: 'Helikaz, DNA polimeraz ve ligaz enzimleri görev alır.' },
            { id: 'ndr5', type: 'text', content: '1. **Helikaz:** DNA çift sarmalını açar.\n2. **DNA Polimeraz:** Açılan kalıp zincirlerin karşısına uygun nükleotitleri getirerek yeni zincirleri sentezler.\n3. **DNA Ligaz:** Oluşan DNA parçalarını (Okazaki parçacıkları) birleştirir.' },
            { id: 'ndr6', type: 'text', content: 'Replikasyon, hücre bölünmesi öncesinde gerçekleşir ve genetik bilginin yeni hücrelere aktarılmasını sağlar.' },
        ],
        imageUrl: 'https://picsum.photos/seed/note-dna/400/250',
        authorId: 'u1', // Ali Veli
        status: 'Yayınlandı',
        createdAt: '2024-07-29T09:00:00Z',
        updatedAt: '2024-07-29T09:30:00Z',
    },
    {
        id: 'note-protein-sentezi',
        title: 'Protein Sentezi: Transkripsiyon ve Translasyon',
        slug: 'protein-sentezi-transkripsiyon-translasyon',
        category: 'Genetik',
        level: 'Lise 12',
        tags: ['protein sentezi', 'transkripsiyon', 'translasyon', 'mRNA', 'tRNA', 'ribozom'],
        summary: 'Protein sentezinin iki ana aşaması olan transkripsiyon (yazılım) ve translasyon (okuma) süreçlerini açıklar.',
        contentBlocks: [
            { id: 'nps1', type: 'heading', level: 2, content: 'Transkripsiyon (Yazılım)' },
            { id: 'nps2', type: 'text', content: 'DNA\'daki genetik bilginin mRNA\'ya (mesajcı RNA) kopyalanmasıdır. Çekirdekte (ökaryotlarda) veya sitoplazmada (prokaryotlarda) gerçekleşir.' },
            { id: 'nps3', type: 'heading', level: 2, content: 'Translasyon (Okuma)' },
            { id: 'nps4', type: 'text', content: 'mRNA\'daki genetik kodun ribozomlarda okunarak amino asit dizisine (polipeptit) çevrilmesidir. Sitoplazmada ribozomlarda gerçekleşir. tRNA\'lar (taşıyıcı RNA) uygun amino asitleri ribozoma taşır.' },
        ],
        imageUrl: 'https://picsum.photos/seed/note-protein/400/250',
        authorId: 'u1', // Ali Veli
        status: 'Taslak',
        createdAt: '2024-08-01T11:00:00Z',
        updatedAt: '2024-08-01T11:30:00Z',
    },
    {
        id: 'note-ekosistem',
        title: 'Ekosistem ve Temel Kavramlar',
        slug: 'ekosistem-temel-kavramlar',
        category: 'Ekoloji',
        level: 'Lise 10',
        tags: ['ekosistem', 'biyotik faktörler', 'abiyotik faktörler', 'besin zinciri', 'popülasyon'],
        summary: 'Ekosistemin tanımı, biyotik ve abiyotik faktörler, besin zinciri, popülasyon gibi temel ekolojik kavramları içerir.',
        contentBlocks: [
            { id: 'ne1', type: 'heading', level: 2, content: 'Ekosistem Nedir?' },
            { id: 'ne2', type: 'text', content: 'Belirli bir alanda yaşayan canlılar (biyotik faktörler) ile bu canlıları çevreleyen cansız ortam (abiyotik faktörler) arasındaki etkileşimlerin oluşturduğu bütündür.' },
             { id: 'ne3', type: 'image', url: 'https://picsum.photos/seed/ecosystem-overview/600/300', alt: 'Ekosistem Örneği', caption: 'Bir orman ekosistemi, canlı ve cansız öğeleri içerir.' },
        ],
        imageUrl: 'https://picsum.photos/seed/note-ecosystem/400/250',
        authorId: 'u2', // Ayşe Kaya
        status: 'Yayınlandı',
        createdAt: '2024-08-02T15:00:00Z',
        updatedAt: '2024-08-02T15:45:00Z',
    }
];

let defaultMockUsers: User[] = [
  { id: 'u1', name: 'Ali Veli', username: 'aliveli', email: 'ali.veli@example.com', role: 'Admin', joinedAt: '2024-01-15T10:00:00Z', avatar: 'https://picsum.photos/seed/u1/128/128', lastLogin: '2024-07-22T10:30:00Z', bio: 'TeknoBiyo kurucusu ve baş yazarı.', website: 'https://aliveli.dev', twitterHandle: 'aliveli', linkedinProfile: 'aliveli-profil', instagramProfile: 'aliveli_insta', facebookProfile: 'alivelifb', youtubeChannel: 'aliveliyoutube', xProfile: 'aliveli_x' },
  { id: 'u2', name: 'Ayşe Kaya', username: 'aysekaya', email: 'ayse.kaya@example.com', role: 'Editor', joinedAt: '2024-03-22T11:00:00Z', avatar: 'https://picsum.photos/seed/u2/128/128', lastLogin: '2024-07-21T15:00:00Z', bio: 'Biyoloji ve sağlık alanında uzman editör.', instagramProfile: 'aysekaya_insta', xProfile: 'aysekaya_x' },
  { id: 'u3', name: 'Mehmet Yılmaz', username: 'mehmetyilmaz', email: 'mehmet.yilmaz@example.com', role: 'User', joinedAt: '2024-06-10T12:00:00Z', avatar: 'https://picsum.photos/seed/u3/128/128', lastLogin: '2024-07-20T09:15:00Z' },
  { id: 'u4', name: 'Zeynep Demir', username: 'zeynepdemir', email: 'zeynep.demir@example.com', role: 'User', joinedAt: '2024-07-01T13:00:00Z', avatar: 'https://picsum.photos/seed/u4/128/128', lastLogin: '2024-07-18T11:00:00Z' },
  { id: 'u5', name: 'Can Öztürk', username: 'canozturk', email: 'can.ozturk@example.com', role: 'Editor', joinedAt: '2024-05-19T14:00:00Z', avatar: 'https://picsum.photos/seed/u5/128/128', lastLogin: '2024-07-19T18:45:00Z', bio: 'Teknoloji ve yazılım konularında içerik üreticisi.', youtubeChannel: 'canozturktech', xProfile: 'canozturk_x' },
  { id: 'user-1746537968395-202eb4', name: 'Gökhan Ermiş', username: 'gokhanermis', email: 'sirfpubg12@gmail.com', role: 'Admin', joinedAt: '2025-05-06T05:26:08.395Z', avatar: 'https://picsum.photos/seed/babybee/128/128', lastLogin: '2025-05-06T05:26:08.395Z', bio: 'Yeni kullanıcı bio.', website: 'https://example.com', twitterHandle: 'gokhanermis', linkedinProfile: 'gokhanermis', instagramProfile: 'gokhanermis_insta', facebookProfile: 'gokhanermisfb', youtubeChannel: 'gokhanermisyoutube', xProfile: 'gokhanermis_x' },
];

let defaultMockRoles: Role[] = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Tam sistem erişimine sahip yönetici.',
    permissions: [
      'Dashboard Görüntüleme',
      'Makaleleri Görüntüleme', 'Makale Oluşturma', 'Makale Düzenleme', 'Makale Silme', 'Hazır İçeriği Görüntüleme',
      'Biyoloji Notlarını Görüntüleme', 'Yeni Biyoloji Notu Ekleme', 'Biyoloji Notlarını Düzenleme', 'Biyoloji Notlarını Silme',
      'Kategorileri Yönetme',
      'Sayfaları Yönetme',
      'Kullanıcıları Görüntüleme', 'Kullanıcı Ekleme', 'Kullanıcı Düzenleme', 'Kullanıcı Silme',
      'Rolleri Yönetme',
      'Ayarları Görüntüleme', 'Menü Yönetimi', 'Kullanım Kılavuzunu Görüntüleme'
    ],
    userCount: 2, // Updated count
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'İçerik oluşturma ve düzenleme yetkisine sahip.',
    permissions: [
      'Dashboard Görüntüleme',
      'Makaleleri Görüntüleme', 'Makale Oluşturma', 'Makale Düzenleme', 'Hazır İçeriği Görüntüleme',
      'Biyoloji Notlarını Görüntüleme', 'Yeni Biyoloji Notu Ekleme', 'Biyoloji Notlarını Düzenleme',
      'Kategorileri Yönetme', 'Kullanım Kılavuzunu Görüntüleme'
    ],
    userCount: 2,
  },
  {
    id: 'user',
    name: 'User',
    description: 'Standart kullanıcı, içerik görüntüleme ve yorum yapma.',
    permissions: ['Kullanım Kılavuzunu Görüntüleme'],
    userCount: 2,
  },
];

const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;

const defaultPageTemplates: Template[] = [
  {
    id: 'page-standard',
    name: 'Standart Sayfa',
    description: 'Genel amaçlı sayfalar için başlık, metin ve görsel içeren temel düzen.',
    previewImageUrl: 'https://picsum.photos/seed/page-std/300/200',
    type: 'page',
    category: 'Genel Sayfa',
    blocks: [
      { id: generateId(), type: 'heading', level: 1, content: '[Sayfa Başlığı Buraya Gelecek]' },
      { id: generateId(), type: 'text', content: '[Sayfanızın ana metin içeriği için bu alanı kullanın. Paragraflarınızı buraya ekleyebilirsiniz.]' },
      { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/page-std-img1/800/400', alt: 'Standart Sayfa Görseli 1', caption: 'İsteğe bağlı görsel alt yazısı.' },
      { id: generateId(), type: 'heading', level: 2, content: 'Alt Başlık 1' },
      { id: generateId(), type: 'text', content: '[Bu alt başlık altındaki detayları veya ek bilgileri buraya yazın.]' },
      { id: generateId(), type: 'divider' },
      { id: generateId(), type: 'heading', level: 2, content: 'Alt Başlık 2' },
      { id: generateId(), type: 'text', content: '[Farklı bir konu veya bölüm için metin içeriği.]' },
      { id: generateId(), type: 'quote', content: 'İlham verici bir alıntı veya önemli bir notu burada vurgulayabilirsiniz.', citation: 'Kaynak (isteğe bağlı)' },
    ]
  },
  {
    id: 'page-contact',
    name: 'İletişim Sayfası',
    description: 'İletişim formu ve iletişim bilgileri için düzenlenmiş sayfa yapısı.',
    previewImageUrl: 'https://picsum.photos/seed/page-contact/300/200',
    type: 'page',
    category: 'Genel Sayfa',
    blocks: [
      { id: generateId(), type: 'heading', level: 1, content: 'Bizimle İletişime Geçin' },
      { id: generateId(), type: 'text', content: 'Sorularınız, önerileriniz veya işbirliği talepleriniz için aşağıdaki formu kullanabilir veya iletişim bilgilerimizden bize ulaşabilirsiniz.' },
      { id: generateId(), type: 'section', sectionType: 'contact-form', settings: { title: 'İletişim Formu', recipientEmail: 'iletisim@example.com' } },
      { id: generateId(), type: 'heading', level: 2, content: 'Diğer İletişim Yolları' },
      { id: generateId(), type: 'text', content: '**E-posta:** bilgi@example.com\n**Telefon:** +90 (XXX) XXX XX XX\n**Adres:** Örnek Mah. Bilim Cad. No:123, TeknoKent, İstanbul' },
      { id: generateId(), type: 'section', sectionType: 'custom-text', settings: { content: '<p style="text-align:center; margin-top:20px;">Harita konumu (Gömülü harita eklenebilir).</p>' } },
    ]
  },
  {
    id: 'page-about-us',
    name: 'Hakkımızda Sayfası',
    description: 'Ekip, misyon ve vizyon gibi bilgileri içeren kurumsal sayfa düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/page-about/300/200',
    type: 'page',
    category: 'Genel Sayfa',
    blocks: [
      { id: generateId(), type: 'heading', level: 1, content: 'TeknoBiyo Hakkında' },
      { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/page-about-hero/1000/400', alt: 'Hakkımızda Kapak Görseli', caption: 'Vizyonumuz ve geleceğe bakışımız.' },
      { id: generateId(), type: 'heading', level: 2, content: 'Misyonumuz' },
      { id: generateId(), type: 'text', content: '[Şirketinizin veya projenizin misyonunu açıklayan detaylı bir metin.]' },
      { id: generateId(), type: 'heading', level: 2, content: 'Vizyonumuz' },
      { id: generateId(), type: 'text', content: '[Gelecekte ulaşmak istediğiniz hedefleri ve vizyonunuzu anlatan bir metin.]' },
      { id: generateId(), type: 'heading', level: 2, content: 'Ekibimiz' },
      { id: generateId(), type: 'text', content: '[Ekip üyelerinizi tanıtan kısa bilgiler veya görseller eklenebilir. Örneğin, bir "section" bloğu ile daha karmaşık bir düzen oluşturulabilir.]' },
      // Örnek Section kullanımı (ekip üyeleri için)
      // { id: generateId(), type: 'section', sectionType: 'team-members', settings: { count: 3, showBio: true } }, // Bu sectionType'ın render edilmesi gerekir
      { id: generateId(), type: 'text', content: 'Ekip üyelerimiz, alanlarında uzman ve tutkulu bireylerden oluşmaktadır...' },
    ]
  },
  {
    id: 'page-faq',
    name: 'SSS Sayfası',
    description: 'Sıkça sorulan soruları ve cevaplarını düzenli bir şekilde sunar.',
    previewImageUrl: 'https://picsum.photos/seed/page-faq/300/200',
    type: 'page',
    category: 'Genel Sayfa',
    blocks: [
      { id: generateId(), type: 'heading', level: 1, content: 'Sıkça Sorulan Sorular (SSS)' },
      { id: generateId(), type: 'text', content: 'Hizmetlerimiz, ürünlerimiz veya projemiz hakkında en çok merak edilen soruları ve yanıtlarını burada bulabilirsiniz.' },
      { id: generateId(), type: 'heading', level: 2, content: 'Soru 1: [Sıkça Sorulan Bir Soru Örneği Nedir?]' },
      { id: generateId(), type: 'text', content: '**Cevap:** [Bu soruya verilecek detaylı ve açıklayıcı cevap.]' },
      { id: generateId(), type: 'divider' },
      { id: generateId(), type: 'heading', level: 2, content: 'Soru 2: [Başka Bir Yaygın Soru Nasıl Çözülür?]' },
      { id: generateId(), type: 'text', content: '**Cevap:** [Bu sorunun çözümünü veya açıklamasını içeren metin.]' },
      { id: generateId(), type: 'divider' },
      { id: generateId(), type: 'heading', level: 2, content: 'Soru 3: [Ürün/Hizmet Hakkında Bir Soru]' },
      { id: generateId(), type: 'text', content: '**Cevap:** [Ürün veya hizmetle ilgili bu soruya verilecek yanıt.]' },
      { id: generateId(), type: 'text', content: 'Daha fazla sorunuz varsa, lütfen bizimle iletişime geçmekten çekinmeyin.' },
    ]
  },
   {
    id: 'page-services',
    name: 'Hizmetler Sayfası',
    description: 'Sunulan hizmetleri detaylı bir şekilde listeleyen ve açıklayan sayfa.',
    previewImageUrl: 'https://picsum.photos/seed/page-services/300/200',
    type: 'page',
    category: 'Genel Sayfa',
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Sunduğumuz Hizmetler' },
        { id: generateId(), type: 'text', content: 'Profesyonel ekibimizle sizlere sunduğumuz hizmetlerin detaylarını aşağıda bulabilirsiniz.' },
        { id: generateId(), type: 'heading', level: 2, content: 'Hizmet Alanı 1: [Hizmet Adı]' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/service1-img/700/350', alt: 'Hizmet 1 Görseli', caption: 'Hizmet 1 Detayları' },
        { id: generateId(), type: 'text', content: '[Hizmet 1\'in açıklaması, faydaları ve süreci hakkında detaylı bilgi.]' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Hizmet Alanı 2: [Hizmet Adı]' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/service2-img/700/350', alt: 'Hizmet 2 Görseli', caption: 'Hizmet 2 Detayları' },
        { id: generateId(), type: 'text', content: '[Hizmet 2\'nin açıklaması, sağladığı avantajlar ve kimlere yönelik olduğu.]' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Neden Bizi Tercih Etmelisiniz?' },
        { id: generateId(), type: 'text', content: '- Deneyimli ve uzman kadro\n- Müşteri odaklı yaklaşım\n- Kaliteli ve güvenilir hizmet\n- Rekabetçi fiyatlar' },
    ]
  },
  {
    id: 'page-portfolio',
    name: 'Portfolyo Sayfası',
    description: 'Tamamlanmış projeleri veya çalışmaları sergilemek için galeri tarzı sayfa.',
    previewImageUrl: 'https://picsum.photos/seed/page-portfolio/300/200',
    type: 'page',
    category: 'Genel Sayfa',
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Çalışmalarımızdan Örnekler' },
        { id: generateId(), type: 'text', content: 'Bugüne kadar tamamladığımız bazı projeleri ve çalışmaları aşağıda inceleyebilirsiniz.' },
        { id: generateId(), type: 'gallery', images: [
            { url: 'https://picsum.photos/seed/portfolio1/600/400', alt: 'Proje 1' },
            { url: 'https://picsum.photos/seed/portfolio2/600/400', alt: 'Proje 2' },
            { url: 'https://picsum.photos/seed/portfolio3/600/400', alt: 'Proje 3' },
            { url: 'https://picsum.photos/seed/portfolio4/600/400', alt: 'Proje 4' },
          ]
        },
        { id: generateId(), type: 'heading', level: 2, content: 'Proje Detayı: [Örnek Proje Adı]' },
        { id: generateId(), type: 'text', content: '[Seçilen bir projenin kısa açıklaması, kullanılan teknolojiler ve elde edilen sonuçlar.]' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/portfolio-detail/800/450', alt: 'Proje Detay Görseli' },
    ]
  },
  {
    id: 'page-landing-product',
    name: 'Ürün Tanıtım Sayfası (Landing)',
    description: 'Belirli bir ürünü veya hizmeti tanıtmak için tasarlanmış odaklı sayfa.',
    previewImageUrl: 'https://picsum.photos/seed/page-landing/300/200',
    type: 'page',
    category: 'Genel Sayfa',
    blocks: [
        { id: generateId(), type: 'section', sectionType: 'hero-banner', settings: { title: '[Ürün Adı]', subtitle: '[Ürünün Ana Faydası veya Sloganı]', ctaButtonText: 'Hemen Keşfet', imageUrl: 'https://picsum.photos/seed/landing-hero/1200/500' } },
        { id: generateId(), type: 'heading', level: 2, content: 'Neden [Ürün Adı]?' },
        { id: generateId(), type: 'text', content: '[Ürünün temel özelliklerini ve kullanıcıya sağlayacağı faydaları anlatan 3-4 madde veya kısa paragraf.]' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/landing-feature1/700/400', alt: 'Ürün Özellik 1', caption:'Özellik 1 Açıklaması' },
        { id: generateId(), type: 'text', content: '[Özellik 1\'in detaylı açıklaması.]' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/landing-feature2/700/400', alt: 'Ürün Özellik 2', caption:'Özellik 2 Açıklaması' },
        { id: generateId(), type: 'text', content: '[Özellik 2\'nin detaylı açıklaması.]' },
        { id: generateId(), type: 'quote', content: 'Müşteri yorumu veya ürün hakkında etkileyici bir söz.', citation: 'Memnun Müşteri' },
        { id: generateId(), type: 'section', sectionType: 'call-to-action', settings: { title: 'Hemen Denemeye Başlayın!', buttonText: 'Satın Al / Kaydol', descriptionText: '[Kısa bir teşvik edici açıklama.]' } },
    ]
  },
  {
    id: 'page-blog-index',
    name: 'Blog Anasayfası',
    description: 'Blog yazılarını listeleyen ve kategorilere ayıran sayfa.',
    previewImageUrl: 'https://picsum.photos/seed/page-blog/300/200',
    type: 'page',
    category: 'Genel Sayfa',
    blocks: [
      { id: generateId(), type: 'heading', level: 1, content: 'TeknoBiyo Blog' },
      { id: generateId(), type: 'text', content: 'Teknoloji ve biyoloji dünyasından en son haberler, analizler ve ilginç bilgiler.' },
      { id: generateId(), type: 'section', sectionType: 'featured-articles', settings: { title: 'Öne Çıkan Yazılar', count: 2 } },
      { id: generateId(), type: 'divider' },
      { id: generateId(), type: 'heading', level: 2, content: 'Tüm Yazılar' },
      { id: generateId(), type: 'section', sectionType: 'article-list', settings: { count: 10, showPagination: true, showCategoryFilter: true } },
    ]
  },
  {
    id: 'page-career',
    name: 'Kariyer Sayfası',
    description: 'Açık pozisyonları listeleyen ve şirket kültürünü tanıtan sayfa.',
    previewImageUrl: 'https://picsum.photos/seed/page-career/300/200',
    type: 'page',
    category: 'Genel Sayfa',
    blocks: [
      { id: generateId(), type: 'heading', level: 1, content: 'TeknoBiyo\'da Kariyer' },
      { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/career-team/1000/400', alt: 'TeknoBiyo Ekibi', caption: 'Birlikte büyüyen bir ekibiz.' },
      { id: generateId(), type: 'text', content: 'Dinamik ve yenilikçi bir ortamda kariyerinize yön vermek ister misiniz? TeknoBiyo olarak, teknoloji ve biyolojiye tutkuyla bağlı yetenekleri aramızda görmekten mutluluk duyarız.' },
      { id: generateId(), type: 'heading', level: 2, content: 'Neden TeknoBiyo?' },
      { id: generateId(), type: 'text', content: '- Sürekli öğrenme ve gelişim fırsatları.\n- İlham verici ve işbirlikçi bir çalışma ortamı.\n- Sektörde fark yaratan projelerde yer alma şansı.\n- Rekabetçi maaş ve yan haklar.' },
      { id: generateId(), type: 'heading', level: 2, content: 'Açık Pozisyonlar' },
      { id: generateId(), type: 'section', sectionType: 'job-listings', settings: {} }, // Bu sectionType'ın render edilmesi gerekir
      { id: generateId(), type: 'text', content: 'Şu anda açık bir pozisyonumuz bulunmuyorsa bile, genel başvurularınızı [e-posta adresi] adresine gönderebilirsiniz.' },
    ]
  },
  { // User Guide Page Template
    id: 'page-user-guide',
    name: 'Kullanım Kılavuzu',
    description: 'Sitenin veya uygulamanın nasıl kullanılacağını açıklayan detaylı bir kılavuz sayfası.',
    previewImageUrl: 'https://picsum.photos/seed/page-guide/300/200',
    type: 'page',
    category: 'Genel Sayfa',
    blocks: [
      { id: generateId(), type: 'heading', level: 1, content: '[Platform Adı] Kullanım Kılavuzu' },
      { id: generateId(), type: 'text', content: 'Bu kılavuz, [Platform Adı] platformunu etkili bir şekilde kullanmanıza yardımcı olmak için tasarlanmıştır. Aşağıdaki bölümlerde sıkça ihtiyaç duyacağınız bilgilere ve özelliklere ulaşabilirsiniz.' },
      { id: generateId(), type: 'heading', level: 2, content: 'Bölüm 1: Başlarken' },
      { id: generateId(), type: 'text', content: '- Hesap Oluşturma ve Giriş Yapma\n- Profil Ayarları\n- Gösterge Paneline Genel Bakış' },
      { id: generateId(), type: 'divider' },
      { id: generateId(), type: 'heading', level: 2, content: 'Bölüm 2: İçerik Yönetimi' },
      { id: generateId(), type: 'text', content: '- Yeni Makale/Not Oluşturma\n- Zengin Metin Editörü Kullanımı\n- Medya Yükleme ve Yönetimi\n- Kategori ve Etiket Ekleme\n- Yayınlama Süreci' },
      { id: generateId(), type: 'divider' },
      { id: generateId(), type: 'heading', level: 2, content: 'Bölüm 3: Kullanıcı Yönetimi (Adminler İçin)' },
      { id: generateId(), type: 'text', content: '- Yeni Kullanıcı Ekleme\n- Rol ve İzin Yönetimi\n- Kullanıcı Aktivitelerini İzleme' },
      { id: generateId(), type: 'divider' },
      { id: generateId(), type: 'heading', level: 2, content: 'Sıkça Sorulan Sorular (SSS)' },
      { id: generateId(), type: 'text', content: '**Soru:** [Yaygın bir soru örneği]\n**Cevap:** [Soruya ait cevap]' },
      { id: generateId(), type: 'text', content: 'Daha fazla yardıma ihtiyacınız olursa, lütfen destek ekibimizle iletişime geçin.' },
    ]
  }
];


// --- In-Memory Data Stores with localStorage Persistence ---
let mockArticles: ArticleData[] = [];
let mockNotes: NoteData[] = [];
let mockCategories: Category[] = [];
let mockUsers: User[] = [];
let mockRoles: Role[] = [];

// Ensure data is loaded once when the module is first imported
export const loadInitialData = () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const storedCategories = localStorage.getItem(CATEGORY_STORAGE_KEY);
        mockCategories = storedCategories ? JSON.parse(storedCategories) : defaultMockCategories;

        const storedArticles = localStorage.getItem(ARTICLE_STORAGE_KEY);
        mockArticles = storedArticles ? JSON.parse(storedArticles).map((article: ArticleData) => ({ ...article, isHero: article.isHero ?? false })) : defaultMockArticles;

        const storedNotes = localStorage.getItem(NOTE_STORAGE_KEY);
        mockNotes = storedNotes ? JSON.parse(storedNotes) : defaultMockNotes;

        const storedUsers = localStorage.getItem(USER_STORAGE_KEY);
        mockUsers = storedUsers ? JSON.parse(storedUsers) : defaultMockUsers;

        const storedRoles = localStorage.getItem(ROLE_STORAGE_KEY);
        mockRoles = storedRoles ? JSON.parse(storedRoles) : defaultMockRoles;


        if (!storedCategories) localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(mockCategories));
        if (!storedArticles) localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(mockArticles));
        if (!storedNotes) localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(mockNotes));
        if (!storedUsers) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUsers));
        if (!storedRoles) localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(mockRoles));

    } else {
        mockCategories = defaultMockCategories;
        mockArticles = defaultMockArticles;
        mockNotes = defaultMockNotes;
        mockUsers = defaultMockUsers;
        mockRoles = defaultMockRoles;
    }
};

const saveData = () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(mockArticles));
            localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(mockNotes));
            localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(mockCategories));
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUsers));
            localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(mockRoles));
            localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(mockPages)); // Save pages
        } catch (error) {
            console.error("Error saving data to localStorage:", error);
        }
    }
};

loadInitialData();


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateSlug = (text: string) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-').replace(/-+/g, '-');
};

// --- Category CRUD ---
export const getCategories = async (): Promise<Category[]> => {
    await delay(5);
    loadInitialData();
    return JSON.parse(JSON.stringify(mockCategories));
};

export const addCategory = async (data: Omit<Category, 'id'>): Promise<Category> => {
    await delay(30);
    loadInitialData();
    const newCategory: Category = {
        ...data,
        id: generateSlug(data.name) + '-' + Date.now().toString(36),
    };
    if (mockCategories.some(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase())) {
        throw new Error(`"${newCategory.name}" adında bir kategori zaten mevcut.`);
    }
    mockCategories.push(newCategory);
    saveData();
    return JSON.parse(JSON.stringify(newCategory));
};

export const updateCategory = async (id: string, data: Partial<Omit<Category, 'id'>>): Promise<Category | null> => {
    await delay(30);
    loadInitialData();
    const categoryIndex = mockCategories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) return null;
    if (data.name && mockCategories.some(cat => cat.id !== id && cat.name.toLowerCase() === data.name!.toLowerCase())) {
         throw new Error(`"${data.name}" adında başka bir kategori zaten mevcut.`);
    }
    const updatedCategory = { ...mockCategories[categoryIndex], ...data };
    mockCategories[categoryIndex] = updatedCategory;
    saveData();
    return JSON.parse(JSON.stringify(updatedCategory));
};

export const deleteCategory = async (id: string): Promise<boolean> => {
    await delay(50);
    loadInitialData();
    const categoryToDelete = mockCategories.find(cat => cat.id === id);
    if (!categoryToDelete) return false;

    const initialLength = mockCategories.length;
    mockCategories = mockCategories.filter(cat => cat.id !== id);
    const success = mockCategories.length < initialLength;

    if (success) {
        mockArticles = mockArticles.map(article => article.category === categoryToDelete.name ? { ...article, category: '' } : article);
        mockNotes = mockNotes.map(note => note.category === categoryToDelete.name ? { ...note, category: '' } : note);
        saveData();
    }
    return success;
};

// --- Article CRUD ---
export const getArticles = async (): Promise<ArticleData[]> => {
    await delay(10);
    loadInitialData();
    return JSON.parse(JSON.stringify(mockArticles));
};

export const getArticleById = async (id: string): Promise<ArticleData | null> => {
    await delay(10);
    loadInitialData();
    const article = mockArticles.find(article => article.id === id);
    return article ? JSON.parse(JSON.stringify(article)) : null;
};

export const createArticle = async (data: Omit<ArticleData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ArticleData> => {
    await delay(50);
    loadInitialData();
    const newArticle: ArticleData = {
        ...data,
        isHero: data.isHero ?? false,
        id: `mock-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    mockArticles.push(newArticle);
    saveData();
    return JSON.parse(JSON.stringify(newArticle));
};

export const updateArticle = async (id: string, data: Partial<Omit<ArticleData, 'id' | 'createdAt'>>): Promise<ArticleData | null> => {
    await delay(50);
    loadInitialData();
    const articleIndex = mockArticles.findIndex(article => article.id === id);
    if (articleIndex === -1) return null;
    const updatedArticle = {
        ...mockArticles[articleIndex],
        ...data,
        isHero: data.isHero ?? mockArticles[articleIndex].isHero, // Ensure isHero persists if not in data
        updatedAt: new Date().toISOString(),
    };
    mockArticles[articleIndex] = updatedArticle;
    saveData();
    return JSON.parse(JSON.stringify(updatedArticle));
};

export const deleteArticle = async (id: string): Promise<boolean> => {
    await delay(80);
    loadInitialData();
    const initialLength = mockArticles.length;
    mockArticles = mockArticles.filter(article => article.id !== id);
    const success = mockArticles.length < initialLength;
    if (success) saveData();
    return success;
};

// --- Note CRUD ---
export const getNotes = async (): Promise<NoteData[]> => {
    await delay(10);
    loadInitialData();
    return JSON.parse(JSON.stringify(mockNotes));
};

export const getNoteById = async (id: string): Promise<NoteData | null> => {
    await delay(10);
    loadInitialData();
    const note = mockNotes.find(note => note.id === id);
    return note ? JSON.parse(JSON.stringify(note)) : null;
};

export const createNote = async (data: Omit<NoteData, 'id' | 'createdAt' | 'updatedAt'>): Promise<NoteData> => {
    await delay(50);
    loadInitialData();
    const newNote: NoteData = {
        ...data,
        id: `note-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`,
        status: data.status || 'Taslak',
        authorId: data.authorId || 'u1', // Default author if not provided
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    mockNotes.push(newNote);
    saveData();
    return JSON.parse(JSON.stringify(newNote));
};

export const updateNote = async (id: string, data: Partial<Omit<NoteData, 'id' | 'createdAt'>>): Promise<NoteData | null> => {
    await delay(50);
    loadInitialData();
    const noteIndex = mockNotes.findIndex(note => note.id === id);
    if (noteIndex === -1) return null;
    const updatedNote = {
        ...mockNotes[noteIndex],
        ...data,
        updatedAt: new Date().toISOString(),
    };
    mockNotes[noteIndex] = updatedNote;
    saveData();
    return JSON.parse(JSON.stringify(updatedNote));
};

export const deleteNote = async (id: string): Promise<boolean> => {
    await delay(80);
    loadInitialData();
    const initialLength = mockNotes.length;
    mockNotes = mockNotes.filter(note => note.id !== id);
    const success = mockNotes.length < initialLength;
    if (success) saveData();
    return success;
};

// --- User CRUD Functions ---
export const getUsers = async (): Promise<User[]> => {
    await delay(10);
    loadInitialData();
    return JSON.parse(JSON.stringify(mockUsers));
};

export const getUserById = async (id: string): Promise<User | null> => {
    await delay(10);
    loadInitialData();
    const user = mockUsers.find(u => u.id === id);
    return user ? JSON.parse(JSON.stringify(user)) : null;
};

export const createUser = async (data: Omit<User, 'id' | 'joinedAt' | 'lastLogin'>): Promise<User> => {
    await delay(50);
    loadInitialData();
    // Validate if username or email already exists
    if (mockUsers.some(u => u.username === data.username)) {
        throw new Error(`Kullanıcı adı "${data.username}" zaten mevcut.`);
    }
    if (mockUsers.some(u => u.email === data.email)) {
        throw new Error(`E-posta adresi "${data.email}" zaten mevcut.`);
    }

    const newUser: User = {
        ...data,
        id: `user-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`,
        joinedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(), // Set lastLogin on creation
        avatar: data.avatar || `https://picsum.photos/seed/${data.username || 'avatar'}/128/128`, // Default avatar
        bio: data.bio || '',
        website: data.website || '',
        twitterHandle: data.twitterHandle || '',
        linkedinProfile: data.linkedinProfile || '',
        instagramProfile: data.instagramProfile || '',
        facebookProfile: data.facebookProfile || '',
        youtubeChannel: data.youtubeChannel || '',
        xProfile: data.xProfile || '',
    };
    mockUsers.push(newUser);
    saveData();
    return JSON.parse(JSON.stringify(newUser));
};

export const updateUser = async (id: string, data: Partial<Omit<User, 'id' | 'joinedAt' | 'email'>>): Promise<User | null> => {
    await delay(50);
    loadInitialData();
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    // If username is being updated, check for uniqueness
    if (data.username && data.username !== mockUsers[userIndex].username && mockUsers.some(u => u.username === data.username && u.id !== id)) {
        throw new Error(`Kullanıcı adı "${data.username}" zaten mevcut.`);
    }

    const updatedUser = {
        ...mockUsers[userIndex],
        ...data,
    };
    mockUsers[userIndex] = updatedUser;
    saveData();
    return JSON.parse(JSON.stringify(updatedUser));
};

export const deleteUser = async (id: string): Promise<boolean> => {
  await delay(80);
  loadInitialData();
  console.log(`[mock-data/deleteUser] Attempting to delete user with id: ${id}`);
  const initialLength = mockUsers.length;
  console.log(`[mock-data/deleteUser] Users before deletion (${initialLength}):`, JSON.stringify(mockUsers.map(u => u.id)));

  const usersBefore = [...mockUsers]; // Create a copy for comparison
  mockUsers = mockUsers.filter(u => u.id !== id);

  const success = mockUsers.length < initialLength;

  console.log(`[mock-data/deleteUser] Users after filtering (${mockUsers.length}):`, JSON.stringify(mockUsers.map(u => u.id)));
  console.log(`[mock-data/deleteUser] Deletion success: ${success}`);

  if (success) {
    console.log(`[mock-data/deleteUser] Saving updated user list to localStorage.`);
    saveData();
  } else {
    console.warn(`[mock-data/deleteUser] User with id ${id} not found or no changes made. Users before: ${JSON.stringify(usersBefore.map(u=>u.id))}`);
  }
  return success;
};


// --- Role CRUD Functions ---
export const getRoles = async (): Promise<Role[]> => {
  await delay(10);
  loadInitialData();
  return JSON.parse(JSON.stringify(mockRoles));
};

export const getRoleById = async (id: string): Promise<Role | null> => {
  await delay(10);
  loadInitialData();
  const role = mockRoles.find(r => r.id === id);
  return role ? JSON.parse(JSON.stringify(role)) : null;
};

export const createRole = async (data: Omit<Role, 'id' | 'userCount'>): Promise<Role> => {
  await delay(50);
  loadInitialData();
  if (mockRoles.some(r => r.name.toLowerCase() === data.name.toLowerCase())) {
    throw new Error(`"${data.name}" adında bir rol zaten mevcut.`);
  }
  const newRole: Role = {
    ...data,
    id: generateSlug(data.name) + '-' + Date.now().toString(36),
    userCount: 0,
  };
  mockRoles.push(newRole);
  saveData();
  return JSON.parse(JSON.stringify(newRole));
};

export const updateRole = async (id: string, data: Partial<Omit<Role, 'id' | 'userCount'>>): Promise<Role | null> => {
  await delay(50);
  loadInitialData();
  const roleIndex = mockRoles.findIndex(r => r.id === id);
  if (roleIndex === -1) return null;
  if (data.name && data.name !== mockRoles[roleIndex].name && mockRoles.some(r => r.name.toLowerCase() === data.name!.toLowerCase())) {
    throw new Error(`"${data.name}" adında başka bir rol zaten mevcut.`);
  }
  const updatedRole = { ...mockRoles[roleIndex], ...data };
  mockRoles[roleIndex] = updatedRole;
  saveData();
  return JSON.parse(JSON.stringify(updatedRole));
};

export const deleteRole = async (id: string): Promise<boolean> => {
  await delay(80);
  loadInitialData();
  const roleToDelete = mockRoles.find(r => r.id === id);
  if (!roleToDelete) return false;

  const initialLength = mockRoles.length;
  mockRoles = mockRoles.filter(r => r.id !== id);
  const success = mockRoles.length < initialLength;

  if (success) {
    // Optionally update users who had this role
    mockUsers = mockUsers.map(user => user.role === roleToDelete.name || user.role === roleToDelete.id ? { ...user, role: 'User' } : user); // Reassign to 'User' role
    saveData();
  }
  return success;
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
        // Add more categories and permissions as needed
    ];
};

// --- Page CRUD (New) ---
export interface PageData {
    id: string;
    title: string;
    slug: string;
    blocks: Block[];
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    imageUrl?: string; // For social sharing, etc.
    settings?: Record<string, any>; // For page-specific settings like hero visibility
    heroSettings?: { // Specific for homepage hero
        enabled: boolean;
        articleSource: 'latest' | 'featured';
        intervalSeconds: number;
        maxArticles: number;
    };
    status: 'Taslak' | 'Hazır' | 'Yayınlandı'; // Status for pages
    createdAt: string;
    updatedAt: string;
}


let defaultMockPages: PageData[] = [
    {
        id: 'anasayfa',
        title: 'Anasayfa',
        slug: '', // Empty slug for homepage
        blocks: [
            { id: 'hpb-welcome', type: 'heading', level: 1, content: 'TeknoBiyo\'ya Hoş Geldiniz!' },
            { id: 'hpb-intro', type: 'text', content: 'Teknoloji ve biyoloji dünyasındaki en son gelişmeleri, derinlemesine analizleri ve ilgi çekici makaleleri keşfedin.' },
            { id: 'hp-section-hero', type: 'section', sectionType: 'hero-banner', settings: { title: "Ana Başlık", subtitle: "Alt Başlık" } },
            { id: 'hp-section-featured', type: 'section', sectionType: 'featured-articles', settings: { title: 'Öne Çıkanlar', count: 3 } },
            { id: 'hp-section-categories', type: 'section', sectionType: 'category-teaser', settings: { title: 'Kategoriler', techButtonLabel: 'Teknoloji', bioButtonLabel: 'Biyoloji'} },
            { id: 'hp-section-recent', type: 'section', sectionType: 'recent-articles', settings: { title: 'En Son Eklenenler', count: 3 } },
        ],
        seoTitle: 'TeknoBiyo | Teknoloji ve Biyoloji Makaleleri',
        seoDescription: 'Teknoloji ve biyoloji alanlarındaki en son gelişmeleri, derinlemesine analizleri ve ilgi çekici makaleleri keşfedin.',
        imageUrl: 'https://picsum.photos/seed/homepage-main/1200/600',
        heroSettings: { enabled: true, articleSource: 'featured', intervalSeconds: 5, maxArticles: 3 },
        status: 'Yayınlandı',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'hakkimizda',
        title: 'Hakkımızda',
        slug: 'hakkimizda',
        blocks: [
            { id: 'ab1', type: 'heading', level: 2, content: 'Biz Kimiz?' },
            { id: 'ab2', type: 'text', content: 'TeknoBiyo, teknoloji ve biyoloji dünyalarının kesişim noktasında yer alan, meraklı zihinler için hazırlanmış bir bilgi platformudur...' },
            { id: 'ab3', type: 'image', url: 'https://picsum.photos/seed/teamwork-page/800/600', alt: 'Ekip Çalışması', caption: 'Vizyonumuz' },
        ],
        seoTitle: 'Hakkımızda | TeknoBiyo',
        seoDescription: 'TeknoBiyo\'nun arkasındaki vizyonu, misyonu ve değerleri keşfedin.',
        imageUrl: 'https://picsum.photos/seed/aboutus-main/1200/600',
        status: 'Yayınlandı',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'iletisim',
        title: 'İletişim',
        slug: 'iletisim',
        blocks: [
            { id: 'cb1', type: 'heading', level: 2, content: 'Bizimle İletişime Geçin' },
            { id: 'cb2', type: 'text', content: 'Sorularınız, önerileriniz veya işbirliği talepleriniz için bize ulaşın.' },
            { id: 'cb-form', type: 'section', sectionType: 'contact-form', settings: { title: 'İletişim Formu', recipientEmail: 'iletisim@teknobiyo.example.com' } },
        ],
        seoTitle: 'İletişim | TeknoBiyo',
        seoDescription: 'TeknoBiyo ile iletişime geçin. Sorularınız ve önerileriniz için buradayız.',
        imageUrl: 'https://picsum.photos/seed/contactus-main/1200/600',
        status: 'Yayınlandı',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
     { // User Guide Page
        id: 'kullanim-kilavuzu',
        title: 'Kullanım Kılavuzu',
        slug: 'kullanim-kilavuzu', // Accessible by admin/editor
        blocks: [
            { id: 'kg1', type: 'heading', level: 1, content: 'TeknoBiyo Yönetim Paneli Kullanım Kılavuzu' },
            { id: 'kg2', type: 'text', content: 'Bu kılavuz, TeknoBiyo yönetim panelini etkili bir şekilde kullanmanıza yardımcı olmak için tasarlanmıştır.' },
            { id: 'kg3', type: 'heading', level: 2, content: '1. Giriş ve Gösterge Paneli' },
            { id: 'kg4', type: 'text', content: '- **Giriş Yapma:** Kullanıcı adı/e-posta ve şifrenizle giriş yapın.\n- **Gösterge Paneli:** Sitenizin genel istatistiklerini ve son aktiviteleri görüntüler.' },
            { id: 'kg5', type: 'heading', level: 2, content: '2. Makale Yönetimi' },
            { id: 'kg6', type: 'text', content: '- **Yeni Makale Ekleme:** "Yeni Makale Ekle" butonuna tıklayın. Başlık, kategori, içerik blokları ve SEO ayarlarını doldurun.\n- **Makale Düzenleme:** Listeden bir makale seçip düzenleme ikonuna tıklayın.\n- **Durum Yönetimi:** Makaleleri "Taslak", "İncelemede", "Hazır" (Admin/Editör önizlemesi için) veya "Yayınlandı" olarak ayarlayabilirsiniz.\n- **Öne Çıkarma/Hero:** Makaleleri anasayfada öne çıkarmak veya Hero bölümünde göstermek için ilgili seçenekleri işaretleyin.' },
             { id: 'kg7', type: 'image', url: 'https://picsum.photos/seed/admin-guide-article/800/400', alt: 'Makale Düzenleme Ekranı', caption: 'Makale düzenleme arayüzü.' },
            { id: 'kg8', type: 'heading', level: 2, content: '3. Biyoloji Notları Yönetimi' },
            { id: 'kg9', type: 'text', content: '- Makale yönetimine benzer şekilde biyoloji notları oluşturabilir, düzenleyebilirsiniz ve yayınlayabilirsiniz.\n- **AI Yardımcı:** Not oluştururken AI\'dan konuyla ilgili fikir ve taslak önerileri alabilirsiniz.' },
            { id: 'kg10', type: 'heading', level: 2, content: '4. Sayfa Yönetimi' },
            { id: 'kg11', type: 'text', content: '- "Anasayfa", "Hakkımızda" gibi statik sayfaların içeriklerini ve yapılarını düzenleyebilirsiniz.\n- **Canlı Önizleme:** Yaptığınız değişiklikleri sağ panelde anlık olarak görebilirsiniz.' },
            { id: 'kg12', type: 'heading', level: 2, content: '5. Kullanıcı ve Rol Yönetimi' },
            { id: 'kg13', type: 'text', content: '- Yeni kullanıcılar ekleyebilir, mevcut kullanıcıların bilgilerini ve rollerini düzenleyebilirsiniz.\n- Farklı kullanıcı rolleri (Admin, Editör, Kullanıcı) oluşturup bu rollere özel izinler atayabilirsiniz.' },
            { id: 'kg14', type: 'heading', level: 2, content: 'İpuçları' },
            { id: 'kg15', type: 'text', content: '- **Önizleme:** Değişikliklerinizi kaydetmeden veya yayınlamadan önce "Önizle" butonunu kullanarak nasıl görüneceğini kontrol edin.\n- **SEO:** Makale ve sayfalarınızın SEO ayarlarını (başlık, açıklama, anahtar kelimeler) doldurarak arama motorlarında daha iyi sıralamalar elde edebilirsiniz.\n- **Kategoriler ve Etiketler:** İçeriklerinizi düzenli tutmak ve kullanıcıların kolayca bulmasını sağlamak için kategorileri ve etiketleri etkili kullanın.' },
        ],
        seoTitle: 'Kullanım Kılavuzu | TeknoBiyo Admin',
        seoDescription: 'TeknoBiyo yönetim panelinin nasıl kullanılacağına dair rehber.',
        imageUrl: 'https://picsum.photos/seed/user-guide-main/1200/600',
        status: 'Hazır', // Only visible to Admin/Editor
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];
let mockPages: PageData[] = [];

const loadPageData = () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const storedPages = localStorage.getItem(PAGE_STORAGE_KEY);
        mockPages = storedPages ? JSON.parse(storedPages) : defaultMockPages;
        if (!storedPages) localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(mockPages));
    } else {
        mockPages = defaultMockPages;
    }
};
loadPageData(); // Load on initial import

const savePageData = () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(mockPages));
    }
};

export const getPages = async (): Promise<PageData[]> => {
    await delay(5);
    loadPageData(); // Ensure data is loaded before returning
    return JSON.parse(JSON.stringify(mockPages));
};

export const getPageById = async (id: string): Promise<PageData | null> => {
    await delay(5);
    loadPageData();
    const page = mockPages.find(p => p.id === id);
    return page ? JSON.parse(JSON.stringify(page)) : null;
};

export const createPage = async (data: Omit<PageData, 'id' | 'createdAt' | 'updatedAt'>): Promise<PageData> => {
    await delay(50);
    loadPageData();
    const newPage: PageData = {
        ...data,
        id: generateSlug(data.title) + '-' + Date.now().toString(36),
        slug: generateSlug(data.slug || data.title),
        status: data.status || 'Taslak', // Default to Taslak
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    if (mockPages.some(p => p.slug === newPage.slug && p.id !== newPage.id)) { // Check if slug exists for OTHER pages
        throw new Error(`"${newPage.slug}" URL metni ile başka bir sayfa zaten mevcut.`);
    }
    mockPages.push(newPage);
    savePageData();
    return JSON.parse(JSON.stringify(newPage));
};

export const updatePage = async (id: string, data: Partial<Omit<PageData, 'id' | 'createdAt'>>): Promise<PageData | null> => {
    await delay(50);
    loadPageData();
    const pageIndex = mockPages.findIndex(p => p.id === id);
    if (pageIndex === -1) return null;

    const existingPage = mockPages[pageIndex];
    let updatedSlug = existingPage.slug;
    if (data.slug && data.slug !== existingPage.slug) { // If slug is being changed
        updatedSlug = generateSlug(data.slug);
        if (mockPages.some(p => p.slug === updatedSlug && p.id !== id)) {
            throw new Error(`"${updatedSlug}" URL metni ile başka bir sayfa zaten mevcut.`);
        }
    }


    const updatedPage = {
        ...existingPage,
        ...data,
        slug: updatedSlug,
        updatedAt: new Date().toISOString(),
    };
    mockPages[pageIndex] = updatedPage;
    savePageData();
    return JSON.parse(JSON.stringify(updatedPage));
};

export const deletePage = async (id: string): Promise<boolean> => {
    await delay(80);
    loadPageData();
    if (id === 'anasayfa' || id === 'kullanim-kilavuzu') return false; // Prevent deletion of critical pages
    const initialLength = mockPages.length;
    mockPages = mockPages.filter(p => p.id !== id);
    const success = mockPages.length < initialLength;
    if (success) savePageData();
    return success;
};
// --- End Page CRUD ---


export const allMockTemplates: Template[] = [
    // Article Templates
    {
        id: 'standard-article',
        name: 'Standart Makale',
        description: 'Giriş, ana görsel, alt başlıklar ve sonuç bölümü içeren temel makale düzeni.',
        previewImageUrl: 'https://picsum.photos/seed/template-std-ai/300/200',
        type: 'article',
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
        type: 'article',
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
             { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-brain-sleep-img/600/300', alt: 'Uyuyan Kişi', caption: 'Uyku, öğrenmeyi pekiştirir ve beyni temizler.' },
             { id: generateId(), type: 'text', content: 'Uyku sırasında beyin, gün içinde öğrenilen bilgileri pekiştirir ve zararlı toksinleri temizler. Her gece 7-8 saat kesintisiz ve kaliteli uyku hedefleyin.' },
             { id: generateId(), type: 'divider'},
            { id: generateId(), type: 'heading', level: 2, content: `5. Sosyal Bağlantıları Koruyun` },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-brain-social-img/600/300', alt: 'Sohbet Eden Arkadaşlar', caption: 'Sosyal etkileşim beyin sağlığını destekler.' },
            { id: generateId(), type: 'text', content: 'Güçlü sosyal ilişkiler, stresi azaltmaya ve beyin sağlığını korumaya yardımcı olabilir. Aile ve arkadaşlarla zaman geçirmek, sosyal aktivitelere katılmak önemlidir.' },
             { id: generateId(), type: 'divider'},
            { id: generateId(), type: 'heading', level: 2, content: `6. Stresi Etkili Yönetin` },
             { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-brain-yoga-img/600/300', alt: 'Yoga Yapan Kişi', caption: 'Meditasyon ve rahatlama teknikleri stresi azaltır.' },
            { id: generateId(), type: 'text', content: 'Kronik stres, beyin hücrelerine zarar verebilir ve hafızayı olumsuz etkileyebilir. Meditasyon, yoga, doğa yürüyüşleri gibi rahatlama teknikleri stresi yönetmenize yardımcı olabilir.' },
             { id: generateId(), type: 'divider'},
            { id: generateId(), type: 'heading', level: 2, content: `7. Kronik Hastalıkları Kontrol Altında Tutun` },
            { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-brain-doctor-img/600/300', alt: 'Doktor ve Hasta', caption: 'Sağlık kontrollerinizi ihmal etmeyin.' },
            { id: generateId(), type: 'text', content: 'Yüksek tansiyon, diyabet, yüksek kolesterol gibi kronik sağlık sorunları beyin sağlığını olumsuz etkileyebilir. Bu hastalıkları doktorunuzun önerileri doğrultusunda kontrol altında tutmak önemlidir.' },
            { id: generateId(), type: 'text', content: 'Bu yöntemleri yaşam tarzınıza entegre ederek beyin sağlığınızı koruyabilir ve bilişsel yeteneklerinizi uzun yıllar boyunca sürdürebilirsiniz.'},
        ]
      },
      {
        id: 'image-gallery',
        name: 'Görsel Galerisi',
        description: 'Görsellerin ön planda olduğu, açıklamalı ve tematik galeri düzeni.',
        previewImageUrl: 'https://picsum.photos/seed/template-gallery-space/300/200',
        type: 'article',
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
        type: 'article',
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
        type: 'article',
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
        type: 'article',
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
    // --- Note Templates ---
   {
    id: 'note-basic-concept',
    name: 'Temel Kavram Notu',
    description: 'Bir biyoloji kavramını açıklayan, tanım ve anahtar noktaları içeren basit not düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/note-concept-dna/300/200',
    type: 'note',
    blocks: [
        { id: generateId(), type: 'heading', level: 2, content: '[Kavram Adı]' },
        { id: generateId(), type: 'text', content: '**Tanım:** [Kavramın kısa ve net tanımı buraya gelecek.]' },
        { id: generateId(), type: 'heading', level: 3, content: 'Anahtar Noktalar' },
        { id: generateId(), type: 'text', content: '- [Anahtar nokta 1]\n- [Anahtar nokta 2]\n- [Anahtar nokta 3]' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/note-concept-placeholder/600/300', alt: 'Kavramla İlgili Görsel', caption:'[Görsel açıklaması]' },
        { id: generateId(), type: 'heading', level: 3, content: 'Örnek/İlişkili Konular' },
        { id: generateId(), type: 'text', content: '[Kavramın anlaşıldığı bir örnek veya ilişkili diğer konular.]' },
    ]
   },
   {
    id: 'note-process-steps',
    name: 'Süreç Adımları Notu',
    description: 'Biyolojik bir süreci (örn. fotosentez, mitoz) adım adım açıklayan not düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/note-process-mitosis/300/200',
    type: 'note',
    blocks: [
        { id: generateId(), type: 'heading', level: 2, content: '[Süreç Adı]' },
        { id: generateId(), type: 'text', content: '[Sürecin genel bir özeti veya amacı.]' },
        { id: generateId(), type: 'heading', level: 3, content: 'Adım 1: [Adımın Adı]' },
        { id: generateId(), type: 'text', content: '[Adımın açıklaması.]' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/note-process-step1/500/250', alt: 'Adım 1 Görseli', caption:'[Adım 1 ile ilgili görsel]' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 3, content: 'Adım 2: [Adımın Adı]' },
        { id: generateId(), type: 'text', content: '[Adımın açıklaması.]' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/note-process-step2/500/250', alt: 'Adım 2 Görseli', caption:'[Adım 2 ile ilgili görsel]' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 3, content: '[... Diğer Adımlar ...]' },
        { id: generateId(), type: 'text', content: '[Sürecin sonucu veya önemi.]' },
    ]
   },
    {
    id: 'note-comparison',
    name: 'Karşılaştırma Notu',
    description: 'İki veya daha fazla biyolojik kavramı/yapıyı karşılaştıran not düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/note-compare-cells/300/200',
    type: 'note',
    blocks: [
        { id: generateId(), type: 'heading', level: 2, content: '[Kavram 1] ve [Kavram 2] Karşılaştırması' },
        { id: generateId(), type: 'text', content: '[Karşılaştırılan kavramların kısa bir tanıtımı.]' },
        { id: generateId(), type: 'heading', level: 3, content: 'Benzerlikler' },
        { id: generateId(), type: 'text', content: '- [Benzerlik 1]\n- [Benzerlik 2]' },
        { id: generateId(), type: 'heading', level: 3, content: 'Farklılıklar' },
        // Simple text-based table structure
        { id: generateId(), type: 'text', content: '**Özellik** | **[Kavram 1]** | **[Kavram 2]**' },
        { id: generateId(), type: 'text', content: '---|---|---' }, // Markdown table separator
        { id: generateId(), type: 'text', content: '[Farklılık 1] | [Kavram 1 Açıklama] | [Kavram 2 Açıklama]' },
        { id: generateId(), type: 'text', content: '[Farklılık 2] | [Kavram 1 Açıklama] | [Kavram 2 Açıklama]' },
        { id: generateId(), type: 'quote', content: '[Karşılaştırma ile ilgili önemli bir not veya özet.]', citation:'' },
    ]
   },
   // Page Templates
   ...defaultPageTemplates,
];


// Export loadData function for potential manual reloading if needed elsewhere
export { loadInitialData };

    