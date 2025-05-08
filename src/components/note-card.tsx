
"use client";

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import type { NoteData } from '@/lib/mock-data'; // Ensure this path is correct

interface NoteCardProps {
  note: NoteData;
  imageLoading?: "eager" | "lazy";
  imageHint?: string;
}

const NoteCardComponent: React.FC<NoteCardProps> = ({ note, imageLoading = "lazy", imageHint = "biology concept abstract" }) => {
  return (
    <Link href={`/biyoloji-notlari/${note.slug}`} className="block group h-full">
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col h-full">
        {note.imageUrl && (
          <CardHeader className="p-0 relative">
            <div className="aspect-[16/9] relative">
              <Image
                src={note.imageUrl}
                alt={note.title}
                layout="fill"
                objectFit="cover"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading={imageLoading}
                data-ai-hint={imageHint}
              />
            </div>
          </CardHeader>
        )}
        <CardContent className="p-5 flex flex-col flex-grow">
          <CardTitle className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{note.title}</CardTitle>
          <div className="mb-3 space-x-1">
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">{note.category}</Badge>
            <Badge variant="outline" className="text-xs">{note.level}</Badge>
          </div>
          <CardDescription className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">{note.summary}</CardDescription>
          <div className="mt-auto flex justify-end items-center">
            <Button variant="link" size="sm" className="p-0 h-auto text-primary hover:text-primary/80 transition-colors">
              Detayları Gör <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export const NoteCard = React.memo(NoteCardComponent);
