
import type { Block } from "@/components/admin/template-selector";
import { generateId, generateSlug } from '@/lib/mock-data';

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

export const PAGE_STORAGE_KEY = 'biyohox_mock_pages_v3';

// Initial default pages
export const defaultMockPages: PageData[] = [
    {
        id: 'anasayfa',
        title: 'Anasayfa',
        slug: '', // Root path
        blocks: [
            { id: generateId(), type: 'text', content: 'BiyoHox\'a hoş geldiniz! İçeriğinizi buraya ekleyebilirsiniz.' }
        ],
        status: 'Yayınlandı',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        heroSettings: { enabled: true, articleSource: 'latest', intervalSeconds: 5, maxArticles: 3 }
    },
    {
        id: 'hakkimizda',
        title: 'Hakkımızda',
        slug: 'hakkimizda',
        blocks: [{id: generateId(), type: 'text', content: 'Hakkımızda sayfa içeriği buraya gelecek.'}],
        status: 'Yayınlandı',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'iletisim',
        title: 'İletişim',
        slug: 'iletisim',
        blocks: [{id: generateId(), type: 'text', content: 'İletişim sayfa içeriği buraya gelecek.'}],
        status: 'Yayınlandı',
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


let mockPages: PageData[] = [...defaultMockPages]; // Initialize with defaults

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getPages = async (): Promise<PageData[]> => {
    await delay(5);
    if (typeof window !== 'undefined') {
        const storedPages = localStorage.getItem(PAGE_STORAGE_KEY);
        if (storedPages) {
            try {
                const parsedPages = JSON.parse(storedPages);
                if (Array.isArray(parsedPages)) {
                     // Ensure default pages exist if not in localStorage
                    const allPages = [...defaultMockPages];
                    parsedPages.forEach(p => {
                        const index = allPages.findIndex(dp => dp.id === p.id);
                        if (index !== -1) allPages[index] = { ...allPages[index], ...p }; // Merge, keeping default structure
                        else allPages.push(p);
                    });
                    mockPages = allPages;
                    return allPages;
                }
            } catch (e) {
                console.error("Error parsing pages from localStorage", e);
            }
        }
    }
     // If not in browser or localStorage is empty/invalid, return default and ensure it's in memory
    mockPages = [...defaultMockPages];
    return mockPages;
};

export const initializePages = (initialPages: PageData[]) => {
    // Ensure default pages are always present and merge with initialPages
    const allPagesMap = new Map<string, PageData>();
    defaultMockPages.forEach(page => allPagesMap.set(page.id, page));
    initialPages.forEach(page => allPagesMap.set(page.id, { ...allPagesMap.get(page.id), ...page }));
    
    mockPages = Array.from(allPagesMap.values());

    if (typeof window !== 'undefined') {
        localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(mockPages));
    }
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
        id: generateSlug(data.title) + '-' + Date.now().toString(36).slice(-6),
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
    // Prevent deletion of core pages
    if (['anasayfa', 'hakkimizda', 'iletisim', 'kullanim-kilavuzu'].includes(id)) {
        console.warn(`Core page "${id}" cannot be deleted.`);
        return false;
    }
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
