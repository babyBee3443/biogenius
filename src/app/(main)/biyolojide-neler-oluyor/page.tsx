
"use client";

import * as React from 'react';
import { NewsArticleCard } from '@/components/news-article-card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CollectAPIArticle {
  key: string; // Assuming there's a unique key for each article
  url: string;
  description: string | null;
  image: string | null; // Field for image URL
  name: string; // Field for title
  source: string; // Field for source name
  date: string; // Field for publish date
}

interface CollectAPIResponse {
  success: boolean;
  result: CollectAPIArticle[];
}

const CACHE_KEY_COLLECTAPI = 'biyohox_biology_news_collectapi_v1';
const CACHE_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

interface CachedNewsCollectAPI {
  timestamp: number;
  articles: CollectAPIArticle[];
}

const BiyolojideNelerOluyorPage: React.FC = () => {
  const [articles, setArticles] = React.useState<CollectAPIArticle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const collectApiKey = process.env.NEXT_PUBLIC_COLLECTAPI_KEY;

  const fetchNews = React.useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    if (!collectApiKey || collectApiKey === 'YOUR_COLLECTAPI_KEY_HERE') {
      const apiKeyError = "CollectAPI anahtarı yapılandırılmamış. Lütfen .env dosyasını kontrol edin ve NEXT_PUBLIC_COLLECTAPI_KEY değerini girin.";
      setError(apiKeyError);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "API Anahtarı Eksik",
        description: apiKeyError,
        duration: 7000,
      });
      return;
    }

    if (!forceRefresh && typeof window !== 'undefined') {
      const cachedDataString = localStorage.getItem(CACHE_KEY_COLLECTAPI);
      if (cachedDataString) {
        try {
          const cachedData: CachedNewsCollectAPI = JSON.parse(cachedDataString);
          if (Date.now() - cachedData.timestamp < CACHE_DURATION_MS) {
            setArticles(cachedData.articles);
            setIsLoading(false);
            console.log("Loaded news from CollectAPI cache.");
            return;
          }
        } catch (e) {
          console.error("Error parsing cached CollectAPI news data:", e);
          localStorage.removeItem(CACHE_KEY_COLLECTAPI);
        }
      }
    }

    const country = 'tr';
    const tag = 'teknoloji'; // Using 'teknoloji' as it might include biotech, or 'general'
    const apiUrl = `https://api.collectapi.com/news/getNews?country=${country}&tag=${tag}`;

    try {
      console.log("Fetching news from CollectAPI:", apiUrl);
      const response = await fetch(apiUrl, {
        headers: {
          'authorization': `apikey ${collectApiKey}`,
          'content-type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorText = `CollectAPI Error ${response.status}: ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorText = `CollectAPI Error ${response.status} (${errorData.name || 'N/A'}): ${errorData.message || response.statusText}`;
            if (response.status === 401) {
                 errorText = "CollectAPI yetkilendirme hatası. API anahtarınızı kontrol edin.";
            }
        } catch (e) { /* Failed to parse error JSON */ }
        throw new Error(errorText);
      }

      const data: CollectAPIResponse = await response.json();
      console.log("CollectAPI response data (first article):", data.result?.[0]);


      if (data.success && data.result) {
        // Filter out articles that might be missing crucial data, though CollectAPI seems more consistent
        const validArticles = data.result.filter(article => article.name && article.url);
        setArticles(validArticles);
        if (typeof window !== 'undefined') {
          const newCacheData: CachedNewsCollectAPI = {
            timestamp: Date.now(),
            articles: validArticles,
          };
          localStorage.setItem(CACHE_KEY_COLLECTAPI, JSON.stringify(newCacheData));
          console.log("News fetched from CollectAPI and cached.");
        }
      } else {
         throw new Error(data.success === false && data.result === null ? "CollectAPI'den geçerli haber verisi alınamadı (boş sonuç)." : "CollectAPI'den haberler alınırken bilinmeyen bir durum oluştu.");
      }
    } catch (err: any) {
      console.error("Error fetching news from CollectAPI:", err);
      const errorMessage = err.message || "Haberler yüklenirken bilinmeyen bir hata oluştu (CollectAPI).";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Haber Yükleme Hatası",
        description: errorMessage,
        duration: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [collectApiKey]);

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
          <Button onClick={() => fetchNews(true)} disabled={isLoading || !collectApiKey || collectApiKey === 'YOUR_COLLECTAPI_KEY_HERE'} variant="outline">
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
          <p className="text-muted-foreground mb-4 whitespace-pre-line">{error}</p>
          <Button onClick={() => fetchNews(true)} variant="destructive" disabled={!collectApiKey || collectApiKey === 'YOUR_COLLECTAPI_KEY_HERE'}>
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
          {articles.map((article) => (
            <NewsArticleCard
              key={article.key || article.url} // Use 'key' if available, otherwise 'url'
              article={{
                title: article.name,
                description: article.description,
                url: article.url,
                urlToImage: article.image,
                publishedAt: article.date, // Assuming 'date' is the publish date string
                source: { name: article.source, id: null }, // CollectAPI seems to provide source as a string
                author: null, // CollectAPI example doesn't show author
                content: null, // CollectAPI example doesn't show full content
              }}
            />
          ))}
        </div>
      )}

      <footer className="mt-16 pt-8 border-t text-center">
        <p className="text-sm text-muted-foreground">
          Bu içerikler <a href="https://collectapi.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">CollectAPI</a> üzerinden sağlanmaktadır.
        </p>
         <p className="text-xs text-muted-foreground mt-1">
           Haber başlıkları ve içerikleri orijinal kaynaklarından alınmıştır ve BiyoHox sorumluluğunda değildir.
        </p>
      </footer>
    </div>
  );
};

export default BiyolojideNelerOluyorPage;

