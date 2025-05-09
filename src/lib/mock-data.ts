
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
  category?: 'Teknoloji' | 'Biyoloji' | 'Genel Sayfa';
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


// No more localStorage keys for mock data
// No more defaultMock... arrays
// No more loadInitialData or saveData related to mock content

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

// --- Category CRUD ---
export const getCategories = async (): Promise<Category[]> => {
    await delay(5);
    // In a real app, fetch from backend API
    console.warn("getCategories: Fetching mock data. Implement backend integration.");
    return [];
};

export const addCategory = async (data: Omit<Category, 'id'>): Promise<Category> => {
    await delay(30);
    console.warn("addCategory: Simulating backend. Implement backend integration.");
    // Simulate successful creation for UI testing, but data won't persist without backend
    const newCategory: Category = {
        ...data,
        id: generateSlug(data.name) + '-' + Date.now().toString(36),
    };
    // mockCategories.push(newCategory); // No longer mutating in-memory array
    return JSON.parse(JSON.stringify(newCategory));
};

export const updateCategory = async (id: string, data: Partial<Omit<Category, 'id'>>): Promise<Category | null> => {
    await delay(30);
    console.warn("updateCategory: Simulating backend. Implement backend integration.");
    // Simulate update
    const updatedCategory: Category = {
        id,
        name: data.name || "Updated Category",
        ...data,
    } as Category;
    return JSON.parse(JSON.stringify(updatedCategory));
};

export const deleteCategory = async (id: string): Promise<boolean> => {
    await delay(50);
    console.warn("deleteCategory: Simulating backend. Implement backend integration.");
    return true; // Simulate success
};

// --- Article CRUD ---
export const getArticles = async (): Promise<ArticleData[]> => {
    await delay(10);
    console.warn("getArticles: Fetching mock data. Implement backend integration.");
    return [];
};

export const getArticleById = async (id: string): Promise<ArticleData | null> => {
    await delay(10);
    console.warn(`getArticleById(${id}): Fetching mock data. Implement backend integration.`);
    return null;
};

