
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
    category: string; // Keep as string, but will only be "Biyoloji" from mock data
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
  category?: 'Biyoloji' | 'Genel Sayfa'; // Removed 'Teknoloji'
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

const mockCategories: Category[] = [
    { id: 'biyoloji', name: 'Biyoloji' },
    // { id: 'teknoloji', name: 'Teknoloji' }, // Removed Teknoloji
    { id: 'genel', name: 'Genel' }, // For notes or other content types
];

// --- Category CRUD ---
export const getCategories = async (): Promise<Category[]> => {
    await delay(5);
    // Returns only "Biyoloji" and "Genel" or other relevant categories for selection in admin
    return JSON.parse(JSON.stringify(mockCategories.filter(cat => cat.name !== 'Teknoloji')));
};

export const addCategory = async (data: Omit<Category, 'id'>): Promise<Category> => {
    await delay(30);
    const newCategory: Category = {
        ...data,
        id: generateSlug(data.name) + '-' + Date.now().toString(36),
    };
    mockCategories.push(newCategory); // For dynamic additions during session
    return JSON.parse(JSON.stringify(newCategory));
};

export const updateCategory = async (id: string, data: Partial<Omit<Category, 'id'>>): Promise<Category | null> => {
    await delay(30);
    const index = mockCategories.findIndex(cat => cat.id === id);
    if (index !== -1) {
        mockCategories[index] = { ...mockCategories[index], ...data };
        return JSON.parse(JSON.stringify(mockCategories[index]));
    }
    return null;
};

export const deleteCategory = async (id: string): Promise<boolean> => {
    await delay(50);
    const index = mockCategories.findIndex(cat => cat.id === id);
    if (index !== -1) {
        mockCategories.splice(index, 1);
        return true;
    }
    return false;
};


let mockArticles: ArticleData[] = [
    // Only Biyoloji articles
    {
      id: 'biyo1',
      title: 'Gen Düzenleme Teknolojileri: CRISPR ve Ötesi',
      excerpt: 'CRISPR gibi gen düzenleme teknolojilerinin potansiyelini ve etik boyutlarını inceleyin.',
      blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Gen Düzenleme: CRISPR ve Geleceği' },
        { id: generateId(), type: 'text', content: 'Gen düzenleme teknolojileri, tıp ve biyoteknoloji alanında devrim yaratma potansiyeline sahip.' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/crispr-tech/800/400', alt: 'CRISPR Teknolojisi', caption: 'Genetik materyali hassas bir şekilde değiştirmek.' },
      ],
      category: 'Biyoloji',
      status: 'Yayınlandı',
      mainImageUrl: 'https://picsum.photos/seed/biyo-gen-edit/600/400',
      slug: 'gen-duzenleme-teknolojileri',
      isFeatured: true,
      isHero: true,
      authorId: 'mock-editor',
      createdAt: '2024-07-19T10:00:00Z',
      updatedAt: '2024-07-19T10:00:00Z',
      seoTitle: 'Gen Düzenleme Teknolojileri: CRISPR ve Ötesi',
      seoDescription: 'CRISPR ve diğer gen düzenleme yöntemlerinin bilimsel temelleri, uygulama alanları ve etik tartışmalar.',
      keywords: ['gen düzenleme', 'CRISPR', 'biyoteknoloji', 'genetik', 'etik'],
    },
    {
      id: 'biyo2',
      title: 'Mikrobiyom: İçimizdeki Gizli Dünya',
      excerpt: 'İnsan vücudundaki mikroorganizmaların sağlığımız üzerindeki etkileri.',
      blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Mikrobiyom: Sağlığımızın Gizli Yöneticileri' },
        { id: generateId(), type: 'text', content: 'Vücudumuzda yaşayan trilyonlarca mikroorganizma, sağlığımız üzerinde derin etkilere sahip.' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/microbiome-art/800/400', alt: 'Mikroorganizmalar', caption: 'Bağırsak mikrobiyotası ve sağlık ilişkisi.' },
      ],
      category: 'Biyoloji',
      status: 'İncelemede',
      mainImageUrl: 'https://picsum.photos/seed/biyo-microbiome/600/400',
      slug: 'mikrobiyom-icimizdeki-gizli-dunya',
      isFeatured: true,
      isHero: false,
      authorId: 'mock-editor',
      createdAt: '2024-07-21T12:00:00Z',
      updatedAt: '2024-07-21T12:00:00Z',
    },
    {
      id: 'biyo3',
      title: 'Sentetik Biyoloji: Yaşamı Yeniden Tasarlamak',
      excerpt: 'Sentetik biyolojinin tıp, enerji ve malzeme bilimindeki uygulamaları.',
      blocks: [],
      category: 'Biyoloji',
      status: 'Yayınlandı',
      mainImageUrl: 'https://picsum.photos/seed/biyo-synbio/600/400',
      slug: 'sentetik-biyoloji-yasami-yeniden-tasarlamak',
      isFeatured: false,
      isHero: true,
      authorId: 'mock-editor',
      createdAt: '2024-07-17T10:00:00Z',
      updatedAt: '2024-07-17T10:00:00Z',
    },
    {
      id: 'biyo4',
      title: 'Kanser İmmünoterapisi: Vücudun Kendi Savunması',
      excerpt: 'Kanserle mücadelede immünoterapinin rolü ve geleceği.',
      blocks: [],
      category: 'Biyoloji',
      status: 'Yayınlandı',
      mainImageUrl: 'https://picsum.photos/seed/biyo-cancer-immuno/600/400',
      slug: 'kanser-immunoterapisi',
      isFeatured: true,
      isHero: false,
      authorId: 'mock-editor',
      createdAt: '2024-07-16T10:00:00Z',
      updatedAt: '2024-07-16T10:00:00Z',
    },
];

