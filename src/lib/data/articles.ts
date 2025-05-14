
import type { Block } from "@/components/admin/template-selector";
import { generateId } from '@/lib/utils'; // Import from utils

// --- Article Data Structure ---
export interface ArticleData {
    id: string;
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

export const ARTICLE_STORAGE_KEY = 'biyohox_mock_articles_v3';
let mockArticles: ArticleData[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getArticles = async (): Promise<ArticleData[]> => {
    await delay(10);
    if (typeof window !== 'undefined') {
        const storedArticles = localStorage.getItem(ARTICLE_STORAGE_KEY);
        if (storedArticles) {
            try {
                const parsedArticles = JSON.parse(storedArticles);
                if (Array.isArray(parsedArticles)) {
                    mockArticles = parsedArticles;
                    return parsedArticles;
                }
            } catch (e) {
                console.error("Error parsing articles from localStorage", e);
            }
        }
    }
    return mockArticles;
};

export const initializeArticles = (initialArticles: ArticleData[]) => {
    mockArticles = initialArticles;
    if (typeof window !== 'undefined') {
        localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(mockArticles));
    }
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
        isFeatured: data.isFeatured ?? false,
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
