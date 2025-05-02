
"use client";

import * as React from 'react';
import Image from 'next/image';
import type { Block } from '@/components/admin/template-selector';
import { cn } from '@/lib/utils'; // Import cn utility
import { Loader2 } from 'lucide-react'; // For iframe loading state

// Define the props for the PagePreviewRenderer
interface PagePreviewRendererProps {
    pageData: {
        id: string;
        title: string;
        slug: string;
        blocks: Block[];
        seoTitle?: string;
        seoDescription?: string;
        imageUrl?: string;
        settings?: Record<string, any>; // Add settings
    };
    selectedBlockId: string | null; // ID of the block selected in the editor
    onBlockSelect: (id: string | null) => void; // Callback when a block is clicked in preview (can be null to deselect)
    isPreview?: boolean; // Flag to indicate if this is rendering in the live preview pane vs final page
}

// --- Block Rendering Components (Simplified versions for preview) ---

const TextBlockPreview: React.FC<{ block: Extract<Block, { type: 'text' }> }> = ({ block }) => (
    <p className="text-base leading-relaxed mb-4">{block.content || <span className="text-muted-foreground italic">[Boş Metin Bloğu]</span>}</p>
);

const HeadingBlockPreview: React.FC<{ block: Extract<Block, { type: 'heading' }> }> = ({ block }) => {
    const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
    const sizeClasses = {
        1: 'text-3xl font-bold mb-4 mt-6',
        2: 'text-2xl font-semibold mb-3 mt-5',
        3: 'text-xl font-semibold mb-3 mt-4',
        4: 'text-lg font-semibold mb-2 mt-3',
        5: 'text-base font-semibold mb-2 mt-2',
        6: 'text-sm font-semibold mb-2 mt-2',
    };
    // Don't render heading blocks in the visual editor for homepage structure, only content pages
    if (block.type === 'heading' && block.id.startsWith('hpb-')) return null; // Example: hide specific homepage structural headings
    return <Tag className={sizeClasses[block.level as keyof typeof sizeClasses] || sizeClasses[2]}>{block.content || <span className="text-muted-foreground italic">[Boş Başlık]</span>}</Tag>;
};

const ImageBlockPreview: React.FC<{ block: Extract<Block, { type: 'image' }> }> = ({ block }) => (
    <figure className="my-6">
        {block.url ? (
            <Image
                src={block.url}
                alt={block.alt || 'Görsel'}
                width={800}
                height={450}
                className="rounded-lg shadow-md mx-auto max-w-full h-auto"
            />
        ) : (
            <div className="bg-muted rounded-lg aspect-video flex items-center justify-center text-muted-foreground italic">
                [Görsel Alanı]
            </div>
        )}
        {block.caption && <figcaption className="text-center text-sm text-muted-foreground mt-2">{block.caption}</figcaption>}
    </figure>
);

const QuoteBlockPreview: React.FC<{ block: Extract<Block, { type: 'quote' }> }> = ({ block }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
        <p>{block.content || <span className="text-muted-foreground italic">[Boş Alıntı]</span>}</p>
        {block.citation && <footer className="mt-2 text-sm not-italic">— {block.citation}</footer>}
    </blockquote>
);

const DividerBlockPreview: React.FC = () => (
    <hr className="my-8" />
);

// Specific preview for homepage sections
const SectionBlockPreview: React.FC<{ block: Extract<Block, { type: 'section' }>, isSelected: boolean, onClick: () => void }> = ({ block, isSelected, onClick }) => {
    const title = block.settings?.title || `[${block.sectionType}]`;
    let content = `Bölüm: ${title}`;
    if (block.sectionType === 'featured-articles') content = `Öne Çıkanlar (${block.settings?.count || 'N/A'} adet)`;
    if (block.sectionType === 'category-teaser') content = `Kategori Tanıtımı (${title})`;
    if (block.sectionType === 'recent-articles') content = `Son Eklenenler (${block.settings?.count || 'N/A'} adet)`;

    return (
        <div
            key={block.id}
            onClick={onClick}
            className={cn(
                "cursor-pointer transition-all duration-200 ease-in-out p-4 -m-1 rounded border border-dashed bg-muted/30 my-4",
                {
                     "ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/10 border-primary": isSelected, // Highlight selected block
                     "hover:bg-muted/50 border-border/50": !isSelected // Subtle hover effect
                }
            )}
             data-preview-block-id={block.id} // Add data attribute for potential targeting
        >
            <p className="text-sm font-medium text-center text-foreground">{content}</p>
             {isSelected && (
                <p className="text-xs text-muted-foreground text-center mt-1">(Düzenlemek için sol panele bakın)</p>
            )}
        </div>
    );
};


const PlaceholderBlockPreview: React.FC<{ type: string }> = ({ type }) => (
    <div className="bg-muted p-4 rounded my-4 text-center text-muted-foreground italic text-sm">
        [{type} Bloğu Önizlemesi]
    </div>
);

