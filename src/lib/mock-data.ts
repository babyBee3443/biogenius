import type { Block } from "@/components/admin/template-selector";

// --- Article Data Structure ---
export interface ArticleData {
    id: string;
    title: string;
    excerpt?: string;
    blocks: Block[];
    category: 'Teknoloji' | 'Biyoloji';
    status: 'Taslak' | 'İncelemede' | 'Yayınlandı' | 'Arşivlendi';
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
    category: string; // e.g., "Hücre Biyolojisi", "Genetik"
    level: 'Lise 9' | 'Lise 10' | 'Lise 11' | 'Lise 12' | 'Genel'; // Example levels
    tags: string[]; // e.g., ["hücre zarı", "organeller", "mitoz"]
    summary: string; // Short summary of the note
    contentBlocks: Block[]; // Use the same Block type for content
    relatedNotes?: string[]; // IDs of related notes
    imageUrl?: string | null; // Optional image for the note card
    createdAt: string;
    updatedAt: string;
}


// --- localStorage Setup ---
const ARTICLE_STORAGE_KEY = 'teknobiyo_mock_articles';
const NOTE_STORAGE_KEY = 'teknobiyo_mock_notes'; // New key for notes

// --- Initial Mock Data (Articles) ---
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
        authorId: 'mock-admin',
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
        status: 'Yayınlandı',
        mainImageUrl: 'https://picsum.photos/seed/crispr/600/400',
        seoTitle: 'Gen Düzenleme Teknolojileri | TeknoBiyo',
        seoDescription: 'CRISPR ve diğer gen düzenleme araçlarının bilim ve tıp üzerindeki etkileri.',
        slug: 'gen-duzenleme-teknolojileri',
        isFeatured: false,
        isHero: false,
        keywords: ['crispr', 'genetik', 'biyoteknoloji'],
        canonicalUrl: '',
        authorId: 'mock-editor',
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
        authorId: 'mock-editor',
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
        authorId: 'mock-admin',
        createdAt: '2024-06-15T14:00:00Z',
        updatedAt: '2024-07-01T10:00:00Z',
    },
    {
        id: '3',
        title: 'Kuantum Bilgisayarlar',
        excerpt: 'Hesaplamanın geleceği...',
        blocks: [],
        category: 'Teknoloji',
        status: 'Taslak',
        mainImageUrl: 'https://picsum.photos/seed/quantum/600/400',
        seoTitle: 'Kuantum Bilgisayarlar | TeknoBiyo',
        seoDescription: 'Kuantum mekaniği prensiplerini kullanan yeni nesil hesaplama makineleri.',
        slug: 'kuantum-bilgisayarlar',
        isFeatured: false,
        isHero: false,
        keywords: ['kuantum', 'hesaplama', 'kübit'],
        canonicalUrl: '',
        authorId: 'mock-admin',
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
        authorId: 'mock-editor',
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
        authorId: 'mock-admin',
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
        authorId: 'mock-editor',
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
        authorId: 'mock-admin',
        createdAt: '2025-05-04T20:48:22.265Z',
        updatedAt: '2025-05-04T20:48:22.265Z'
    },

];

// Ensure defaultMockArticles has the new field even if localStorage doesn't
defaultMockArticles = defaultMockArticles.map(article => ({
    ...article,
    isHero: article.isHero ?? false, // Add default if missing
}));

// --- Initial Mock Data (Biology Notes) ---
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
        createdAt: '2024-07-27T14:00:00Z',
        updatedAt: '2024-07-27T15:30:00Z',
    },
        {
        id: 'note-dna-replikasyonu',
        title: 'DNA Replikasyonu (Eşlenmesi)',
        slug: 'dna-replikasyonu-eslenmesi',
        category: 'Genetik',
        level: 'Lise 12', // Example: More advanced topic
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
        createdAt: '2024-07-29T09:00:00Z',
        updatedAt: '2024-07-29T09:30:00Z',
    },
];


// --- In-Memory Data Stores with localStorage Persistence ---
let mockArticles: ArticleData[] = [];
let mockNotes: NoteData[] = []; // New store for notes

