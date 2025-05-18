
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Newspaper, FileText, UserCheck } from "lucide-react"; // Added relevant icons
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Dummy data types for placeholder content
interface ArticleStub {
  id: string;
  title: string;
  category: string;
}

interface NoteStub {
  id: string;
  title: string;
  level: string;
}

interface UserStub {
  id: string;
  name: string;
  avatar: string;
}

interface RecentContentAndUsersSectionProps {
  mostReadArticles: (ArticleStub & { views?: number })[]; // Adjusted for potential views property
  pendingDrafts: ((ArticleStub | NoteStub) & { type: 'article' | 'note' })[]; // Adjusted to match actual data structure
  activeUsers: UserStub[];
}


const RecentContentAndUsersSectionComponent: React.FC<RecentContentAndUsersSectionProps> = ({
    mostReadArticles = [],
    pendingDrafts = [],
    activeUsers = []
}) => {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-1">
            <Newspaper className="h-4 w-4 text-primary" /> En Çok Okunanlar (Simüle)
          </CardTitle>
          <CardDescription className="text-xs">En popüler makaleleriniz.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            {mostReadArticles.length > 0 ? mostReadArticles.map(article => (
                 <div key={article.id} className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground truncate">{article.title}</p>
                    <p className="text-xs">Kategori: {article.category} - {article.views || 0} görüntülenme</p>
                 </div>
            )) : <p className="text-sm text-muted-foreground italic">Veri yok.</p>}
        </CardContent>
      </Card>
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-1">
            <FileText className="h-4 w-4 text-orange-500" /> Bekleyen Taslaklar
          </CardTitle>
          <CardDescription className="text-xs">Yayınlanmayı bekleyen içerikler.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
           {pendingDrafts.length > 0 ? pendingDrafts.map(draft => (
                 <div key={draft.id} className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground truncate">{draft.title}</p>
                    <p className="text-xs">Tip: {draft.type === 'article' ? 'Makale' : 'Not'}</p>
                 </div>
            )) : <p className="text-sm text-muted-foreground italic">Bekleyen taslak yok.</p>}
        </CardContent>
      </Card>
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-1">
            <UserCheck className="h-4 w-4 text-green-500" /> Son Aktif Kullanıcılar
          </CardTitle>
           <CardDescription className="text-xs">Son giriş yapan kullanıcılar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            {activeUsers.length > 0 ? activeUsers.map(user => (
                 <div key={user.id} className="text-sm text-muted-foreground truncate">{user.name}</div>
            )) : <p className="text-sm text-muted-foreground italic">Veri yok.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export const RecentContentAndUsersSection = React.memo(RecentContentAndUsersSectionComponent);
export default RecentContentAndUsersSection;
