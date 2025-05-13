
"use client";

import * as React from 'react';
import { type User, type Role, getRoles } from '@/lib/mock-data';

interface PermissionsState {
  permissions: Set<string>;
  isLoading: boolean;
  error: string | null;
}

export function usePermissions(currentUserId: string | null) { // Accept currentUserId
  const [state, setState] = React.useState<PermissionsState>({
    permissions: new Set(),
    isLoading: true,
    error: null,
  });

  React.useEffect(() => {
    let isMounted = true;
    const fetchPermissions = async () => {
      if (isMounted) {
        setState(prev => ({ ...prev, isLoading: true, error: null })); // Set loading true on new fetch
      }

      if (typeof window === 'undefined') {
        if (isMounted) {
          setState({ permissions: new Set(), isLoading: false, error: "Permissions can only be fetched on the client." });
        }
        return;
      }

      if (!currentUserId) { // If no userId (e.g., logged out)
        if (isMounted) {
          setState({ permissions: new Set(), isLoading: false, error: "Kullanıcı bulunamadı (oturum kapalı)." });
        }
        return;
      }

      const storedUserString = localStorage.getItem('currentUser');
      if (!storedUserString) {
        if (isMounted) {
          // This case should ideally be handled by redirect if currentUserId was sourced from localStorage
          setState({ permissions: new Set(), isLoading: false, error: "localStorage'da kullanıcı bulunamadı." });
        }
        return;
      }

      try {
        const currentUser: User = JSON.parse(storedUserString);
        // Additional check if the ID from localStorage matches the passed currentUserId
        if (!currentUser || currentUser.id !== currentUserId || !currentUser.role) {
          if (isMounted) {
            setState({ permissions: new Set(), isLoading: false, error: "Geçerli kullanıcı rolü bulunamadı." });
          }
          return;
        }

        const allRoles = await getRoles();
        const userRoleData = allRoles.find(r => r.name.toLowerCase() === currentUser.role.toLowerCase() || r.id === currentUser.role);

        if (userRoleData && userRoleData.permissions) {
          if (isMounted) {
            setState({ permissions: new Set(userRoleData.permissions), isLoading: false, error: null });
          }
        } else {
          if (isMounted) {
            console.warn(`No permissions found for role: ${currentUser.role}. User: ${currentUser.name}`);
            setState({ permissions: new Set(), isLoading: false, error: `"${currentUser.role}" rolü için izin bulunamadı.` });
          }
        }
      } catch (err) {
        console.error("Error fetching permissions:", err);
        if (isMounted) {
          setState({ permissions: new Set(), isLoading: false, error: "İzinler yüklenirken bir hata oluştu." });
        }
      }
    };

    fetchPermissions();
    return () => { isMounted = false; };
  }, [currentUserId]); // Re-run when currentUserId changes

  const hasPermission = React.useCallback(
    (permissionName: string): boolean => {
      return state.permissions.has(permissionName);
    },
    [state.permissions]
  );

  return { ...state, hasPermission };
}
