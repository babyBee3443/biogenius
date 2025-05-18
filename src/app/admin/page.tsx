
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  Newspaper,
  Eye,
  Users,
  MessageSquare,
  ArrowUpRight,
  Upload,
  Clock,
  LineChart,
  ExternalLink,
  Smartphone,
  FileText,
  Search,
  TrendingUp,
  Gauge,
  Server,
  AlertTriangle,
  RefreshCw,
  Activity,
  Loader2,
  Home,
  BookOpen,
  FileEdit, // For pending drafts
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getArticles, type ArticleData } from '@/lib/data/articles';
import { getNotes, type NoteData } from '@/lib/data/notes'; // Import notes data
import { getUsers, type User } from '@/lib/data/users';
import * as React from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import dynamic from "next/dynamic"; // Import dynamic

// --- Dynamic Imports for Sections ---
const TotalStatsCards = dynamic(() => import('@/components/admin/dashboard/total-stats-cards').then(mod => mod.TotalStatsCards), {
  loading: () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[120px] w-full rounded-lg" />)}
    </div>
  ),
  ssr: false
});

const PlaceholderAnalyticsCards = dynamic(() => import('@/components/admin/dashboard/placeholder-analytics-cards').then(mod => mod.PlaceholderAnalyticsCards), {
  loading: () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[120px] w-full rounded-lg" />)}
    </div>
  ),
  ssr: false
});

const ChartsSection = dynamic(() => import('@/components/admin/dashboard/charts-section').then(mod => mod.ChartsSection), {
  loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
  ssr: false
});

const RecentContentAndUsersSection = dynamic(() => import('@/components/admin/dashboard/recent-content-users-section').then(mod => mod.RecentContentAndUsersSection), {
  loading: () => (
    <div className="grid gap-6 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[300px] w-full rounded-lg" />)}
    </div>
  ),
  ssr: false
});

const PerformanceMetricsSection = dynamic(() => import('@/components/admin/dashboard/performance-metrics-section').then(mod => mod.PerformanceMetricsSection), {
  loading: () => (
     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[120px] w-full rounded-lg" />)}
    </div>
  ),
  ssr: false
});
// --- End Dynamic Imports ---


async function getTotalCommentCount(): Promise<number> {
  return 0;
}

