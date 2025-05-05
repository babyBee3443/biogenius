
"use client";

import * as React from "react";
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Twitter, Facebook, Linkedin, Eye, Video as VideoIcon, Loader2, AlertTriangle, Tag, BookCopy } from 'lucide-react'; // Added Tag, BookCopy
import type { Block } from '@/components/admin/template-selector';
import type { ArticleData, NoteData } from '@/lib/mock-data'; // Import both types
import { Badge } from '@/components/ui/badge'; // Import Badge
import { Separator } from '@/components/ui/separator'; // Import Separator

// --- Block Rendering Components (Simplified versions for preview) ---
// ... (Keep the existing Block Rendering Components: TextBlockRenderer, HeadingBlockRenderer, etc.) ...

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
            <Image src={block.url} alt={block.alt || 'Görsel'} width={800} height={400} className="rounded-lg shadow-md mx-auto max-w-full h-auto" data-ai-hint="preview content image"/>
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


// --- Data Types for Preview ---
type PreviewData = (Partial<ArticleData> & { previewType?: 'article' }) | (Partial<NoteData> & { previewType: 'note' });

const PREVIEW_STORAGE_KEY = 'preview_data'; // Use the fixed key

export default function ArticlePreviewPage() {
  const [previewData, setPreviewData] = React.useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    let isMounted = true;
    console.log("[PreviewPage] useEffect triggered.");

    if (typeof window === 'undefined') {
      console.log("[PreviewPage] Running on server, skipping localStorage logic.");
      setIsLoading(false);
      return;
    }
    console.log("[PreviewPage] Running on client.");

    const loadPreview = () => {
        if (!isMounted) return;

        console.log(`[PreviewPage] Attempting to load data from localStorage with key: ${PREVIEW_STORAGE_KEY}`);
        try {
            const storedData = localStorage.getItem(PREVIEW_STORAGE_KEY);

            if (storedData) {
                console.log(`[PreviewPage] Found data in localStorage. Length: ${storedData.length}.`);
                let parsedData;
                try {
                    parsedData = JSON.parse(storedData);
                    console.log("[PreviewPage] Parsed data successfully.");

                    if (!parsedData || typeof parsedData !== 'object' || Object.keys(parsedData).length === 0) {
                         const errorMsg = `Geçersiz veya boş önizleme verisi yapısı.`;
                         console.error("[PreviewPage]", errorMsg, parsedData);
                         if (isMounted) setError(errorMsg);
                         return;
                    }
                    // Basic validation based on expected type (article or note)
                     if ((!parsedData.previewType || parsedData.previewType === 'article') && typeof parsedData.title === 'string' && Array.isArray(parsedData.blocks)) {
                        console.log("[PreviewPage] Data appears to be valid article/general data.");
                        if (isMounted) setPreviewData(parsedData);
                    } else if (parsedData.previewType === 'note' && typeof parsedData.title === 'string' && Array.isArray(parsedData.contentBlocks)) {
                        // Remap contentBlocks to blocks for consistent rendering
                        const noteData = { ...parsedData, blocks: parsedData.contentBlocks };
                        console.log("[PreviewPage] Data appears to be valid note data. Remapped contentBlocks.");
                        if (isMounted) setPreviewData(noteData);
                    } else {
                         const errorMsg = `Önizleme verisi beklenen yapıda değil (eksik title, blocks/contentBlocks veya geçersiz previewType).`;
                         console.error("[PreviewPage]", errorMsg, parsedData);
                         if (isMounted) setError(errorMsg);
                    }

                } catch (parseError: any) {
                    console.error("[PreviewPage] JSON parse error:", parseError);
                    if (isMounted) setError(`Önizleme verisi okunamadı (JSON Parse Hatası): ${parseError.message}.`);
                    return;
                }
            } else {
                const errorMsg = `Önizleme verisi bulunamadı (Anahtar: ${PREVIEW_STORAGE_KEY}). Lütfen makaleyi veya şablonu kaydedip tekrar deneyin.`;
                console.error("[PreviewPage]", errorMsg);
                if (isMounted) setError(errorMsg);
            }
        } catch (e: any) {
            console.error("[PreviewPage] LocalStorage erişim hatası:", e);
            if (isMounted) setError(`Önizleme verisi yüklenirken bir hata oluştu: ${e.message}`);
        } finally {
             if (isMounted) setIsLoading(false);
        }
    };

    loadPreview();

    return () => {
      isMounted = false;
      console.log("[PreviewPage] Component unmounted.");
    };

  }, []);

   if (isLoading) {
     console.log("[PreviewPage] Rendering loading state.");
     return (
        <div className="flex justify-center items-center h-screen text-lg">
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            Önizleme verisi yükleniyor...
        </div>
     );
   }

   if (error) {
        console.error("[PreviewPage] Rendering error state:", error);
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                 <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-destructive mb-4">Önizleme Hatası</h1>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={() => window.close()} variant="outline">Sekmeyi Kapat</Button>
            </div>
        );
    }

   if (!previewData) {
     console.error("[PreviewPage] Rendering error state: previewData is null/undefined after checks.");
     return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-destructive mb-4">Önizleme Hatası</h1>
            <p className="text-muted-foreground mb-6">Önizleme verisi yüklenemedi (veri null).</p>
            <Button onClick={() => window.close()} variant="outline">Sekmeyi Kapat</Button>
        </div>
     );
   }

    console.log("[PreviewPage] Rendering preview for:", previewData.title, "Type:", previewData.previewType);

    // Determine if it's an article or note based on previewType or structure
    const isNote = previewData.previewType === 'note';
    const isArticle = !isNote; // Assume article if not explicitly note

    const commonData = {
        title: previewData.title || "[Başlık Yok]",
        blocks: previewData.blocks || [],
        imageUrl: (isArticle ? (previewData as Partial<ArticleData>).mainImageUrl : (previewData as Partial<NoteData>).imageUrl) || null,
        createdAt: previewData.createdAt,
    };

  return (
    <div className="bg-background min-h-screen">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 p-3 text-center text-sm font-medium sticky top-0 z-50 border-b border-yellow-300 dark:border-yellow-700 flex items-center justify-center gap-4">
            <Eye className="h-4 w-4 flex-shrink-0" />
            <span>Bu bir önizlemedir. Değişiklikler henüz kaydedilmedi.</span>
            <Button size="sm" variant="ghost" className="h-auto p-1 text-yellow-800 dark:text-yellow-300 ml-auto" onClick={() => window.close()}>
                Kapat
            </Button>
        </div>

        {isArticle && (
             <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
                <header className="mb-10">
                     <span className={`text-sm font-medium mb-3 inline-block tracking-wide uppercase ${ (previewData as Partial<ArticleData>).category === 'Teknoloji' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}>
                       {(previewData as Partial<ArticleData>).category || '[Kategori Yok]'}
                     </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{commonData.title}</h1>
                     {(previewData as Partial<ArticleData>).excerpt && <p className="text-lg md:text-xl text-muted-foreground">{(previewData as Partial<ArticleData>).excerpt}</p>}
                     {((previewData as Partial<ArticleData>).authorId || commonData.createdAt) && (
                         <p className="text-sm text-muted-foreground mt-3">
                            {(previewData as Partial<ArticleData>).authorId && `Yazar: ${(previewData as Partial<ArticleData>).authorId}`}
                            {(previewData as Partial<ArticleData>).authorId && commonData.createdAt && ' | '}
                            {commonData.createdAt && `Yayınlanma: ${new Date(commonData.createdAt).toLocaleDateString('tr-TR')}`}
                         </p>
                     )}
                </header>
                 {commonData.imageUrl && (
                    <div className="mb-10 shadow-xl rounded-lg overflow-hidden">
                    <Image src={commonData.imageUrl} alt={commonData.title} width={1200} height={600} className="w-full h-auto object-cover" priority data-ai-hint="preview main image"/>
                    </div>
                 )}
                 <div className="prose dark:prose-invert lg:prose-lg max-w-none mb-12">
                    {commonData.blocks.length > 0 ? commonData.blocks.map(renderBlock) : <p className="text-muted-foreground italic">(İçerik Bölümü Yok)</p>}
                 </div>
                 <div className="mt-16 border-t border-border/50 pt-10 space-y-10">
                    {/* Article specific footer elements */}
                    <div><h2 className="text-2xl font-semibold mb-4">İlgili Makaleler (Placeholder)</h2><p className="text-muted-foreground text-sm">...</p></div>
                    <div><h2 className="text-2xl font-semibold mb-4">Paylaş (Placeholder)</h2><div className="flex space-x-3">...</div></div>
                    <div><h2 className="text-2xl font-semibold mb-4">Yorumlar (Placeholder)</h2><p className="text-muted-foreground text-sm">...</p></div>
                 </div>
            </article>
         )}

        {isNote && (
             <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
                 <header className="mb-8">
                     <Link href="/biyoloji-notlari" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center mb-2"><ArrowLeft className="mr-1 h-3 w-3" /> Biyoloji Notlarına Dön</Link>
                     <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight flex items-center gap-2"><BookCopy className="h-7 w-7 text-green-600"/> {commonData.title}</h1>
                     <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                         <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">{(previewData as Partial<NoteData>).category || '[Kategori]'}</Badge>
                         <Badge variant="outline">{(previewData as Partial<NoteData>).level || '[Seviye]'}</Badge>
                         {commonData.createdAt && <span>| Son Güncelleme: {new Date(commonData.createdAt).toLocaleDateString('tr-TR')}</span>}
                     </div>
                     {(previewData as Partial<NoteData>).tags && (previewData as Partial<NoteData>).tags!.length > 0 && (
                         <div className="flex flex-wrap gap-2 mt-3">
                             {(previewData as Partial<NoteData>).tags!.map(tag => <Badge key={tag} variant="outline" className="text-xs font-normal flex items-center gap-1"><Tag className="h-3 w-3"/>{tag}</Badge>)}
                         </div>
                     )}
                 </header>
                  {commonData.imageUrl && (
                    <div className="mb-8 shadow-lg rounded-lg overflow-hidden">
                        <Image src={commonData.imageUrl} alt={commonData.title} width={800} height={400} className="w-full h-auto object-cover" priority data-ai-hint="biology note header image"/>
                    </div>
                  )}
                  {(previewData as Partial<NoteData>).summary && (
                    <p className="text-lg text-muted-foreground mb-8 p-4 bg-secondary/40 rounded-md border border-border/50">{(previewData as Partial<NoteData>).summary}</p>
                  )}
                  <div className="prose dark:prose-invert lg:prose-lg max-w-none mb-12">
                    {commonData.blocks.length > 0 ? commonData.blocks.map(renderBlock) : <p className="text-muted-foreground italic">(İçerik Bölümü Yok)</p>}
                  </div>
                   <Separator className="my-12"/>
                  {/* Note specific footer elements */}
                   <div><h2 className="text-2xl font-semibold mb-4">İlgili Notlar (Placeholder)</h2><p className="text-muted-foreground text-sm">...</p></div>
            </article>
         )}
    </div>
  );
}
