
"use client";

import * as React from "react";
import { useRouter, useParams, notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { Switch } from "@/components/ui/switch"; // Import Switch
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Trash2, Monitor, Tablet, Smartphone, Settings, Eye, Film } from "lucide-react"; // Added Film icon for Hero
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { BlockEditor } from "@/components/admin/block-editor";
import type { Block } from "@/components/admin/template-selector";
import SeoPreview from "@/components/admin/seo-preview";
import PagePreviewRenderer from "@/components/admin/page-preview-renderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// --- Types ---
interface HeroSettings {
    enabled: boolean;
    articleSource: 'latest' | 'featured';
    intervalSeconds: number;
    maxArticles: number;
}

interface PageData {
    id: string;
    title: string;
    slug: string;
    blocks: Block[];
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    imageUrl?: string;
    settings?: Record<string, any>;
    heroSettings?: HeroSettings; // Add heroSettings
}

// --- Mock Data ---
// Updated mock function to include heroSettings for homepage
const getPageById = async (id: string): Promise<PageData | null> => {
    const pages: PageData[] = [
        {
            id: 'anasayfa',
            title: 'Anasayfa',
            slug: '',
            blocks: [
                // Structural blocks (hidden in editor preview)
                { id: 'hpb-welcome', type: 'heading', level: 1, content: 'TeknoBiyo\'ya Hoş Geldiniz!' },
                { id: 'hpb-intro', type: 'text', content: 'Teknoloji ve biyoloji dünyasındaki en son gelişmeleri, derinlemesine analizleri ve ilgi çekici makaleleri keşfedin.' },
                // Visual sections
                { id: 'hp-section-featured', type: 'section', sectionType: 'featured-articles', settings: { title: 'Öne Çıkanlar', count: 3 } },
                { id: 'hp-section-categories', type: 'section', sectionType: 'category-teaser', settings: { title: 'Kategoriler', techButtonLabel: 'Teknoloji', bioButtonLabel: 'Biyoloji'} },
                { id: 'hp-section-recent', type: 'section', sectionType: 'recent-articles', settings: { title: 'En Son Eklenenler', count: 3 } },
                { id: 'hp-section-custom-text', type: 'section', sectionType: 'custom-text', settings: { content: '<p>Bu alana <strong>özel metin</strong> veya HTML ekleyebilirsiniz.</p>' } },
            ],
            seoTitle: 'TeknoBiyo | Teknoloji ve Biyoloji Makaleleri',
            seoDescription: 'Teknoloji ve biyoloji alanlarındaki en son gelişmeleri, derinlemesine analizleri ve ilgi çekici makaleleri keşfedin.',
            imageUrl: 'https://picsum.photos/seed/homepage/1200/600',
            settings: {},
            heroSettings: { // Default Hero Settings for Homepage
                enabled: true,
                articleSource: 'featured', // Show featured articles by default
                intervalSeconds: 5,
                maxArticles: 3,
            }
        },
        {
            id: 'hakkimizda',
            title: 'Hakkımızda',
            slug: 'hakkimizda',
            blocks: [
                { id: 'ab1', type: 'heading', level: 2, content: 'Biz Kimiz?' },
                { id: 'ab2', type: 'text', content: 'TeknoBiyo, teknoloji ve biyoloji dünyalarının kesişim noktasında yer alan, meraklı zihinler için hazırlanmış bir bilgi platformudur...' },
                { id: 'ab3', type: 'image', url: 'https://picsum.photos/seed/teamwork/800/600', alt: 'Ekip Çalışması', caption: 'Vizyonumuz' },
            ],
            seoTitle: 'Hakkımızda | TeknoBiyo',
            seoDescription: 'TeknoBiyo\'nun arkasındaki vizyonu, misyonu ve değerleri keşfedin.',
            imageUrl: 'https://picsum.photos/seed/teamwork/1200/600'
        },
        {
            id: 'iletisim',
            title: 'İletişim',
            slug: 'iletisim',
            blocks: [
                { id: 'cb1', type: 'heading', level: 2, content: 'Bizimle İletişime Geçin' },
                { id: 'cb2', type: 'text', content: 'Sorularınız, önerileriniz veya işbirliği talepleriniz için bize ulaşın.' },
                { id: 'cb-form', type: 'section', sectionType: 'contact-form', settings: { title: 'İletişim Formu', recipientEmail: 'iletisim@teknobiyo.example.com' } },
            ],
            seoTitle: 'İletişim | TeknoBiyo',
            seoDescription: 'TeknoBiyo ile iletişime geçin. Sorularınız ve önerileriniz için buradayız.',
             imageUrl: 'https://picsum.photos/seed/contactus/1200/600'
        },
    ];
    return pages.find(page => page.id === id) || null;
};