// Function to load data from localStorage or use defaults
const loadData = () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        // Load Articles
        const storedArticles = localStorage.getItem(ARTICLE_STORAGE_KEY);
        if (storedArticles) {
            try {
                const parsedData: ArticleData[] = JSON.parse(storedArticles);
                mockArticles = parsedData.map(article => ({
                    ...article,
                    isHero: article.isHero ?? false,
                }));
            } catch (error) {
                console.error("Error parsing article localStorage data, using defaults:", error);
                mockArticles = defaultMockArticles;
                localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(mockArticles));
            }
        } else {
            mockArticles = defaultMockArticles;
            localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(mockArticles));
        }

        // Load Notes
        const storedNotes = localStorage.getItem(NOTE_STORAGE_KEY);
        if (storedNotes) {
             try {
                mockNotes = JSON.parse(storedNotes);
             } catch (error) {
                 console.error("Error parsing note localStorage data, using defaults:", error);
                 mockNotes = defaultMockNotes;
                 localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(mockNotes));
             }
        } else {
             mockNotes = defaultMockNotes;
             localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(mockNotes));
        }

    } else {
        // Fallback for non-browser environments
        mockArticles = defaultMockArticles;
        mockNotes = defaultMockNotes;
    }
};

// Function to save data to localStorage
const saveData = () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(mockArticles));
            localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(mockNotes)); // Save notes
        } catch (error) {
            console.error("Error saving data to localStorage:", error);
        }
    }
};

// Load data when the module is first imported in a browser context
loadData();


// --- CRUD Functions (Articles) ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getArticles = async (): Promise<ArticleData[]> => {
    await delay(10);
    loadData();
    return JSON.parse(JSON.stringify(mockArticles));
};

export const getArticleById = async (id: string): Promise<ArticleData | null> => {
    await delay(10);
    loadData();
    const article = mockArticles.find(article => article.id === id);
    return article ? JSON.parse(JSON.stringify(article)) : null;
};

export const createArticle = async (data: Omit<ArticleData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ArticleData> => {
    await delay(50);
    loadData();
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
    loadData();
    const articleIndex = mockArticles.findIndex(article => article.id === id);
    if (articleIndex === -1) {
        return null;
    }
    const updatedArticle = {
        ...mockArticles[articleIndex],
        ...data,
        updatedAt: new Date().toISOString(),
    };
    mockArticles[articleIndex] = updatedArticle;
    saveData();
    return JSON.parse(JSON.stringify(updatedArticle));
};

export const deleteArticle = async (id: string): Promise<boolean> => {
    await delay(80);
    loadData();
    const initialLength = mockArticles.length;
    mockArticles = mockArticles.filter(article => article.id !== id);
    const success = mockArticles.length < initialLength;
    if (success) {
        saveData();
    }
    return success;
};

// --- CRUD Functions (Notes) ---

/**
 * Fetches all biology notes.
 */
export const getNotes = async (): Promise<NoteData[]> => {
    await delay(10);
    loadData();
    return JSON.parse(JSON.stringify(mockNotes));
};

/**
 * Fetches a single biology note by its ID.
 */
export const getNoteById = async (id: string): Promise<NoteData | null> => {
    await delay(10);
    loadData();
    const note = mockNotes.find(note => note.id === id);
    return note ? JSON.parse(JSON.stringify(note)) : null;
};

/**
 * Creates a new biology note.
 */
export const createNote = async (data: Omit<NoteData, 'id' | 'createdAt' | 'updatedAt'>): Promise<NoteData> => {
    await delay(50);
    loadData();
    const newNote: NoteData = {
        ...data,
        id: `note-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    mockNotes.push(newNote);
    saveData();
    return JSON.parse(JSON.stringify(newNote));
};

/**
 * Updates an existing biology note.
 */
export const updateNote = async (id: string, data: Partial<Omit<NoteData, 'id' | 'createdAt'>>): Promise<NoteData | null> => {
    await delay(50);
    loadData();
    const noteIndex = mockNotes.findIndex(note => note.id === id);
    if (noteIndex === -1) {
        return null;
    }
    const updatedNote = {
        ...mockNotes[noteIndex],
        ...data,
        updatedAt: new Date().toISOString(),
    };
    mockNotes[noteIndex] = updatedNote;
    saveData();
    return JSON.parse(JSON.stringify(updatedNote));
};

/**
 * Deletes a biology note by its ID.
 */
export const deleteNote = async (id: string): Promise<boolean> => {
    await delay(80);
    loadData();
    const initialLength = mockNotes.length;
    mockNotes = mockNotes.filter(note => note.id !== id);
    const success = mockNotes.length < initialLength;
    if (success) {
        saveData();
    }
    return success;
};


// Function to generate slugs
export const generateSlug = (text: string) => {
    return text
        .toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-').replace(/-+/g, '-');
};

export { loadData as reloadMockData };
