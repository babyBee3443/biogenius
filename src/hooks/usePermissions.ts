
"use client";

import * as React from 'react';
import { type User, type Role, getRoleById, getRoles } from '@/lib/mock-data'; // Assuming getRoleById or similar exists

interface PermissionsState {
  permissions: Set<string>;
  isLoading: boolean;
  error: string | null;
}

export function usePermissions() {
  const [state, setState] = React.useState<PermissionsState>({
    permissions: new Set(),
    isLoading: true,
    error: null,
  });

  React.useEffect(() => {
    let isMounted = true;
    const fetchPermissions = async () => {
      if (typeof window === 'undefined') {
        if (isMounted) {
          setState({ permissions: new Set(), isLoading: false, error: "Permissions can only be fetched on the client." });
        }
        return;
      }

      const storedUserString = localStorage.getItem('currentUser');
      if (!storedUserString) {
        if (isMounted) {
          setState({ permissions: new Set(), isLoading: false, error: "Kullanıcı bulunamadı." });
        }
        return;
      }

      try {
        const currentUser: User = JSON.parse(storedUserString);
        if (!currentUser || !currentUser.role) {
          if (isMounted) {
            setState({ permissions: new Set(), isLoading: false, error: "Kullanıcı rolü bulunamadı." });
          }
          return;
        }

        // In a real app, you might fetch all roles once and cache them, or fetch by role name/ID
        const allRoles = await getRoles(); // Assuming getRoles fetches all defined roles
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
  }, []);

  const hasPermission = React.useCallback(
    (permissionName: string): boolean => {
      return state.permissions.has(permissionName);
    },
    [state.permissions]
  );

  return { ...state, hasPermission };
}