export default function EditPage() {
    const router = useRouter();
    const params = useParams();
    const resolvedParams = React.use(params); // Use React.use() here
    const pageId = resolvedParams.id as string;

    const [pageData, setPageData] = React.useState<PageData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [title, setTitle] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [blocks, setBlocks] = React.useState<Block[]>([]);
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [canonicalUrl, setCanonicalUrl] = React.useState("");
    const [previewDevice, setPreviewDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null);
    const [editorView, setEditorView] = React.useState<'editor' | 'seo'>('editor');

    // --- State for Hero Settings ---
    const [heroSettings, setHeroSettings] = React.useState<HeroSettings>({
        enabled: true,
        articleSource: 'latest',
        intervalSeconds: 5,
        maxArticles: 3,
    });
    // ---

    React.useEffect(() => {
        if (pageId) {
            getPageById(pageId)
                .then(data => {
                    if (data) {
                        setPageData(data);
                        setTitle(data.title);
                        setSlug(data.slug);
                        setBlocks(data.blocks || []);
                        setSeoTitle(data.seoTitle || data.title || '');
                        setSeoDescription(data.seoDescription || '');
                        setKeywords(data.keywords || []);
                        setCanonicalUrl(data.canonicalUrl || '');
                        if (data.heroSettings) { // Load hero settings if available
                            setHeroSettings(data.heroSettings);
                        }
                    } else {
                        notFound();
                    }
                })
                .catch(error => {
                    console.error("Error fetching page data:", error);
                    toast({ variant: "destructive", title: "Hata", description: "Sayfa bilgileri yüklenirken bir sorun oluştu." });
                    notFound();
                })
                .finally(() => setLoading(false));
        }
    }, [pageId]);

    // Slug generation
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-').replace(/-+/g, '-');
    };

    // Auto-update slug when title changes (if slug is empty or matches old title slug)
    React.useEffect(() => {
        if (title && pageData && title !== pageData.title) {
             if (!slug || slug === generateSlug(pageData.title)) {
                 setSlug(generateSlug(title));
            }
        }
     }, [title, pageData, slug]);

    // Auto-update SEO title if empty
     React.useEffect(() => {
        if (title && !seoTitle && pageData && title !== pageData.title) {
            setSeoTitle(title);
        }
     }, [title, seoTitle, pageData]);

     // Auto-update SEO description if empty (use first text block if available)
     React.useEffect(() => {
        if (blocks.length > 0 && !seoDescription && pageData) {
            const firstTextBlock = blocks.find(b => b.type === 'text') as Extract<Block, { type: 'text' }> | undefined;
            if (firstTextBlock && firstTextBlock.content && firstTextBlock.content !== (pageData.blocks.find(b => b.id === firstTextBlock.id && b.type === 'text') as Extract<Block, { type: 'text' }>)?.content) {
                 const desc = firstTextBlock.content.length > 160 ? firstTextBlock.content.substring(0, 157) + '...' : firstTextBlock.content;
                 setSeoDescription(desc);
            }
        }
     }, [blocks, seoDescription, pageData]);


    // --- Block Handlers ---
    const handleAddBlock = (type: Block['type']) => {
        const newBlock: Block = {
            id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            type: type,
            ...(type === 'text' && { content: '' }),
            ...(type === 'heading' && { level: 2, content: '' }),
            ...(type === 'image' && { url: '', alt: '', caption: '' }),
            ...(type === 'gallery' && { images: [] }),
            ...(type === 'video' && { url: '' }),
            ...(type === 'quote' && { content: '', citation: '' }),
            ...(type === 'code' && { language: 'javascript', content: '' }),
            ...(type === 'divider' && {}),
             ...(type === 'section' && { sectionType: 'custom-text', settings: { content: '' } }),
        } as Block;
        setBlocks([...blocks, newBlock]);
        setSelectedBlockId(newBlock.id);
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks(blocks.filter(block => block.id !== id));
        if (selectedBlockId === id) {
            setSelectedBlockId(null);
        }
    };

    const handleUpdateBlock = (updatedBlock: Block) => {
        setBlocks(prevBlocks =>
            prevBlocks.map(block =>
                block.id === updatedBlock.id ? updatedBlock : block
            )
        );
    };

    const handleReorderBlocks = (reorderedBlocks: Block[]) => {
        setBlocks(reorderedBlocks);
    };

    const handleBlockSelect = (id: string | null) => {
        setSelectedBlockId(id);
        if (id) {
             const editorElement = document.querySelector(`[data-block-wrapper-id="${id}"]`);
             if (editorElement) {
                 editorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
             }
             setEditorView('editor');
        }
    };
    // --- End Block Handlers ---

    // --- Hero Settings Handlers ---
    const handleHeroSettingChange = <K extends keyof HeroSettings>(key: K, value: HeroSettings[K]) => {
        setHeroSettings(prev => ({ ...prev, [key]: value }));
    };
    // ---

    const handleSave = () => {
         if (!title) {
            toast({ variant: "destructive", title: "Hata", description: "Sayfa başlığı zorunludur." });
            return;
        }
        const saveData = {
            pageId,
            title,
            slug,
            blocks,
            seoTitle,
            seoDescription,
            keywords,
            canonicalUrl,
            ...(pageId === 'anasayfa' && { heroSettings }), // Only include heroSettings for homepage
        };
        console.log("Updating page:", saveData);
        // TODO: Implement actual API call to save the page data
        toast({
            title: "Sayfa Güncellendi",
            description: `"${title}" başlıklı sayfa başarıyla güncellendi.`,
        });
        if(pageData) setPageData({...pageData, title, slug, blocks, seoTitle, seoDescription, keywords, canonicalUrl, ...(pageId === 'anasayfa' && { heroSettings }) });
    };

     const handleDelete = () => {
        if (pageId === 'anasayfa') {
            toast({ variant: "destructive", title: "Hata", description: "Anasayfa silinemez." });
            return;
        }
        if (window.confirm(`"${title}" başlıklı sayfayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            console.log("Deleting page:", pageId);
            // TODO: Implement actual API call to delete the page
             toast({
                 variant: "destructive",
                 title: "Sayfa Silindi",
                 description: `"${title}" başlıklı sayfa silindi.`,
            });
            router.push('/admin/pages');
        }
    };

    // --- Preview Data for Renderer ---
    const currentPreviewData: PageData = React.useMemo(() => ({
        id: pageId || 'preview',
        title: title,
        slug: slug,
        blocks: blocks,
        seoTitle: seoTitle,
        seoDescription: seoDescription,
        imageUrl: pageData?.imageUrl || (blocks.find(b => b.type === 'image') as Extract<Block, { type: 'image' }>)?.url || 'https://picsum.photos/seed/page-preview/1200/600',
        settings: pageData?.settings || {},
        ...(pageId === 'anasayfa' && { heroSettings }), // Pass current hero settings for homepage preview
    }), [pageId, title, slug, blocks, seoTitle, seoDescription, pageData, keywords, canonicalUrl, heroSettings]); // Add heroSettings dependency


    const getPreviewSizeClass = () => {
      switch (previewDevice) {
        case 'mobile': return 'w-[375px] h-[667px] max-w-full max-h-full';
        case 'tablet': return 'w-[768px] h-[1024px] max-w-full max-h-full';
        default: return 'w-full h-full';
      }
    }


    if (loading) {
        return <div className="flex justify-center items-center h-screen">Sayfa bilgileri yükleniyor...</div>;
    }

     if (!pageData) {
         return <div className="text-center py-10">Sayfa bulunamadı.</div>;
    }


    return (
         // Removed overflow-hidden from outer div to allow ScrollArea to manage scrolling
        <div className="flex flex-col h-screen">
             {/* Top Bar */}
             <div className="flex items-center justify-between px-4 py-2 border-b bg-card sticky top-0 z-20 h-14 flex-shrink-0"> {/* Ensure top bar doesn't shrink */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/pages"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                    </Button>
                    <Separator orientation="vertical" className="h-6"/>
                     <Button
                       variant={editorView === 'editor' ? 'secondary' : 'ghost'}
                       size="sm"
                       onClick={() => setEditorView('editor')}
                     >
                       <Settings className="mr-2 h-4 w-4" /> Düzenleyici
                     </Button>
                     <Button
                        variant={editorView === 'seo' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setEditorView('seo')}
                     >
                       <Eye className="mr-2 h-4 w-4" /> SEO Ayarları
                     </Button>
                </div>
                 <h1 className="text-lg font-semibold truncate hidden md:block" title={`Sayfayı Düzenle: ${pageData.title}`}>
                     {pageData.title}
                 </h1>
                 <div className="flex items-center gap-2">
                     {/* Preview Device Toggles */}
                     <Button
                        variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPreviewDevice('desktop')}
                        title="Masaüstü Önizleme"
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button
                         variant={previewDevice === 'tablet' ? 'secondary' : 'ghost'}
                         size="icon"
                         className="h-8 w-8"
                         onClick={() => setPreviewDevice('tablet')}
                         title="Tablet Önizleme"
                      >
                         <Tablet className="h-4 w-4" />
                      </Button>
                      <Button
                         variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'}
                         size="icon"
                         className="h-8 w-8"
                         onClick={() => setPreviewDevice('mobile')}
                         title="Mobil Önizleme"
                      >
                         <Smartphone className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6 mx-2" />

                     {pageId !== 'anasayfa' && (
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                     )}
                      <Button size="sm" onClick={handleSave} disabled={!title}>
                        <Save className="mr-2 h-4 w-4" /> Kaydet
                    </Button>
                 </div>
            </div>

            {/* Main Content Area (Editor/SEO + Preview) */}
             {/* Use flex-1 and overflow-hidden on the container of the two panes */}
             <div className="flex flex-1 overflow-hidden">
                 {/* Left Pane (Editor or SEO) - Use ScrollArea */}
                 <ScrollArea className="flex-shrink-0 border-r w-[500px] h-full"> {/* Increased fixed width */}
                    <div className="p-6 space-y-6">
                        {editorView === 'editor' && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Temel Bilgiler</CardTitle>
                                        <CardDescription>Sayfanın başlığını ve URL'sini düzenleyin.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="page-title">Sayfa Başlığı <span className="text-destructive">*</span></Label>
                                            <Input
                                                id="page-title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="page-slug">URL Metni (Slug)</Label>
                                            <Input
                                                id="page-slug"
                                                value={slug}
                                                onChange={(e) => setSlug(generateSlug(e.target.value))}
                                                disabled={pageId === 'anasayfa'}
                                                placeholder={pageId === 'anasayfa' ? "(Anasayfa)" : "sayfa-url"}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                {pageId === 'anasayfa' ? "Anasayfa URL'si değiştirilemez." : "Tarayıcı adres çubuğunda görünecek kısım."}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {pageId === 'anasayfa' && ( // Show Hero Settings only for homepage
                                     <Card>
                                         <CardHeader>
                                             <CardTitle className="flex items-center gap-2"><Film className="h-5 w-5" /> Hero Bölümü Ayarları</CardTitle>
                                             <CardDescription>Anasayfa üst kısmındaki kayan makale bölümünü yönetin.</CardDescription>
                                         </CardHeader>
                                         <CardContent className="space-y-4">
                                             <div className="flex items-center justify-between space-x-2">
                                                 <Label htmlFor="hero-enabled">Hero Bölümünü Göster</Label>
                                                 <Switch
                                                     id="hero-enabled"
                                                     checked={heroSettings.enabled}
                                                     onCheckedChange={(checked) => handleHeroSettingChange('enabled', checked)}
                                                 />
                                             </div>
                                              <Separator />
                                             {heroSettings.enabled && ( // Show other settings only if enabled
                                                 <>
                                                     <div className="space-y-2">
                                                         <Label htmlFor="hero-source">Gösterilecek Makaleler</Label>
                                                         <Select
                                                             value={heroSettings.articleSource}
                                                             onValueChange={(value: 'latest' | 'featured') => handleHeroSettingChange('articleSource', value)}
                                                         >
                                                             <SelectTrigger id="hero-source">
                                                                 <SelectValue placeholder="Kaynak seçin" />
                                                             </SelectTrigger>
                                                             <SelectContent>
                                                                 <SelectItem value="latest">En Son Eklenenler</SelectItem>
                                                                 <SelectItem value="featured">Öne Çıkanlar</SelectItem>
                                                             </SelectContent>
                                                         </Select>
                                                     </div>
                                                     <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="hero-interval">Geçiş Süresi (saniye)</Label>
                                                            <Input
                                                                id="hero-interval"
                                                                type="number"
                                                                min="1"
                                                                max="30"
                                                                value={heroSettings.intervalSeconds}
                                                                onChange={(e) => handleHeroSettingChange('intervalSeconds', parseInt(e.target.value) || 1)}
                                                            />
                                                        </div>
                                                         <div className="space-y-2">
                                                            <Label htmlFor="hero-max">Maksimum Makale</Label>
                                                            <Input
                                                                id="hero-max"
                                                                type="number"
                                                                min="1"
                                                                max="10"
                                                                value={heroSettings.maxArticles}
                                                                onChange={(e) => handleHeroSettingChange('maxArticles', parseInt(e.target.value) || 1)}
                                                            />
                                                        </div>
                                                     </div>
                                                 </>
                                              )}
                                         </CardContent>
                                     </Card>
                                )}

                                <Separator />

                                {/* Block Editor Section */}
                                 <BlockEditor
                                   blocks={blocks}
                                   onAddBlock={handleAddBlock}
                                   onDeleteBlock={handleDeleteBlock}
                                   onUpdateBlock={handleUpdateBlock}
                                   onReorderBlocks={handleReorderBlocks}
                                   selectedBlockId={selectedBlockId}
                                   onBlockSelect={handleBlockSelect}
                                 />
                             </>
                        )}

                        {editorView === 'seo' && (
                             <Card>
                                <CardHeader>
                                    <CardTitle>SEO Ayarları</CardTitle>
                                    <CardDescription>Sayfanızın arama motorlarında nasıl görüneceğini optimize edin.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="seo-title">SEO Başlığı</Label>
                                        <Input
                                            id="seo-title"
                                            value={seoTitle}
                                            onChange={(e) => setSeoTitle(e.target.value)}
                                            maxLength={60}
                                            placeholder="Arama sonuçlarında görünecek başlık"
                                        />
                                        <p className="text-xs text-muted-foreground">Tavsiye: 50-60 karakter. ({seoTitle.length}/60)</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="seo-description">Meta Açıklama</Label>
                                        <Textarea
                                            id="seo-description"
                                            value={seoDescription}
                                            onChange={(e) => setSeoDescription(e.target.value)}
                                            maxLength={160}
                                            rows={4}
                                            placeholder="Arama sonuçlarında görünecek kısa açıklama"
                                        />
                                        <p className="text-xs text-muted-foreground">Tavsiye: 150-160 karakter. ({seoDescription.length}/160)</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="keywords">Anahtar Kelimeler</Label>
                                        <Input
                                            id="keywords"
                                            value={keywords.join(', ')}
                                            onChange={(e) => setKeywords(e.target.value.split(',').map(kw => kw.trim()).filter(kw => kw !== ''))}
                                            placeholder="Anahtar kelimeleri virgülle ayırın"
                                        />
                                        <p className="text-xs text-muted-foreground">Sayfanızla ilgili anahtar kelimeleri belirtin.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="canonical-url">Canonical URL</Label>
                                        <Input
                                            id="canonical-url"
                                            type="url"
                                            value={canonicalUrl}
                                            onChange={(e) => setCanonicalUrl(e.target.value)}
                                            placeholder="https://teknobiyo.com/orijinal-sayfa-url"
                                        />
                                        <p className="text-xs text-muted-foreground">İçerik aynı olan başka bir URL varsa ekleyin.</p>
                                    </div>
                                    <Separator />
                                      <SeoPreview
                                          title={seoTitle || title}
                                          description={seoDescription || ''}
                                          slug={slug || '/'}
                                          category="sayfa"
                                      />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                 </ScrollArea>

                  {/* Right Preview Pane - Takes remaining space and handles its own overflow */}
                   <div className="flex-1 bg-muted/30 p-4 overflow-auto flex flex-col items-center justify-start relative"> {/* Allow overflow */}
                     <div className={cn(
                         "border bg-background shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out relative w-full h-full max-w-full max-h-full", // Make it take full space of its container
                         // Remove device-specific size classes to let it fill
                         // getPreviewSizeClass()
                     )}>
                       {/* Scale the preview content based on device selection */}
                        <div className={cn(
                             "transition-transform duration-300 ease-in-out origin-top",
                             {
                                 'scale-[0.5] w-[750px] h-[1334px] mx-auto': previewDevice === 'mobile', // Scale down and set fixed size based on ratio
                                 'scale-[0.7] w-[1097px] h-[1463px] mx-auto': previewDevice === 'tablet', // Scale down and set fixed size based on ratio
                                 'scale-100 w-full h-full': previewDevice === 'desktop', // No scaling for desktop
                             }
                        )}>
                           <PagePreviewRenderer
                              key={previewDevice + '-' + currentPreviewData.id + '-' + blocks.map(b => b.id).join('-')}
                              pageData={currentPreviewData}
                              selectedBlockId={selectedBlockId}
                              onBlockSelect={handleBlockSelect}
                              isPreview={true}
                           />
                        </div>
                     </div>
                   </div>
            </div>
        </div>
    );
}

