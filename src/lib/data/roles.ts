
import { generateSlug } from '@/lib/mock-data';
import { getUsers, USER_STORAGE_KEY } from '@/lib/data/users'; // Import from new users file
import type { User } from '@/lib/data/users'; // Import User type from new users file

// --- Role Data Structure ---
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

// Base roles defined in code, permissions here are the source of truth for these
export const baseMockRoles: ReadonlyArray<Omit<Role, 'userCount'>> = Object.freeze([
    { id: 'admin', name: 'Admin', description: 'Tam sistem erişimi.', permissions: ['Dashboard Görüntüleme', 'Makaleleri Görüntüleme', 'Makale Oluşturma', 'Makale Düzenleme', 'Makale Silme', 'Biyoloji Notlarını Görüntüleme', 'Yeni Biyoloji Notu Ekleme', 'Biyoloji Notlarını Düzenleme', 'Biyoloji Notlarını Silme', 'Hazır İçeriği Görüntüleme','Kategorileri Yönetme', 'Sayfaları Yönetme', 'Kullanıcıları Görüntüleme', 'Kullanıcı Ekleme', 'Kullanıcı Düzenleme', 'Kullanıcı Silme', 'Rolleri Yönetme', 'Ayarları Görüntüleme', 'Menü Yönetimi', 'Kullanım Kılavuzunu Görüntüleme'] },
    { id: 'editor', name: 'Editor', description: 'İçerik yönetimi ve düzenleme yetkileri.', permissions: ['Dashboard Görüntüleme', 'Makaleleri Görüntüleme', 'Makale Oluşturma', 'Makale Düzenleme', 'Biyoloji Notlarını Görüntüleme', 'Yeni Biyoloji Notu Ekleme', 'Biyoloji Notlarını Düzenleme', 'Hazır İçeriği Görüntüleme', 'Kategorileri Yönetme', 'Kullanım Kılavuzunu Görüntüleme'] },
    { id: 'user', name: 'User', description: 'Standart kullanıcı, içerik görüntüleme ve yorum yapma.', permissions: [] },
]);

export const ROLE_STORAGE_KEY = 'biyohox_mock_roles_v3';
let mockRoles: Role[] = []; // This will be populated by getRoles initially

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getRoles = async (): Promise<Role[]> => {
    await delay(10);
    let rolesFromStorage: Role[] = [];
    let allUsers: User[] = [];

    if (typeof window !== 'undefined') {
        const storedRoles = localStorage.getItem(ROLE_STORAGE_KEY);
        if (storedRoles) {
            try {
                rolesFromStorage = JSON.parse(storedRoles) as Role[];
                if (!Array.isArray(rolesFromStorage)) rolesFromStorage = [];
            } catch (e) { rolesFromStorage = []; }
        }
        allUsers = await getUsers(); // Fetch current users to calculate accurate counts
    }


    // Merge base roles with stored roles, ensuring base roles' permissions are always from code definition
    // and user counts are dynamically calculated.
    const mergedRoles = baseMockRoles.map(baseRoleDef => {
        const storedRole = rolesFromStorage.find(sr => sr.id === baseRoleDef.id || sr.name.trim().toLowerCase() === baseRoleDef.name.trim().toLowerCase());
        const count = allUsers.filter(u =>
            u.role.trim().toLowerCase() === baseRoleDef.name.trim().toLowerCase() ||
            u.role.trim().toLowerCase() === baseRoleDef.id.trim().toLowerCase()
        ).length;

        return {
            ...baseRoleDef, // Start with base role definition (ID, Name, Permissions from code)
            description: storedRole?.description || baseRoleDef.description, // Use stored description if available
            userCount: count, // Use calculated user count
        };
    });

    // Add any custom roles from storage that are not base roles
    rolesFromStorage.forEach(storedRole => {
        if (!mergedRoles.some(mr => mr.id === storedRole.id || mr.name.trim().toLowerCase() === storedRole.name.trim().toLowerCase())) {
            const count = allUsers.filter(u =>
                u.role.trim().toLowerCase() === storedRole.name.trim().toLowerCase() ||
                u.role.trim().toLowerCase() === storedRole.id.trim().toLowerCase()
            ).length;
            mergedRoles.push({...storedRole, userCount: count });
        }
    });
    mockRoles = mergedRoles; // Update in-memory cache
    return mergedRoles;
};

export const initializeRoles = (initialRoles: Role[]) => {
    mockRoles = initialRoles;
    if (typeof window !== 'undefined') {
        localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(mockRoles));
    }
};

export const getRoleById = async (id: string): Promise<Role | null> => {
  await delay(10);
  const roles = await getRoles();
  const role = roles.find(r => r.id === id);
  return role ? JSON.parse(JSON.stringify(role)) : null;
};

export const createRole = async (data: Omit<Role, 'id' | 'userCount'>): Promise<Role> => {
  await delay(50);
  const newRole: Role = {
    ...data,
    id: generateSlug(data.name) + '-' + Date.now().toString(36).slice(-6),
    userCount: 0,
  };
  const currentRoles = await getRoles();
  currentRoles.push(newRole);
  if (typeof window !== 'undefined') {
      localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(currentRoles));
  }
  mockRoles = currentRoles;
  return JSON.parse(JSON.stringify(newRole));
};

export const updateRole = async (id: string, data: Partial<Omit<Role, 'id'>>): Promise<Role | null> => {
  await delay(50);
  const currentRoles = await getRoles(); // This will get dynamically calculated user counts
  const index = currentRoles.findIndex(r => r.id === id);

  if (index !== -1) {
      const baseRoleMatch = baseMockRoles.find(br => br.id === currentRoles[index].id);
      const permissionsToKeep = baseRoleMatch ? baseRoleMatch.permissions : data.permissions || currentRoles[index].permissions;

      // userCount should not be directly updatable through this function; it's calculated.
      // So, we merge data but retain the userCount from the fresh `getRoles()` call.
      currentRoles[index] = {
          ...currentRoles[index], // This includes the fresh userCount
          ...data,                 // Apply updates from 'data'
          permissions: permissionsToKeep, // Ensure correct permissions
      };

      if (typeof window !== 'undefined') {
          // Filter out userCount before saving if it was accidentally passed in data, as it's derived
          const rolesToStore = currentRoles.map(({ userCount, ...rest }) => rest);
          localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(rolesToStore));
      }
      mockRoles = currentRoles;
      return JSON.parse(JSON.stringify(currentRoles[index]));
  }
  return null;
};


export const deleteRole = async (id: string): Promise<boolean> => {
  await delay(80);
  let currentRoles = await getRoles(); // Get roles with current user counts
  const roleToDelete = currentRoles.find(r => r.id === id);

  if (roleToDelete && (roleToDelete.id === 'admin' || roleToDelete.id === 'editor' || roleToDelete.id === 'user')) {
    if (roleToDelete.userCount > 0) {
      console.warn(`Cannot delete base role "${roleToDelete.name}" as it has ${roleToDelete.userCount} users.`);
      return false;
    }
  }

  const initialLength = currentRoles.length;
  currentRoles = currentRoles.filter(r => r.id !== id);

  if (currentRoles.length < initialLength) {
      if (typeof window !== 'undefined') {
          // Filter out userCount before saving, as it's derived
          const rolesToStore = currentRoles.map(({ userCount, ...rest }) => rest);
          localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(rolesToStore));
      }
      mockRoles = currentRoles;
      return true;
  }
  return false;
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