let mockNotes: NoteData[] = [
    {
      id: 'note1',
      title: 'Hücre Zarının Yapısı ve Görevleri',
      slug: 'hucre-zarinin-yapisi-gorevleri',
      category: 'Hücre Biyolojisi',
      level: 'Lise 9',
      tags: ['hücre zarı', 'fosfolipit', 'protein', 'madde alışverişi'],
      summary: 'Hücre zarının yapısını (fosfolipit tabaka, proteinler, karbonhidratlar) ve temel görevlerini (madde alışverişi, hücre tanıma, iletişim) açıklar.',
      contentBlocks: [
        {id: generateId(), type: 'heading', level: 2, content: 'Hücre Zarının Yapısı'},
        {id: generateId(), type: 'text', content: 'Hücre zarı, akıcı mozaik modeline göre çift katlı fosfolipit tabakası ve bu tabakaya gömülü veya bağlı proteinlerden oluşur. Karbonhidratlar da zarın dış yüzeyinde proteinlere (glikoprotein) veya lipitlere (glikolipit) bağlı olarak bulunabilir.'},
        {id: generateId(), type: 'image', url: 'https://picsum.photos/seed/cell-membrane/600/300', alt:'Hücre Zarı Modeli', caption: 'Akıcı Mozaik Zar Modeli'},
        {id: generateId(), type: 'heading', level: 2, content: 'Hücre Zarının Görevleri'},
        {id: generateId(), type: 'text', content: '- Hücreyi dış ortamdan ayırır ve hücre bütünlüğünü korur.\n- Madde alışverişini denetler (seçici geçirgen).\n- Hücreler arası iletişimi sağlar.\n- Hücrelerin birbirini tanımasını sağlar (glikokaliks sayesinde).'}
      ],
      imageUrl: 'https://picsum.photos/seed/note-cell-membrane/400/250',
      authorId: 'u1',
      status: 'Yayınlandı',
      createdAt: '2024-07-10T10:00:00Z',
      updatedAt: '2024-07-12T14:30:00Z',
    },
    {
      id: 'note2',
      title: 'Mitokondri: Hücrenin Enerji Santrali',
      slug: 'mitokondri-enerji-santrali',
      category: 'Hücre Biyolojisi',
      level: 'Lise 9',
      tags: ['mitokondri', 'oksijenli solunum', 'ATP', 'enerji'],
      summary: 'Mitokondrinin yapısını, oksijenli solunumdaki rolünü ve ATP üretim sürecini özetler.',
      contentBlocks: [],
      imageUrl: 'https://picsum.photos/seed/note-mitochondria/400/250',
      authorId: 'u1',
      status: 'Yayınlandı',
      createdAt: '2024-07-11T11:00:00Z',
      updatedAt: '2024-07-11T11:00:00Z',
    },
    {
      id: 'note3',
      title: 'DNA Replikasyonu (Eşlenmesi)',
      slug: 'dna-replikasyonu',
      category: 'Genetik',
      level: 'Lise 12',
      tags: ['DNA', 'replikasyon', 'helikaz', 'polimeraz', 'ligaz'],
      summary: 'DNA\'nın kendini yarı korunumlu olarak nasıl eşlediğini, görev alan enzimleri ve süreci açıklar.',
      contentBlocks: [],
      imageUrl: 'https://picsum.photos/seed/note-dna-replication/400/250',
      authorId: 'u2',
      status: 'Hazır',
      createdAt: '2024-07-12T09:00:00Z',
      updatedAt: '2024-07-13T16:00:00Z',
    },
];

