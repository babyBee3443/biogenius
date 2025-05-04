
"use client";

import * as React from 'react';
import Image from 'next/image';
import type { Block } from '@/components/admin/template-selector';
import { cn } from '@/lib/utils';
import { Loader2, Mail, Phone, MapPin, Film } from 'lucide-react'; // Import needed icons, added Film
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// --- Types (assuming these are defined elsewhere or globally) ---
interface HeroSettings {
    enabled: boolean;
    articleSource: 'latest' | 'featured';
    intervalSeconds: number;
    maxArticles: number;
}

interface ArticleStub {
  id: string;
  title: string;
  description: string;
  category: 'Teknoloji' | 'Biyoloji';
  imageUrl: string;
}
// ---

// --- Mock Components for Homepage Sections ---
// Simulate fetching featured/latest articles for Hero Preview
const getMockArticlesForHero = (source: 'latest' | 'featured', count: number): ArticleStub[] => {
     const allMockArticles: ArticleStub[] = [
         { id: 'hero-1', title: 'Yapay Zeka Sanatı', description: 'AI tarafından üretilen sanat eserleri.', category: 'Teknoloji', imageUrl: 'https://picsum.photos/seed/hero-ai/1920/1080' },
         { id: 'hero-2', title: 'CRISPR ile Hastalık Tedavisi', description: 'Gen düzenlemenin tıptaki yeri.', category: 'Biyoloji', imageUrl: 'https://picsum.photos/seed/hero-crispr/1920/1080' },
         { id: 'hero-3', title: 'Kuantum İnternet', description: 'Geleceğin iletişim ağı.', category: 'Teknoloji', imageUrl: 'https://picsum.photos/seed/hero-quantum/1920/1080' },
         { id: 'hero-4', title: 'Nöroteknoloji', description: 'Beyin-bilgisayar arayüzleri.', category: 'Teknoloji', imageUrl: 'https://picsum.photos/seed/hero-neuro/1920/1080' },
         { id: 'hero-5', title: 'Sentetik Biyolojide Son Gelişmeler', description: 'Yaşamı programlamak.', category: 'Biyoloji', imageUrl: 'https://picsum.photos/seed/hero-synbio/1920/1080' },
     ];
     // Simple filter/sort simulation
     if (source === 'featured') {
         return allMockArticles.filter(a => ['hero-1', 'hero-2', 'hero-3'].includes(a.id)).slice(0, count);
     }
     // Default to 'latest' (just slicing for mock purposes)
     return allMockArticles.slice(0, count);
 };


const HeroSectionPreview: React.FC<{ settings: HeroSettings | undefined }> = ({ settings }) => {
    if (!settings || !settings.enabled) {
        return (
            <div className="p-6 border border-dashed border-gray-500/50 rounded my-4 bg-gray-500/5 text-center text-muted-foreground italic">
                [Hero Bölümü Devre Dışı]
            </div>
        );
    }

    // Simulate fetching articles based on settings
    const articles = getMockArticlesForHero(settings.articleSource, settings.maxArticles);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    // Basic auto-play simulation (only advances, doesn't respect interval perfectly in preview)
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % articles.length);
        }, settings.intervalSeconds * 1000);
        return () => clearTimeout(timer);
    }, [currentIndex, articles.length, settings.intervalSeconds]);

    if (articles.length === 0) {
        return (
            <div className="p-6 border border-dashed border-yellow-500/50 rounded my-4 bg-yellow-500/5 text-center text-yellow-700">
                [Hero için uygun makale bulunamadı (Kaynak: {settings.articleSource}, Max: {settings.maxArticles}) - Makale ekleyin veya ayarları kontrol edin]
            </div>
        );
    }

    const currentArticle = articles[currentIndex];

    return (
        <div className="relative h-48 md:h-56 p-6 border border-dashed border-indigo-500/50 rounded my-4 bg-indigo-500/5 overflow-hidden flex items-center justify-center text-center">
             {/* Background Image Simulation */}
             <div className="absolute inset-0 z-0">
                 <Image
                    src={currentArticle.imageUrl}
                    alt={currentArticle.title}
                    layout="fill"
                    objectFit="cover"
                    className="filter brightness-50"
                    data-ai-hint="hero abstract background"
                 />
                 <div className="absolute inset-0 bg-black/30"></div>
             </div>
             {/* Content Simulation */}
            <div className="relative z-10 text-white">
                <h2 className="text-lg font-semibold md:text-xl">{currentArticle.title}</h2>
                <p className="mt-2 text-xs md:text-sm max-w-md mx-auto text-gray-200">{currentArticle.description}</p>
                <Button size="sm" className="mt-4" disabled>Devamını Oku (Önizleme)</Button>
            </div>
            {/* Dots Simulation */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-2">
                 {articles.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      currentIndex === index ? 'bg-white scale-110' : 'bg-white/50'
                    )}
                  />
                ))}
            </div>
        </div>
    );
};


