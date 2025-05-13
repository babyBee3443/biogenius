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
import { ArrowLeft, Save, Trash2, Monitor, Tablet, Smartphone, Settings, Eye, Film } from "lucide-react"; 
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { BlockEditor } from "@/components/admin/block-editor";
import type { Block } from "@/components/admin/template-selector";
import SeoPreview from "@/components/admin/seo-preview";
import PagePreviewRenderer from "@/components/admin/page-preview-renderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { PageData as PageDataType, HeroSettings as HeroSettingsType } from "@/lib/mock-data"; 
import { getPageById as fetchPageById, updatePage } from "@/lib/mock-data"; 

const PREVIEW_STORAGE_KEY = 'preview_data';


// --- Main Page Component ---
export default function EditPage() {
    const router = useRouter();
    const params = useParams();
    const pageId = React.use(params).id as string;

    const [pageData, setPageData] = React.useState<PageDataType | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [title, setTitle] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [blocks, setBlocks] = React.useState<Block[]>([]);
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [canonicalUrl, setCanonicalUrl] = React.useState("");
    const [previewDevice, setPreviewDevice] = React.useState&lt;'desktop' | 'tablet' | 'mobile'&gt;('desktop');
    const [selectedBlockId, setSelectedBlockId] = React.useState&lt;string | null&gt;(null);
    const [editorView, setEditorView] = React.useState&lt;'editor' | 'seo'&gt;('editor');

    const [heroSettings, setHeroSettings] = React.useState&lt;HeroSettingsType&gt;({
        enabled: true,
        articleSource: 'latest',
        intervalSeconds: 5,
        maxArticles: 3,
    });

    React.useEffect(() => {
        if (pageId) {
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
        }
    }, [pageId]);

    const generateSlugUtil = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-').replace(/-+/g, '-');
    };

    React.useEffect(() => {
        if (title && pageData && title !== pageData.title) {
             if (!slug || slug === generateSlugUtil(pageData.title)) {
                 setSlug(generateSlugUtil(title));
            }
        }
     }, [title, pageData, slug]);

     React.useEffect(() => {
        if (title && !seoTitle && pageData && title !== pageData.title) {
            setSeoTitle(title);
        }
     }, [title, seoTitle, pageData]);

     React.useEffect(() => {
        if (blocks.length > 0 && !seoDescription && pageData) {
            const firstTextBlock = blocks.find(b => b.type === 'text') as Extract&lt;Block, { type: 'text' }&gt; | undefined;
            if (firstTextBlock && firstTextBlock.content && firstTextBlock.content !== (pageData.blocks.find(b => b.id === firstTextBlock.id && b.type === 'text') as Extract&lt;Block, { type: 'text' }&gt;)?.content) {
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

    const handleHeroSettingChange = &lt;K extends keyof HeroSettingsType&gt;(key: K, value: HeroSettingsType[K]) => {
        setHeroSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
         if (!title) {
            toast({ variant: "destructive", title: "Hata", description: "Sayfa başlığı zorunludur." });
            return;
        }
        const saveData: Partial&lt;Omit&lt;PageDataType, 'id' | 'createdAt' | 'updatedAt'&gt;&gt; = {
            title,
            slug,
            blocks,
            seoTitle,
            seoDescription,
            keywords,
            canonicalUrl,
            status: pageData?.status || 'Taslak', 
            ...(pageId === 'anasayfa' && { heroSettings }),
        };
        
        try {
            const updated = await updatePage(pageId, saveData);
            if (updated) {
                setPageData(updated); 
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
        }
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

    const currentPreviewData: PageDataType = React.useMemo(() =&gt; ({
        id: pageId || 'preview',
        title: title,
        slug: slug,
        blocks: blocks,
        seoTitle: seoTitle,
        seoDescription: seoDescription,
        imageUrl: pageData?.imageUrl || (blocks.find(b => b.type === 'image') as Extract&lt;Block, { type: 'image' }&gt;)?.url || 'https://picsum.photos/seed/page-preview/1200/600',
        settings: pageData?.settings || {},
        heroSettings: pageId === 'anasayfa' ? heroSettings : undefined,
        status: pageData?.status || 'Taslak',
        createdAt: pageData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        keywords: keywords,
        canonicalUrl: canonicalUrl,
    }), [pageId, title, slug, blocks, seoTitle, seoDescription, pageData, keywords, canonicalUrl, heroSettings]);


    const getPreviewSizeClass = () =&gt; {
      switch (previewDevice) {
        case 'mobile': return 'w-[375px] h-[667px] max-w-full max-h-full';
        case 'tablet': return 'w-[768px] h-[1024px] max-w-full max-h-full';
        default: return 'w-full h-full';
      }
    }


    if (loading) {
        return &lt;div className="flex justify-center items-center h-screen"&gt;Sayfa bilgileri yükleniyor...&lt;/div&gt;;
    }

     if (!pageData) {
         return &lt;div className="text-center py-10"&gt;Sayfa bulunamadı.&lt;/div&gt;;
    }


    return (
        &lt;div className="flex flex-col h-screen"&gt;
             &lt;div className="flex items-center justify-between px-4 py-2 border-b bg-card sticky top-0 z-20 h-14 flex-shrink-0"&gt;
                &lt;div className="flex items-center gap-2"&gt;
                    &lt;Button variant="ghost" size="sm" asChild&gt;
                        &lt;Link href="/admin/pages"&gt;&lt;ArrowLeft className="mr-2 h-4 w-4" /&gt; Geri&lt;/Link&gt;
                    &lt;/Button&gt;
                    &lt;Separator orientation="vertical" className="h-6"/&gt;
                     &lt;Button
                       variant={editorView === 'editor' ? 'secondary' : 'ghost'}
                       size="sm"
                       onClick={() =&gt; setEditorView('editor')}
                     &gt;
                       &lt;Settings className="mr-2 h-4 w-4" /&gt; Düzenleyici
                     &lt;/Button&gt;
                     &lt;Button
                        variant={editorView === 'seo' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() =&gt; setEditorView('seo')}
                     &gt;
                       &lt;Eye className="mr-2 h-4 w-4" /&gt; SEO Ayarları
                     &lt;/Button&gt;
                &lt;/div&gt;
                 &lt;h1 className="text-lg font-semibold truncate hidden md:block" title={`Sayfayı Düzenle: ${pageData.title}`}`&gt;
                     {pageData.title}
                 &lt;/h1&gt;
                 &lt;div className="flex items-center gap-2"&gt;
                     &lt;Button
                        variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =&gt; setPreviewDevice('desktop')}
                        title="Masaüstü Önizleme"
                      &gt;
                        &lt;Monitor className="h-4 w-4" /&gt;
                      &lt;/Button&gt;
                      &lt;Button
                         variant={previewDevice === 'tablet' ? 'secondary' : 'ghost'}
                         size="icon"
                         className="h-8 w-8"
                         onClick={() =&gt; setPreviewDevice('tablet')}
                         title="Tablet Önizleme"
                      &gt;
                         &lt;Tablet className="h-4 w-4" /&gt;
                      &lt;/Button&gt;
                      &lt;Button
                         variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'}
                         size="icon"
                         className="h-8 w-8"
                         onClick={() =&gt; setPreviewDevice('mobile')}
                         title="Mobil Önizleme"
                      &gt;
                         &lt;Smartphone className="h-4 w-4" /&gt;
                      &lt;/Button&gt;
                      &lt;Separator orientation="vertical" className="h-6 mx-2" /&gt;

                     {pageId !== 'anasayfa' && (
                        &lt;Button variant="destructive" size="sm" onClick={handleDelete}&gt;
                            &lt;Trash2 className="h-4 w-4" /&gt;
                        &lt;/Button&gt;
                     )}
                      &lt;Button size="sm" onClick={handleSave} disabled={!title}&gt;
                        &lt;Save className="mr-2 h-4 w-4" /&gt; Kaydet
                    &lt;/Button&gt;
                 &lt;/div&gt;
            &lt;/div&gt;

             &lt;div className="flex flex-1 overflow-hidden"&gt;
                 &lt;ScrollArea className="flex-shrink-0 border-r w-[500px] h-full"&gt; 
                    &lt;div className="p-6 space-y-6"&gt;
                        {editorView === 'editor' && (
                            &lt;&gt;
                                &lt;Card&gt;
                                    &lt;CardHeader&gt;
                                        &lt;CardTitle&gt;Temel Bilgiler&lt;/CardTitle&gt;
                                        &lt;CardDescription&gt;Sayfanın başlığını ve URL'sini düzenleyin.&lt;/CardDescription&gt;
                                    &lt;/CardHeader&gt;
                                    &lt;CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6"&gt;
                                        &lt;div className="space-y-2"&gt;
                                            &lt;Label htmlFor="page-title"&gt;Sayfa Başlığı &lt;span className="text-destructive"&gt;*&lt;/span&gt;&lt;/Label&gt;
                                            &lt;Input
                                                id="page-title"
                                                value={title}
                                                onChange={(e) =&gt; setTitle(e.target.value)}
                                                required
                                            /&gt;
                                        &lt;/div&gt;
                                        &lt;div className="space-y-2"&gt;
                                            &lt;Label htmlFor="page-slug"&gt;URL Metni (Slug)&lt;/Label&gt;
                                            &lt;Input
                                                id="page-slug"
                                                value={slug}
                                                onChange={(e) =&gt; setSlug(generateSlugUtil(e.target.value))}
                                                disabled={pageId === 'anasayfa'}
                                                placeholder={pageId === 'anasayfa' ? "(Anasayfa)" : "sayfa-url"}
                                            /&gt;
                                            &lt;p className="text-xs text-muted-foreground"&gt;
                                                {pageId === 'anasayfa' ? "Anasayfa URL'si değiştirilemez." : "Tarayıcı adres çubuğunda görünecek kısım."}
                                            &lt;/p&gt;
                                        &lt;/div&gt;
                                    &lt;/CardContent&gt;
                                &lt;/Card&gt;

                                {pageId === 'anasayfa' && (
                                     &lt;Card&gt;
                                         &lt;CardHeader&gt;
                                             &lt;CardTitle className="flex items-center gap-2"&gt;&lt;Film className="h-5 w-5" /&gt; Hero Bölümü Ayarları&lt;/CardTitle&gt;
                                             &lt;CardDescription&gt;Anasayfa üst kısmındaki kayan makale bölümünü yönetin.&lt;/CardDescription&gt;
                                         &lt;/CardHeader&gt;
                                         &lt;CardContent className="space-y-4"&gt;
                                             &lt;div className="flex items-center justify-between space-x-2"&gt;
                                                 &lt;Label htmlFor="hero-enabled"&gt;Hero Bölümünü Göster&lt;/Label&gt;
                                                 &lt;Switch
                                                     id="hero-enabled"
                                                     checked={heroSettings.enabled}
                                                     onCheckedChange={(checked) =&gt; handleHeroSettingChange('enabled', checked)}
                                                 /&gt;
                                             &lt;/div&gt;
                                              &lt;Separator /&gt;
                                             {heroSettings.enabled && ( 
                                                 &lt;&gt;
                                                     &lt;div className="space-y-2"&gt;
                                                         &lt;Label htmlFor="hero-source"&gt;Gösterilecek Makaleler&lt;/Label&gt;
                                                         &lt;Select
                                                             value={heroSettings.articleSource}
                                                             onValueChange={(value: 'latest' | 'featured') =&gt; handleHeroSettingChange('articleSource', value)}
                                                         &gt;
                                                             &lt;SelectTrigger id="hero-source"&gt;
                                                                 &lt;SelectValue placeholder="Kaynak seçin" /&gt;
                                                             &lt;/SelectTrigger&gt;
                                                             &lt;SelectContent&gt;
                                                                 &lt;SelectItem value="latest"&gt;En Son Eklenenler&lt;/SelectItem&gt;
                                                                 &lt;SelectItem value="featured"&gt;Öne Çıkanlar&lt;/SelectItem&gt;
                                                             &lt;/SelectContent&gt;
                                                         &lt;/Select&gt;
                                                     &lt;/div&gt;
                                                     &lt;div className="grid grid-cols-2 gap-4"&gt;
                                                        &lt;div className="space-y-2"&gt;
                                                            &lt;Label htmlFor="hero-interval"&gt;Geçiş Süresi (saniye)&lt;/Label&gt;
                                                            &lt;Input
                                                                id="hero-interval"
                                                                type="number"
                                                                min="1"
                                                                max="30"
                                                                value={heroSettings.intervalSeconds}
                                                                onChange={(e) =&gt; handleHeroSettingChange('intervalSeconds', parseInt(e.target.value) || 1)}
                                                            /&gt;
                                                        &lt;/div&gt;
                                                         &lt;div className="space-y-2"&gt;
                                                            &lt;Label htmlFor="hero-max"&gt;Maksimum Makale&lt;/Label&gt;
                                                            &lt;Input
                                                                id="hero-max"
                                                                type="number"
                                                                min="1"
                                                                max="10"
                                                                value={heroSettings.maxArticles}
                                                                onChange={(e) =&gt; handleHeroSettingChange('maxArticles', parseInt(e.target.value) || 1)}
                                                            /&gt;
                                                        &lt;/div&gt;
                                                     &lt;/div&gt;
                                                 &lt;/&gt;
                                              )}
                                         &lt;/CardContent&gt;
                                     &lt;/Card&gt;
                                )}

                                &lt;Separator /&gt;

                                 &lt;BlockEditor
                                   blocks={blocks}
                                   onAddBlock={handleAddBlock}
                                   onDeleteBlock={handleDeleteBlock}
                                   onUpdateBlock={handleUpdateBlock}
                                   onReorderBlocks={handleReorderBlocks}
                                   selectedBlockId={selectedBlockId}
                                   onBlockSelect={handleBlockSelect}
                                 /&gt;
                             &lt;/&gt;
                        )}

                        {editorView === 'seo' && (
                             &lt;Card&gt;
                                &lt;CardHeader&gt;
                                    &lt;CardTitle&gt;SEO Ayarları&lt;/CardTitle&gt;
                                    &lt;CardDescription&gt;Sayfanızın arama motorlarında nasıl görüneceğini optimize edin.&lt;/CardDescription&gt;
                                &lt;/CardHeader&gt;
                                &lt;CardContent className="space-y-6"&gt;
                                    &lt;div className="space-y-2"&gt;
                                        &lt;Label htmlFor="seo-title"&gt;SEO Başlığı&lt;/Label&gt;
                                        &lt;Input
                                            id="seo-title"
                                            value={seoTitle}
                                            onChange={(e) =&gt; setSeoTitle(e.target.value)}
                                            maxLength={60}
                                            placeholder="Arama sonuçlarında görünecek başlık"
                                        /&gt;
                                        &lt;p className="text-xs text-muted-foreground"&gt;Tavsiye: 50-60 karakter. ({seoTitle.length}/60)&lt;/p&gt;
                                    &lt;/div&gt;
                                    &lt;div className="space-y-2"&gt;
                                        &lt;Label htmlFor="seo-description"&gt;Meta Açıklama&lt;/Label&gt;
                                        &lt;Textarea
                                            id="seo-description"
                                            value={seoDescription}
                                            onChange={(e) =&gt; setSeoDescription(e.target.value)}
                                            maxLength={160}
                                            rows={4}
                                            placeholder="Arama sonuçlarında görünecek kısa açıklama"
                                        /&gt;
                                        &lt;p className="text-xs text-muted-foreground"&gt;Tavsiye: 150-160 karakter. ({seoDescription.length}/160)&lt;/p&gt;
                                    &lt;/div&gt;
                                    &lt;div className="space-y-2"&gt;
                                        &lt;Label htmlFor="keywords"&gt;Anahtar Kelimeler&lt;/Label&gt;
                                        &lt;Input
                                            id="keywords"
                                            value={keywords.join(', ')}
                                            onChange={(e) =&gt; setKeywords(e.target.value.split(',').map(kw =&gt; kw.trim()).filter(kw =&gt; kw !== ''))}
                                            placeholder="Anahtar kelimeleri virgülle ayırın"
                                        /&gt;
                                        &lt;p className="text-xs text-muted-foreground"&gt;Sayfanızla ilgili anahtar kelimeleri belirtin.&lt;/p&gt;
                                    &lt;/div&gt;
                                    &lt;div className="space-y-2"&gt;
                                        &lt;Label htmlFor="canonical-url"&gt;Canonical URL&lt;/Label&gt;
                                        &lt;Input
                                            id="canonical-url"
                                            type="url"
                                            value={canonicalUrl}
                                            onChange={(e) =&gt; setCanonicalUrl(e.target.value)}
                                            placeholder="https://teknobiyo.com/orijinal-sayfa-url"
                                        /&gt;
                                        &lt;p className="text-xs text-muted-foreground"&gt;İçerik aynı olan başka bir URL varsa ekleyin.&lt;/p&gt;
                                    &lt;/div&gt;
                                    &lt;Separator /&gt;
                                      &lt;SeoPreview
                                          title={seoTitle || title}
                                          description={seoDescription || ''}
                                          slug={slug || '/'}
                                          category="sayfa"
                                      /&gt;
                                &lt;/CardContent&gt;
                            &lt;/Card&gt;
                        )}
                    &lt;/div&gt;
                 &lt;/ScrollArea&gt;

                   &lt;div className="flex-1 bg-muted/30 p-4 overflow-auto flex flex-col items-center justify-start relative"&gt; 
                     &lt;div className={cn(
                         "border bg-background shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out relative w-full h-full max-w-full max-h-full",
                     )}&gt;
                        &lt;div className={cn(
                             "transition-transform duration-300 ease-in-out origin-top",
                             {
                                 'scale-[0.5] w-[750px] h-[1334px] mx-auto': previewDevice === 'mobile',
                                 'scale-[0.7] w-[1097px] h-[1463px] mx-auto': previewDevice === 'tablet', 
                                 'scale-100 w-full h-full': previewDevice === 'desktop', 
                             }
                        )}&gt;
                           &lt;PagePreviewRenderer
                              key={previewDevice + '-' + currentPreviewData.id + '-' + blocks.map(b =&gt; b.id).join('-')}
                              pageData={currentPreviewData}
                              selectedBlockId={selectedBlockId}
                              onBlockSelect={handleBlockSelect}
                              isPreview={true}
                           /&gt;
                        &lt;/div&gt;
                     &lt;/div&gt;
                   &lt;/div&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    );
}
