
"use client";

import * as React from 'react';
import { getRoles, type Role, getAllPermissions as mockGetAllPermissions, baseMockRoles } from '@/lib/data/roles';
import type { User } from '@/lib/data/users';

interface PermissionsState {
  permissions: Set<string>;
  isLoading: boolean;
  error: string | null;
}

export function usePermissions(currentUserId: string | null = null) {
  const [state, setState] = React.useState<PermissionsState>({
    permissions: new Set(),
    isLoading: true,
    error: null,
  });

  React.useEffect(() => {
    let isMounted = true;
    const fetchPermissions = async () => {
      if (!isMounted) return;

      // If currentUserId is null, we're not logged in or still checking.
      // Don't treat this as an error, just means no permissions for now.
      if (!currentUserId) {
        if (isMounted) {
          setState({ permissions: new Set(), isLoading: false, error: null });
        }
        return;
      }
      
      if(isMounted) {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
      }

      if (typeof window === 'undefined') {
         if (isMounted) {
            setState({ permissions: new Set(), isLoading: false, error: "İzinler yalnızca istemci tarafında alınabilir." });
         }
        return;
      }

      const storedUserString = localStorage.getItem('currentUser');
      if (!storedUserString) {
        if (isMounted) {
          // No user in localStorage, but currentUserId was provided. This might be an inconsistent state.
          // For now, treat as no permissions rather than an error.
          setState({ permissions: new Set(), isLoading: false, error: null });
        }
        return;
      }

      try {
        const currentUser: User = JSON.parse(storedUserString);

        if (!currentUser || currentUser.id !== currentUserId) {
          if (isMounted) {
            // Mismatch between passed currentUserId and localStorage.
            setState({ permissions: new Set(), isLoading: false, error: null });
          }
          return;
        }

        if (!currentUser.role || typeof currentUser.role !== 'string') {
          if (isMounted) {
            setState({ permissions: new Set(), isLoading: false, error: `Kullanıcı rolü tanımsız veya geçersiz. Kullanıcı Rolü: ${currentUser.role}` });
          }
          return;
        }
        
        const userRoleString = currentUser.role.trim().toLowerCase();

        if (userRoleString === 'admin') {
            // If the user is explicitly "Admin", grant all permissions directly from baseMockRoles
            const adminBaseRole = baseMockRoles.find(r => r.id.toLowerCase() === 'admin');
            if (adminBaseRole && adminBaseRole.permissions) {
                if (isMounted) {
                    setState({ permissions: new Set(adminBaseRole.permissions), isLoading: false, error: null });
                }
            } else {
                 if (isMounted) { // Should not happen if baseMockRoles is correct
                    setState({ permissions: new Set(), isLoading: false, error: `"Admin" rolü için temel izinler bulunamadı.` });
                }
            }
        } else {
            // For other roles, fetch from getRoles which considers localStorage for custom roles
            // but ensures base roles (like Editor, User) get permissions from code.
            const allRoles = await getRoles(); // getRoles now ensures correct base permissions
            const userRoleData = allRoles.find(r =>
                r.name.trim().toLowerCase() === userRoleString ||
                r.id.trim().toLowerCase() === userRoleString
            );

            if (userRoleData) {
                if (userRoleData.permissions && Array.isArray(userRoleData.permissions)) {
                     if (isMounted) {
                        setState({ permissions: new Set(userRoleData.permissions), isLoading: false, error: null });
                     }
                } else {
                    if (isMounted) {
                        setState({ permissions: new Set(), isLoading: false, error: `"${currentUser.role}" rolü için izinler tanımsız veya geçersiz.` });
                    }
                }
            } else {
                if (isMounted) {
                    setState({ permissions: new Set(), isLoading: false, error: `Sistemde "${currentUser.role}" adlı bir rol bulunamadı.` });
                }
            }
        }

      } catch (err: any) {
        console.error("[usePermissions] Error during fetchPermissions:", err);
        if (isMounted) {
            setState({ permissions: new Set(), isLoading: false, error: `İzinler yüklenirken bir hata oluştu: ${err.message}` });
        }
      }
    };

    fetchPermissions();
    return () => { isMounted = false; };
  }, [currentUserId]);

  const hasPermission = React.useCallback(
    (permissionName: string): boolean => {
      return state.permissions.has(permissionName);
    },
    [state.permissions]
  );

  return { ...state, hasPermission };
}

    