let mockUsers: User[] = [
  { id: 'u1', name: 'Ali Veli', username: 'aliveli', email: 'ali.veli@example.com', role: 'Admin', joinedAt: '2024-01-15T10:00:00Z', avatar: 'https://picsum.photos/seed/aliveli/128/128', lastLogin: '2024-07-25T13:30:00Z', bio: 'Biyoloji ve teknoloji meraklısı.'},
  { id: 'u2', name: 'Ayşe Kaya', username: 'aysekaya', email: 'ayse.kaya@example.com', role: 'Editor', joinedAt: '2024-03-22T14:30:00Z', avatar: 'https://picsum.photos/seed/aysekaya/128/128', lastLogin: '2024-07-25T18:00:00Z' },
  { id: 'u3', name: 'Mehmet Yılmaz', username: 'mehmetyilmaz', email: 'mehmet.yilmaz@example.com', role: 'User', joinedAt: '2024-06-10T08:15:00Z', avatar: 'https://picsum.photos/seed/mehmetyilmaz/128/128', lastLogin: '2024-07-24T12:15:00Z' },
  { id: 'u4', name: 'Zeynep Demir', username: 'zeynepdemir', email: 'zeynep.demir@example.com', role: 'User', joinedAt: '2024-07-01T11:00:00Z', avatar: 'https://picsum.photos/seed/zeynepdemir/128/128', lastLogin: '2024-07-25T09:45:00Z' },
  { id: 'u5', name: 'Can Öztürk', username: 'canozturk', email: 'can.ozturk@example.com', role: 'Editor', joinedAt: '2024-05-19T16:00:00Z', avatar: 'https://picsum.photos/seed/canozturk/128/128', lastLogin: '2024-07-23T20:00:00Z' },
  { id: 'superadmin', name: 'Super Admin', username: 'superadmin', email: 'superadmin@teknobiyo.example.com', role: 'Admin', joinedAt: '2024-01-01T00:00:00Z', avatar: 'https://picsum.photos/seed/superadmin/128/128', lastLogin: new Date().toISOString(), bio: 'Sistem Yöneticisi.'},
  { id: 'gokhan', name: 'Gökhan Ermiş', username: 'babybee', email: 'sirfpubg12@gmail.com', role: 'Admin', joinedAt: '2024-01-01T00:00:00Z', avatar: 'https://picsum.photos/seed/babybee/128/128', lastLogin: new Date().toISOString(), bio: 'TeknoBiyo Kurucusu.'},
];

let mockRoles: Role[] = [
    { id: 'admin', name: 'Admin', description: 'Tam sistem erişimi.', permissions: ['Dashboard Görüntüleme', 'Makaleleri Görüntüleme', 'Makale Oluşturma', 'Makale Düzenleme', 'Makale Silme', 'Biyoloji Notlarını Görüntüleme', 'Yeni Biyoloji Notu Ekleme', 'Biyoloji Notlarını Düzenleme', 'Biyoloji Notlarını Silme', 'Hazır İçeriği Görüntüleme','Kategorileri Yönetme', 'Sayfaları Yönetme', 'Kullanıcıları Görüntüleme', 'Kullanıcı Ekleme', 'Kullanıcı Düzenleme', 'Kullanıcı Silme', 'Rolleri Yönetme', 'Ayarları Görüntüleme', 'Menü Yönetimi', 'Kullanım Kılavuzunu Görüntüleme'], userCount: 2 },
    { id: 'editor', name: 'Editor', description: 'İçerik yönetimi ve düzenleme yetkileri.', permissions: ['Dashboard Görüntüleme', 'Makaleleri Görüntüleme', 'Makale Oluşturma', 'Makale Düzenleme', 'Biyoloji Notlarını Görüntüleme', 'Yeni Biyoloji Notu Ekleme', 'Biyoloji Notlarını Düzenleme', 'Hazır İçeriği Görüntüleme', 'Kategorileri Yönetme', 'Kullanım Kılavuzunu Görüntüleme'], userCount: 2 },
    { id: 'user', name: 'User', description: 'Standart kullanıcı, içerik görüntüleme ve yorum yapma.', permissions: [], userCount: 2 },
];


