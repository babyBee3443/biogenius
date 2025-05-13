
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, FileText, HelpCircle, ArrowRight, Users, Loader2, AlertTriangle } from "lucide-react";
import Link from 'next/link';
import { getDailyBiologyFact, type DailyBiologyFactOutput } from '@/ai/flows/get-daily-biology-fact-flow';

// Define a type for the "Latest Note" if it were dynamic
interface LatestNote {
  exists: boolean;
  title?: string;
  link: string;
}

// Define a type for the "Popular Test" if it were dynamic
interface PopularTest {
  title: string;
  category: string;
  solvedBy: number;
  averageSuccess: number;
  link: string;
}

const RecommendedContentSection: React.FC = () => {
  const [todaysFact, setTodaysFact] = React.useState<DailyBiologyFactOutput | null>(null);
  const [isLoadingFact, setIsLoadingFact] = React.useState(true);
  const [factError, setFactError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchFact = async () => {
      setIsLoadingFact(true);
      setFactError(null);
      try {
        const fact = await getDailyBiologyFact();
        setTodaysFact(fact);
      } catch (error: any) {
        console.error("Error fetching daily fact:", error);
        setFactError("Günlük bilgi yüklenirken bir hata oluştu.");
        setTodaysFact({ // Provide a fallback in case of error
            factTitle: "Bilgi Alınamadı",
            factDetail: "Günlük biyoloji bilgisi şu anda mevcut değil. Lütfen daha sonra tekrar deneyin.",
        });
      } finally {
        setIsLoadingFact(false);
      }
    };
    fetchFact();
  }, []);


  // Static data for other cards
  const latestNote: LatestNote = {
    exists: false,
    link: "/admin/biyoloji-notlari/new"
  };

  const popularTest: PopularTest = {
    title: "Popüler Test",
    category: "Hücre Bölünmeleri",
    solvedBy: 856,
    averageSuccess: 72,
    link: "#"
  };

  return (
    <section className="py-12 bg-secondary/50 rounded-lg shadow-inner border border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Bugün Önerilen İçerikler</h2>
            <p className="text-muted-foreground">Günlük önerilerimizle biyoloji öğrenmeye devam et!</p>
          </div>
          <Button asChild variant="default" className="mt-4 md:mt-0">
            <Link href="/biyoloji-notlari">Tüm İçerikler <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Bugünün Bilgisi (AI Powered) */}
          <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-3 pb-3">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-lg">{isLoadingFact ? "Yükleniyor..." : todaysFact?.factTitle || "Bugünün Bilgisi"}</CardTitle>
                <CardDescription className="text-xs">Her gün yeni bir bilimsel gerçek</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              {isLoadingFact ? (
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : factError ? (
                <div className="flex items-center text-destructive text-sm">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {factError}
                </div>
              ) : todaysFact ? (
                <p className="text-sm text-muted-foreground mb-4">{todaysFact.factDetail}</p>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">Bugün için bir bilgi bulunamadı.</p>
              )}
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              {todaysFact?.sourceHint && !isLoadingFact && !factError && (
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="font-semibold">İpucu:</span> "{todaysFact.sourceHint}" diye aratabilirsiniz.
                </p>
              )}
              <Button variant="link" asChild className="p-0 h-auto text-primary hover:text-primary/80" disabled={isLoadingFact || !!factError}>
                <a href={todaysFact?.sourceHint ? `https://www.google.com/search?q=${encodeURIComponent(todaysFact.sourceHint)}` : "#"} target="_blank" rel="noopener noreferrer">
                  Daha Fazla Bilgi <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </Card>

          {/* Card 2: En Son Not */}
          <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-3 pb-3">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <CardTitle className="text-lg">{latestNote.exists ? latestNote.title : "En Son Not"}</CardTitle>
                    <CardDescription className="text-xs">
                        {latestNote.exists ? "En son eklenen biyoloji notu" : "Henüz not eklenmemiş."}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">
                {latestNote.exists ? "Bu nota göz atın." : "Yeni bir not eklendiğinde burada görünecektir."}
              </p>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button variant="link" asChild className="p-0 h-auto text-primary hover:text-primary/80">
                <Link href={latestNote.link}>
                    {latestNote.exists ? "Notu Oku" : "Not Ekle"} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Card 3: Popüler Test */}
          <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center space-x-3 pb-3">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                    <HelpCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              <div>
                <CardTitle className="text-lg">{popularTest.title}</CardTitle>
                <CardDescription className="text-xs">{popularTest.category}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                <span>{popularTest.solvedBy} kişi çözdü</span>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Ortalama Başarı</span>
                  <span>{popularTest.averageSuccess}%</span>
                </div>
                <Progress value={popularTest.averageSuccess} aria-label={`${popularTest.averageSuccess}% başarı`} className="h-2 [&>div]:bg-green-500" />
              </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button variant="default" asChild className="w-full bg-green-600 hover:bg-green-500 text-white">
                <Link href={popularTest.link}>Teste Başla <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RecommendedContentSection;
