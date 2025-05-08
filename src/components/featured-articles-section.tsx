
"use client";

import * as React from 'react';
import { ArticleCard } from './article-card';
import type { ArticleData } from '@/lib/mock-data';

interface FeaturedArticlesSectionProps {
  articles: ArticleData[];
}

const FeaturedArticlesSection: React.FC<FeaturedArticlesSectionProps> = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return <p className="text-muted-foreground">Şu anda öne çıkan makale bulunmamaktadır.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article, index) => (
        <ArticleCard 
          key={article.id} 
          article={article} 
          priority={index < 3} // Prioritize first 3 images in this section
          imageHint="technology biology abstract"
        />
      ))}
    </div>
  );
};

export default FeaturedArticlesSection;
