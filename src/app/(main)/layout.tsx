
"use client"; // This layout must be a client component to access localStorage

import * as React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import MaintenancePage from '@/app/maintenance/page'; // Import the maintenance page
import { Loader2 } from 'lucide-react'; // Import Loader2 for loading state

const MAINTENANCE_MODE_KEY = 'maintenanceModeActive';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMaintenanceMode, setIsMaintenanceMode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true); // Start with loading true

  React.useEffect(() => {
    // This effect runs only on the client-side
    let isMounted = true;
    const checkMaintenanceMode = () => {
      if (typeof window !== 'undefined') {
        const maintenanceStatus = localStorage.getItem(MAINTENANCE_MODE_KEY);
        if (isMounted) {
          setIsMaintenanceMode(maintenanceStatus === 'true');
          setIsLoading(false); // Set loading to false after checking
        }
      } else {
         if (isMounted) {
            setIsLoading(false); // Also set loading to false if not in browser (e.g. during SSR pre-render pass)
         }
      }
    };

    checkMaintenanceMode();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === MAINTENANCE_MODE_KEY) {
        if (isMounted) {
          setIsMaintenanceMode(event.newValue === 'true');
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom event from settings page
    const handleMaintenanceModeUpdatedEvent = () => {
      console.log("MainLayout: maintenanceModeUpdated event received");
      checkMaintenanceMode();
    };
    window.addEventListener('maintenanceModeUpdated', handleMaintenanceModeUpdatedEvent);


    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('maintenanceModeUpdated', handleMaintenanceModeUpdatedEvent);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-12">{children}</main>
      <Footer />
    </div>
  );
}
