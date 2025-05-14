
import { generateId } from '@/lib/utils'; // Import from utils
import { getRoles, ROLE_STORAGE_KEY } from '@/lib/data/roles'; // Import from new roles file
import type { Role } from '@/lib/data/roles'; // Import Role type from new roles file

// --- User Data Structure ---
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string; // Role can be a string to accommodate custom roles
  status?: 'Öğrenci' | 'Öğretmen' | 'Meraklı'; // Added status field
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

export const USER_STORAGE_KEY = 'biyohox_mock_users_v3';
let mockUsers: User[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getUsers = async (): Promise<User[]> => {
    await delay(10);
     if (typeof window !== 'undefined') {
        const storedUsers = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUsers) {
            try {
                const parsedUsers = JSON.parse(storedUsers);
                if (Array.isArray(parsedUsers)) {
                    mockUsers = parsedUsers;
                    return parsedUsers;
                }
            } catch (e) {
                console.error("Error parsing users from localStorage", e);
            }
        }
    }
    return mockUsers;
};

export const initializeUsers = (initialUsers: User[]) => {
    // Ensure default admin user has a status if not provided
    const usersWithStatus = initialUsers.map(user => ({
        ...user,
        status: user.status || (user.role === 'Admin' || user.role === 'Editor' ? 'Öğretmen' : 'Öğrenci') // Default status
    }));
    mockUsers = usersWithStatus;
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUsers));
    }
};

export const getUserById = async (id: string): Promise<User | null> => {
    await delay(10);
    const users = await getUsers();
    const user = users.find(u => u.id === id);
    return user ? JSON.parse(JSON.stringify(user)) : null;
};

export const createUser = async (data: Omit<User, 'id' | 'joinedAt' | 'lastLogin'>): Promise<User> => {
    await delay(50);
    const newUser: User = {
        ...data,
        id: generateId(),
        joinedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        avatar: data.avatar || `https://placehold.co/128x128.png?text=${(data.username || 'A').charAt(0)}`,
        status: data.status || (data.role === 'Admin' || data.role === 'Editor' ? 'Öğretmen' : 'Öğrenci'), // Default status
    };
    const currentUsers = await getUsers();
    currentUsers.push(newUser);
     if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUsers));
    }
    mockUsers = currentUsers;

    if (typeof window !== 'undefined') {
        const currentRoles = await getRoles();
        const roleIndex = currentRoles.findIndex(r => r.id === newUser.role.toLowerCase() || r.name.toLowerCase() === newUser.role.toLowerCase());
        if (roleIndex !== -1) {
            currentRoles[roleIndex].userCount = (currentRoles[roleIndex].userCount || 0) + 1;
            localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(currentRoles.map(({ userCount, ...rest }) => rest)));
        }
    }
    return JSON.parse(JSON.stringify(newUser));
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User | null> => {
    await delay(50);
    const currentUsers = await getUsers();
    const index = currentUsers.findIndex(u => u.id === id);
    if (index !== -1) {
        const oldRole = currentUsers[index].role;
        currentUsers[index] = { ...currentUsers[index], ...data, lastLogin: new Date().toISOString() };

        if (typeof window !== 'undefined') {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUsers));
        }
        mockUsers = currentUsers;

        if (data.role && data.role !== oldRole && typeof window !== 'undefined') {
            const currentRoles = await getRoles();
            const oldRoleIndex = currentRoles.findIndex(r => r.id === oldRole.toLowerCase() || r.name.toLowerCase() === oldRole.toLowerCase());
            if (oldRoleIndex !== -1) {
                currentRoles[oldRoleIndex].userCount = Math.max(0, (currentRoles[oldRoleIndex].userCount || 0) - 1);
            }
            const newRoleIndex = currentRoles.findIndex(r => r.id === data.role!.toLowerCase() || r.name.toLowerCase() === data.role!.toLowerCase());
            if (newRoleIndex !== -1) {
                currentRoles[newRoleIndex].userCount = (currentRoles[newRoleIndex].userCount || 0) + 1;
            }
            localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(currentRoles.map(({ userCount, ...rest }) => rest)));
        }
        return JSON.parse(JSON.stringify(currentUsers[index]));
    }
    return null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  await delay(80);
  let currentUsers = await getUsers();
  const userIndex = currentUsers.findIndex(u => u.id === id);
  if (userIndex !== -1) {
    const userRole = currentUsers[userIndex].role;
    currentUsers.splice(userIndex, 1);
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUsers));
    }
    mockUsers = currentUsers;

    if (typeof window !== 'undefined') {
        const currentRoles = await getRoles();
        const roleIndex = currentRoles.findIndex(r => r.id === userRole.toLowerCase() || r.name.toLowerCase() === userRole.toLowerCase());
        if (roleIndex !== -1) {
            currentRoles[roleIndex].userCount = Math.max(0, (currentRoles[roleIndex].userCount || 0) - 1);
            localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(currentRoles.map(({ userCount, ...rest }) => rest)));
        }
    }
    return true;
  }
  return false;
};
