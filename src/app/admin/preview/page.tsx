"use client";

import * as React from "react";
import { notFound, useSearchParams } from 'next/navigation'; // Keep useSearchParams for potential future use or debugging
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Twitter, Facebook, Linkedin, Eye, Video as VideoIcon, Loader2, AlertTriangle } from 'lucide-react';
import type { Block } from '@/components/admin/template-selector';
import type { ArticleData } from '@/lib/mock-data';

// --- Block Rendering Components (Simplified versions for preview) ---

const TextBlockRenderer: React.FC<{ block: Extract<Block, { type: 'text' }> }> = ({ block }) => (
  <div dangerouslySetInnerHTML={{ __html: block.content?.replace(/\n/g, '<br />') || '<p class="italic text-muted-foreground">[Boş Metin Bloğu]</p>' }} />
);

const HeadingBlockRenderer: React.FC<{ block: Extract<Block, { type: 'heading' }> }> = ({ block }) => {
  const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
  return <Tag>{block.content || <span className="italic text-muted-foreground">[Boş Başlık]</span>}</Tag>;
};

const ImageBlockRenderer: React.FC<{ block: Extract<Block, { type: 'image' }> }> = ({ block }) => (
    <figure className="my-6">
        {block.url ? (
            <Image src={block.url} alt={block.alt || 'Makale Görseli'} width={800} height={400} className="rounded-lg shadow-md mx-auto max-w-full h-auto" data-ai-hint="article content placeholder"/>
        ) : (
            <div className="bg-muted rounded-lg aspect-video flex items-center justify-center text-muted-foreground italic">
                [Görsel Alanı - URL Yok]
            </div>
        )}
        {block.caption && <figcaption className="text-center text-sm text-muted-foreground mt-2">{block.caption}</figcaption>}
    </figure>
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
                ></iframe>
            </div>
        );
    }
     return <PlaceholderBlockRenderer type="video" />;
};

const QuoteBlockRenderer: React.FC<{ block: Extract<Block, { type: 'quote' }> }> = ({ block }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
        <p>{block.content || <span className="italic text-muted-foreground">[Boş Alıntı]</span>}</p>
        {block.citation && <footer className="mt-2 text-sm not-italic">— {block.citation}</footer>}
    </blockquote>
);

const DividerBlockRenderer: React.FC<{ block: Extract<Block, { type: 'divider' }> }> = () => (
    <hr className="my-8" />
);

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
         case 'video':
             return <VideoBlockRenderer key={block.id} block={block} />;
        case 'divider':
            return <DividerBlockRenderer key={block.id} block={block} />;
        case 'gallery':
        case 'code':
        case 'section':
        default:
            return <PlaceholderBlockRenderer key={block.id} type={block.type} />;
    }
};

const PREVIEW_STORAGE_KEY = 'preview_data'; // Define the fixed key

