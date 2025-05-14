
"use client";

import *G React from 'react';
import { NewsArticleCard } from '@/components/news-article-card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NewsAPIArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
  code?: string; // For error responses
  message?: string; // For error responses
}

const CACHE_KEY = 'biyohox_biology_news_v1';
const CACHE_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

interface CachedNews {
  timestamp: number;
  articles: NewsAPIArticle[];
}

const BiyolojideNelerOluyorPage: React.FC = () => {
  const [articles, setArticles] = React.useState<NewsAPIArticle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const newsApiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  const fetchNews = React.useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    if (!newsApiKey) {
      setError("News API anahtarı yapılandırılmamış. Lütfen .env dosyasını kontrol edin.");
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "API Anahtarı Eksik",
        description: "Haberleri getirmek için News API anahtarı gerekli.",
      });
      return;
    }

    if (!forceRefresh && typeof window !== 'undefined') {
      const cachedDataString = localStorage.getItem(CACHE_KEY);
      if (cachedDataString) {
        try {
          const cachedData: CachedNews = JSON.parse(cachedDataString);
          if (Date.now() - cachedData.timestamp < CACHE_DURATION_MS) {
            setArticles(cachedData.articles);
            setIsLoading(false);
            console.log("Loaded news from cache.");
            return;
          }
        } catch (e) {
          console.error("Error parsing cached news data:", e);
          localStorage.removeItem(CACHE_KEY); // Clear corrupted cache
        }
      }
    }

    const keywords = [
      'biology', 'genetics', 'molecular biology', 'evolution', 'biotechnology',
      'microbiology', 'neuroscience', 'ecology', 'cell biology', 'bioinformatics',
      'synthetic biology', 'immunology', 'drug discovery', 'genome editing', 'crispr',
      'stem cells', 'cancer research', 'virology', 'pandemic', 'vaccine development',
      'biodiversity', 'climate change biology', 'conservation biology', 'marine biology',
      'plant science', 'photosynthesis', 'dna sequencing', 'protein folding', 'bioethics'
    ];
    // Join keywords with OR, and ensure each keyword is significant for the query
    // NewsAPI might handle single complex terms better than many ORs.
    // Let's try a more focused query:
    const query = `(${keywords.slice(0,10).join(' OR ')})`; // Limit to first 10 for wider reach initially
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=21&apiKey=${newsApiKey}`;

    try {
      console.log("Fetching news from API:", url);
      const response = await fetch(url);
      if (!response.ok) {
        const errorData: NewsAPIResponse = await response.json();
        throw new Error(`API Error ${response.status} (${errorData.code}): ${errorData.message || response.statusText}`);
      }
      const data: NewsAPIResponse = await response.json();

      if (data.status === 'ok') {
        const validArticles = data.articles.filter(article => article.title && article.urlToImage && article.description);
        setArticles(validArticles);
        if (typeof window !== 'undefined') {
          const newCacheData: CachedNews = {
            timestamp: Date.now(),
            articles: validArticles,
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(newCacheData));
          console.log("News fetched from API and cached.");
        }
      } else if (data.status === 'error') {
         throw new Error(`API Error (${data.code}): ${data.message}`);
      }
    } catch (err: any) {
      console.error("Error fetching news:", err);
      setError(err.message || "Haberler yüklenirken bilinmeyen bir hata oluştu.");
      toast({
        variant: "destructive",
        title: "Haber Yükleme Hatası",
        description: err.message || "Lütfen daha sonra tekrar deneyin.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [newsApiKey]);

  React.useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center justify-center">
          <span role="img" aria-label="microscope" className="mr-3 text-5xl md:text-6xl">🔬</span>
          Biyolojide Neler Oluyor?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Dünya çapında biyolojiyle ilgili en güncel gelişmeler, araştırmalar ve keşifler burada.
        </p>
        <div className="mt-6">
          <Button onClick={() => fetchNews(true)} disabled={isLoading || !newsApiKey} variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Haberleri Yenile
          </Button>
        </div>
      </header>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <span className="ml-4 text-lg text-muted-foreground">Haberler yükleniyor...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center py-20 bg-destructive/10 p-6 rounded-lg border border-destructive/30">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-destructive mb-2">Bir Hata Oluştu</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => fetchNews(true)} variant="destructive" disabled={!newsApiKey}>
            Tekrar Dene
          </Button>
        </div>
      )}

      {!isLoading && !error && articles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">Şu anda gösterilecek güncel biyoloji haberi bulunamadı.</p>
          <p className="text-sm text-muted-foreground mt-2">Lütfen daha sonra tekrar kontrol edin veya API anahtarınızı doğrulayın.</p>
        </div>
      )}

      {!isLoading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article, index) => (
            <NewsArticleCard key={article.url || index} article={article} />
          ))}
        </div>
      )}

      <footer className="mt-16 pt-8 border-t text-center">
        <p className="text-sm text-muted-foreground">
          Bu içerikler <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">NewsAPI.org</a> üzerinden sağlanmaktadır.
        </p>
         <p className="text-xs text-muted-foreground mt-1">
           Haber başlıkları ve içerikleri orijinal kaynaklarından alınmıştır ve BiyoHox sorumluluğunda değildir.
        </p>
      </footer>
    </div>
  );
};

export default BiyolojideNelerOluyorPage;
