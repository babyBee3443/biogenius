"use client";

import * as React from "react";
import { notFound, useSearchParams } from 'next/navigation'; // Import useSearchParams
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Twitter, Facebook, Linkedin, Eye, Video as VideoIcon, Loader2 } from 'lucide-react'; // Added Eye and VideoIcon
import type { Block } from '@/components/admin/template-selector';
import type { ArticleData } from '@/lib/mock-data'; // Import the standard ArticleData interface

// --- Block Rendering Components (reuse from article page if possible, or keep simple previews) ---

const TextBlockRenderer: React.FC<{ block: Extract<Block, { type: 'text' }> }> = ({ block }) => (
  // Simple rendering, ensuring HTML is handled safely if needed.
  // Using dangerouslySetInnerHTML is risky without sanitization.
  // For preview, rendering plain text might be safer or use a basic markdown parser.
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
         case 'video':
             return <VideoBlockRenderer key={block.id} block={block} />;
        case 'divider':
            return <DividerBlockRenderer key={block.id} block={block} />;
        // Add cases for other block types
        case 'gallery':
        case 'code':
        case 'section': // Sections might not be directly rendered here
        default:
            return <PlaceholderBlockRenderer key={block.id} type={block.type} />;
    }
};

export default function ArticlePreviewPage() {
  const searchParams = useSearchParams(); // Get query parameters
  const previewKey = searchParams?.get('key'); // Get the unique key

  // Use a broader type initially, then refine
  const [previewData, setPreviewData] = React.useState<Partial<ArticleData> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
        // Don't run localStorage logic on the server
        setIsLoading(false);
        return;
    }

    if (!previewKey) {
        setError("Önizleme anahtarı bulunamadı. Lütfen URL'yi kontrol edin.");
        setIsLoading(false);
        return;
    }

    console.log("Attempting to load preview data for key:", previewKey); // Log key being used

    try {
        // Use the unique key to get the correct data
        const storedData = localStorage.getItem(previewKey);

        if (storedData) {
            console.log("Found data in localStorage:", storedData.substring(0, 100) + "..."); // Log found data (truncated)
            let parsedData;
            try {
                 parsedData = JSON.parse(storedData);
                 console.log("Parsed data:", parsedData); // Log parsed data
            } catch (parseError) {
                 console.error("Error parsing JSON data:", parseError);
                 setError("Önizleme verisi bozuk. Lütfen tekrar deneyin.");
                 setIsLoading(false);
                 return;
            }


            // --- More Robust Validation ---
            if (
                parsedData &&
                typeof parsedData === 'object' &&
                Object.keys(parsedData).length > 0 && // Ensure it's not an empty object
                typeof parsedData.title === 'string' && parsedData.title && // Must have a non-empty title
                Array.isArray(parsedData.blocks) // Must have blocks array (can be empty)
                // Other required fields like category might be added here if crucial for preview
             ) {
                 // Normalize data before setting state
                 const normalizedData: Partial<ArticleData> = {
                    ...parsedData,
                    // Use excerpt if available, otherwise try description, else undefined
                    excerpt: parsedData.excerpt ?? parsedData.description,
                    // Use mainImageUrl if available, otherwise try imageUrl, else undefined
                    mainImageUrl: parsedData.mainImageUrl ?? parsedData.imageUrl,
                 };
                 console.log("Validated and normalized data:", normalizedData); // Log final data
                 setPreviewData(normalizedData);
            } else {
                 console.error("Invalid preview data structure:", parsedData); // Log invalid data structure
                 setError("Önizleme verisi geçersiz veya eksik. Lütfen şablonu veya makaleyi tekrar kaydedip önizlemeyi deneyin.");
            }
        } else {
             console.error("No data found in localStorage for key:", previewKey);
             setError(`Önizleme verisi bulunamadı (Anahtar: ${previewKey}). Lütfen şablonu veya makaleyi tekrar kaydedip önizlemeyi deneyin.`);
        }
    } catch (e) {
         console.error("Error accessing or processing preview data:", e);
         setError("Önizleme verisi yüklenirken bir hata oluştu. Tarayıcı konsolunu kontrol edin.");
    } finally {
        setIsLoading(false);
         // Optional: Clean up the specific localStorage item after loading - maybe delay this or do it on window close
         // console.log("Attempting to remove localStorage item with key:", previewKey);
         // localStorage.removeItem(previewKey);
    }

  }, [previewKey]); // Depend on the previewKey

   if (isLoading) {
     return (
        <div className="flex justify-center items-center h-screen text-lg">
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            Önizleme yükleniyor...
        </div>
     );
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

   // Cast to full ArticleData *after* validation and normalization, acknowledging some fields might be missing
   const articleData = previewData as ArticleData | null;

   if (!articleData) {
     // This case might be redundant due to error handling, but good as a fallback
     notFound();
   }

    // Destructure using standard ArticleData fields (handle potential undefined)
    const { title, excerpt, category, mainImageUrl, blocks, authorId, createdAt } = articleData;

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
             {/* Use Link for category if applicable, otherwise just span */}
             <span className={`text-sm font-medium mb-3 inline-block tracking-wide uppercase ${categoryLinkClass}`}>
               {category || '[Kategori Yok]'}
             </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{title || "[Başlık Yok]"}</h1>
             {excerpt && <p className="text-lg md:text-xl text-muted-foreground">{excerpt}</p>}
             {/* Display author and date if available in preview data */}
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

          {/* Render Blocks */}
          <div className="prose dark:prose-invert lg:prose-lg max-w-none mb-12">
            {blocks && blocks.length > 0 ? ( // Added check for blocks existence
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