// --- Article CRUD ---
export const getArticles = async (): Promise<ArticleData[]> => {
    await delay(10);
    return JSON.parse(JSON.stringify(mockArticles));
};

export const getArticleById = async (id: string): Promise<ArticleData | null> => {
    await delay(10);
    const article = mockArticles.find(a => a.id === id);
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
    mockArticles.push(newArticle);
    return JSON.parse(JSON.stringify(newArticle));
};

export const updateArticle = async (id: string, data: Partial<Omit<ArticleData, 'id' | 'createdAt'>>): Promise<ArticleData | null> => {
    await delay(50);
    const index = mockArticles.findIndex(a => a.id === id);
    if (index !== -1) {
        mockArticles[index] = { ...mockArticles[index], ...data, updatedAt: new Date().toISOString() };
        return JSON.parse(JSON.stringify(mockArticles[index]));
    }
    return null;
};

export const deleteArticle = async (id: string): Promise<boolean> => {
    await delay(80);
    const initialLength = mockArticles.length;
    mockArticles = mockArticles.filter(a => a.id !== id);
    return mockArticles.length < initialLength;
};

// --- Note CRUD ---
export const getNotes = async (): Promise<NoteData[]> => {
    await delay(10);
    return JSON.parse(JSON.stringify(mockNotes));
};

export const getNoteById = async (id: string): Promise<NoteData | null> => {
    await delay(10);
    const note = mockNotes.find(n => n.id === id);
    return note ? JSON.parse(JSON.stringify(note)) : null;
};

export const createNote = async (data: Omit<NoteData, 'id' | 'createdAt' | 'updatedAt'>): Promise<NoteData> => {
    await delay(50);
    const newNote: NoteData = {
        ...data,
        id: `note-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`,
        status: data.status || 'Taslak',
        authorId: data.authorId || 'u1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    mockNotes.push(newNote);
    return JSON.parse(JSON.stringify(newNote));
};

export const updateNote = async (id: string, data: Partial<Omit<NoteData, 'id' | 'createdAt'>>): Promise<NoteData | null> => {
    await delay(50);
    const index = mockNotes.findIndex(n => n.id === id);
    if (index !== -1) {
        mockNotes[index] = { ...mockNotes[index], ...data, updatedAt: new Date().toISOString() };
        return JSON.parse(JSON.stringify(mockNotes[index]));
    }
    return null;
};

export const deleteNote = async (id: string): Promise<boolean> => {
    await delay(80);
    const initialLength = mockNotes.length;
    mockNotes = mockNotes.filter(n => n.id !== id);
    return mockNotes.length < initialLength;
};

// --- User CRUD Functions ---
export const getUsers = async (): Promise<User[]> => {
    await delay(10);
    return JSON.parse(JSON.stringify(mockUsers));
};

export const getUserById = async (id: string): Promise<User | null> => {
    await delay(10);
    const user = mockUsers.find(u => u.id === id);
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
    mockUsers.push(newUser);
    // Update user count in roles
    const roleIndex = mockRoles.findIndex(r => r.id === newUser.role.toLowerCase() || r.name.toLowerCase() === newUser.role.toLowerCase());
    if (roleIndex !== -1) {
        mockRoles[roleIndex].userCount += 1;
    }
    return JSON.parse(JSON.stringify(newUser));
};

export const updateUser = async (id: string, data: Partial<Omit<User, 'id' | 'joinedAt' | 'email'>>): Promise<User | null> => {
    await delay(50);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
        const oldRole = mockUsers[index].role;
        mockUsers[index] = { ...mockUsers[index], ...data, lastLogin: new Date().toISOString() };

        // Update user counts if role changed
        if (data.role && data.role !== oldRole) {
            const oldRoleIndex = mockRoles.findIndex(r => r.id === oldRole.toLowerCase() || r.name.toLowerCase() === oldRole.toLowerCase());
            if (oldRoleIndex !== -1) {
                mockRoles[oldRoleIndex].userCount = Math.max(0, mockRoles[oldRoleIndex].userCount - 1);
            }
            const newRoleIndex = mockRoles.findIndex(r => r.id === data.role!.toLowerCase() || r.name.toLowerCase() === data.role!.toLowerCase());
            if (newRoleIndex !== -1) {
                mockRoles[newRoleIndex].userCount += 1;
            }
        }
        return JSON.parse(JSON.stringify(mockUsers[index]));
    }
    return null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  await delay(80);
  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    const userRole = mockUsers[userIndex].role;
    mockUsers.splice(userIndex, 1);
    // Update user count in roles
    const roleIndex = mockRoles.findIndex(r => r.id === userRole.toLowerCase() || r.name.toLowerCase() === userRole.toLowerCase());
    if (roleIndex !== -1) {
        mockRoles[roleIndex].userCount = Math.max(0, mockRoles[roleIndex].userCount - 1);
    }
    return true;
  }
  return false;
};


