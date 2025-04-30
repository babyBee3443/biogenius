
"use client";

import * as React from "react";
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Twitter, Facebook, Linkedin, Eye } from 'lucide-react'; // Added Eye icon
import type { Block } from '@/components/admin/template-selector'; // Import Block type

interface ArticlePreviewData {
  id: string;
  title: string;
  description: string;
  category: 'Teknoloji' | 'Biyoloji';
  imageUrl: string;
  blocks: Block[];
}

// --- Block Rendering Components ---
// TODO: Implement proper rendering for all block types (matching the final article page)

const TextBlockRenderer: React.FC<{ block: Extract<Block, { type: 'text' }> }> = ({ block }) => (
  <p>{block.content}</p>
);

const HeadingBlockRenderer: React.FC<{ block: Extract<Block, { type: 'heading' }> }> = ({ block }) => {
  const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
  return <Tag>{block.content}</Tag>;
};

const ImageBlockRenderer: React.FC<{ block: Extract<Block, { type: 'image' }> }> = ({ block }) => (
    <figure className="my-6">
        <Image src={block.url} alt={block.alt} width={800} height={400} className="rounded-lg shadow-md mx-auto" />
        {block.caption && <figcaption className="text-center text-sm text-muted-foreground mt-2">{block.caption}</figcaption>}
    </figure>
);

const QuoteBlockRenderer: React.FC<{ block: Extract<Block, { type: 'quote' }> }> = ({ block }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
        <p>{block.content}</p>
        {block.citation && <footer className="mt-2 text-sm">— {block.citation}</footer>}
    </blockquote>
);

const DividerBlockRenderer: React.FC<{ block: Extract<Block, { type: 'divider' }> }> = () => (
    <hr className="my-8" />
);

// Add renderers for other block types (Gallery, Video, Code) as needed
const PlaceholderBlockRenderer: React.FC<{ type: string }> = ({ type }) => (
  <div className="bg-muted p-4 rounded my-4 text-center text-muted-foreground italic">
    [{type} Bloku Önizlemesi]
  </div>
);

// Function to render a single block
const renderBlock = (block: Block) => {
    switch (block.type) {
        case 'text':
            return <TextBlockRenderer key={block.id} block={block} />;
        case 'heading':
            return <HeadingBlockRenderer key={block.id} block={block} />;
        case 'image':
            return <ImageBlockRenderer key={block.id} block={block} />;
        case 'quote':
            return <QuoteBlockRenderer key={block.id} block={block} />;
        case 'divider':
            return <DividerBlockRenderer key={block.id} block={block} />;
        // Add cases for other block types
        case 'gallery':
        case 'video':
        case 'code':
        default:
            return <PlaceholderBlockRenderer key={block.id} type={block.type} />;
    }
};

export default function ArticlePreviewPage() {
  const [articleData, setArticleData] = React.useState<ArticlePreviewData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
        const storedData = localStorage.getItem('articlePreviewData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            // Basic validation
            if (parsedData && parsedData.title && parsedData.blocks) {
                 setArticleData(parsedData);
            } else {
                 setError("Önizleme verisi geçersiz veya eksik.");
            }
        } else {
            setError("Önizleme verisi bulunamadı.");
        }
    } catch (e) {
         console.error("Error parsing preview data:", e);
         setError("Önizleme verisi yüklenirken bir hata oluştu.");
    } finally {
        setIsLoading(false);
    }

     // Optional: Clean up localStorage after loading
     // return () => {
     //   localStorage.removeItem('articlePreviewData');
     // };
  }, []);

   if (isLoading) {
     return <div className="flex justify-center items-center h-screen">Önizleme yükleniyor...</div>;
   }

   if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-2xl font-bold text-destructive mb-4">Önizleme Hatası</h1>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={() => window.close()} variant="outline">Sekmeyi Kapat</Button>
            </div>
        );
    }

   if (!articleData) {
     // This case might be redundant due to error handling, but good as a fallback
     notFound();
   }

    const { title, description, category, imageUrl, blocks } = articleData;

  const categoryLinkClass = category === 'Teknoloji'
    ? 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
    : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300';

  return (
    <div className="bg-background min-h-screen"> {/* Ensure background covers */}
        {/* Preview Banner */}
        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 p-3 text-center text-sm font-medium sticky top-0 z-50 border-b border-yellow-300 dark:border-yellow-700">
            <Eye className="inline-block h-4 w-4 mr-2" /> Bu bir önizlemedir. Değişiklikler henüz kaydedilmedi.
            <Button size="sm" variant="ghost" className="ml-4 h-auto p-1 text-yellow-800 dark:text-yellow-300" onClick={() => window.close()}>
                Kapat
            </Button>
        </div>

        {/* Render article content based on the structure of articles/[id]/page.tsx */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12"> {/* Added padding top */}
          <header className="mb-10">
             <span className={`text-sm font-medium mb-3 inline-block tracking-wide uppercase ${categoryLinkClass}`}>
               {category}
             </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{title || "Başlık Yok"}</h1>
            <p className="text-lg md:text-xl text-muted-foreground">{description || "Açıklama Yok"}</p>
          </header>

          {imageUrl && (
            <div className="mb-10 shadow-xl rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={title || "Ana Görsel"}
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}

          {/* Render Blocks */}
          <div className="prose dark:prose-invert lg:prose-lg max-w-none mb-12">
            {blocks.length > 0 ? (
                 blocks.map(renderBlock)
             ) : (
                 <p className="text-muted-foreground italic">(İçerik Bölümü Yok)</p>
             )}
          </div>

           {/* Static placeholders for Related, Share, Comments sections in preview */}
           <div className="mt-16 border-t border-border/50 pt-10 space-y-10">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">İlgili Makaleler (Placeholder)</h2>
                    <p className="text-muted-foreground text-sm">Gerçek makalede ilgili içerikler burada görünecektir.</p>
                </div>
                 <div>
                    <h2 className="text-2xl font-semibold mb-4">Paylaş (Placeholder)</h2>
                    <div className="flex space-x-3">
                        <Button variant="outline" size="icon" aria-label="Twitter'da paylaş"><Twitter className="h-5 w-5" /></Button>
                        <Button variant="outline" size="icon" aria-label="Facebook'ta paylaş"><Facebook className="h-5 w-5" /></Button>
                        <Button variant="outline" size="icon" aria-label="LinkedIn'de paylaş"><Linkedin className="h-5 w-5" /></Button>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Yorumlar (Placeholder)</h2>
                    <p className="text-muted-foreground text-sm">Gerçek makalede yorum bölümü burada yer alacaktır.</p>
                </div>
            </div>
        </article>
    </div>
  );
}

