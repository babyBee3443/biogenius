
"use client";

import *G React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, CalendarDays, Newspaper } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale'; // For Turkish date formatting

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

interface NewsArticleCardProps {
  article: NewsAPIArticle;
}

export const NewsArticleCard: React.FC<NewsArticleCardProps> = ({ article }) => {
  const formattedDate = article.publishedAt
    ? format(parseISO(article.publishedAt), 'dd MMMM yyyy, HH:mm', { locale: tr })
    : 'Tarih Bilgisi Yok';

  const descriptionSnippet = article.description
    ? (article.description.length > 150 ? article.description.substring(0, 147) + '...' : article.description)
    : 'Açıklama bulunmamaktadır.';

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group bg-card">
      {article.urlToImage ? (
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={article.urlToImage}
            alt={article.title || 'Haber Görseli'}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-110"
            data-ai-hint="news biology research"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ) : (
        <div className="w-full aspect-[16/9] bg-muted flex items-center justify-center text-muted-foreground">
          <Newspaper className="h-12 w-12" />
        </div>
      )}
      <CardContent className="p-5 flex flex-col flex-grow">
        <CardTitle className="text-lg font-semibold mb-2 leading-tight group-hover:text-primary transition-colors">
          {article.title || "Başlık Yok"}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
          {descriptionSnippet}
        </CardDescription>
        <div className="text-xs text-muted-foreground mb-4 space-y-1">
          <div className="flex items-center">
            <Newspaper className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>{article.source.name || 'Bilinmeyen Kaynak'}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>
        <Button
          asChild
          variant="default"
          size="sm"
          className="mt-auto w-full bg-primary hover:bg-primary/90 text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/30 transition-shadow"
        >
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Devamını Oku <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};