export const createArticle = async (data: Omit<ArticleData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ArticleData> => {
    await delay(50);
    console.warn("createArticle: Simulating backend. Implement backend integration.");
    const newArticle: ArticleData = {
        ...data,
        isHero: data.isHero ?? false,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(newArticle));
};

export const updateArticle = async (id: string, data: Partial<Omit<ArticleData, 'id' | 'createdAt'>>): Promise<ArticleData | null> => {
    await delay(50);
    console.warn(`updateArticle(${id}): Simulating backend. Implement backend integration.`);
    const updatedArticle: ArticleData = {
        id,
        title: data.title || "Updated Title",
        category: data.category || "Teknoloji",
        status: data.status || "Taslak",
        authorId: data.authorId || "mock-admin",
        blocks: data.blocks || [],
        slug: data.slug || generateSlug(data.title || "updated-title"),
        isFeatured: data.isFeatured || false,
        isHero: data.isHero || false,
        createdAt: new Date().toISOString(), // This should be original creation date
        updatedAt: new Date().toISOString(),
        mainImageUrl: data.mainImageUrl === undefined ? null : data.mainImageUrl,
        ...data,
    };
    return JSON.parse(JSON.stringify(updatedArticle));
};

export const deleteArticle = async (id: string): Promise<boolean> => {
    await delay(80);
    console.warn(`deleteArticle(${id}): Simulating backend. Implement backend integration.`);
    return true; // Simulate success
};

// --- Note CRUD ---
export const getNotes = async (): Promise<NoteData[]> => {
    await delay(10);
    console.warn("getNotes: Fetching mock data. Implement backend integration.");
    return [];
};

export const getNoteById = async (id: string): Promise<NoteData | null> => {
    await delay(10);
    console.warn(`getNoteById(${id}): Fetching mock data. Implement backend integration.`);
    return null;
};

export const createNote = async (data: Omit<NoteData, 'id' | 'createdAt' | 'updatedAt'>): Promise<NoteData> => {
    await delay(50);
    console.warn("createNote: Simulating backend. Implement backend integration.");
    const newNote: NoteData = {
        ...data,
        id: `note-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`,
        status: data.status || 'Taslak',
        authorId: data.authorId || 'u1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(newNote));
};

export const updateNote = async (id: string, data: Partial<Omit<NoteData, 'id' | 'createdAt'>>): Promise<NoteData | null> => {
    await delay(50);
    console.warn(`updateNote(${id}): Simulating backend. Implement backend integration.`);
    const updatedNote: NoteData = {
        id,
        title: data.title || "Updated Note Title",
        slug: data.slug || generateSlug(data.title || "updated-note"),
        category: data.category || "Genel",
        level: data.level || "Lise 9",
        tags: data.tags || [],
        summary: data.summary || "",
        contentBlocks: data.contentBlocks || [],
        authorId: data.authorId || "u1",
        status: data.status || "Taslak",
        createdAt: new Date().toISOString(), // This should be original creation date
        updatedAt: new Date().toISOString(),
        ...data,
    };
    return JSON.parse(JSON.stringify(updatedNote));
};

export const deleteNote = async (id: string): Promise<boolean> => {
    await delay(80);
    console.warn(`deleteNote(${id}): Simulating backend. Implement backend integration.`);
    return true;
};

// --- User CRUD Functions ---
export const getUsers = async (): Promise<User[]> => {
    await delay(10);
    console.warn("getUsers: Fetching mock data. Implement backend integration.");
    // Return a default admin user if local storage is empty for login purposes.
    if (typeof window !== 'undefined' && !localStorage.getItem(USER_STORAGE_KEY)) {
        const defaultAdmin: User = {
            id: 'superadmin',
            name: 'Super Admin',
            username: 'superadmin',
            email: 'superadmin@teknobiyo.example.com',
            role: 'Admin',
            joinedAt: '2024-01-01T00:00:00Z',
            avatar: 'https://picsum.photos/seed/superadmin/128/128',
            lastLogin: new Date().toISOString(),
            bio: 'Sistem Yöneticisi.',
        };
        return [defaultAdmin];
    }
    // Attempt to get from local storage if it exists from previous versions (for migration)
    // or return empty if we are truly dynamic
    if (typeof window !== 'undefined') {
        const storedUsers = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUsers) return JSON.parse(storedUsers);
    }
    return [];
};

export const getUserById = async (id: string): Promise<User | null> => {
    await delay(10);
    console.warn(`getUserById(${id}): Fetching mock data. Implement backend integration.`);
     if (id === 'superadmin' && typeof window !== 'undefined' && !localStorage.getItem(USER_STORAGE_KEY)) {
        return {
            id: 'superadmin',
            name: 'Super Admin',
            username: 'superadmin',
            email: 'superadmin@teknobiyo.example.com',
            role: 'Admin',
            joinedAt: '2024-01-01T00:00:00Z',
            avatar: 'https://picsum.photos/seed/superadmin/128/128',
            lastLogin: new Date().toISOString(),
            bio: 'Sistem Yöneticisi.',
        };
    }
    if (typeof window !== 'undefined') {
        const storedUsers = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUsers) {
            const users: User[] = JSON.parse(storedUsers);
            return users.find(u => u.id === id) || null;
        }
    }
    return null;
};

export const createUser = async (data: Omit<User, 'id' | 'joinedAt' | 'lastLogin'>): Promise<User> => {
    await delay(50);
    console.warn("createUser: Simulating backend. Implement backend integration.");
    const newUser: User = {
        ...data,
        id: `user-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`,
        joinedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        avatar: data.avatar || `https://picsum.photos/seed/${data.username || 'avatar'}/128/128`,
    };
    return JSON.parse(JSON.stringify(newUser));
};

export const updateUser = async (id: string, data: Partial<Omit<User, 'id' | 'joinedAt' | 'email'>>): Promise<User | null> => {
    await delay(50);
    console.warn(`updateUser(${id}): Simulating backend. Implement backend integration.`);
    const updatedUser: User = {
        id,
        name: data.name || "Updated User",
        username: data.username || "updateduser",
        email: "user@example.com", // Email should not be updated this way typically
        role: data.role || "User",
        joinedAt: new Date().toISOString(), // Should be original
        ...data,
    } as User;
    return JSON.parse(JSON.stringify(updatedUser));
};

export const deleteUser = async (id: string): Promise<boolean> => {
  await delay(80);
  console.warn(`deleteUser(${id}): Simulating backend. Implement backend integration.`);
  return true;
};


// --- Role CRUD Functions ---
export const getRoles = async (): Promise<Role[]> => {
  await delay(10);
  console.warn("getRoles: Fetching mock data. Implement backend integration.");
   if (typeof window !== 'undefined' && !localStorage.getItem(ROLE_STORAGE_KEY)) {
        return [
            { id: 'admin', name: 'Admin', description: 'Tam sistem erişimi.', permissions: ['Dashboard Görüntüleme', 'Makaleleri Görüntüleme', 'Kullanıcıları Görüntüleme', 'Rolleri Yönetme', 'Ayarları Görüntüleme'], userCount: 1 },
            { id: 'editor', name: 'Editor', description: 'İçerik yönetimi.', permissions: ['Dashboard Görüntüleme', 'Makaleleri Görüntüleme'], userCount: 0 },
            { id: 'user', name: 'User', description: 'Standart kullanıcı.', permissions: [], userCount: 0 },
        ];
    }
    if (typeof window !== 'undefined') {
        const storedRoles = localStorage.getItem(ROLE_STORAGE_KEY);
        if (storedRoles) return JSON.parse(storedRoles);
    }
  return [];
};