export default function AdminDashboard() {
  const [totalArticles, setTotalArticles] = React.useState(0);
  const [totalNotes, setTotalNotes] = React.useState(0); // State for total notes
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [totalComments, setTotalComments] = React.useState(0);
  const [recentArticles, setRecentArticles] = React.useState<ArticleData[]>([]);
  const [mostReadArticles, setMostReadArticles] = React.useState< (ArticleData & { views?: number })[] >([]);
  const [pendingDrafts, setPendingDrafts] = React.useState< ( (ArticleData | NoteData) & { type: 'article' | 'note' } )[] >([]);
  const [activeUsers, setActiveUsers] = React.useState<User[]>([]);
  const [loadingData, setLoadingData] = React.useState(true);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = React.useState(false);


  React.useEffect(() => {
    let isMounted = true;
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (isMounted) setCurrentUserId(user.id || null);
        } catch (e) {
          console.error("Error parsing currentUser in AdminDashboard", e);
          if (isMounted) setCurrentUserId(null);
        }
      } else {
        if (isMounted) setCurrentUserId(null);
      }
      if (isMounted) setIsInitialLoadComplete(true);
    }
    return () => { isMounted = false; };
  }, []);


  const { hasPermission, isLoading: permissionsLoading, error: permissionsError } = usePermissions(currentUserId);
  const router = useRouter();

  const fetchData = React.useCallback(async () => {
    setLoadingData(true);
    try {
      const [
        articlesData,
        notesData, // Fetch notes
        usersData,
        commentsData,
      ] = await Promise.all([
        getArticles(),
        getNotes(), // Get notes
        getUsers(),
        getTotalCommentCount(),
      ]);

      setTotalArticles(articlesData.length);
      setTotalNotes(notesData.length); // Set total notes
      setTotalUsers(usersData.length);
      setTotalComments(commentsData);

      setRecentArticles(
        articlesData
          .filter(a => a.status === 'Yayınlandı')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3) // Show 3 recent articles
      );

      // Simulate most read articles
      const articlesWithViews = articlesData.map(a => ({...a, views: Math.floor(Math.random() * 1000) + 50 }));
      setMostReadArticles(
        articlesWithViews
            .filter(a => a.status === 'Yayınlandı')
            .sort((a,b) => (b.views || 0) - (a.views || 0))
            .slice(0, 3) // Show 3 most read
      );

      // Pending drafts (articles and notes)
      const articleDrafts = articlesData
        .filter(a => a.status === 'Taslak' || a.status === 'İncelemede')
        .map(a => ({ ...a, type: 'article' as 'article' }));
      const noteDrafts = notesData
        .filter(n => n.status === 'Taslak' || n.status === 'İncelemede')
        .map(n => ({ ...n, type: 'note' as 'note' }));
      setPendingDrafts(
          [...articleDrafts, ...noteDrafts]
            .sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5) // Show 5 pending drafts
      );


      setActiveUsers(
        usersData
          .filter(u => u.lastLogin)
          .sort((a, b) => new Date(b.lastLogin!).getTime() - new Date(a.lastLogin!).getTime())
          .slice(0, 5)
      );

    } catch (error) {
      console.error("[AdminDashboard] Error fetching dashboard data:", error);
      toast({ variant: "destructive", title: "Veri Yükleme Hatası", description: "Gösterge paneli verileri yüklenemedi."})
    } finally {
      setLoadingData(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isInitialLoadComplete) {
        return;
    }

    if (!currentUserId) {
        setLoadingData(false);
        return;
    }

    if (permissionsLoading) {
        return;
    }

    if (permissionsError) {
        console.error("[AdminDashboard] Permissions error:", permissionsError);
        setLoadingData(false);
        return;
    }

    if (!hasPermission('Dashboard Görüntüleme')) {
        setLoadingData(false);
        return;
    }

    fetchData();

  }, [isInitialLoadComplete, currentUserId, fetchData, permissionsLoading, hasPermission, router, permissionsError]);

  if (!isInitialLoadComplete || (currentUserId && permissionsLoading) || (loadingData && !isInitialLoadComplete && !currentUserId) ) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
            Gösterge Paneli Yükleniyor...
        </div>
    );
  }

  if (permissionsError && currentUserId) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive text-lg mb-2">Yetkilendirme Hatası</p>
            <p className="text-muted-foreground max-w-md text-center">{permissionsError}</p>
        </div>
    );
  }

  if (!hasPermission('Dashboard Görüntüleme') && currentUserId) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive text-lg mb-2">Erişim Reddedildi</p>
            <p className="text-muted-foreground max-w-md text-center">
                Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.
            </p>
        </div>
    );
  }


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">İstatistikler</h1>
        <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={fetchData} disabled={loadingData}>
               <RefreshCw className="mr-2 h-4 w-4" /> Verileri Yenile
            </Button>
            <Button variant="outline" asChild size="sm">
                <Link href="/" target="_blank">
                    <Home className="mr-2 h-4 w-4" /> Siteyi Görüntüle
                </Link>
            </Button>
        </div>
      </div>

      <TotalStatsCards
        totalArticles={totalArticles}
        totalNotes={totalNotes}
        totalUsers={totalUsers}
        totalComments={totalComments}
      />

      <PlaceholderAnalyticsCards />
      <ChartsSection />
      <RecentContentAndUsersSection
        mostReadArticles={mostReadArticles}
        pendingDrafts={pendingDrafts}
        activeUsers={activeUsers}
      />
      <PerformanceMetricsSection />
    </div>
  );
}