export default function ArticlePreviewPage() {
  const [previewData, setPreviewData] = React.useState<Partial<ArticleData> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    console.log("[ArticlePreviewPage] useEffect triggered.");

    if (typeof window === 'undefined') {
      console.log("[ArticlePreviewPage] Running on server, skipping localStorage logic.");
      setIsLoading(false);
      return;
    }
    console.log("[ArticlePreviewPage] Running on client.");

    const loadPreview = () => {
        if (!isMounted) return;

        console.log(`[ArticlePreviewPage] Attempting to load data from localStorage with key: ${PREVIEW_STORAGE_KEY}`);
        try {
            const storedData = localStorage.getItem(PREVIEW_STORAGE_KEY);

            if (storedData) {
                console.log(`[ArticlePreviewPage] Found data in localStorage for key ${PREVIEW_STORAGE_KEY}. Length: ${storedData.length}.`);
                // console.log(`[ArticlePreviewPage] Raw data:`, storedData.substring(0, 500) + '...'); // Log beginning of raw data

                let parsedData;
                try {
                    parsedData = JSON.parse(storedData);
                    console.log("[ArticlePreviewPage] Parsed data successfully.");
                    // console.log("[ArticlePreviewPage] Parsed data content:", parsedData); // More detailed log

                    if (!parsedData || typeof parsedData !== 'object' || Object.keys(parsedData).length === 0) {
                         const errorMsg = `Geçersiz veya boş önizleme verisi yapısı.`;
                         console.error("[ArticlePreviewPage]", errorMsg, parsedData);
                         if (isMounted) setError(errorMsg);
                         return; // Stop execution if data is invalid
                    }
                } catch (parseError: any) {
                    console.error("[ArticlePreviewPage] JSON parse error:", parseError);
                    // console.error("[ArticlePreviewPage] Raw data causing parse error:", storedData);
                    if (isMounted) setError(`Önizleme verisi okunamadı (JSON Parse Hatası): ${parseError.message}.`);
                    return; // Stop execution on parse error
                }

                // Basic validation and normalization (Ensure required fields exist)
                if (typeof parsedData.title === 'string' && parsedData.title && Array.isArray(parsedData.blocks)) {
                    const normalizedData: Partial<ArticleData> = {
                        ...parsedData,
                        excerpt: parsedData.excerpt ?? parsedData.description, // Normalize excerpt/description
                        mainImageUrl: parsedData.mainImageUrl ?? parsedData.imageUrl, // Normalize image URL
                    };
                    console.log("[ArticlePreviewPage] Data validated and normalized.");
                    // console.log("[ArticlePreviewPage] Normalized data:", normalizedData);
                    if (isMounted) {
                         setPreviewData(normalizedData);
                         setError(null);
                    }
                } else {
                    const missingFields = [];
                    if (typeof parsedData.title !== 'string' || !parsedData.title) missingFields.push("title");
                    if (!Array.isArray(parsedData.blocks)) missingFields.push("blocks");
                    const errorMsg = `Önizleme verisi eksik alanlar içeriyor: ${missingFields.join(', ')}.`;
                    console.error("[ArticlePreviewPage]", errorMsg, parsedData);
                    if (isMounted) setError(errorMsg);
                }
            } else {
                const errorMsg = `Önizleme verisi bulunamadı (Anahtar: ${PREVIEW_STORAGE_KEY}). Lütfen makaleyi veya şablonu kaydedip tekrar deneyin.`;
                console.error("[ArticlePreviewPage]", errorMsg);
                if (isMounted) setError(errorMsg);
            }
        } catch (e: any) {
            console.error("[ArticlePreviewPage] LocalStorage erişim hatası:", e);
            if (isMounted) setError(`Önizleme verisi yüklenirken bir hata oluştu: ${e.message}`);
        } finally {
             if (isMounted) setIsLoading(false);
        }
    };

    // Load preview data immediately on mount
    loadPreview();

    return () => {
      isMounted = false;
      console.log("[ArticlePreviewPage] Component unmounted.");
    };

  }, []); // Empty dependency array - runs only once on mount

   if (isLoading) {
     console.log("[ArticlePreviewPage] Rendering loading state.");
     return (
        <div className="flex justify-center items-center h-screen text-lg">
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            Önizleme verisi yükleniyor...
        </div>
     );
   }

   if (error) {
        console.error("[ArticlePreviewPage] Rendering error state:", error); // Log the error being displayed
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                 <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-destructive mb-4">Önizleme Hatası</h1>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={() => window.close()} variant="outline">Sekmeyi Kapat</Button>
            </div>
        );
    }

   // Assert previewData is not null here because error/loading states handle it
   if (!previewData) {
     console.error("[ArticlePreviewPage] Rendering error state: previewData is null/undefined after checks.");
     return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-destructive mb-4">Önizleme Hatası</h1>
            <p className="text-muted-foreground mb-6">Önizleme verisi yüklenemedi (veri null).</p>
            <Button onClick={() => window.close()} variant="outline">Sekmeyi Kapat</Button>
        </div>
     );
   }

   // Final check for empty object (should have been caught earlier)
   if (Object.keys(previewData).length === 0) {
        console.error("[ArticlePreviewPage] Rendering error state: previewData is empty object.");
        return (
             <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                 <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-destructive mb-4">Önizleme Hatası</h1>
                <p className="text-muted-foreground mb-6">Boş önizleme verisi alındı.</p>
                <Button onClick={() => window.close()} variant="outline">Sekmeyi Kapat</Button>
            </div>
        );
    }


    console.log("[ArticlePreviewPage] Rendering article preview for:", previewData.title);
    const { title, excerpt, category, mainImageUrl, blocks, authorId, createdAt } = previewData;

  const categoryLinkClass = category === 'Teknoloji'
    ? 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
    : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300';

  return (
    <div className="bg-background min-h-screen">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 p-3 text-center text-sm font-medium sticky top-0 z-50 border-b border-yellow-300 dark:border-yellow-700 flex items-center justify-center gap-4">
            <Eye className="h-4 w-4 flex-shrink-0" />
            <span>Bu bir önizlemedir. Değişiklikler henüz kaydedilmedi.</span>
            <Button size="sm" variant="ghost" className="h-auto p-1 text-yellow-800 dark:text-yellow-300 ml-auto" onClick={() => window.close()}>
                Kapat
            </Button>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <header className="mb-10">
             <span className={`text-sm font-medium mb-3 inline-block tracking-wide uppercase ${categoryLinkClass}`}>
               {category || '[Kategori Yok]'}
             </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{title || "[Başlık Yok]"}</h1>
             {excerpt && <p className="text-lg md:text-xl text-muted-foreground">{excerpt}</p>}
             {(authorId || createdAt) && (
                 <p className="text-sm text-muted-foreground mt-3">
                    {authorId && `Yazar: ${authorId}`}
                    {authorId && createdAt && ' | '}
                    {createdAt && `Yayınlanma: ${new Date(createdAt).toLocaleDateString('tr-TR')}`}
                 </p>
             )}
          </header>

          {mainImageUrl && (
            <div className="mb-10 shadow-xl rounded-lg overflow-hidden">
              <Image
                src={mainImageUrl}
                alt={title || "Ana Görsel"}
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                priority
                data-ai-hint="preview main image"
              />
            </div>
          )}

          <div className="prose dark:prose-invert lg:prose-lg max-w-none mb-12">
            {blocks && blocks.length > 0 ? (
                 blocks.map(renderBlock)
             ) : (
                 <p className="text-muted-foreground italic">(İçerik Bölümü Yok)</p>
             )}
          </div>

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
