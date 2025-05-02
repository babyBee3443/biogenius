
"use client";

import * as React from 'react';
import Image from 'next/image';
import type { Block } from '@/components/admin/template-selector';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react'; // Still potentially useful for async loading sections

// --- Mock Components for Homepage Sections ---
// These components simulate what the real homepage components might look like.
// They should fetch their own data in a real application.
const FeaturedArticlesSection: React.FC<{ settings: any }> = ({ settings }) => (
    <div className="p-4 border border-dashed border-blue-500 rounded my-4 bg-blue-500/10">
        <h2 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-300">{settings?.title || 'Öne Çıkanlar'}</h2>
        <p className="text-sm text-blue-700 dark:text-blue-400">({settings?.count || 'N/A'} adet makale gösterilecek)</p>
        {/* Placeholder for actual article cards */}
        <div className="flex gap-2 mt-2">
            <div className="w-1/3 h-16 bg-blue-200 dark:bg-blue-800/50 rounded text-xs flex items-center justify-center">Makale 1</div>
            <div className="w-1/3 h-16 bg-blue-200 dark:bg-blue-800/50 rounded text-xs flex items-center justify-center">Makale 2</div>
            <div className="w-1/3 h-16 bg-blue-200 dark:bg-blue-800/50 rounded text-xs flex items-center justify-center">Makale 3</div>
        </div>
    </div>
);

const CategoryTeaserSection: React.FC<{ settings: any }> = ({ settings }) => (
    <div className="p-4 border border-dashed border-green-500 rounded my-4 bg-green-500/10">
        <h2 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-300">{settings?.title || 'Kategoriler'}</h2>
         <div className="flex gap-2 mt-2">
             <div className="w-1/2 h-16 bg-green-200 dark:bg-green-800/50 rounded text-xs flex items-center justify-center">Teknoloji</div>
             <div className="w-1/2 h-16 bg-green-200 dark:bg-green-800/50 rounded text-xs flex items-center justify-center">Biyoloji</div>
         </div>
    </div>
);

const RecentArticlesSection: React.FC<{ settings: any }> = ({ settings }) => (
     <div className="p-4 border border-dashed border-purple-500 rounded my-4 bg-purple-500/10">
        <h2 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-300">{settings?.title || 'Son Eklenenler'}</h2>
        <p className="text-sm text-purple-700 dark:text-purple-400">({settings?.count || 'N/A'} adet makale gösterilecek)</p>
         <div className="flex gap-2 mt-2">
             <div className="w-full h-10 bg-purple-200 dark:bg-purple-800/50 rounded text-xs flex items-center justify-center">Son Makale 1</div>
         </div>
          <div className="flex gap-2 mt-1">
             <div className="w-full h-10 bg-purple-200 dark:bg-purple-800/50 rounded text-xs flex items-center justify-center">Son Makale 2</div>
         </div>
          <div className="flex gap-2 mt-1">
             <div className="w-full h-10 bg-purple-200 dark:bg-purple-800/50 rounded text-xs flex items-center justify-center">Son Makale 3</div>
         </div>
    </div>
);

const ContactFormSection: React.FC<{ settings: any }> = ({ settings }) => (
     <div className="p-4 border border-dashed border-orange-500 rounded my-4 bg-orange-500/10">
        <h2 className="text-lg font-semibold mb-2 text-orange-800 dark:text-orange-300">İletişim Formu</h2>
        <p className="text-sm text-orange-700 dark:text-orange-400 italic">Form alanları burada görünecek.</p>
        {/* Placeholder for form fields */}
    </div>
);

const CustomTextSection: React.FC<{ settings: any }> = ({ settings }) => (
     <div className="p-4 border border-dashed border-gray-500 rounded my-4 bg-gray-500/10">
         <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-300">Özel Metin Bölümü</h2>
         {/* Render HTML carefully - consider sanitization or a safe rendering method */}
        <div className="text-sm" dangerouslySetInnerHTML={{ __html: settings?.content || '<p class="italic text-gray-500">[İçerik Yok]</p>' }} />
    </div>
);
// --- End Mock Components ---


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

