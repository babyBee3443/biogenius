
import type { Block } from "@/components/admin/template-selector"; // Assuming Block might be needed indirectly or for consistency
import { generateSlug } from '@/lib/mock-data'; // Assuming generateSlug remains in mock-data or is moved to a utils file

// --- Category Data Structure ---
export interface Category {
    id: string;
    name: string;
}

// Storage Key (centralized in mock-data.ts, but good to be aware of)
export const CATEGORY_STORAGE_KEY = 'biyohox_mock_categories_v3';

// In-memory cache
let mockCategories: Category[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Category CRUD ---
export const getCategories = async (): Promise<Category[]> => {
    await delay(5);
    if (typeof window !== 'undefined') {
        const storedCategories = localStorage.getItem(CATEGORY_STORAGE_KEY);
        if (storedCategories) {
            try {
                const parsedCategories = JSON.parse(storedCategories);
                if (Array.isArray(parsedCategories)) {
                    mockCategories = parsedCategories;
                    return parsedCategories;
                }
            } catch (e) {
                console.error("Error parsing categories from localStorage", e);
            }
        }
    }
    // Fallback or initial load if nothing in localStorage or not in browser
    // This might be initialized by loadInitialData in mock-data.ts
    return mockCategories;
};

export const initializeCategories = (initialCategories: Category[]) => {
    mockCategories = initialCategories;
     if (typeof window !== 'undefined') {
        localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(mockCategories));
    }
};


export const addCategory = async (data: Omit<Category, 'id'>): Promise<Category> => {
    await delay(30);
    const newCategory: Category = {
        ...data,
        id: generateSlug(data.name) + '-' + Date.now().toString(36).slice(-6),
    };
    const currentCategories = await getCategories(); // Ensures we're working with the latest from localStorage if available
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
