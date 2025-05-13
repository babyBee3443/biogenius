"use client"; // This layout must be a client component to access localStorage

import * as React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import MaintenancePage from '@/app/maintenance/page'; // Import the maintenance page

const MAINTENANCE_MODE_KEY = 'maintenanceModeActive';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMaintenanceMode, setIsMaintenanceMode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // This effect runs only on the client-side
    const checkMaintenanceMode = () => {
      const maintenanceStatus = localStorage.getItem(MAINTENANCE_MODE_KEY);
      setIsMaintenanceMode(maintenanceStatus === 'true');
      setIsLoading(false);
    };

    checkMaintenanceMode();

    // Optional: Listen for changes to maintenance mode from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === MAINTENANCE_MODE_KEY) {
        setIsMaintenanceMode(event.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Optional: Listen for custom event if settings page dispatches one
    const handleMaintenanceModeEvent = () => checkMaintenanceMode();
    // Assuming your settings page might dispatch an event like this:
    // window.dispatchEvent(new CustomEvent('maintenanceModeChanged'));
    // For now, we'll rely on localStorage change or initial load.

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      // window.removeEventListener('maintenanceModeChanged', handleMaintenanceModeEvent);
    };
  }, []);

  if (isLoading) {
    // You can render a loading spinner or a minimal layout here
    // to avoid flashing the main content before checking maintenance mode.
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        {/* Optional: Add a loader */}
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