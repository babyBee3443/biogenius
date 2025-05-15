
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Tag } from 'lucide-react';
import { getNoteById, getNotes, type NoteData } from '@/lib/data/notes'; // Corrected import
import type { Block } from '@/components/admin/template-selector';
import { Badge } from "@/components/ui/badge";
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NoteCard } from '@/components/note-card';
import { Skeleton } from '@/components/ui/skeleton'; // Added Skeleton
import * as React from 'react'; // Import React for Fragment

// --- Block Rendering Components ---
const TextBlockRenderer: React.FC<{ block: Extract<Block, { type: 'text' }> }> = ({ block }) => (
  <div dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, '<br />') }} />
);

const HeadingBlockRenderer: React.FC<{ block: Extract<Block, { type: 'heading' }> }> = ({ block }) => {
  const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
  return <Tag>{block.content}</Tag>;
};

const ImageBlockRenderer: React.FC<{ block: Extract<Block, { type: 'image' }> }> = ({ block }) => (
    <figure className="my-6">
        <Image
            src={block.url}
            alt={block.alt || 'Not Görseli'}
            width={700}
            height={400}
            className="rounded-lg shadow-md mx-auto max-w-full h-auto"
            data-ai-hint="biology diagram illustration" 
            loading="lazy" // Ensure images within blocks are lazy-loaded
         />
        {block.caption && <figcaption className="text-center text-sm text-muted-foreground mt-2">{block.caption}</figcaption>}
    </figure>
);

const QuoteBlockRenderer: React.FC<{ block: Extract<Block, { type: 'quote' }> }> = ({ block }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6 bg-secondary/30 p-4 rounded-r-lg">
        <p>{block.content}</p>
        {block.citation && <footer className="mt-2 text-sm not-italic">— {block.citation}</footer>}
    </blockquote>
);

const DividerBlockRenderer: React.FC = () => (
    <hr className="my-8 border-border/50" />
);

const VideoBlockRenderer: React.FC<{ block: Extract<Block, { type: 'video' }> }> = ({ block }) => {
    const getYouTubeId = (url: string): string | null => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = block.youtubeId || getYouTubeId(block.url);

    if (videoId) {
        return (
            <div className="aspect-video my-6 shadow-md rounded-lg overflow-hidden">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy" // Lazy load iframes
                ></iframe>
            </div>
        );
    }
     return <PlaceholderBlockRenderer type="video" />;
};

const PlaceholderBlockRenderer: React.FC<{ type: string }> = ({ type }) => (
  <div className="bg-muted p-4 rounded my-4 text-center text-muted-foreground italic">
    [{type} Bloku İçeriği]
  </div>
);

const renderBlock = (block: Block) => {
    switch (block.type) {
        case 'text': return <TextBlockRenderer key={block.id} block={block} />;
        case 'heading': return <HeadingBlockRenderer key={block.id} block={block} />;
        case 'image': return <ImageBlockRenderer key={block.id} block={block} />;
        case 'quote': return <QuoteBlockRenderer key={block.id} block={block} />;
        case 'divider': return <DividerBlockRenderer key={block.id} />;
        case 'video': return <VideoBlockRenderer key={block.id} block={block} />;
        default: return <PlaceholderBlockRenderer key={block.id} type={block.type} />;
    }
};

interface NotePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const notes = await getNotes();
  return notes.map((note) => ({
    slug: note.slug,
  }));
}


export default async function NotePage({ params }: NotePageProps) {
  const noteSlug = params.slug;
  const note = await getNoteById(noteSlug); 


  if (!note) {
    notFound();
  }

  const allNotes = await getNotes(); 
  const relatedNotes = allNotes
      .filter(n => n.category === note.category && n.id !== note.id)
      .slice(0, 3);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-8 pt-4">
         <Link href="/biyoloji-notlari" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center mb-2">
             <ArrowLeft className="mr-1 h-3 w-3" /> Biyoloji Notlarına Dön
         </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{note.title}</h1>
         <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
             <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">{note.category}</Badge>
             <Badge variant="outline">{note.level}</Badge>
             <span>|</span>
             <span>Son Güncelleme: {new Date(note.updatedAt).toLocaleDateString('tr-TR')}</span>
         </div>
          {note.tags && note.tags.length > 0 && (
             <div className="flex flex-wrap gap-2 mt-3">
                {note.tags.map(tag => (
                     <Badge key={tag} variant="outline" className="text-xs font-normal flex items-center gap-1">
                         <Tag className="h-3 w-3"/>{tag}
                    </Badge>
                ))}
             </div>
         )}
      </header>

      {note.imageUrl && (
          <div className="mb-8 shadow-lg rounded-lg overflow-hidden">
            <Image
                src={note.imageUrl}
                alt={note.title}
                width={800}
                height={400}
                className="w-full h-auto object-cover"
                priority // Prioritize the main note image for LCP
                data-ai-hint="biology note header image"
            />
          </div>
      )}

        {note.summary && (
            <p className="text-lg text-muted-foreground mb-8 p-4 bg-secondary/40 rounded-md border border-border/50">
                {note.summary}
            </p>
        )}
      
      {/* AdSense Placeholder - İçerik Başı */}
      <div className="my-8 p-4 text-center bg-muted/30 border border-dashed border-border rounded-lg">
        {/* Google AdSense Reklam Birimi Kodu Buraya Eklenecek (Örn: İçerik İçi Duyarlı) */}
        <p className="text-sm text-muted-foreground">Reklam Alanı (Örn: İçerik İçi)</p>
      </div>

      <div className="prose dark:prose-invert lg:prose-lg max-w-none mb-12">
        {note.contentBlocks && note.contentBlocks.length > 0 ? (
             note.contentBlocks.map((block, index) => (
                <React.Fragment key={block.id}>
                    {renderBlock(block)}
                    {/* AdSense Placeholder - Paragraf Arası */}
                    {(index === 1 || index === 3) && ( // Örnek: 2. ve 4. bloktan sonra
                         <div className="my-8 p-4 text-center bg-muted/30 border border-dashed border-border rounded-lg">
                            {/* Google AdSense Reklam Birimi Kodu Buraya Eklenecek (Örn: İçerik İçi Duyarlı) */}
                            <p className="text-sm text-muted-foreground">Reklam Alanı (Örn: Paragraf Arası)</p>
                        </div>
                    )}
                </React.Fragment>
            ))
         ) : (
             <p className="text-muted-foreground italic">(Bu not için içerik bulunamadı.)</p>
         )}
      </div>

       {relatedNotes.length > 0 && (
          <div className="mt-16 border-t border-border/50 pt-10">
             <h2 className="text-2xl font-semibold mb-6">İlgili Notlar</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 {relatedNotes.map(relNote => (
                    <NoteCard key={relNote.id} note={relNote} imageLoading="lazy" imageHint="related note biology"/>
                 ))}
             </div>
           </div>
       )}
      
      {/* AdSense Placeholder - Sayfa Sonu */}
      <div className="mt-12 mb-8 p-4 text-center bg-muted/30 border border-dashed border-border rounded-lg">
        {/* Google AdSense Reklam Birimi Kodu Buraya Eklenecek (Örn: Yatay Banner) */}
        <p className="text-sm text-muted-foreground">Reklam Alanı (Örn: Alt Leaderboard)</p>
      </div>

       <div className="mt-16 mb-8 text-center">
           <Button asChild variant="outline">
               <Link href="/biyoloji-notlari" className="inline-flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Notlar Listesine Dön
               </Link>
           </Button>
       </div>
    </article>
  );
}