export const getRoleById = async (id: string): Promise<Role | null> => {
  await delay(10);
  console.warn(`getRoleById(${id}): Fetching mock data. Implement backend integration.`);
   if (typeof window !== 'undefined') {
        const storedRoles = localStorage.getItem(ROLE_STORAGE_KEY);
        if (storedRoles) {
            const roles: Role[] = JSON.parse(storedRoles);
            return roles.find(r => r.id === id) || null;
        }
         // Fallback if no roles in local storage
        if (id === 'admin') return { id: 'admin', name: 'Admin', description: 'Tam sistem erişimi.', permissions: ['Dashboard Görüntüleme', 'Makaleleri Görüntüleme', 'Kullanıcıları Görüntüleme', 'Rolleri Yönetme', 'Ayarları Görüntüleme'], userCount: 1 };
    }
  return null;
};

export const createRole = async (data: Omit<Role, 'id' | 'userCount'>): Promise<Role> => {
  await delay(50);
  console.warn("createRole: Simulating backend. Implement backend integration.");
  const newRole: Role = {
    ...data,
    id: generateSlug(data.name) + '-' + Date.now().toString(36),
    userCount: 0,
  };
  return JSON.parse(JSON.stringify(newRole));
};

export const updateRole = async (id: string, data: Partial<Omit<Role, 'id' | 'userCount'>>): Promise<Role | null> => {
  await delay(50);
  console.warn(`updateRole(${id}): Simulating backend. Implement backend integration.`);
   const updatedRole: Role = {
       id,
       name: data.name || "Updated Role",
       description: data.description || "",
       permissions: data.permissions || [],
       userCount: 0, // This should be calculated by backend
       ...data,
   } as Role;
  return JSON.parse(JSON.stringify(updatedRole));
};

export const deleteRole = async (id: string): Promise<boolean> => {
  await delay(80);
  console.warn(`deleteRole(${id}): Simulating backend. Implement backend integration.`);
  return true;
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
    // This can remain hardcoded as permissions are usually part of the application's definition
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
    console.warn("getPages: Fetching mock data. Implement backend integration.");
    return [];
};

export const getPageById = async (id: string): Promise<PageData | null> => {
    await delay(5);
    console.warn(`getPageById(${id}): Fetching mock data. Implement backend integration.`);
    return null;
};

export const createPage = async (data: Omit<PageData, 'id' | 'createdAt' | 'updatedAt'>): Promise<PageData> => {
    await delay(50);
    console.warn("createPage: Simulating backend. Implement backend integration.");
    const newPage: PageData = {
        ...data,
        id: generateSlug(data.title) + '-' + Date.now().toString(36),
        slug: generateSlug(data.slug || data.title),
        status: data.status || 'Taslak',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(newPage));
};

export const updatePage = async (id: string, data: Partial<Omit<PageData, 'id' | 'createdAt'>>): Promise<PageData | null> => {
    await delay(50);
    console.warn(`updatePage(${id}): Simulating backend. Implement backend integration.`);
    const updatedPage: PageData = {
        id,
        title: data.title || "Updated Page Title",
        slug: data.slug || generateSlug(data.title || "updated-page"),
        blocks: data.blocks || [],
        status: data.status || "Taslak",
        createdAt: new Date().toISOString(), // Should be original
        updatedAt: new Date().toISOString(),
        ...data,
    };
    return JSON.parse(JSON.stringify(updatedPage));
};

export const deletePage = async (id: string): Promise<boolean> => {
    await delay(80);
    console.warn(`deletePage(${id}): Simulating backend. Implement backend integration.`);
    if (id === 'anasayfa' || id === 'kullanim-kilavuzu') return false;
    return true;
};
// --- End Page CRUD ---

