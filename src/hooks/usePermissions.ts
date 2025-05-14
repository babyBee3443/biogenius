
"use client";

import * as React from 'react';
import { type User, type Role, getRoles } from '@/lib/mock-data'; // Assuming getRoles is the correct function to fetch all role definitions

interface PermissionsState {
  permissions: Set<string>;
  isLoading: boolean;
  error: string | null;
}

export function usePermissions(currentUserId: string | null) {
  const [state, setState] = React.useState<PermissionsState>({
    permissions: new Set(),
    isLoading: true, // Start with loading true
    error: null,
  });

  React.useEffect(() => {
    let isMounted = true;
    const fetchPermissions = async () => {
      if (!isMounted) return;

      // If currentUserId is null, it means the user is not yet identified or logged out.
      // In this case, permissions are not applicable, and we shouldn't treat it as an error condition here.
      // The calling component (e.g., AdminLayout) is responsible for handling unauthenticated users.
      if (!currentUserId) {
        console.log("[usePermissions] No currentUserId provided. isLoading: false, error: null, empty permissions.");
        if (isMounted) {
          setState({ permissions: new Set(), isLoading: false, error: null });
        }
        return;
      }

      // Proceed to fetch permissions only if currentUserId is available.
      if (isMounted) {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        console.log(`[usePermissions] Fetching permissions for userId: ${currentUserId}`);
      }

      if (typeof window === 'undefined') {
        if (isMounted) {
          // This case should ideally not be hit if currentUserId is present,
          // as localStorage access implies client-side.
          setState({ permissions: new Set(), isLoading: false, error: "Permissions can only be fetched on the client." });
        }
        return;
      }

      const storedUserString = localStorage.getItem('currentUser');
      if (!storedUserString) {
        console.warn("[usePermissions] No 'currentUser' found in localStorage despite currentUserId being present.");
        if (isMounted) {
          // This indicates a discrepancy, possibly currentUser was cleared after ID was set.
          setState({ permissions: new Set(), isLoading: false, error: "Oturum bilgisi localStorage'da bulunamadı." });
        }
        return;
      }

      try {
        const currentUser: User = JSON.parse(storedUserString);
        console.log("[usePermissions] Current user from localStorage:", JSON.stringify(currentUser));

        if (!currentUser || currentUser.id !== currentUserId) {
            console.warn(`[usePermissions] Mismatch or invalid currentUser in localStorage. Expected ID: ${currentUserId}, Found:`, currentUser);
            if (isMounted) {
                setState({ permissions: new Set(), isLoading: false, error: "Geçersiz kullanıcı bilgisi." });
            }
            return;
        }
        if (!currentUser.role || typeof currentUser.role !== 'string') {
            console.warn(`[usePermissions] User role is missing or not a string for user: ${currentUser.id}. Role:`, currentUser.role);
             if (isMounted) {
                setState({ permissions: new Set(), isLoading: false, error: `Kullanıcı rolü tanımsız veya geçersiz. Kullanıcı Rolü: ${currentUser.role}` });
            }
            return;
        }

        const allRoles = await getRoles();
        console.log("[usePermissions] All roles fetched:", JSON.stringify(allRoles.map(r => ({id: r.id, name: r.name}))));
        const userRoleString = currentUser.role.toLowerCase();
        console.log("[usePermissions] Attempting to match currentUser.role (lowercase):", userRoleString);

        const userRoleData = allRoles.find(r =>
            r.name.toLowerCase() === userRoleString ||
            r.id.toLowerCase() === userRoleString
        );

        console.log("[usePermissions] Found userRoleData for role string '" + currentUser.role + "':", userRoleData ? JSON.stringify({id: userRoleData.id, name: userRoleData.name, permsCount: userRoleData.permissions?.length}) : "NOT FOUND");

        if (userRoleData) {
            if (userRoleData.permissions && Array.isArray(userRoleData.permissions)) {
                if (isMounted) {
                    setState({ permissions: new Set(userRoleData.permissions), isLoading: false, error: null });
                    console.log(`[usePermissions] Successfully set ${userRoleData.permissions.length} permissions for role: ${userRoleData.name}`);
                }
            } else {
                 console.warn(`[usePermissions] Role data for '${currentUser.role}' found, but permissions array is missing, not an array, or undefined. Permissions:`, userRoleData.permissions);
                 if (isMounted) {
                    setState({ permissions: new Set(), isLoading: false, error: `"${currentUser.role}" rolü için izinler tanımsız veya geçersiz.` });
                 }
            }
        } else {
            console.warn(`[usePermissions] No role data found for role string: '${currentUser.role}'. Searched in roles:`, allRoles.map(r => ({ id: r.id, name: r.name })));
            if (isMounted) {
                setState({ permissions: new Set(), isLoading: false, error: `Sistemde "${currentUser.role}" rolü bulunamadı veya rol için izin tanımlanmamış. Tanımlı roller: ${allRoles.map(r => r.name).join(', ')}` });
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
