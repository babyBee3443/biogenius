"use client";

import * as React from 'react';
import Image from 'next/image';
import type { Block } from '@/components/admin/template-selector';
import { cn } from '@/lib/utils'; // Import cn utility

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
    };
    selectedBlockId: string | null; // ID of the block selected in the editor
    onBlockSelect: (id: string) => void; // Callback when a block is clicked in preview
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

const PlaceholderBlockPreview: React.FC<{ type: string }> = ({ type }) => (
    <div className="bg-muted p-4 rounded my-4 text-center text-muted-foreground italic text-sm">
        [{type} Bloğu Önizlemesi]
    </div>
);

// Function to render a single block with selection handling
const renderPreviewBlock = (
    block: Block,
    isSelected: boolean,
    onClick: () => void
) => {
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
                "cursor-pointer transition-all duration-200 ease-in-out p-1 -m-1 rounded", // Add padding/margin for click area and rounding
                {
                     "ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/10": isSelected, // Highlight selected block
                     "hover:bg-muted/50": !isSelected // Subtle hover effect
                }
            )}
             data-preview-block-id={block.id} // Add data attribute for potential targeting
        >
            {content}
        </div>
    );
};


// --- The Main Preview Renderer Component ---
const PagePreviewRenderer: React.FC<PagePreviewRendererProps> = ({
    pageData,
    selectedBlockId,
    onBlockSelect,
 }) => {
    const { title, blocks } = pageData;

    return (
        <div className="p-4 bg-background text-foreground h-full overflow-y-auto">
            <header className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{title || <span className="text-muted-foreground italic">[Başlık Yok]</span>}</h1>
            </header>

            {/* Render Blocks */}
            <div className="prose dark:prose-invert max-w-none">
                {blocks.length > 0 ? (
                    blocks.map(block =>
                        renderPreviewBlock(
                            block,
                            block.id === selectedBlockId,
                            () => onBlockSelect(block.id)
                        )
                    )
                ) : (
                    <p className="text-muted-foreground italic">(Bu sayfada henüz içerik bölümü yok)</p>
                )}
            </div>
        </div>
    );
};

export default PagePreviewRenderer;