// Templates can remain hardcoded as they define structure, not dynamic content
export const allMockTemplates: Template[] = [
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
           { id: generateId(), type: 'video', url: 'https://www.youtube.com/watch?v=ABd2-6hnwAI', youtubeId: 'ABd2-6hnwAI' },
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
   {
    id: 'note-basic-concept',
    name: 'Temel Kavram Notu',
    description: 'Bir biyoloji kavramını açıklayan, tanım ve anahtar noktaları içeren basit not düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/note-concept-dna/300/200',
    type: 'note',
    blocks: [
        { id: generateId(), type: 'heading', level: 2, content: 'DNA\'nın Yapısı' },
        { id: generateId(), type: 'text', content: '**Tanım:** Deoksiribonükleik asit (DNA), canlıların genetik bilgilerini taşıyan ve nesilden nesile aktaran moleküldür.' },
        { id: generateId(), type: 'heading', level: 3, content: 'Anahtar Noktalar' },
        { id: generateId(), type: 'text', content: '- Çift sarmal yapısındadır.\n- Nükleotit adı verilen birimlerden oluşur (Adenin, Timin, Guanin, Sitozin).\n- A ile T, G ile C arasında hidrojen bağları bulunur.\n- Genetik kodu taşır.' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/note-dna-structure/600/300', alt: 'DNA Çift Sarmalı', caption:'DNA\'nın çift sarmal yapısı ve baz eşleşmeleri.' },
        { id: generateId(), type: 'heading', level: 3, content: 'Örnek/İlişkili Konular' },
        { id: generateId(), type: 'text', content: 'Gen, kromozom, RNA, protein sentezi, mutasyon.' },
    ]
   },
   {
    id: 'note-process-steps',
    name: 'Süreç Adımları Notu',
    description: 'Biyolojik bir süreci (örn. fotosentez, mitoz) adım adım açıklayan not düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/note-process-mitosis/300/200',
    type: 'note',
    blocks: [
        { id: generateId(), type: 'heading', level: 2, content: 'Mitoz Bölünme Aşamaları' },
        { id: generateId(), type: 'text', content: 'Mitoz bölünme, tek hücreli canlılarda üremeyi, çok hücreli canlılarda ise büyüme, gelişme ve onarımı sağlayan temel hücre bölünmesi çeşididir. Birbirini takip eden evrelerden oluşur.' },
        { id: generateId(), type: 'heading', level: 3, content: 'Adım 1: İnterfaz (Hazırlık Evresi)' },
        { id: generateId(), type: 'text', content: 'Hücrenin bölünmeye hazırlandığı evredir. DNA kendini eşler (replikasyon), organel sayısı artar ve hücre büyür. Bu evre G1, S ve G2 olmak üzere üç alt evreden oluşur.' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/note-mitosis-interphase/500/250', alt: 'İnterfaz Evresi Şeması', caption:'İnterfaz: DNA replikasyonu ve hücre büyümesi.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 3, content: 'Adım 2: Profaz' },
        { id: generateId(), type: 'text', content: 'Kromatin iplikler kısalıp kalınlaşarak kromozomları oluşturur. Çekirdek zarı ve çekirdekçik erimeye başlar. Sentrozomlar (hayvan hücrelerinde) zıt kutuplara çekilir ve iğ ipliklerini oluşturur.' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/note-mitosis-prophase/500/250', alt: 'Profaz Evresi Şeması', caption:'Profaz: Kromozomların oluşumu ve iğ ipliklerinin belirmesi.' },
        { id: generateId(), type: 'divider' },
         { id: generateId(), type: 'heading', level: 3, content: 'Adım 3: Metafaz' },
        { id: generateId(), type: 'text', content: 'Kromozomlar hücrenin ekvatoral düzlemine (metafaz plağı) tek sıra halinde dizilir. Her kromozomun sentromeri iğ ipliklerine tutunur.' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/note-mitosis-metaphase/500/250', alt: 'Metafaz Evresi Şeması', caption:'Metafaz: Kromozomların ekvatoral düzlemde dizilmesi.' },
         { id: generateId(), type: 'divider' },
         { id: generateId(), type: 'heading', level: 3, content: 'Adım 4: Anafaz' },
        { id: generateId(), type: 'text', content: 'Kardeş kromatitler birbirinden ayrılarak zıt kutuplara doğru hareket eder. Ayrılan her bir kromatit artık bir kromozomdur.' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/note-mitosis-anaphase/500/250', alt: 'Anafaz Evresi Şeması', caption:'Anafaz: Kardeş kromatitlerin ayrılması.' },
         { id: generateId(), type: 'divider' },
         { id: generateId(), type: 'heading', level: 3, content: 'Adım 5: Telofaz' },
        { id: generateId(), type: 'text', content: 'Kutuplara ulaşan kromozomlar tekrar kromatin ipliklere dönüşür. Çekirdek zarı ve çekirdekçik yeniden oluşur. İğ iplikleri kaybolur.' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/note-mitosis-telophase/500/250', alt: 'Telofaz Evresi Şeması', caption:'Telofaz: İki yeni çekirdeğin oluşumu.' },
         { id: generateId(), type: 'divider' },
         { id: generateId(), type: 'heading', level: 3, content: 'Adım 6: Sitokinez (Sitoplazma Bölünmesi)' },
        { id: generateId(), type: 'text', content: 'Telofaz ile eş zamanlı başlayabilir. Sitoplazma bölünerek iki yeni hücre oluşur. Hayvan hücrelerinde boğumlanma, bitki hücrelerinde ise ara lamel (hücre plağı) oluşumu ile gerçekleşir.' },
        { id: generateId(), type: 'text', content: 'Sonuç olarak, mitoz bölünme ile ana hücreyle aynı genetik yapıda ve aynı kromozom sayısında iki yavru hücre meydana gelir.' },
    ]
   },
    {
    id: 'note-comparison',
    name: 'Karşılaştırma Notu',
    description: 'İki veya daha fazla biyolojik kavramı/yapıyı karşılaştıran not düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/note-compare-cells/300/200',
    type: 'note',
    blocks: [
        { id: generateId(), type: 'heading', level: 2, content: 'Mitoz ve Mayoz Bölünme Karşılaştırması' },
        { id: generateId(), type: 'text', content: 'Mitoz ve mayoz, hücre bölünmesinin iki temel tipidir ancak amaçları, gerçekleştiği hücreler ve sonuçları bakımından önemli farklılıklar gösterirler.' },
        { id: generateId(), type: 'heading', level: 3, content: 'Temel Amaçları' },
        { id: generateId(), type: 'text', content: '- **Mitoz:** Büyüme, gelişme, onarım, tek hücrelilerde eşeysiz üreme.\n- **Mayoz:** Eşeyli üreyen canlılarda gamet (üreme hücresi) oluşturma, genetik çeşitliliği sağlama.' },
        { id: generateId(), type: 'heading', level: 3, content: 'Karşılaştırma Tablosu' },
        { id: generateId(), type: 'text', content: '**Özellik** | **Mitoz Bölünme** | **Mayoz Bölünme**' },
        { id: generateId(), type: 'text', content: '---|---|---' },
        { id: generateId(), type: 'text', content: 'Gerçekleştiği Hücreler | Vücut hücreleri (somatik) | Eşey ana hücreleri (üreme ana hücreleri)' },
        { id: generateId(), type: 'text', content: 'Bölünme Sayısı | Bir | İki (Mayoz I ve Mayoz II)' },
        { id: generateId(), type: 'text', content: 'Oluşan Hücre Sayısı | İki | Dört' },
        { id: generateId(), type: 'text', content: 'Kromozom Sayısı | Değişmez (2n → 2n) | Yarıya iner (2n → n)' },
        { id: generateId(), type: 'text', content: 'Genetik Çeşitlilik | Genellikle oluşmaz (mutasyonlar hariç) | Oluşur (krossing over ve homolog kromozomların rastgele ayrılması ile)' },
        { id: generateId(), type: 'text', content: 'Kardeş Kromatit Ayrılması | Anafazda | Mayoz II Anafaz II\'de' },
        { id: generateId(), type: 'text', content: 'Homolog Kromozom Ayrılması | Yok | Mayoz I Anafaz I\'de' },
        { id: generateId(), type: 'text', content: 'Krossing Over | Yok | Mayoz I Profaz I\'de (genellikle)' },
        { id: generateId(), type: 'quote', content: 'Mitoz, genetik sürekliliği sağlarken; mayoz, genetik çeşitliliğin temelini atar.', citation:'Biyoloji Ders Notları' },
    ]
   },
   // --- Page Templates (Kept from previous state for completeness) ---
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
      { id: generateId(), type: 'section', sectionType: 'job-listings', settings: {} }, 
      { id: generateId(), type: 'text', content: 'Şu anda açık bir pozisyonumuz bulunmuyorsa bile, genel başvurularınızı [e-posta adresi] adresine gönderebilirsiniz.' },
    ]
  },
  { 
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

export const USER_STORAGE_KEY = 'teknobiyo_mock_users';
export const ROLE_STORAGE_KEY = 'teknobiyo_mock_roles';

// Reload mock data (used for specific cases like data import)
export const reloadMockData = () => {
    console.log("reloadMockData called - This function should ideally re-fetch from a backend.");
    // Since there's no backend, this function doesn't have much to do other than log
    // and potentially reset to defaults if that was the desired behavior for a 'reset' button.
    // For now, it's a placeholder.
};
