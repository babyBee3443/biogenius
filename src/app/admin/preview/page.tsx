"use client";

import * as React from "react";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Loader2, AlertTriangle, Tag, BookCopy } from 'lucide-react';
import type { Block } from '@/components/admin/template-selector';
import type { ArticleData, NoteData, PageData as PageDataType } from '@/lib/mock-data'; 
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import PagePreviewRenderer from "@/components/admin/page-preview-renderer"; 

// --- Block Rendering Components (Simplified versions for preview) ---
const TextBlockRenderer: React.FC<{ block: Extract&lt;Block, { type: 'text' }&gt; }&gt; = ({ block }) =&gt; (
  &lt;div dangerouslySetInnerHTML={{ __html: block.content?.replace(/\n/g, '&lt;br /&gt;') || '&lt;p class="italic text-muted-foreground"&gt;[Boş Metin Bloğu]&lt;/p&gt;' }} /&gt;
);

const HeadingBlockRenderer: React.FC<{ block: Extract&lt;Block, { type: 'heading' }&gt; }&gt; = ({ block }) =&gt; {
  const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
  return &lt;Tag&gt;{block.content || &lt;span className="italic text-muted-foreground"&gt;[Boş Başlık]&lt;/span&gt;}&lt;/Tag&gt;;
};

const ImageBlockRenderer: React.FC<{ block: Extract&lt;Block, { type: 'image' }&gt; }&gt; = ({ block }) =&gt; (
    &lt;figure className="my-6"&gt;
        {block.url ? (
            &lt;Image src={block.url} alt={block.alt || 'Görsel'} width={800} height={400} className="rounded-lg shadow-md mx-auto max-w-full h-auto" data-ai-hint="preview content image"/&gt;
        ) : (
            &lt;div className="bg-muted rounded-lg aspect-video flex items-center justify-center text-muted-foreground italic"&gt;
                [Görsel Alanı - URL Yok]
            &lt;/div&gt;
        )}
        {block.caption && &lt;figcaption className="text-center text-sm text-muted-foreground mt-2"&gt;{block.caption}&lt;/figcaption&gt;}
    &lt;/figure&gt;
);

