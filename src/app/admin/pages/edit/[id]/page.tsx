"use client";

import * as React from "react";
import { useRouter, useParams, notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Trash2, Monitor, Tablet, Smartphone, Settings, Eye } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { BlockEditor } from "@/components/admin/block-editor";
import type { Block } from "@/components/admin/template-selector";
import SeoPreview from "@/components/admin/seo-preview";
import PagePreviewRenderer from "@/components/admin/page-preview-renderer"; // Ensure this is correctly imported
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Mock data fetching - Replace with actual API call
interface PageData {
    id: string;
    title: string;
    slug: string;
    blocks: Block[];
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    imageUrl?: string; // Add imageUrl for preview consistency
    settings?: Record<string, any>; // General settings for the page layout
}

// Mock function - Updated to include blocks and SEO fields
const getPageById = async (id: string): Promise<PageData | null> => {
    const pages: PageData[] = [
        {
            id: 'anasayfa',
            title: 'Anasayfa',
            slug: '',
            blocks: [
                // Example structural blocks (might be hidden in editor preview)
                { id: 'hpb-welcome', type: 'heading', level: 1, content: 'TeknoBiyo\'ya Hoş Geldiniz!' },
                { id: 'hpb-intro', type: 'text', content: 'Teknoloji ve biyoloji dünyasındaki en son gelişmeleri, derinlemesine analizleri ve ilgi çekici makaleleri keşfedin.' },
                // --- Blocks representing visual sections ---
                { id: 'hp-section-featured', type: 'section', sectionType: 'featured-articles', settings: { title: 'Öne Çıkanlar', count: 3 } },
                { id: 'hp-section-categories', type: 'section', sectionType: 'category-teaser', settings: { title: 'Kategoriler', techButtonLabel: 'Teknoloji', bioButtonLabel: 'Biyoloji'} }, // Added labels
                { id: 'hp-section-recent', type: 'section', sectionType: 'recent-articles', settings: { title: 'En Son Eklenenler', count: 3 } },
                 { id: 'hp-section-custom-text', type: 'section', sectionType: 'custom-text', settings: { content: '<p>Bu alana <strong>özel metin</strong> veya HTML ekleyebilirsiniz.</p>' } },
            ],
            seoTitle: 'TeknoBiyo | Teknoloji ve Biyoloji Makaleleri',
            seoDescription: 'Teknoloji ve biyoloji alanlarındaki en son gelişmeleri, derinlemesine analizleri ve ilgi çekici makaleleri keşfedin.',
            imageUrl: 'https://picsum.photos/seed/homepage/1200/600',
            settings: {} // Add page-level settings if needed
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
                { id: 'cb-form', type: 'section', sectionType: 'contact-form', settings: { title: 'İletişim Formu', recipientEmail: 'iletisim@teknobiyo.example.com' } }, // Placeholder for form block
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
    const pageId = params.id as string;

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
    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null); // State for selected block in editor/preview
    const [editorView, setEditorView] = React.useState<'editor' | 'seo'>('editor'); // State for left pane view


    React.useEffect(() => {
        if (pageId) {
            getPageById(pageId)
                .then(data => {
                    if (data) {
                        setPageData(data);
                        setTitle(data.title);
                        setSlug(data.slug);
                        setBlocks(data.blocks || []);
                        setSeoTitle(data.seoTitle || data.title || ''); // Default SEO title to page title
                        setSeoDescription(data.seoDescription || '');
                        setKeywords(data.keywords || []);
                        setCanonicalUrl(data.canonicalUrl || '');
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
             ...(type === 'section' && { sectionType: 'custom-text', settings: { content: '' } }), // Example new section block
        } as Block;
        setBlocks([...blocks, newBlock]);
        setSelectedBlockId(newBlock.id); // Select the newly added block
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks(blocks.filter(block => block.id !== id));
        if (selectedBlockId === id) {
            setSelectedBlockId(null); // Deselect if deleted
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

    // Callback for selecting block from preview OR editor
    const handleBlockSelect = (id: string | null) => {
        setSelectedBlockId(id);
        if (id) {
            // Optional: Scroll editor to the selected block if selection came from preview
             const editorElement = document.querySelector(`[data-block-wrapper-id="${id}"]`);
             if (editorElement) {
                 editorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
             }
             // Switch to editor view if SEO view is active
             setEditorView('editor');
        }
    };
    // --- End Block Handlers ---


    const handleSave = () => {
         if (!title) {
            toast({ variant: "destructive", title: "Hata", description: "Sayfa başlığı zorunludur." });
            return;
        }
        const saveData = { pageId, title, slug, blocks, seoTitle, seoDescription, keywords, canonicalUrl };
        console.log("Updating page:", saveData);
        // TODO: Implement actual API call to save the page data
        toast({
            title: "Sayfa Güncellendi",
            description: `"${title}" başlıklı sayfa başarıyla güncellendi.`,
        });
        // Update local state to reflect saved data (optional, depends on API response)
        if(pageData) setPageData({...pageData, title, slug, blocks, seoTitle, seoDescription, keywords, canonicalUrl });
    };

     const handleDelete = () => {
        // Prevent deleting homepage
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
    // Use useMemo to recalculate only when dependencies change
    const currentPreviewData: PageData = React.useMemo(() => ({
        id: pageId || 'preview',
        title: title,
        slug: slug,
        blocks: blocks, // Pass current blocks state to preview
        seoTitle: seoTitle,
        seoDescription: seoDescription,
        imageUrl: pageData?.imageUrl || (blocks.find(b => b.type === 'image') as Extract<Block, { type: 'image' }>)?.url || 'https://picsum.photos/seed/page-preview/1200/600',
        settings: pageData?.settings || {} // Pass settings
        // Add all relevant state variables that affect the preview as dependencies
    }), [pageId, title, slug, blocks, seoTitle, seoDescription, pageData, keywords, canonicalUrl]);


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
         // Should be handled by notFound(), but as a fallback
         return <div className="text-center py-10">Sayfa bulunamadı.</div>;
    }


    return (
        <div className="flex flex-col h-screen overflow-hidden">
             {/* Top Bar */}
             <div className="flex items-center justify-between px-4 py-2 border-b bg-card sticky top-0 z-20 h-14">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/pages"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                    </Button>
                    <Separator orientation="vertical" className="h-6"/>
                     {/* Editor/SEO Toggle */}
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

                     {pageId !== 'anasayfa' && ( // Conditionally render delete button
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
             <div className="flex flex-1 overflow-hidden">
                 {/* Left Pane (Editor or SEO) - Increased width */}
                 <ScrollArea className="border-r w-full md:w-1/2 xl:w-[600px] flex-shrink-0"> {/* Fixed larger width */}
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

                                <Separator />

                                {/* Block Editor Section */}
                                 <BlockEditor
                                   blocks={blocks}
                                   onAddBlock={handleAddBlock}
                                   onDeleteBlock={handleDeleteBlock}
                                   onUpdateBlock={handleUpdateBlock}
                                   onReorderBlocks={handleReorderBlocks}
                                   selectedBlockId={selectedBlockId} // Pass selected block ID
                                   onBlockSelect={handleBlockSelect} // Pass selection handler
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

                  {/* Right Preview Pane - Takes remaining space */}
                   <div className="flex-1 bg-muted/30 p-4 overflow-hidden flex flex-col items-center justify-start relative">
                     <div className={cn(
                         "border bg-background shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out relative",
                         getPreviewSizeClass()
                     )}>
                       {/* Removed overlay for direct interaction (be careful with iframe approach if re-enabled) */}
                       {/* <div className="absolute inset-0 z-10 bg-transparent" /> */}
                       <PagePreviewRenderer
                          key={previewDevice + '-' + currentPreviewData.id + '-' + blocks.map(b => b.id).join('-')} // More specific key including block IDs
                          pageData={currentPreviewData} // Pass data recalculated by useMemo
                          selectedBlockId={selectedBlockId}
                          onBlockSelect={handleBlockSelect}
                          isPreview={true}
                       />
                     </div>
                   </div>
            </div>
        </div>
    );
}