// --- Role CRUD Functions ---
export const getRoles = async (): Promise<Role[]> => {
  await delay(10);
  return JSON.parse(JSON.stringify(mockRoles));
};

export const getRoleById = async (id: string): Promise<Role | null> => {
  await delay(10);
  const role = mockRoles.find(r => r.id === id);
  return role ? JSON.parse(JSON.stringify(role)) : null;
};

export const createRole = async (data: Omit<Role, 'id' | 'userCount'>): Promise<Role> => {
  await delay(50);
  const newRole: Role = {
    ...data,
    id: generateSlug(data.name) + '-' + Date.now().toString(36),
    userCount: 0, // New roles start with 0 users
  };
  mockRoles.push(newRole);
  return JSON.parse(JSON.stringify(newRole));
};

export const updateRole = async (id: string, data: Partial<Omit<Role, 'id' | 'userCount'>>): Promise<Role | null> => {
  await delay(50);
  const index = mockRoles.findIndex(r => r.id === id);
  if (index !== -1) {
      // Preserve userCount unless explicitly provided (though typically it's calculated)
      mockRoles[index] = { ...mockRoles[index], ...data, userCount: data.userCount !== undefined ? data.userCount : mockRoles[index].userCount };
      return JSON.parse(JSON.stringify(mockRoles[index]));
  }
  return null;
};

