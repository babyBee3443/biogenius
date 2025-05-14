
import type { Block } from "@/components/admin/template-selector";
import { generateId } from '@/lib/mock-data';

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
    authorId?: string; // Made optional, will default if not provided
    status?: 'Taslak' | 'İncelemede' | 'Hazır' | 'Yayınlandı' | 'Arşivlendi'; // Made optional
    createdAt: string;
    updatedAt: string;
}

export const NOTE_STORAGE_KEY = 'biyohox_mock_notes_v3';
let mockNotes: NoteData[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getNotes = async (): Promise<NoteData[]> => {
    await delay(10);
    if (typeof window !== 'undefined') {
        const storedNotes = localStorage.getItem(NOTE_STORAGE_KEY);
        if (storedNotes) {
            try {
                const parsedNotes = JSON.parse(storedNotes);
                if (Array.isArray(parsedNotes)) {
                    mockNotes = parsedNotes;
                    return parsedNotes;
                }
            } catch (e) {
                 console.error("Error parsing notes from localStorage", e);
            }
        }
    }
    return mockNotes;
};

export const initializeNotes = (initialNotes: NoteData[]) => {
    mockNotes = initialNotes;
     if (typeof window !== 'undefined') {
        localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(mockNotes));
    }
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
        id: generateId(),
        status: 'Taslak',
        authorId: data.authorId || 'admin001',
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
