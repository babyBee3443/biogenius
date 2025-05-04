
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
    keywords?: string[];
    canonicalUrl?: string;
    authorId: string;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
}


// --- localStorage Setup ---
const LOCAL_STORAGE_KEY = 'teknobiyo_mock_articles';

// --- Initial Mock Data (Defaults if localStorage is empty) ---
const defaultMockArticles: ArticleData[] = [
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
        status: 'İncelemede',
        mainImageUrl: 'https://picsum.photos/seed/microbiome/600/400',
        seoTitle: 'Mikrobiyom: İçimizdeki Dünya | TeknoBiyo',
        seoDescription: 'İnsan vücudundaki mikroorganizmaların sağlığımız üzerindeki etkileri ve mikrobiyom dengesinin önemi.',
        slug: 'mikrobiyom-icimizdeki-dunya',
        isFeatured: false,
        keywords: ['mikrobiyom', 'bağırsak', 'sağlık', 'bakteri', 'probiyotik'],
        canonicalUrl: '',
        authorId: 'mock-editor',
        createdAt: '2024-07-21T08:00:00Z',
        updatedAt: '2024-07-22T16:45:00Z',
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
        keywords: ['kanser', 'immünoterapi', 'bağışıklık sistemi', 'tedavi'],
        canonicalUrl: '',
        authorId: 'mock-editor',
        createdAt: '2024-07-16T10:00:00Z',
        updatedAt: '2024-07-26T09:30:00Z',
    },

];

// --- In-Memory Data Store with localStorage Persistence ---
let mockArticles: ArticleData[] = [];

// Function to load data from localStorage or use defaults
const loadData = () => {
    // Check if running in a browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            try {
                mockArticles = JSON.parse(storedData);
                console.log("Loaded articles from localStorage.");
            } catch (error) {
                console.error("Error parsing localStorage data, using defaults:", error);
                mockArticles = defaultMockArticles;
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockArticles));
            }
        } else {
            console.log("No data in localStorage, using defaults.");
            mockArticles = defaultMockArticles;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockArticles));
        }
    } else {
        // Fallback for non-browser environments (e.g., server-side rendering build time)
        console.log("localStorage not available, using default data in memory.");
        mockArticles = defaultMockArticles;
    }
};

// Function to save data to localStorage
const saveData = () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockArticles));
            console.log("Saved articles to localStorage.");
        } catch (error) {
            console.error("Error saving data to localStorage:", error);
        }
    }
};

// Load data when the module is first imported in a browser context
loadData();


// --- CRUD Functions (Modified for localStorage) ---

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches all articles from the in-memory store.
 * @returns A promise that resolves to an array of ArticleData.
 */
export const getArticles = async (): Promise<ArticleData[]> => {
    await delay(50); // Shorter delay for reads
    // Return a deep copy to prevent direct modification
    return JSON.parse(JSON.stringify(mockArticles));
};

/**
 * Fetches a single article by its ID from the in-memory store.
 * @param id - The ID of the article to fetch.
 * @returns A promise that resolves to the ArticleData or null if not found.
 */
export const getArticleById = async (id: string): Promise<ArticleData | null> => {
    await delay(50);
    const article = mockArticles.find(article => article.id === id);
    // Return a deep copy
    return article ? JSON.parse(JSON.stringify(article)) : null;
};

/**
 * Creates a new article and saves it to the in-memory store and localStorage.
 * @param data - The data for the new article (without id, createdAt, updatedAt).
 * @returns A promise that resolves to the newly created ArticleData.
 */
export const createArticle = async (data: Omit<ArticleData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ArticleData> => {
    await delay(100); // Slightly longer delay for writes
    const newArticle: ArticleData = {
        ...data,
        id: `mock-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    mockArticles.push(newArticle);
    saveData(); // Save to localStorage
    console.log("Article created:", JSON.parse(JSON.stringify(newArticle)));
    return JSON.parse(JSON.stringify(newArticle));
};

/**
 * Updates an existing article in the in-memory store and localStorage.
 * @param id - The ID of the article to update.
 * @param data - The partial data to update the article with.
 * @returns A promise that resolves to the updated ArticleData or null if not found.
 */
export const updateArticle = async (id: string, data: Partial<Omit<ArticleData, 'id' | 'createdAt'>>): Promise<ArticleData | null> => {
    await delay(100);
    const articleIndex = mockArticles.findIndex(article => article.id === id);
    if (articleIndex === -1) {
        console.error("Article not found for update:", id);
        return null;
    }

    // Update the article
    mockArticles[articleIndex] = {
        ...mockArticles[articleIndex],
        ...data,
        updatedAt: new Date().toISOString(),
    };

    saveData(); // Save to localStorage
    console.log("Article updated:", JSON.parse(JSON.stringify(mockArticles[articleIndex])));
    return JSON.parse(JSON.stringify(mockArticles[articleIndex]));
};

/**
 * Deletes an article by its ID from the in-memory store and localStorage.
 * @param id - The ID of the article to delete.
 * @returns A promise that resolves to true if deletion was successful, false otherwise.
 */
export const deleteArticle = async (id: string): Promise<boolean> => {
    await delay(150);
    const initialLength = mockArticles.length;
    mockArticles = mockArticles.filter(article => article.id !== id);
    const success = mockArticles.length < initialLength;
    if (success) {
        saveData(); // Save to localStorage
        console.log("Article deleted:", id);
    } else {
        console.error("Article not found for deletion:", id);
    }
    return success;
};

// Function to generate slugs (remains the same)
export const generateSlug = (text: string) => {
    return text
        .toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-').replace(/-+/g, '-');
};

// Export the loadData function if manual reloading is needed elsewhere (optional)
export { loadData as reloadMockData };
