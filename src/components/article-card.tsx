
"use client";

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { ArticleData } from '@/lib/mock-data'; // Ensure this path is correct

interface ArticleCardProps {
  article: ArticleData;
  priority?: boolean;
  imageLoading?: "eager" | "lazy";
  imageHint?: string;
}

const ArticleCardComponent: React.FC<ArticleCardProps> = ({ article, priority = false, imageLoading, imageHint = "article abstract" }) => {
  const categoryClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col group h-full">
      {article.mainImageUrl && (
        <CardHeader className="p-0 relative">
          <Link href={`/articles/${article.id}`} passHref legacyBehavior>
            <a className="block aspect-[16/9] relative">
              <Image
                src={article.mainImageUrl}
                alt={article.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
                priority={priority}
                loading={imageLoading || (priority ? "eager" : "lazy")}
                data-ai-hint={imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </Link>
        </CardHeader>
      )}
      <CardContent className="p-6 flex flex-col flex-grow">
        <CardTitle className="text-xl font-semibold mb-3">
          <Link href={`/articles/${article.id}`} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </CardTitle>
        {article.excerpt && (
          <CardDescription className="text-muted-foreground mb-5 flex-grow line-clamp-3">
            {article.excerpt}
          </CardDescription>
        )}
        <div className="mt-auto flex justify-between items-center">
          <span className={`text-xs font-semibold px-2 py-1 rounded ${categoryClass}`}>
            {article.category}
          </span>
          <Button asChild variant="link" className="p-0 h-auto text-primary hover:text-primary/80 transition-colors">
            <Link href={`/articles/${article.id}`} className="flex items-center">
              Devamını Oku <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const ArticleCard = React.memo(ArticleCardComponent);
