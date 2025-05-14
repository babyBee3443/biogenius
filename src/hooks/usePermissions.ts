
"use client";

import * as React from 'react';
import { type User, type Role, getRoles } from '@/lib/mock-data';

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
        if (isMounted) {
          setState({ permissions: new Set(), isLoading: false, error: null });
          // console.log("[usePermissions] No currentUserId, permissions set to empty, loading false.");
        }
        return;
      }

      if (isMounted) {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        // console.log(`[usePermissions] Fetching permissions for userId: ${currentUserId}`);
      }

      if (typeof window === 'undefined') {
        if (isMounted) {
          setState({ permissions: new Set(), isLoading: false, error: "Permissions can only be fetched on the client." });
        }
        return;
      }

      const storedUserString = localStorage.getItem('currentUser');
      if (!storedUserString) {
        if (isMounted) {
          setState({ permissions: new Set(), isLoading: false, error: "Oturum bilgisi bulunamadı. Lütfen giriş yapın." });
          // console.warn("[usePermissions] No 'currentUser' found in localStorage.");
        }
        return;
      }

      try {
        const currentUser: User = JSON.parse(storedUserString);
        // console.log("[usePermissions] Current user from localStorage:", currentUser);

        if (!currentUser || currentUser.id !== currentUserId) {
          if (isMounted) {
            setState({ permissions: new Set(), isLoading: false, error: "Geçersiz kullanıcı bilgisi." });
            // console.warn(`[usePermissions] Mismatch or invalid currentUser. Expected ID: ${currentUserId}, Found:`, currentUser);
          }
          return;
        }
        if (!currentUser.role || typeof currentUser.role !== 'string') {
          if (isMounted) {
            setState({ permissions: new Set(), isLoading: false, error: `Kullanıcı rolü tanımsız veya geçersiz. Kullanıcı Rolü: ${currentUser.role}` });
            // console.warn(`[usePermissions] User role is missing or not a string for user: ${currentUser.id}. Role:`, currentUser.role);
          }
          return;
        }

        const allRoles = await getRoles(); // This will now ensure base roles have correct permissions
        // console.log("[usePermissions] All roles fetched:", allRoles.map(r => ({id: r.id, name: r.name, permsCount: r.permissions?.length || 0})));
        
        const userRoleString = currentUser.role.trim().toLowerCase();
        // console.log("[usePermissions] Attempting to match currentUser.role (trimmed, lowercase):", userRoleString);

        const userRoleData = allRoles.find(r =>
            r.name.trim().toLowerCase() === userRoleString ||
            r.id.trim().toLowerCase() === userRoleString
        );

        // console.log("[usePermissions] Found userRoleData for role string '" + currentUser.role + "':", userRoleData ? {id: userRoleData.id, name: userRoleData.name, permsCount: userRoleData.permissions?.length} : "NOT FOUND");

        if (userRoleData) {
            if (userRoleData.permissions && Array.isArray(userRoleData.permissions)) {
                if (isMounted) {
                    setState({ permissions: new Set(userRoleData.permissions), isLoading: false, error: null });
                    // console.log(`[usePermissions] Successfully set ${userRoleData.permissions.length} permissions for role: ${userRoleData.name}`);
                }
            } else {
                 if (isMounted) {
                    setState({ permissions: new Set(), isLoading: false, error: `"${currentUser.role}" rolü için izinler tanımsız veya geçersiz.` });
                    // console.warn(`[usePermissions] Role data for '${currentUser.role}' found, but permissions array is missing or invalid. Permissions:`, userRoleData.permissions);
                 }
            }
        } else {
            if (isMounted) {
                setState({ permissions: new Set(), isLoading: false, error: `Sistemde "${currentUser.role}" adlı bir rol bulunamadı. Lütfen rol tanımlarını kontrol edin.` });
                // console.warn(`[usePermissions] No role data found for role string: '${currentUser.role}'. Available roles:`, allRoles.map(r => r.name));
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
      const has = state.permissions.has(permissionName);
      // console.log(`[usePermissions] Check: User has permission '${permissionName}'? ${has}. Permissions set:`, Array.from(state.permissions));
      return has;
    },
    [state.permissions]
  );

  return { ...state, hasPermission };
}
