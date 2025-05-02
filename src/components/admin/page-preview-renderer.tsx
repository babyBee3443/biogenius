
"use client";

import * as React from 'react';
import Image from 'next/image';
import type { Block } from '@/components/admin/template-selector'; // Reuse Block type

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
        // category?: string; // Consider if needed for styling previews
    };
}

// --- Block Rendering Components (Simplified versions for preview) ---
// These are similar to the ones in `/admin/preview/page.tsx` but adapted for component use

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
    return <Tag className={sizeClasses[block.level as keyof typeof sizeClasses] || sizeClasses[2]}>{block.content || <span className="text-muted-foreground italic">[Boş Başlık]</span>}</Tag>;
};

const ImageBlockPreview: React.FC<{ block: Extract<Block, { type: 'image' }> }> = ({ block }) => (
    <figure className="my-6">
        {block.url ? (
            <Image
                src={block.url}
                alt={block.alt || 'Görsel'}
                width={800} // Adjust as needed for preview size
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

const PlaceholderBlockPreview: React.FC<{ type: string }> = ({ type }) => (
    <div className="bg-muted p-4 rounded my-4 text-center text-muted-foreground italic text-sm">
        [{type} Bloğu Önizlemesi]
    </div>
);

// Function to render a single block
const renderPreviewBlock = (block: Block) => {
    switch (block.type) {
        case 'text':
            return <TextBlockPreview key={block.id} block={block} />;
        case 'heading':
            return <HeadingBlockPreview key={block.id} block={block} />;
        case 'image':
            return <ImageBlockPreview key={block.id} block={block} />;
        case 'quote':
            return <QuoteBlockPreview key={block.id} block={block} />;
        case 'divider':
            return <DividerBlockPreview key={block.id} />;
        // Add cases for other block types if previews are available
        case 'gallery':
        case 'video':
        case 'code':
        default:
            return <PlaceholderBlockPreview key={block.id} type={block.type} />;
    }
};


// --- The Main Preview Renderer Component ---
const PagePreviewRenderer: React.FC<PagePreviewRendererProps> = ({ pageData }) => {
    const { title, blocks, imageUrl } = pageData;

    // Basic structure mimicking a simplified page layout
    return (
        <div className="p-4 bg-background text-foreground h-full overflow-y-auto">
            <header className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{title || <span className="text-muted-foreground italic">[Başlık Yok]</span>}</h1>
            </header>

            {/* Optional: Render a main image if available and not handled by blocks */}
            {/* {imageUrl && !blocks.some(b => b.type === 'image') && (
                <div className="mb-6 shadow rounded-lg overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={title || "Ana Görsel"}
                        width={1200}
                        height={600}
                        className="w-full h-auto object-cover"
                    />
                </div>
            )} */}

            {/* Render Blocks */}
            <div className="prose dark:prose-invert max-w-none">
                {blocks.length > 0 ? (
                    blocks.map(renderPreviewBlock)
                ) : (
                    <p className="text-muted-foreground italic">(Bu sayfada henüz içerik bölümü yok)</p>
                )}
            </div>
        </div>
    );
};

export default PagePreviewRenderer;
