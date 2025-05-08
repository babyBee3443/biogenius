
"use client";

import * as React from 'react';
import { ArticleCard } from './article-card';
import type { ArticleData } from '@/lib/mock-data';

interface RecentArticlesSectionProps {
  articles: ArticleData[];
}

const RecentArticlesSection: React.FC<RecentArticlesSectionProps> = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return <p className="text-muted-foreground">Yakın zamanda yayınlanmış makale bulunmamaktadır.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article) => (
        <ArticleCard 
          key={article.id} 
          article={article} 
          imageLoading="lazy"
          imageHint="recent abstract data"
        />
      ))}
    </div>
  );
};

export default RecentArticlesSection;
