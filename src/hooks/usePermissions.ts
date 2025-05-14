
"use client";

import * as React from 'react';
import { getRoles, type Role } from '@/lib/data/roles'; // Updated import
import type { User } from '@/lib/data/users'; // Updated import

interface PermissionsState {
  permissions: Set<string>;
  isLoading: boolean;
  error: string | null;
}

export function usePermissions(currentUserId: string | null = null) { // Default to null if not provided
  const [state, setState] = React.useState<PermissionsState>({
    permissions: new Set(),
    isLoading: true,
    error: null,
  });

  React.useEffect(() => {
    let isMounted = true;
    const fetchPermissions = async () => {
      if (!isMounted) return;

      if (!currentUserId) {
        // No user ID, means not logged in or session is still loading.
        // isLoading will remain true until currentUserId is available or auth check completes.
        // If auth check completes and still no currentUserId, AdminLayout handles redirection.
        // For non-admin contexts, this means no permissions.
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
          setState({ permissions: new Set(), isLoading: false, error: "Oturum bilgisi bulunamadı. Lütfen giriş yapın." });
        }
        return;
      }

      try {
        const currentUser: User = JSON.parse(storedUserString);

        if (!currentUser || currentUser.id !== currentUserId) {
          if (isMounted) {
            setState({ permissions: new Set(), isLoading: false, error: "Geçersiz kullanıcı oturumu. Lütfen tekrar giriş yapın." });
          }
          return;
        }

        if (!currentUser.role || typeof currentUser.role !== 'string') {
          if (isMounted) {
            setState({ permissions: new Set(), isLoading: false, error: `Kullanıcı rolü tanımsız veya geçersiz. Kullanıcı Rolü: ${currentUser.role}` });
          }
          return;
        }

        const allRoles = await getRoles();
        const userRoleString = currentUser.role.trim().toLowerCase();
        
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
                setState({ permissions: new Set(), isLoading: false, error: `Sistemde "${currentUser.role}" adlı bir rol bulunamadı. Lütfen rol tanımlarını kontrol edin.` });
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