const TextBlockPreview: React.FC<{ block: Extract<Block, { type: 'text' }>, isSelected: boolean, onClick: (e: React.MouseEvent) => void }> = ({ block, isSelected, onClick }) => (
     <div onClick={onClick} className={cn("cursor-pointer transition-colors duration-150 p-1 -m-1 rounded", { 'bg-primary/10': isSelected, 'hover:bg-muted/50': !isSelected })}>
        <p className="text-base leading-relaxed">{block.content || <span className="text-muted-foreground italic">[Boş Metin Bloğu]</span>}</p>
    </div>
);

const HeadingBlockPreview: React.FC<{ block: Extract<Block, { type: 'heading' }>, isSelected: boolean, onClick: (e: React.MouseEvent) => void }> = ({ block, isSelected, onClick }) => {
    const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
    const sizeClasses = {
        1: 'text-3xl font-bold mb-4 mt-6',
        2: 'text-2xl font-semibold mb-3 mt-5',
        3: 'text-xl font-semibold mb-3 mt-4',
        4: 'text-lg font-semibold mb-2 mt-3',
        5: 'text-base font-semibold mb-2 mt-2',
        6: 'text-sm font-semibold mb-2 mt-2',
    };
    // Hide specific structural headings if needed
    if (block.id.startsWith('hpb-')) return null;

    return (
        <div onClick={onClick} className={cn("cursor-pointer transition-colors duration-150 p-1 -m-1 rounded", { 'bg-primary/10': isSelected, 'hover:bg-muted/50': !isSelected })}>
             <Tag className={sizeClasses[block.level as keyof typeof sizeClasses] || sizeClasses[2]}>
                 {block.content || <span className="text-muted-foreground italic">[Boş Başlık]</span>}
             </Tag>
        </div>
    );
};

const ImageBlockPreview: React.FC<{ block: Extract<Block, { type: 'image' }>, isSelected: boolean, onClick: (e: React.MouseEvent) => void }> = ({ block, isSelected, onClick }) => (
     <div onClick={onClick} className={cn("cursor-pointer transition-colors duration-150 p-1 -m-1 rounded", { 'ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/10': isSelected, 'hover:bg-muted/50': !isSelected })}>
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
    </div>
);

const QuoteBlockPreview: React.FC<{ block: Extract<Block, { type: 'quote' }>, isSelected: boolean, onClick: (e: React.MouseEvent) => void }> = ({ block, isSelected, onClick }) => (
    <div onClick={onClick} className={cn("cursor-pointer transition-colors duration-150 p-1 -m-1 rounded", { 'bg-primary/10': isSelected, 'hover:bg-muted/50': !isSelected })}>
        <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
            <p>{block.content || <span className="text-muted-foreground italic">[Boş Alıntı]</span>}</p>
            {block.citation && <footer className="mt-2 text-sm not-italic">— {block.citation}</footer>}
        </blockquote>
    </div>
);

const DividerBlockPreview: React.FC<{ isSelected: boolean, onClick: (e: React.MouseEvent) => void }> = ({ isSelected, onClick }) => (
    <div onClick={onClick} className={cn("cursor-pointer transition-colors duration-150 py-2 rounded", { 'bg-primary/10': isSelected, 'hover:bg-muted/50': !isSelected })}>
        <hr className="my-8" />
    </div>
);