export const deleteRole = async (id: string): Promise<boolean> => {
  await delay(80);
  const initialLength = mockRoles.length;
  // Prevent deletion of 'Admin', 'Editor', 'User' core roles if they have users
  const roleToDelete = mockRoles.find(r => r.id === id);
  if (roleToDelete && ['admin', 'editor', 'user'].includes(roleToDelete.id.toLowerCase()) && roleToDelete.userCount > 0) {
    console.warn(`Cannot delete core role "${roleToDelete.name}" as it has ${roleToDelete.userCount} users.`);
    return false;
  }
  mockRoles = mockRoles.filter(r => r.id !== id);
  return mockRoles.length < initialLength;
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

let mockPages: PageData[] = [
    { id: 'anasayfa', title: 'Anasayfa', slug: '', blocks: [], status: 'Yayınlandı', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', heroSettings: { enabled: true, articleSource: 'latest', intervalSeconds: 5, maxArticles: 3 } },
    { id: 'hakkimizda', title: 'Hakkımızda', slug: 'hakkimizda', blocks: [], status: 'Yayınlandı', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    { id: 'iletisim', title: 'İletişim', slug: 'iletisim', blocks: [], status: 'Yayınlandı', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    { id: 'kullanim-kilavuzu', title: 'Kullanım Kılavuzu', slug: 'kullanim-kilavuzu', blocks: [{id: generateId(), type: 'heading', level: 1, content: 'Admin Paneli Kullanım Kılavuzu'}, {id: generateId(), type: 'text', content: 'Bu kılavuz admin panelinin kullanımı hakkında bilgiler içerir.'}], status: 'Yayınlandı', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z'},
];

// --- Page CRUD ---
export const getPages = async (): Promise<PageData[]> => {
    await delay(5);
    return JSON.parse(JSON.stringify(mockPages));
};

export const getPageById = async (id: string): Promise<PageData | null> => {
    await delay(5);
    const page = mockPages.find(p => p.id === id || p.slug === id);
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
    mockPages.push(newPage);
    return JSON.parse(JSON.stringify(newPage));
};

export const updatePage = async (id: string, data: Partial<Omit<PageData, 'id' | 'createdAt'>>): Promise<PageData | null> => {
    await delay(50);
    const index = mockPages.findIndex(p => p.id === id);
    if (index !== -1) {
        mockPages[index] = { ...mockPages[index], ...data, updatedAt: new Date().toISOString() };
        return JSON.parse(JSON.stringify(mockPages[index]));
    }
    return null;
};

export const deletePage = async (id: string): Promise<boolean> => {
    await delay(80);
    if (id === 'anasayfa' || id === 'kullanim-kilavuzu') return false; // Prevent deletion of core pages
    const initialLength = mockPages.length;
    mockPages = mockPages.filter(p => p.id !== id);
    return mockPages.length < initialLength;
};
// --- End Page CRUD ---

// Templates can remain hardcoded as they define structure, not dynamic content
export const allMockTemplates: Template[] = [
    // Biyoloji focused templates
    {
        id: 'listicle-biyo',
        name: 'Listeleme Makalesi (Biyoloji)',
        description: 'Belirli bir biyoloji konusunda numaralı veya madde işaretli öneriler/bilgiler sunan format.',
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
        ]
      },
      {
        id: 'interview-biyo',
        name: 'Röportaj Makalesi (Biyoloji)',
        description: 'Bir biyoloji uzmanıyla yapılan söyleşiyi soru-cevap formatında detaylı bir şekilde sunar.',
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
        { id: generateId(), type: 'text', content: 'Mitoz bölünme, tek hücreli canlılarda üremeyi, çok hücreli canlılarda ise büyüme, gelişme ve onarımı sağlayan temel hücre bölünmesi çeşididir.' },
        { id: generateId(), type: 'heading', level: 3, content: 'Adım 1: İnterfaz (Hazırlık Evresi)' },
        { id: generateId(), type: 'text', content: 'Hücrenin bölünmeye hazırlandığı evredir. DNA kendini eşler (replikasyon), organel sayısı artar ve hücre büyür.' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/note-mitosis-interphase/500/250', alt: 'İnterfaz Evresi Şeması', caption:'İnterfaz: DNA replikasyonu ve hücre büyümesi.' },
        { id: generateId(), type: 'divider' },
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
    ]
   },
   // --- Page Templates ---
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
        { id: generateId(), type: 'gallery', images: [
            { url: 'https://picsum.photos/seed/portfolio1/600/400', alt: 'Proje 1' },
            { url: 'https://picsum.photos/seed/portfolio2/600/400', alt: 'Proje 2' },
          ]
        },
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
      { id: generateId(), type: 'section', sectionType: 'featured-articles', settings: { title: 'Öne Çıkan Yazılar', count: 2 } },
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
      { id: generateId(), type: 'heading', level: 2, content: 'Açık Pozisyonlar' },
      { id: generateId(), type: 'section', sectionType: 'job-listings', settings: {} },
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
      { id: generateId(), type: 'text', content: 'Bu kılavuz, [Platform Adı] platformunu etkili bir şekilde kullanmanıza yardımcı olmak için tasarlanmıştır.' },
      { id: generateId(), type: 'heading', level: 2, content: 'Bölüm 1: Başlarken' },
    ]
  }
];

export const ARTICLE_STORAGE_KEY = 'teknobiyo_mock_articles_v2';
export const NOTE_STORAGE_KEY = 'teknobiyo_mock_notes_v2';
export const CATEGORY_STORAGE_KEY = 'teknobiyo_mock_categories_v2';
export const USER_STORAGE_KEY = 'teknobiyo_mock_users_v2';
export const ROLE_STORAGE_KEY = 'teknobiyo_mock_roles_v2';
export const PAGE_STORAGE_KEY = 'teknobiyo_mock_pages_v2';

export const reloadMockData = () => {
    console.log("reloadMockData called - This function should ideally re-fetch from a backend.");
};

// Helper to initialize data in localStorage if it doesn't exist
const initializeLocalStorage = () => {
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
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUsers));
    }
    if (!localStorage.getItem(ROLE_STORAGE_KEY)) {
      localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(mockRoles));
    }
     if (!localStorage.getItem(PAGE_STORAGE_KEY)) {
      localStorage.setItem(PAGE_STORAGE_KEY, JSON.stringify(mockPages));
    }
  }
};

// Call initialization when the module is loaded
initializeLocalStorage();
