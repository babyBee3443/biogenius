
"use client";

import * as React from 'react';
import Image from 'next/image';
import type { Block } from '@/components/admin/template-selector';
import { cn } from '@/lib/utils';
import { Loader2, Mail, Phone, MapPin } from 'lucide-react'; // Import needed icons
import { Button } from '@/components/ui/button'; // Import Button for teasers
import Link from 'next/link'; // Import Link for teasers
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // For contact info
import { Input } from '@/components/ui/input'; // For contact form
import { Label } from '@/components/ui/label'; // For contact form
import { Textarea } from '@/components/ui/textarea'; // For contact form

// --- Mock Components for Homepage Sections ---
// These components simulate what the real homepage components might look like.
// They should fetch their own data in a real application, but for preview, we use settings.
const FeaturedArticlesSection: React.FC<{ settings: any }> = ({ settings }) => {
    const count = settings?.count || 3;
    const items = Array.from({ length: count }, (_, i) => i + 1); // Create array based on count

    return (
        <div className="p-6 border border-dashed border-blue-500/50 rounded my-4 bg-blue-500/5">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-300">{settings?.title || 'Öne Çıkanlar'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {items.map(i => (
                    <div key={i} className="w-full h-24 bg-blue-100 dark:bg-blue-800/30 rounded text-xs flex flex-col items-center justify-center p-2 border border-blue-200 dark:border-blue-700/50">
                         <Image src={`https://picsum.photos/seed/feat${i}/100/50`} alt={`Makale ${i}`} width={100} height={50} className="rounded mb-1" data-ai-hint="technology abstract"/>
                         <span>Makale {i} Başlığı</span>
                     </div>
                ))}
            </div>
        </div>
    );
};

const CategoryTeaserSection: React.FC<{ settings: any }> = ({ settings }) => (
    <div className="p-6 border border-dashed border-green-500/50 rounded my-4 bg-green-500/5">
        <h2 className="text-xl font-semibold mb-4 text-green-800 dark:text-green-300">{settings?.title || 'Kategoriler'}</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="p-4 bg-green-100 dark:bg-green-800/30 rounded text-center border border-green-200 dark:border-green-700/50">
                 <h3 className="font-medium mb-2">{settings?.techButtonLabel || 'Teknoloji'}</h3>
                 <Button size="sm" variant="outline" className="border-green-500/50 text-green-700 dark:text-green-300 hover:bg-green-200/50 dark:hover:bg-green-700/30" asChild>
                     <Link href="#">Makalelere Göz At</Link>
                 </Button>
             </div>
             <div className="p-4 bg-green-100 dark:bg-green-800/30 rounded text-center border border-green-200 dark:border-green-700/50">
                 <h3 className="font-medium mb-2">{settings?.bioButtonLabel || 'Biyoloji'}</h3>
                 <Button size="sm" variant="outline" className="border-green-500/50 text-green-700 dark:text-green-300 hover:bg-green-200/50 dark:hover:bg-green-700/30" asChild>
                     <Link href="#">Makalelere Göz At</Link>
                 </Button>
            </div>
         </div>
    </div>
);

const RecentArticlesSection: React.FC<{ settings: any }> = ({ settings }) => {
    const count = settings?.count || 3;
    const items = Array.from({ length: count }, (_, i) => i + 1); // Create array based on count

    return (
     <div className="p-6 border border-dashed border-purple-500/50 rounded my-4 bg-purple-500/5">
        <h2 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-300">{settings?.title || 'Son Eklenenler'}</h2>
         <div className="space-y-3">
             {items.map(i => (
                <div key={i} className="flex items-center gap-3 p-2 bg-purple-100 dark:bg-purple-800/30 rounded border border-purple-200 dark:border-purple-700/50">
                    <Image src={`https://picsum.photos/seed/recent${i}/50/50`} alt={`Son Makale ${i}`} width={50} height={50} className="rounded flex-shrink-0" data-ai-hint="abstract colorful"/>
                    <span className="text-sm font-medium">Son Eklenen Makale {i} Başlığı</span>
                 </div>
             ))}
         </div>
    </div>
);
}

const ContactFormSection: React.FC<{ settings: any }> = ({ settings }) => (
     <div className="p-6 border border-dashed border-orange-500/50 rounded my-4 bg-orange-500/5">
        <h2 className="text-xl font-semibold mb-4 text-orange-800 dark:text-orange-300">{settings?.title || 'İletişim Formu'}</h2>
        {/* Basic form structure for preview */}
        <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="prev-name">Ad Soyad</Label>
                    <Input id="prev-name" placeholder="Adınız..." disabled className="bg-white dark:bg-gray-800/50"/>
                </div>
                <div>
                    <Label htmlFor="prev-email">E-posta</Label>
                    <Input id="prev-email" type="email" placeholder="E-postanız..." disabled className="bg-white dark:bg-gray-800/50"/>
                </div>
            </div>
            <div>
                <Label htmlFor="prev-message">Mesaj</Label>
                <Textarea id="prev-message" placeholder="Mesajınız..." rows={4} disabled className="bg-white dark:bg-gray-800/50"/>
            </div>
            <Button type="button" disabled>Gönder (Önizleme)</Button>
             {settings?.recipientEmail && <p className="text-xs text-muted-foreground mt-2">Gönderilecek Adres: {settings.recipientEmail}</p>}
        </form>
    </div>
);

const CustomTextSection: React.FC<{ settings: any }> = ({ settings }) => (
     <div className="p-6 border border-dashed border-gray-500/50 rounded my-4 bg-gray-500/5">
         {/* Render HTML carefully - consider sanitization or a safe rendering method */}
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: settings?.content || '<p class="italic text-gray-500">[Özel Metin İçeriği Yok]</p>' }} />
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
        {/* Render basic HTML or use dangerouslySetInnerHTML for more complex content from editor */}
        <p className="text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, '<br />') || '<span class="text-muted-foreground italic">[Boş Metin Bloğu]</span>' }} />
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
    // Hide specific structural headings if needed (e.g., ones used only for layout hints)
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
                    // Add unoptimized prop if using external URLs heavily without specific host config
                    // unoptimized
                />
            ) : (
                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center text-muted-foreground italic">
                    [Görsel Alanı - URL Ekleyin]
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
        <hr className="my-8 border-border/50" />
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
                "cursor-pointer transition-all duration-200 ease-in-out rounded relative my-4", // Added margin
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
            {/* Tooltip shown only when selected */}
            {isSelected && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full shadow whitespace-nowrap z-20">
                    Düzenlemek için sol panele bakın
                </div>
            )}
        </div>
    );
};


const PlaceholderBlockPreview: React.FC<{ type: string, isSelected: boolean, onClick: (e: React.MouseEvent) => void }> = ({ type, isSelected, onClick }) => (
     <div onClick={onClick} className={cn("cursor-pointer transition-colors duration-150 p-1 -m-1 rounded", { 'bg-primary/10': isSelected, 'hover:bg-muted/50': !isSelected })}>
        <div className="bg-muted p-4 rounded my-4 text-center text-muted-foreground italic text-sm">
            [{type} Bloğu Önizlemesi - Düzenleyici Yok]
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
            className="p-6 bg-background text-foreground h-full overflow-y-auto relative" // Added relative positioning
            onClick={() => onBlockSelect(null)} // Click background to deselect
         >
            {isPreview && ( // Show header only in the editor preview pane
                 <header className="mb-6 border-b pb-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
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