// Section Block Preview
const SectionBlockPreview: React.FC<{ block: Extract<Block, { type: 'section' }>, isSelected: boolean, onClick: (e: React.MouseEvent) => void }> = ({ block, isSelected, onClick }) => {
    const { sectionType, settings } = block;

    // Render the appropriate mock component based on sectionType
    let SectionComponent;
    switch (sectionType) {
        case 'featured-articles': SectionComponent = FeaturedArticlesSection; break;
        case 'category-teaser': SectionComponent = CategoryTeaserSection; break;
        case 'recent-articles': SectionComponent = RecentArticlesSection; break;
        case 'contact-form': SectionComponent = ContactFormSection; break;
        case 'custom-text': SectionComponent = CustomTextSection; break;
        default: SectionComponent = () => <div className="p-4 border border-dashed border-red-500 rounded my-4 bg-red-500/10 text-red-700">Bilinmeyen Bölüm Tipi: {sectionType}</div>;
    }

    return (
        <div
            key={block.id}
            onClick={onClick} // Allow clicking the section wrapper
            className={cn(
                "cursor-pointer transition-all duration-200 ease-in-out rounded relative",
                 // Apply ring only when selected
                { 'ring-2 ring-primary ring-offset-2 ring-offset-background': isSelected }
            )}
             data-preview-block-id={block.id}
        >
            {/* Add overlay for better selection indication */}
            {isSelected && <div className="absolute inset-0 bg-primary/5 rounded pointer-events-none z-0"></div>}
            <div className="relative z-10"> {/* Content above overlay */}
                <SectionComponent settings={settings} />
            </div>
            {isSelected && (
                <p className="text-xs text-muted-foreground text-center mt-1">(Düzenlemek için sol panele bakın)</p>
            )}
        </div>
    );
};


const PlaceholderBlockPreview: React.FC<{ type: string, isSelected: boolean, onClick: (e: React.MouseEvent) => void }> = ({ type, isSelected, onClick }) => (
     <div onClick={onClick} className={cn("cursor-pointer transition-colors duration-150 p-1 -m-1 rounded", { 'bg-primary/10': isSelected, 'hover:bg-muted/50': !isSelected })}>
        <div className="bg-muted p-4 rounded my-4 text-center text-muted-foreground italic text-sm">
            [{type} Bloğu Önizlemesi]
        </div>
    </div>
);


// --- The Main Preview Renderer Component ---
const PagePreviewRenderer: React.FC<PagePreviewRendererProps> = ({
    pageData,
    selectedBlockId,
    onBlockSelect,
    isPreview = false, // isPreview is often true in the editor context
 }) => {
    const { id: pageId, title, blocks, slug } = pageData;


    // Always use component-based rendering for direct updates
    return (
        <div
            className="p-6 bg-background text-foreground h-full overflow-y-auto"
            onClick={() => onBlockSelect(null)} // Click background to deselect
         >
            {isPreview && ( // Show header only in the editor preview pane
                 <header className="mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold mb-1">{title || <span className="text-muted-foreground italic">[Başlık Yok]</span>}</h1>
                    <p className="text-sm text-muted-foreground">URL: /{slug || ''}</p>
                 </header>
             )}

            {/* Render Blocks */}
            <div className="prose dark:prose-invert max-w-none">
                {blocks.length > 0 ? (
                     blocks.map(block => {
                         const isSelected = block.id === selectedBlockId;
                         const handleSelect = (e: React.MouseEvent) => {
                             e.stopPropagation(); // Prevent background click
                             onBlockSelect(block.id);
                         };

                         switch (block.type) {
                            case 'text': return <TextBlockPreview key={block.id} block={block} isSelected={isSelected} onClick={handleSelect} />;
                            case 'heading': return <HeadingBlockPreview key={block.id} block={block} isSelected={isSelected} onClick={handleSelect} />;
                            case 'image': return <ImageBlockPreview key={block.id} block={block} isSelected={isSelected} onClick={handleSelect} />;
                            case 'quote': return <QuoteBlockPreview key={block.id} block={block} isSelected={isSelected} onClick={handleSelect} />;
                            case 'divider': return <DividerBlockPreview key={block.id} isSelected={isSelected} onClick={handleSelect} />;
                            case 'section': return <SectionBlockPreview key={block.id} block={block} isSelected={isSelected} onClick={handleSelect} />;
                             // Add other block types here
                             default: return <PlaceholderBlockPreview key={block.id} type={block.type} isSelected={isSelected} onClick={handleSelect}/>;
                         }
                    })
                ) : (
                    <p className="text-muted-foreground italic">(Bu sayfada henüz içerik bölümü yok. Eklemek için sol paneli kullanın.)</p>
                )}
            </div>
        </div>
    );
};

export default PagePreviewRenderer;
