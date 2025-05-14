
import type { Block } from "@/components/admin/template-selector";
import { initializeArticles, ARTICLE_STORAGE_KEY } from "./data/articles";
import { initializeNotes, NOTE_STORAGE_KEY } from "./data/notes";
import { initializeCategories, CATEGORY_STORAGE_KEY } from "./data/categories";
import { initializeUsers, USER_STORAGE_KEY, type User } from "./data/users";
import { initializeRoles, ROLE_STORAGE_KEY, baseMockRoles as baseRolesForInit } from "./data/roles";
import { initializePages, PAGE_STORAGE_KEY, defaultMockPages } from "./data/pages";
import { initializeTemplates, TEMPLATE_STORAGE_KEY, ALL_MOCK_TEMPLATES_SOURCE } from "./data/templates";

// --- Shared Utility Functions ---
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateSlug = (text: string) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-').replace(/-+/g, '-');
};

export const generateId = () => `mock-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`;

// --- Shared Constants ---
export const PREVIEW_STORAGE_KEY = 'preview_data';


// --- Centralized Data Initialization ---
export const loadInitialData = () => {
    if (typeof window !== 'undefined') {
        const initOrVerify = (key: string, defaultDataFactory: () => any[], initializer: (data: any[]) => void, isBaseData: boolean = false) => {
            let dataToInitialize = defaultDataFactory();
            const stored = localStorage.getItem(key);
            if (stored && !isBaseData) {
                try {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) {
                        dataToInitialize = parsed;
                    }
                } catch (e) {
                    console.warn(`Error parsing ${key} from localStorage, using defaults.`, e);
                }
            }
            initializer(dataToInitialize); // This will also set it in localStorage via the specific initializer
        };

        // Initialize each data type
        initOrVerify(ARTICLE_STORAGE_KEY, () => [], initializeArticles);
        initOrVerify(NOTE_STORAGE_KEY, () => [], initializeNotes);
        initOrVerify(CATEGORY_STORAGE_KEY, () => [], initializeCategories);
        
        // User and Role initialization needs careful handling for default admin
        const defaultAdminUser: User = {
             id: 'admin001', name: 'Admin User', username: 'admin',
             email: 'admin@biyohox.example.com', role: 'Admin', // Ensure role is 'Admin' string
             joinedAt: new Date().toISOString(),
             avatar: 'https://picsum.photos/seed/admin-avatar/128/128'
        };

        let currentUsers = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]') as User[];
        const adminExists = currentUsers.some(u => u.id === 'admin001');
        if (!adminExists) {
            currentUsers = [defaultAdminUser, ...currentUsers.filter(u => u.id !== 'admin001')];
        }
        initializeUsers(currentUsers);


        // Role initialization: always ensure base roles have permissions from code
        const rolesFromStorage = JSON.parse(localStorage.getItem(ROLE_STORAGE_KEY) || '[]');
        const usersForRoleCount = currentUsers; // Use the most up-to-date user list

        const initializedRoles = baseRolesForInit.map(baseRoleDef => {
            const storedRole = rolesFromStorage.find((sr: any) => sr.id === baseRoleDef.id || sr.name.toLowerCase() === baseRoleDef.name.toLowerCase());
            const count = usersForRoleCount.filter(u => u.role.trim().toLowerCase() === baseRoleDef.name.trim().toLowerCase() || u.role.trim().toLowerCase() === baseRoleDef.id.trim().toLowerCase()).length;
            return {
                ...baseRoleDef, // id, name, permissions from code
                description: storedRole?.description || baseRoleDef.description,
                userCount: count,
            };
        });

        rolesFromStorage.forEach((storedRole: any) => {
            if (!initializedRoles.some(ir => ir.id === storedRole.id || ir.name.toLowerCase() === storedRole.name.toLowerCase())) {
                 const count = usersForRoleCount.filter(u => u.role.trim().toLowerCase() === storedRole.name.trim().toLowerCase() || u.role.trim().toLowerCase() === storedRole.id.trim().toLowerCase()).length;
                initializedRoles.push({...storedRole, userCount: count});
            }
        });
        initializeRoles(initializedRoles);


        initOrVerify(PAGE_STORAGE_KEY, () => [...defaultMockPages], initializePages, true); // Pass true for base data
        initOrVerify(TEMPLATE_STORAGE_KEY, () => [...ALL_MOCK_TEMPLATES_SOURCE.map(t => ({...t}))], initializeTemplates, true); // Pass true for base data

        // Re-check currentUser to ensure Header updates if admin was just created
        const currentUserString = localStorage.getItem('currentUser');
        if (!currentUserString && adminExists && currentUsers.find(u=>u.id === 'admin001')) {
             // If no currentUser but admin001 exists, maybe set it for dev convenience?
             // localStorage.setItem('currentUser', JSON.stringify(defaultAdminUser));
             // window.dispatchEvent(new CustomEvent('currentUserUpdated'));
        } else if (currentUserString) {
             window.dispatchEvent(new CustomEvent('currentUserUpdated'));
        }
    }
};

// Run initial data load on script evaluation if in browser
if (typeof window !== 'undefined') {
    loadInitialData();
}

// Export for manual reloading if needed
export { loadInitialData as reloadMockData };

// Re-export commonly used types for convenience, though direct imports are preferred
export type { Category } from './data/categories';
export type { ArticleData } from './data/articles';
export type { NoteData } from './data/notes';
export type { User } from './data/users';
export type { Role, Permission, PermissionCategory } from './data/roles';
export type { PageData } from './data/pages';
export type { Template } from './data/templates';

// Re-export commonly used functions (optional, direct imports from ./data/* are better)
export { getCategories, addCategory, updateCategory, deleteCategory } from './data/categories';
export { getArticles, getArticleById, createArticle, updateArticle, deleteArticle } from './data/articles';
export { getNotes, getNoteById, createNote, updateNote, deleteNote } from './data/notes';
export { getUsers, getUserById, createUser, updateUser, deleteUser } from './data/users';
export { getRoles, getRoleById, createRole, updateRole, deleteRole, getAllPermissions } from './data/roles';
export { getPages, getPageById, createPage, updatePage, deletePage } from './data/pages';
export { allMockTemplatesGetter } from './data/templates';
