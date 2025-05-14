
"use client";

import * as React from 'react';
import { type User, type Role, getRoles } from '@/lib/mock-data'; // Correctly import getRoles

interface PermissionsState {
  permissions: Set<string>;
  isLoading: boolean;
  error: string | null;
}

export function usePermissions(currentUserId: string | null) {
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
        // If no user ID, means not logged in or session is still loading.
        // AdminLayout should handle redirection. usePermissions will reflect no permissions.
        if (isMounted) {
          setState({ permissions: new Set(), isLoading: false, error: null });
        }
        return;
      }

      if (isMounted) {
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
          // This indicates a problem if currentUserId was provided but no localStorage item
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

        const allRoles = await getRoles(); // Fetch all roles, ensuring base roles have correct permissions
        const userRoleString = currentUser.role.trim().toLowerCase();
        
        // Find the role data matching the user's role (case-insensitive for name and id)
        const userRoleData = allRoles.find(r =>
            r.name.trim().toLowerCase() === userRoleString ||
            r.id.trim().toLowerCase() === userRoleString
        );

        if (userRoleData) {
            // Crucially, use permissions from the getRoles() definition for base roles
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