// Function to render a single block with selection handling (excluding section blocks)
const renderPreviewBlock = (
    block: Block,
    isSelected: boolean,
    onClick: () => void,
    pageId: string,
) => {
    // Skip rendering section blocks here, they are handled separately or by iframe
    if (block.type === 'section') return null;

     // Hide structural blocks on homepage preview if using block editor mode for it
     if (pageId === 'anasayfa' && block.id.startsWith('hpb-')) return null;


    let content;
    switch (block.type) {
        case 'text':
            content = <TextBlockPreview block={block} />;
            break;
        case 'heading':
            content = <HeadingBlockPreview block={block} />;
            break;
        case 'image':
            content = <ImageBlockPreview block={block} />;
            break;
        case 'quote':
            content = <QuoteBlockPreview block={block} />;
            break;
        case 'divider':
            content = <DividerBlockPreview />;
            break;
        default:
            content = <PlaceholderBlockPreview type={block.type} />;
    }

    return (
        <div
            key={block.id}
            onClick={onClick}
            className={cn(
                "cursor-pointer transition-all duration-200 ease-in-out p-1 -m-1 rounded relative", // Added relative
                {
                     "ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/10": isSelected, // Highlight selected block
                     "hover:bg-muted/50": !isSelected // Subtle hover effect
                }
            )}
             data-preview-block-id={block.id} // Add data attribute for potential targeting
        >
             {/* Add a semi-transparent overlay when selected to indicate clickability */}
             {/* {isSelected && <div className="absolute inset-0 bg-primary/5 rounded pointer-events-none" />} */}
            {content}
        </div>
    );
};


// --- The Main Preview Renderer Component ---
const PagePreviewRenderer: React.FC<PagePreviewRendererProps> = ({
    pageData,
    selectedBlockId,
    onBlockSelect,
    isPreview = false,
 }) => {
    const { id: pageId, title, blocks, slug } = pageData;
    const [iframeLoading, setIframeLoading] = React.useState(pageId === 'anasayfa' && isPreview); // Only load iframe for homepage preview

    // For homepage preview, render an iframe simulating the live page
    if (pageId === 'anasayfa' && isPreview) {
        // Construct the URL for the homepage (adjust based on your routing)
        // For local development, assuming the main site runs on a different port or root
        // In production, this would be the actual site URL.
        const siteUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:3000` : '/'; // Adjust port 3000 if needed
        const previewUrl = `${siteUrl}/?preview=true&pageData=${encodeURIComponent(JSON.stringify(pageData))}`; // Pass data via query param (limited size)

        // Alternative: Use a dedicated preview route if query param is too small
        // React.useEffect(() => { localStorage.setItem('homepagePreviewData', JSON.stringify(pageData)); }, [pageData]);
        // const previewUrl = '/admin/live-preview/homepage';


        return (
            <div className="w-full h-full relative bg-muted">
                {iframeLoading && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground z-10">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <p>Anasayfa önizlemesi yükleniyor...</p>
                    </div>
                )}
                 {/* Use a sandbox iframe for security and control */}
                 <iframe
                    // src={previewUrl} // Using URL approach
                    src={`/`} // Simulate loading the actual homepage (adjust if necessary)
                    title="Anasayfa Önizleme"
                    className={cn("w-full h-full border-0", { 'opacity-0': iframeLoading })} // Hide while loading
                    sandbox="allow-scripts allow-same-origin" // Restrict iframe capabilities
                    onLoad={() => setIframeLoading(false)}
                />
                 {/* Overlay to capture clicks on the iframe and map them to blocks */}
                 {!iframeLoading && (
                    <div className="absolute inset-0 z-20 bg-transparent" onClick={() => onBlockSelect(null)}>
                        {/* Map block positions here if needed - complex */}
                        {/* Example: Placeholder clickable areas for known sections */}
                        <div
                            className={cn("absolute top-[10%] left-[5%] w-[90%] h-[30%] border border-dashed cursor-pointer rounded hover:bg-primary/10 transition-colors", { 'ring-2 ring-primary bg-primary/10': selectedBlockId === 'hp-section-featured' })}
                            onClick={(e) => { e.stopPropagation(); onBlockSelect('hp-section-featured'); }}
                            title="Öne Çıkanlar Bölümü"
                        />
                         <div
                            className={cn("absolute top-[45%] left-[5%] w-[40%] h-[20%] border border-dashed cursor-pointer rounded hover:bg-primary/10 transition-colors", { 'ring-2 ring-primary bg-primary/10': selectedBlockId === 'hp-section-categories' })}
                            onClick={(e) => { e.stopPropagation(); onBlockSelect('hp-section-categories'); }}
                             title="Kategoriler Bölümü"
                         />
                          <div
                            className={cn("absolute top-[70%] left-[5%] w-[90%] h-[25%] border border-dashed cursor-pointer rounded hover:bg-primary/10 transition-colors", { 'ring-2 ring-primary bg-primary/10': selectedBlockId === 'hp-section-recent' })}
                            onClick={(e) => { e.stopPropagation(); onBlockSelect('hp-section-recent'); }}
                             title="Son Eklenenler Bölümü"
                          />
                    </div>
                 )}

            </div>
        );
    }

    // For other pages or non-preview renders, use the block-based renderer
    return (
        <div
            className="p-6 bg-background text-foreground h-full overflow-y-auto"
            onClick={() => onBlockSelect(null)} // Click background to deselect
         >
            <header className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{title || <span className="text-muted-foreground italic">[Başlık Yok]</span>}</h1>
            </header>

            {/* Render Blocks */}
            <div className="prose dark:prose-invert max-w-none">
                {blocks.length > 0 ? (
                     blocks.map(block => {
                         if (block.type === 'section') {
                             // Render section blocks differently in the preview editor
                             return <SectionBlockPreview
                                 key={block.id}
                                 block={block}
                                 isSelected={block.id === selectedBlockId}
                                 onClick={(e) => { e.stopPropagation(); onBlockSelect(block.id); }}
                              />;
                         } else {
                             // Render regular content blocks
                             return renderPreviewBlock(
                                block,
                                block.id === selectedBlockId,
                                (e) => { e.stopPropagation(); onBlockSelect(block.id); },
                                pageId
                            );
                         }
                    })
                ) : (
                    <p className="text-muted-foreground italic">(Bu sayfada henüz içerik bölümü yok)</p>
                )}
            </div>
        </div>
    );
};

export default PagePreviewRenderer;