const VideoBlockRenderer: React.FC<{ block: Extract&lt;Block, { type: 'video' }&gt; }&gt; = ({ block }) =&gt; {
    const getYouTubeId = (url: string): string | null =&gt; {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    const videoId = block.youtubeId || getYouTubeId(block.url);

    if (videoId) {
        return (
            &lt;div className="aspect-video my-6 shadow-md rounded-lg overflow-hidden"&gt;
                &lt;iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                &gt;&lt;/iframe&gt;
            &lt;/div&gt;
        );
    }
     return &lt;PlaceholderBlockRenderer type="video" /&gt;;
};

const QuoteBlockRenderer: React.FC<{ block: Extract&lt;Block, { type: 'quote' }&gt; }&gt; = ({ block }) =&gt; (
    &lt;blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6"&gt;
        &lt;p&gt;{block.content || &lt;span className="italic text-muted-foreground"&gt;[Boş Alıntı]&lt;/span&gt;}&lt;/p&gt;
        {block.citation && &lt;footer className="mt-2 text-sm not-italic"&gt;— {block.citation}&lt;/footer&gt;}
    &lt;/blockquote&gt;
);

const DividerBlockRenderer: React.FC<{ block: Extract&lt;Block, { type: 'divider' }&gt; }&gt; = () =&gt; (
    &lt;hr className="my-8" /&gt;
);

const PlaceholderBlockRenderer: React.FC<{ type: string }&gt; = ({ type }) =&gt; (
  &lt;div className="bg-muted p-4 rounded my-4 text-center text-muted-foreground italic"&gt;
    [{type} Bloku Önizlemesi]
  &lt;/div&gt;
);

const SectionBlockRenderer: React.FC<{ block: Extract&lt;Block, { type: 'section' }&gt; }&gt; = ({ block }) =&gt; {
    return (
        &lt;div className="my-6 p-4 border border-dashed border-muted-foreground/50 rounded-md bg-muted/20"&gt;
            &lt;p className="text-sm font-semibold text-muted-foreground"&gt;[Bölüm: {block.sectionType || 'Bilinmeyen'}]&lt;/p&gt;
            {block.settings?.title && &lt;h3 className="text-lg font-medium mt-1"&gt;{block.settings.title}&lt;/h3&gt;}
            {block.sectionType === 'custom-text' && block.settings?.content && (
                &lt;div className="prose dark:prose-invert max-w-none mt-2" dangerouslySetInnerHTML={{ __html: block.settings.content }} /&gt;
            )}
            &lt;pre className="text-xs bg-black/10 dark:bg-white/10 p-2 rounded mt-2 overflow-x-auto"&gt;
                Ayarlar: {JSON.stringify(block.settings, null, 2)}
            &lt;/pre&gt;
        &lt;/div&gt;
    );
};

const renderBlock = (block: Block) =&gt; {
    switch (block.type) {
        case 'text': return &lt;TextBlockRenderer key={block.id} block={block} /&gt;;
        case 'heading': return &lt;HeadingBlockRenderer key={block.id} block={block} /&gt;;
        case 'image': return &lt;ImageBlockRenderer key={block.id} block={block} /&gt;;
        case 'quote': return &lt;QuoteBlockRenderer key={block.id} block={block} /&gt;;
        case 'video': return &lt;VideoBlockRenderer key={block.id} block={block} /&gt;;
        case 'divider': return &lt;DividerBlockRenderer key={block.id} block={block} /&gt;;
        case 'section': return &lt;SectionBlockRenderer key={block.id} block={block} /&gt;;
        case 'gallery':
        case 'code':
        default:
            return &lt;PlaceholderBlockRenderer key={block.id} type={block.type} /&gt;;
    }
};

type CombinedPreviewData = (Partial&lt;ArticleData&gt; &amp; { previewType: 'article' }) |
                           (Partial&lt;NoteData&gt; &amp; { previewType: 'note' }) |
                           (Partial&lt;PageDataType&gt; &amp; { previewType: 'page' });

const PREVIEW_STORAGE_KEY = 'preview_data';

export default function PreviewPage() {
  const [previewData, setPreviewData] = React.useState&lt;CombinedPreviewData | null&gt;(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState&lt;string | null&gt;(null);

  React.useEffect(() =&gt; {
    let isMounted = true;
    console.log("[PreviewPage] useEffect triggered. Attempting to load preview data.");

    const loadPreview = () =&gt; {
        if (!isMounted) return;
        setIsLoading(true); 
        setError(null); 

        if (typeof window === 'undefined') {
          console.log("[PreviewPage] Running on server, skipping localStorage logic.");
          if(isMounted) setIsLoading(false);
          return;
        }
        console.log("[PreviewPage] Running on client.");

        console.log(`[PreviewPage] Attempting to load data from localStorage with key: ${PREVIEW_STORAGE_KEY}`);
        try {
            const storedData = localStorage.getItem(PREVIEW_STORAGE_KEY);

            if (storedData) {
                console.log(`[PreviewPage] Found data in localStorage. Length: ${storedData.length}. Data (first 500 chars):`, storedData.substring(0, 500));
                let parsedData: CombinedPreviewData;
                try {
                    parsedData = JSON.parse(storedData) as CombinedPreviewData; 
                    console.log("[PreviewPage] Parsed data successfully:", parsedData);

                    if (!parsedData || typeof parsedData !== 'object' || Object.keys(parsedData).length === 0) {
                         const errorMsg = `Geçersiz veya boş önizleme verisi yapısı. Veri: ${JSON.stringify(parsedData)}`;
                         console.error("[PreviewPage]", errorMsg);
                         if (isMounted) setError(errorMsg);
                         return;
                    }
                    
                     if (!parsedData.previewType || !['article', 'note', 'page'].includes(parsedData.previewType)) {
                         const errorMsg = `Önizleme verisi geçersiz 'previewType' içeriyor: ${parsedData.previewType}. Veri: ${JSON.stringify(parsedData)}`;
                         console.error("[PreviewPage]", errorMsg);
                         if (isMounted) setError(errorMsg);
                         return;
                     }
                    
                    if (parsedData.previewType === 'article' || parsedData.previewType === 'page') {
                        if (typeof (parsedData as Partial&lt;ArticleData&gt; | Partial&lt;PageDataType&gt;).title !== 'string' || !Array.isArray((parsedData as Partial&lt;ArticleData&gt; | Partial&lt;PageDataType&gt;).blocks)) {
                            const errorMsg = `Makale/Sayfa önizleme verisi beklenen yapıda değil (eksik title veya blocks). Veri: ${JSON.stringify(parsedData)}`;
                            console.error("[PreviewPage]", errorMsg);
                            if (isMounted) setError(errorMsg);
                            return;
                        }
                    } else if (parsedData.previewType === 'note') {
                         if (typeof (parsedData as Partial&lt;NoteData&gt;).title !== 'string' || !Array.isArray((parsedData as Partial&lt;NoteData&gt;).contentBlocks)) {
                            const errorMsg = `Not önizleme verisi beklenen yapıda değil (eksik title veya contentBlocks). Veri: ${JSON.stringify(parsedData)}`;
                            console.error("[PreviewPage]", errorMsg);
                            if (isMounted) setError(errorMsg);
                            return;
                        }
                    }


                    console.log("[PreviewPage] Data appears to be valid and is being set to state.");
                    if (isMounted) setPreviewData(parsedData);

                } catch (parseError: any) {
                    console.error("[PreviewPage] JSON parse error:", parseError, "Stored Data (first 500 chars):", storedData.substring(0, 500));
                    if (isMounted) setError(`Önizleme verisi okunamadı (JSON Parse Hatası): ${parseError.message}. Veri (ilk 500 karakter): ${storedData.substring(0, 500)}...`);
                    return;
                }
            } else {
                const errorMsg = `Önizleme verisi bulunamadı (Anahtar: ${PREVIEW_STORAGE_KEY}). Lütfen makaleyi veya şablonu kaydedip tekrar deneyin.`;
                console.error("[PreviewPage]", errorMsg);
                if (isMounted) setError(errorMsg);
            }
        } catch (e: any) {
            console.error("[PreviewPage] LocalStorage erişim hatası veya başka bir genel hata:", e);
            if (isMounted) setError(`Önizleme verisi yüklenirken bir hata oluştu: ${e.message}`);
        } finally {
             if (isMounted) setIsLoading(false);
             console.log("[PreviewPage] Loading finished.");
        }
    };

    loadPreview();

    return () =&gt; {
      isMounted = false;
      console.log("[PreviewPage] Component unmounted.");
    };

  }, []); 

   if (isLoading) {
     console.log("[PreviewPage] Rendering loading state.");
     return (
        &lt;div className="flex justify-center items-center h-screen text-lg"&gt;
            &lt;Loader2 className="mr-3 h-6 w-6 animate-spin" /&gt;
            Önizleme verisi yükleniyor...
        &lt;/div&gt;
     );
   }

   if (error) {
        console.error("[PreviewPage] Rendering error state:", error);
        return (
            &lt;div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"&gt;
                 &lt;AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" /&gt;
                &lt;h1 className="text-2xl font-bold text-destructive mb-4"&gt;Önizleme Hatası&lt;/h1&gt;
                &lt;p className="text-muted-foreground mb-6"&gt;{error}&lt;/p&gt;
                &lt;Button onClick={() =&gt; window.close()} variant="outline"&gt;Sekmeyi Kapat&lt;/Button&gt;
            &lt;/div&gt;
        );
    }

   if (!previewData) {
     console.error("[PreviewPage] Rendering error state: previewData is null/undefined after checks.");
     return (
        &lt;div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"&gt;
            &lt;AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" /&gt;
            &lt;h1 className="text-2xl font-bold text-destructive mb-4"&gt;Önizleme Hatası&lt;/h1&gt;
            &lt;p className="text-muted-foreground mb-6"&gt;Önizleme verisi yüklenemedi (veri null). Veri yapısını veya anahtarı kontrol edin.&lt;/p&gt;
            &lt;Button onClick={() =&gt; window.close()} variant="outline"&gt;Sekmeyi Kapat&lt;/Button&gt;
        &lt;/div&gt;
     );
   }

    console.log("[PreviewPage] Rendering preview for:", previewData.title, "Type:", previewData.previewType);

    const commonData = {
        title: previewData.title || "[Başlık Yok]",
        blocks: previewData.previewType === 'note' ? (previewData as Partial&lt;NoteData&gt;).contentBlocks || [] : (previewData as Partial&lt;ArticleData&gt; | Partial&lt;PageDataType&gt;).blocks || [],
        imageUrl: (previewData.previewType === 'article' ? (previewData as Partial&lt;ArticleData&gt;).mainImageUrl :
                   previewData.previewType === 'note' ? (previewData as Partial&lt;NoteData&gt;).imageUrl :
                   previewData.previewType === 'page' ? (previewData as Partial&lt;PageDataType&gt;).imageUrl : null) || null,
        createdAt: previewData.createdAt,
    };

  return (
    &lt;div className="bg-background min-h-screen"&gt;
        &lt;div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 p-3 text-center text-sm font-medium sticky top-0 z-50 border-b border-yellow-300 dark:border-yellow-700 flex items-center justify-center gap-4"&gt;
            &lt;Eye className="h-4 w-4 flex-shrink-0" /&gt;
            &lt;span&gt;Bu bir önizlemedir. Değişiklikler henüz kaydedilmedi.&lt;/span&gt;
            &lt;Button size="sm" variant="ghost" className="h-auto p-1 text-yellow-800 dark:text-yellow-300 ml-auto" onClick={() =&gt; window.close()}&gt;
                Kapat
            &lt;/Button&gt;
        &lt;/div&gt;

        {previewData.previewType === 'article' && (
             &lt;article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12"&gt;
                &lt;header className="mb-10"&gt;
                     &lt;span className={`text-sm font-medium mb-3 inline-block tracking-wide uppercase ${ (previewData as Partial&lt;ArticleData&gt;).category === 'Teknoloji' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}&gt;
                       {(previewData as Partial&lt;ArticleData&gt;).category || '[Kategori Yok]'}
                     &lt;/span&gt;
                    &lt;h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight"&gt;{commonData.title}&lt;/h1&gt;
                     {(previewData as Partial&lt;ArticleData&gt;).excerpt && &lt;p className="text-lg md:text-xl text-muted-foreground"&gt;{(previewData as Partial&lt;ArticleData&gt;).excerpt}&lt;/p&gt;}
                     {((previewData as Partial&lt;ArticleData&gt;).authorId || commonData.createdAt) && (
                         &lt;p className="text-sm text-muted-foreground mt-3"&gt;
                            {(previewData as Partial&lt;ArticleData&gt;).authorId && `Yazar: ${(previewData as Partial&lt;ArticleData&gt;).authorId}`}
                            {(previewData as Partial&lt;ArticleData&gt;).authorId && commonData.createdAt && ' | '}
                            {commonData.createdAt && `Yayınlanma: ${new Date(commonData.createdAt).toLocaleDateString('tr-TR')}`}
                         &lt;/p&gt;
                     )}
                &lt;/header&gt;
                 {commonData.imageUrl && (
                    &lt;div className="mb-10 shadow-xl rounded-lg overflow-hidden"&gt;
                    &lt;Image src={commonData.imageUrl} alt={commonData.title} width={1200} height={600} className="w-full h-auto object-cover" priority data-ai-hint="preview main image"/&gt;
                    &lt;/div&gt;
                 )}
                 &lt;div className="prose dark:prose-invert lg:prose-lg max-w-none mb-12"&gt;
                    {commonData.blocks.length &gt; 0 ? commonData.blocks.map(renderBlock) : &lt;p className="text-muted-foreground italic"&gt;(İçerik Bölümü Yok)&lt;/p&gt;}
                 &lt;/div&gt;
                 &lt;div className="mt-16 border-t border-border/50 pt-10 space-y-10"&gt;
                    &lt;div&gt;&lt;h2 className="text-2xl font-semibold mb-4"&gt;İlgili Makaleler (Placeholder)&lt;/h2&gt;&lt;p className="text-muted-foreground text-sm"&gt;...&lt;/p&gt;&lt;/div&gt;
                    &lt;div&gt;&lt;h2 className="text-2xl font-semibold mb-4"&gt;Paylaş (Placeholder)&lt;/h2&gt;&lt;div className="flex space-x-3"&gt;...&lt;/div&gt;&lt;/div&gt;
                    &lt;div&gt;&lt;h2 className="text-2xl font-semibold mb-4"&gt;Yorumlar (Placeholder)&lt;/h2&gt;&lt;p className="text-muted-foreground text-sm"&gt;...&lt;/p&gt;&lt;/div&gt;
                 &lt;/div&gt;
            &lt;/article&gt;
         )}

        {previewData.previewType === 'note' && (
             &lt;article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12"&gt;
                 &lt;header className="mb-8"&gt;
                     &lt;h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight flex items-center gap-2"&gt;&lt;BookCopy className="h-7 w-7 text-green-600"/&gt; {commonData.title}&lt;/h1&gt;
                     &lt;div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4"&gt;
                         &lt;Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"&gt;{(previewData as Partial&lt;NoteData&gt;).category || '[Kategori]'}&lt;/Badge&gt;
                         &lt;Badge variant="outline"&gt;{(previewData as Partial&lt;NoteData&gt;).level || '[Seviye]'}&lt;/Badge&gt;
                         {commonData.createdAt && &lt;span&gt;| Son Güncelleme: {new Date(commonData.createdAt).toLocaleDateString('tr-TR')}&lt;/span&gt;}
                     &lt;/div&gt;
                     {(previewData as Partial&lt;NoteData&gt;).tags && (previewData as Partial&lt;NoteData&gt;).tags!.length &gt; 0 && (
                         &lt;div className="flex flex-wrap gap-2 mt-3"&gt;
                             {(previewData as Partial&lt;NoteData&gt;).tags!.map(tag =&gt; &lt;Badge key={tag} variant="outline" className="text-xs font-normal flex items-center gap-1"&gt;&lt;Tag className="h-3 w-3"/&gt;{tag}&lt;/Badge&gt;)}
                         &lt;/div&gt;
                     )}
                 &lt;/header&gt;
                  {commonData.imageUrl && (
                    &lt;div className="mb-8 shadow-lg rounded-lg overflow-hidden"&gt;
                        &lt;Image src={commonData.imageUrl} alt={commonData.title} width={800} height={400} className="w-full h-auto object-cover" priority data-ai-hint="biology note header image"/&gt;
                    &lt;/div&gt;
                  )}
                  {(previewData as Partial&lt;NoteData&gt;).summary && (
                    &lt;p className="text-lg text-muted-foreground mb-8 p-4 bg-secondary/40 rounded-md border border-border/50"&gt;{(previewData as Partial&lt;NoteData&gt;).summary}&lt;/p&gt;
                  )}
                  &lt;div className="prose dark:prose-invert lg:prose-lg max-w-none mb-12"&gt;
                    {commonData.blocks.length &gt; 0 ? commonData.blocks.map(renderBlock) : &lt;p className="text-muted-foreground italic"&gt;(İçerik Bölümü Yok)&lt;/p&gt;}
                  &lt;/div&gt;
                   &lt;Separator className="my-12"/&gt;
                   &lt;div&gt;&lt;h2 className="text-2xl font-semibold mb-4"&gt;İlgili Notlar (Placeholder)&lt;/h2&gt;&lt;p className="text-muted-foreground text-sm"&gt;...&lt;/p&gt;&lt;/div&gt;
            &lt;/article&gt;
         )}

         {previewData.previewType === 'page' && (
             &lt;div className="container py-8"&gt; 
                &lt;PagePreviewRenderer
                    pageData={previewData as PageDataType} 
                    selectedBlockId={null} 
                    onBlockSelect={() =&gt; {}}
                    isPreview={true} 
                /&gt;
            &lt;/div&gt;
         )}
    &lt;/div&gt;
  );
}
