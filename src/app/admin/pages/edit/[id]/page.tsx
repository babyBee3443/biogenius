
"use client";

import * as React from "react";
import { useRouter, useParams, notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Trash2, Monitor, Tablet, Smartphone, Settings, Eye, Film, Loader2 } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { BlockEditor } from "@/components/admin/block-editor";
import type { Block } from "@/components/admin/template-selector";
import SeoPreview from "@/components/admin/seo-preview";
import PagePreviewRenderer from "@/components/admin/page-preview-renderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { PageData as PageDataType, HeroSettings as HeroSettingsType } from "@/lib/data/pages"; // Changed from mock-data
import { getPageById as fetchPageById, updatePage, deletePage as mockDeletePage } from "@/lib/data/pages"; // Changed from mock-data
import { generateSlug as generateSlugUtil } from '@/lib/utils';

const PREVIEW_STORAGE_KEY = 'preview_data';


// --- Main Page Component ---
export default function EditPage() {
    const router = useRouter();
    const params = useParams();
    const pageId = React.use(params).id as string;

    const [pageData, setPageData] = React.useState<PageDataType | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false); // Added saving state
    const [isDeleting, setIsDeleting] = React.useState(false); // Added deleting state

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

    const [heroSettings, setHeroSettings] = React.useState<HeroSettingsType>({
        enabled: true,
        articleSource: 'latest',
        intervalSeconds: 5,
        maxArticles: 3,
    });

    React.useEffect(() => {
        if (pageId) {
            setLoading(true);
            fetchPageById(pageId)
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
                        if (data.heroSettings) {
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
        } else {
            setLoading(false);
            notFound(); // If no pageId, it's a not found scenario
        }
    }, [pageId]);


     React.useEffect(() => {
         if (title && pageData && title !== pageData.title) {
              if (!slug || slug === generateSlugUtil(pageData.title)) {
                  setSlug(generateSlugUtil(title));
             }
         } else if (title && !slug && pageId !== 'anasayfa') { // Don't auto-slug for homepage if title changes but slug was empty
            setSlug(generateSlugUtil(title));
         }
      }, [title, pageData, slug, pageId]);

     React.useEffect(() => {
        if (title && !seoTitle && pageData && title !== pageData.title) {
            setSeoTitle(title);
        } else if (title && !seoTitle) {
            setSeoTitle(title);
        }
     }, [title, seoTitle, pageData]);

     React.useEffect(() => {
        if (blocks.length > 0 && !seoDescription && pageData) {
            const firstTextBlock = blocks.find(b => b.type === 'text') as Extract<Block, { type: 'text' }> | undefined;
            if (firstTextBlock && firstTextBlock.content && firstTextBlock.content !== (pageData.blocks.find(b => b.id === firstTextBlock.id && b.type === 'text') as Extract<Block, { type: 'text' }>)?.content) {
                 const desc = firstTextBlock.content.length > 160 ? firstTextBlock.content.substring(0, 157) + '...' : firstTextBlock.content;
                 setSeoDescription(desc);
            }
        } else if (blocks.length > 0 && !seoDescription) {
            const firstTextBlock = blocks.find(b => b.type === 'text') as Extract<Block, { type: 'text' }> | undefined;
            if (firstTextBlock && firstTextBlock.content) {
                const desc = firstTextBlock.content.length > 160 ? firstTextBlock.content.substring(0, 157) + '...' : firstTextBlock.content;
                setSeoDescription(desc);
            }
        }
     }, [blocks, seoDescription, pageData]);


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

    const handleHeroSettingChange = <K extends keyof HeroSettingsType>(key: K, value: HeroSettingsType[K]) => {
        setHeroSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
         if (!title) {
            toast({ variant: "destructive", title: "Hata", description: "Sayfa başlığı zorunludur." });
            return;
        }
        if (pageId !== 'anasayfa' && !slug) {
            toast({ variant: "destructive", title: "Hata", description: "URL metni (slug) zorunludur."});
            return;
        }
        setIsSaving(true);
        const saveData: Partial<Omit<PageDataType, 'id' | 'createdAt' | 'updatedAt'>> = {
            title,
            slug: pageId === 'anasayfa' ? '' : slug,
            blocks,
            seoTitle: seoTitle || title,
            seoDescription,
            keywords,
            canonicalUrl,
            status: pageData?.status || 'Taslak',
            ...(pageId === 'anasayfa' && { heroSettings }),
        };

        try {
            const updated = await updatePage(pageId, saveData);
            if (updated) {
                setPageData(updated); // Update local state with the response from the "API"
                setTitle(updated.title);
                setSlug(updated.slug);
                setBlocks(updated.blocks || []);
                setSeoTitle(updated.seoTitle || updated.title || '');
                setSeoDescription(updated.seoDescription || '');
                setKeywords(updated.keywords || []);
                setCanonicalUrl(updated.canonicalUrl || '');
                if (updated.heroSettings) {
                    setHeroSettings(updated.heroSettings);
                }
                toast({
                    title: "Sayfa Güncellendi",
                    description: `"${title}" başlıklı sayfa başarıyla güncellendi.`,
                });
            } else {
                 toast({ variant: "destructive", title: "Hata", description: "Sayfa güncellenemedi." });
            }
        } catch (error: any) {
            console.error("Error updating page:", error);
            toast({ variant: "destructive", title: "Hata", description: `Sayfa güncellenirken bir sorun oluştu: ${error.message}` });
        } finally {
            setIsSaving(false);
        }
    };

     const handleDelete = async () => {
        if (pageId === 'anasayfa') {
            toast({ variant: "destructive", title: "Hata", description: "Anasayfa silinemez." });
            return;
        }
        if (window.confirm(`"${title}" başlıklı sayfayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            setIsDeleting(true);
            try {
                const success = await mockDeletePage(pageId); // Use mock delete
                if (success) {
                    toast({
                        variant: "destructive",
                        title: "Sayfa Silindi",
                        description: `"${title}" başlıklı sayfa silindi.`,
                    });
                    router.push('/admin/pages');
                } else {
                    toast({ variant: "destructive", title: "Silme Hatası", description: "Sayfa silinemedi." });
                }
            } catch (error: any) {
                 console.error("Error deleting page:", error);
                 toast({ variant: "destructive", title: "Silme Hatası", description: `Sayfa silinirken bir hata oluştu: ${error.message}`});
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const currentPreviewData: PageDataType = React.useMemo(() => ({
        id: pageId || 'preview',
        title: title,
        slug: pageId === 'anasayfa' ? '' : slug,
        blocks: blocks,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || '',
        imageUrl: pageData?.imageUrl || (blocks.find(b => b.type === 'image') as Extract<Block, { type: 'image' }>)?.url || 'https://placehold.co/1200x600.png',
        settings: pageData?.settings || {},
        heroSettings: pageId === 'anasayfa' ? heroSettings : undefined,
        status: pageData?.status || 'Taslak',
        createdAt: pageData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        keywords: keywords,
        canonicalUrl: canonicalUrl,
    }), [pageId, title, slug, blocks, seoTitle, seoDescription, pageData, keywords, canonicalUrl, heroSettings]);


    const getPreviewSizeClass = () => {
      switch (previewDevice) {
        case 'mobile': return 'w-[375px] h-[667px] max-w-full max-h-full';
        case 'tablet': return 'w-[768px] h-[1024px] max-w-full max-h-full';
        default: return 'w-full h-full';
      }
    }


    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="mr-2 h-6 w-6 animate-spin"/>Sayfa bilgileri yükleniyor...</div>;
    }

     if (!pageData) {
         return <div className="text-center py-10">Sayfa bulunamadı.</div>;
    }


    return (
        <div className="flex flex-col h-screen">
             <div className="flex items-center justify-between px-4 py-2 border-b bg-card sticky top-0 z-20 h-14 flex-shrink-0">
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
                        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isSaving || isDeleting}>
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                        </Button>
                     )}
                      <Button size="sm" onClick={handleSave} disabled={!title || (pageId !== 'anasayfa' && !slug) || isSaving || isDeleting}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />} Kaydet
                    </Button>
                 </div>
            </div>

             <div className="flex flex-1 overflow-hidden">
                 <ScrollArea className="flex-shrink-0 border-r w-full md:w-[400px] lg:w-[500px] h-full"> {/* Full width on mobile, fixed on larger screens */}
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
                                                onChange={(e) => setSlug(generateSlugUtil(e.target.value))}
                                                disabled={pageId === 'anasayfa'}
                                                placeholder={pageId === 'anasayfa' ? "(Anasayfa)" : "sayfa-url"}
                                                required={pageId !== 'anasayfa'}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                {pageId === 'anasayfa' ? "Anasayfa URL'si değiştirilemez." : "Tarayıcı adres çubuğunda görünecek kısım."}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {pageId === 'anasayfa' && (
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
                                             {heroSettings.enabled && (
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
                                            placeholder="https://biyohox.com/orijinal-sayfa-url"
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

                   <div className="flex-1 bg-muted/30 p-4 overflow-auto flex-col items-center justify-start relative hidden md:flex"> {/* Hide on mobile, flex on md+ */}
                     <div className={cn(
                         "border bg-background shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out relative w-full h-full max-w-full max-h-full",
                     )}>
                        <div className={cn(
                             "transition-transform duration-300 ease-in-out origin-top",
                             {
                                 'scale-[0.4] w-[937.5px] h-[1667.5px] mx-auto': previewDevice === 'mobile', // Adjusted scale for mobile
                                 'scale-[0.6] w-[1280px] h-[1706px] mx-auto': previewDevice === 'tablet', // Adjusted scale for tablet
                                 'scale-100 w-full h-full': previewDevice === 'desktop',
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
                  {/* Mobile Preview Section */}
                  <div className="md:hidden flex-1 bg-muted/30 p-4 overflow-auto flex flex-col items-center justify-start relative">
                    <p className="text-sm font-semibold mb-2 text-center">Önizleme (Mobil)</p>
                     <div className="w-[375px] h-[667px] max-w-full max-h-[70vh] border bg-background shadow-lg rounded-lg overflow-hidden mx-auto">
                         <PagePreviewRenderer
                            key={`mobile-preview-${currentPreviewData.id}-${blocks.map(b => b.id).join('-')}`}
                            pageData={currentPreviewData}
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