// --- Other Mock Components (Unchanged) ---
const FeaturedArticlesSection: React.FC<{ settings: any }> = ({ settings }) => {
    const count = settings?.count || 3;
    const items = Array.from({ length: count }, (_, i) => i + 1);

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
    const items = Array.from({ length: count }, (_, i) => i + 1);

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
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: settings?.content || '<p class="italic text-gray-500">[Özel Metin İçeriği Yok]</p>' }} />
    </div>
);
// --- End Mock Components ---


// --- Props for PagePreviewRenderer ---
interface PagePreviewRendererProps {
    pageData: {
        id: string;
        title: string;
        slug: string;
        blocks: Block[];
        seoTitle?: string;
        seoDescription?: string;
        imageUrl?: string;
        settings?: Record<string, any>;
        heroSettings?: HeroSettings; // Add heroSettings
    };
    selectedBlockId: string | null;
    onBlockSelect: (id: string | null) => void;
    isPreview?: boolean;
}

// --- Block Rendering Components (Simplified versions for preview) ---
// ... (TextBlockPreview, HeadingBlockPreview, ImageBlockPreview, etc. remain unchanged) ...
const TextBlockPreview: React.FC<{ block: Extract<Block, { type: 'text' }>, isSelected: boolean, onClick: (e: React.MouseEvent) => void }> = ({ block, isSelected, onClick }) => (
     <div onClick={onClick} className={cn("cursor-pointer transition-colors duration-150 p-1 -m-1 rounded", { 'bg-primary/10': isSelected, 'hover:bg-muted/50': !isSelected })}>
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

const SectionBlockPreview: React.FC<{ block: Extract<Block, { type: 'section' }>, isSelected: boolean, onClick: (e: React.MouseEvent) => void }> = ({ block, isSelected, onClick }) => {
    const { sectionType, settings } = block;
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
            onClick={onClick}
            className={cn(
                "cursor-pointer transition-all duration-200 ease-in-out rounded relative my-4",
                { 'ring-2 ring-primary ring-offset-2 ring-offset-background': isSelected }
            )}
             data-preview-block-id={block.id}
        >
            {isSelected && <div className="absolute inset-0 bg-primary/5 rounded pointer-events-none z-0"></div>}
            <div className="relative z-10">
                <SectionComponent settings={settings} />
            </div>
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
    isPreview = false,
 }) => {
    const { id: pageId, title, blocks, slug, heroSettings } = pageData; // Destructure heroSettings


    return (
        <div
            className="p-6 bg-background text-foreground h-full overflow-y-auto relative"
            onClick={() => onBlockSelect(null)}
         >
            {isPreview && (
                 <header className="mb-6 border-b pb-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                    <h1 className="text-2xl font-bold mb-1">{title || <span className="text-muted-foreground italic">[Başlık Yok]</span>}</h1>
                    <p className="text-sm text-muted-foreground">URL: /{slug || ''}</p>
                 </header>
             )}

            {/* Render Hero Section Preview (Only for homepage preview) */}
             {isPreview && pageId === 'anasayfa' && (
                 <HeroSectionPreview settings={heroSettings} />
             )}

            {/* Render Blocks */}
            <div className="prose dark:prose-invert max-w-none">
                {blocks.length > 0 ? (
                     blocks.map(block => {
                         // Skip rendering hero block if it's handled separately
                         // if (isPreview && pageId === 'anasayfa' && block.id === 'hp-hero') return null;

                         const isSelected = block.id === selectedBlockId;
                         const handleSelect = (e: React.MouseEvent) => {
                             e.stopPropagation();
                             onBlockSelect(block.id);
                         };

                         switch (block.type) {
                            case 'text': return <TextBlockPreview key={block.id} block={block} isSelected={isSelected} onClick={handleSelect} />;
                            case 'heading': return <HeadingBlockPreview key={block.id} block={block} isSelected={isSelected} onClick={handleSelect} />;
                            case 'image': return <ImageBlockPreview key={block.id} block={block} isSelected={isSelected} onClick={handleSelect} />;
                            case 'quote': return <QuoteBlockPreview key={block.id} block={block} isSelected={isSelected} onClick={handleSelect} />;
                            case 'divider': return <DividerBlockPreview key={block.id} isSelected={isSelected} onClick={handleSelect} />;
                            case 'section': return <SectionBlockPreview key={block.id} block={block} isSelected={isSelected} onClick={handleSelect} />;
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

    