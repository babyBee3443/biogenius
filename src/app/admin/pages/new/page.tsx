
"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, LayoutGrid, Layers } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { BlockEditor } from "@/components/admin/block-editor";
import { TemplateSelector, type Block } from "@/components/admin/template-selector";
import SeoPreview from "@/components/admin/seo-preview";
import { Textarea } from "@/components/ui/textarea";
import { createPage, type PageData, generateSlug as generateSlugUtil } from "@/lib/mock-data";

const PREVIEW_STORAGE_KEY = 'preview_data';

export default function NewPage() {
    const router = useRouter();
    const [title, setTitle] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [blocks, setBlocks] = React.useState<Block[]>([]);
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [canonicalUrl, setCanonicalUrl] = React.useState("");
    const [saving, setSaving] = React.useState(false);
    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = React.useState(false);
    const [templateApplied, setTemplateApplied] = React.useState(false);
    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null);


    const generateBlockId = () => `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const createDefaultBlock = (): Block => ({ id: generateBlockId(), type: 'text', content: '' });

    React.useEffect(() => {
        if (blocks.length === 0) {
            setBlocks([createDefaultBlock()]);
        }
    }, [blocks.length]);


    // Basic slug generation (same as article editor)
    const handleSlugGeneration = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-').replace(/-+/g, '-');
    };

    // Auto-generate slug from title
     React.useEffect(() => {
         if (title) {
             setSlug(handleSlugGeneration(title));
         } else {
             setSlug(""); // Clear slug if title is empty
         }
     }, [title]);

     // Auto-generate SEO Title
     React.useEffect(() => {
        if (title && !seoTitle) {
            setSeoTitle(title);
        }
     }, [title, seoTitle]);

      // Auto-generate SEO Description (basic)
     React.useEffect(() => {
        if (blocks.length > 0 && !seoDescription) {
            const firstTextBlock = blocks.find(b => b.type === 'text') as Extract<Block, { type: 'text' }> | undefined;
            if (firstTextBlock && firstTextBlock.content) {
                 const desc = firstTextBlock.content.length > 160 ? firstTextBlock.content.substring(0, 157) + '...' : firstTextBlock.content;
                 setSeoDescription(desc);
            }
        }
     }, [blocks, seoDescription]);


     // --- Block Handlers ---
     const handleAddBlock = (type: Block['type']) => {
        const newBlock: Block = {
            id: generateBlockId(),
            type: type,
            ...(type === 'text' && { content: '' }),
            ...(type === 'heading' && { level: 2, content: '' }),
            ...(type === 'image' && { url: '', alt: '', caption: '' }),
            ...(type === 'gallery' && { images: [] }),
            ...(type === 'video' && { url: '', youtubeId: '' }),
            ...(type === 'quote' && { content: '', citation: '' }),
            ...(type === 'code' && { language: 'javascript', content: '' }),
            ...(type === 'divider' && {}),
            ...(type === 'section' && { sectionType: 'custom-text', settings: {} }),
        } as Block;
        setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
        setSelectedBlockId(newBlock.id);
        setTemplateApplied(false);
     };

     const handleDeleteBlock = (id: string) => {
        setBlocks(blocks.filter(block => block.id !== id));
        if (selectedBlockId === id) setSelectedBlockId(null);
        setTemplateApplied(false);
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
        setTemplateApplied(false);
     };

     const handleBlockSelect = (id: string | null) => {
        setSelectedBlockId(id);
    };
     // --- End Block Handlers ---

     // --- Template Handlers ---
     const handleTemplateSelect = (templateBlocks: Block[]) => {
        const newBlocks = templateBlocks.map(block => ({
            ...block,
            id: generateBlockId()
        }));
        setBlocks(newBlocks);
        setTemplateApplied(true);
        setIsTemplateSelectorOpen(false);
        toast({ title: "Şablon Uygulandı", description: "Seçilen sayfa şablonu başarıyla uygulandı." });
    };

    const handleRemoveTemplate = () => {
        if (window.confirm("Mevcut içeriği kaldırıp varsayılan boş metin bloğuna dönmek istediğinizden emin misiniz?")) {
            setBlocks([createDefaultBlock()]);
            setTemplateApplied(false);
            setSelectedBlockId(null);
            toast({ title: "Şablon Kaldırıldı", description: "İçerik varsayılan boş metin bloğuna döndürüldü." });
        }
    };
    // --- End Template Handlers ---


    const handleSave = async () => {
        if (!title || !slug) {
            toast({ variant: "destructive", title: "Hata", description: "Sayfa başlığı ve URL metni zorunludur." });
            return;
        }
        setSaving(true);
        const newPageData: Omit<PageData, 'id' | 'createdAt' | 'updatedAt'> = {
            title,
            slug,
            blocks: blocks.length > 0 ? blocks : [createDefaultBlock()],
            seoTitle: seoTitle || title,
            seoDescription,
            keywords,
            canonicalUrl,
            status: 'Taslak', // Default status
            // imageUrl can be set if there's a dedicated field for it
        };

        try {
            const createdPage = await createPage(newPageData);
            if (createdPage) {
                toast({
                    title: "Sayfa Oluşturuldu",
                    description: `"${createdPage.title}" başlıklı sayfa başarıyla oluşturuldu.`,
                });
                router.push(`/admin/pages/edit/${createdPage.id}`);
            } else {
                toast({ variant: "destructive", title: "Oluşturma Hatası", description: "Sayfa oluşturulamadı." });
                setSaving(false);
            }
        } catch (error: any) {
            console.error("Error creating page:", error);
            toast({ variant: "destructive", title: "Oluşturma Hatası", description: error.message || "Sayfa oluşturulurken bir sorun oluştu." });
            setSaving(false);
        }
    };

     // --- Preview Handler ---
     const handlePreview = () => {
        if (typeof window === 'undefined') return;

        const previewData: Partial<PageData> & { previewType: 'page' } = {
            previewType: 'page',
            id: 'preview_new_page',
            title: title || 'Başlıksız Sayfa',
            slug: slug || handleSlugGeneration(title),
            blocks,
            seoTitle: seoTitle || title,
            seoDescription: seoDescription || '',
            keywords: keywords || [],
            canonicalUrl: canonicalUrl || '',
            imageUrl: (blocks.find(b => b.type === 'image') as Extract<Block, { type: 'image' }>)?.url || 'https://picsum.photos/seed/new-page-preview/1200/600',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'Taslak'
        };

        console.log(`[NewPage/handlePreview] Preparing to save preview data to localStorage with key: ${PREVIEW_STORAGE_KEY}`);
        console.log("[NewPage/handlePreview] Preview Data before stringify:", previewData);

        if (!previewData || Object.keys(previewData).length === 0 || !previewData.previewType) {
            console.error("[NewPage/handlePreview] Error: Preview data is empty or invalid before stringifying.", previewData);
            toast({ variant: "destructive", title: "Önizleme Hatası", description: "Oluşturulacak önizleme verisi boş veya geçersiz." });
            return;
        }

        try {
            const stringifiedData = JSON.stringify(previewData);
            console.log("[NewPage/handlePreview] Stringified data:", stringifiedData.substring(0, 200) + "..."); // Log part of stringified data
            if (!stringifiedData || stringifiedData === 'null' || stringifiedData === '{}') {
                 console.error("[NewPage/handlePreview] Error: Stringified preview data is empty or null.");
                 toast({ variant: "destructive", title: "Önizleme Hatası", description: "Önizleme verisi oluşturulamadı (boş veri)." });
                 return;
            }
            localStorage.setItem(PREVIEW_STORAGE_KEY, stringifiedData);
            console.log(`[NewPage/handlePreview] Successfully called localStorage.setItem for key: ${PREVIEW_STORAGE_KEY}`);

            // Verification step
            const checkStoredData = localStorage.getItem(PREVIEW_STORAGE_KEY);
            console.log(`[NewPage/handlePreview] Verification - Data retrieved from localStorage for key '${PREVIEW_STORAGE_KEY}':`, checkStoredData ? checkStoredData.substring(0,200) + "..." : "NULL");

            if (!checkStoredData || checkStoredData === 'null' || checkStoredData === 'undefined') {
                 console.error(`[NewPage/handlePreview] Verification FAILED: No data found for key ${PREVIEW_STORAGE_KEY} immediately after setItem.`);
                 throw new Error("Verification failed: No data found in localStorage after setItem.");
            }
            const parsedVerify = JSON.parse(checkStoredData);
            if (!parsedVerify || parsedVerify.previewType !== 'page') {
                console.error(`[NewPage/handlePreview] Verification FAILED: Invalid data structure or previewType in localStorage after setItem. Parsed:`, parsedVerify);
                throw new Error("Verification failed: Invalid data structure in localStorage after setItem.");
            }
            console.log("[NewPage/handlePreview] Verification SUCCESS after setItem");

            const previewUrl = `/admin/preview`;
            console.log(`[NewPage/handlePreview] Opening preview window with URL: ${previewUrl}`);

            setTimeout(() => {
                const newWindow = window.open(previewUrl, '_blank');
                if (!newWindow) {
                    console.error("[NewPage/handlePreview] Failed to open preview window. Pop-up blocker might be active.");
                    toast({ variant: "destructive", title: "Önizleme Açılamadı", description: "Pop-up engelleyiciyi kontrol edin.", duration: 10000 });
                } else {
                    console.log("[NewPage/handlePreview] Preview window opened successfully.");
                }
            }, 300);

        } catch (error: any) {
            console.error("[NewPage/handlePreview] Error during preview process:", error);
            toast({ variant: "destructive", title: "Önizleme Hatası", description: `Önizleme verisi kaydedilemedi veya doğrulanamadı: ${error.message}`, duration: 10000 });
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-10">
                 <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/pages"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                 </Button>
                <h1 className="text-xl font-semibold">Yeni Sayfa Oluştur</h1>
                <div className="flex items-center gap-2">
                     <Button variant="outline" size="sm" onClick={() => setIsTemplateSelectorOpen(true)}>
                        <LayoutGrid className="mr-2 h-4 w-4" /> Şablon Seç
                     </Button>
                     <Button variant="outline" size="sm" onClick={handlePreview} disabled={saving}>
                        <Eye className="mr-2 h-4 w-4" /> Önizle
                     </Button>
                     <Button size="sm" onClick={handleSave} disabled={!title || !slug || saving}>
                        <Save className="mr-2 h-4 w-4" /> Kaydet
                     </Button>
                 </div>
            </div>

             {/* Main Content Area */}
             <div className="flex flex-1 overflow-hidden">
                  {/* Left Content Area (Editor) */}
                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Temel Bilgiler</CardTitle>
                            <CardDescription>Sayfanın başlığını ve URL'sini belirleyin.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="page-title">Sayfa Başlığı <span className="text-destructive">*</span></Label>
                                <Input
                                    id="page-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Örn: Gizlilik Politikası"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="page-slug">URL Metni (Slug) <span className="text-destructive">*</span></Label>
                                <Input
                                    id="page-slug"
                                    value={slug}
                                    onChange={(e) => setSlug(handleSlugGeneration(e.target.value))} // Allow manual adjustment
                                    placeholder="Sayfa URL'si"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Tarayıcı adres çubuğunda görünecek kısım. Genellikle otomatik oluşturulur.</p>
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
                       selectedBlockId={selectedBlockId}
                       onBlockSelect={handleBlockSelect}
                     />
                 </div>

                  {/* Right Sidebar (SEO & Actions) */}
                 <aside className="w-96 border-l bg-card p-6 overflow-y-auto space-y-6 hidden lg:block">
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
                            </CardContent>
                      </Card>

                       <Separator />

                      {/* SEO Preview */}
                       <div className="sticky top-[calc(theme(spacing.16)+theme(spacing.6))] h-fit">
                          <SeoPreview
                              title={seoTitle || title}
                              description={seoDescription || ''}
                              slug={slug}
                              category="sayfa" // Generic category for pages
                          />
                       </div>

                       {/* Actions */}
                       {templateApplied && (
                            <Button
                                variant="outline"
                                className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
                                onClick={handleRemoveTemplate}
                                disabled={saving}
                            >
                                <Layers className="mr-2 h-4 w-4" /> Şablonu Kaldır
                            </Button>
                        )}
                 </aside>
            </div>

             {/* Template Selector Modal */}
             <TemplateSelector
                isOpen={isTemplateSelectorOpen}
                onClose={() => setIsTemplateSelectorOpen(false)}
                onSelectTemplateBlocks={handleTemplateSelect}
                blocksCurrentlyExist={blocks.length > 1 || (blocks.length === 1 && (blocks[0]?.type !== 'text' || blocks[0]?.content !== ''))}
                templateTypeFilter="page" // Filter for page templates
            />
        </div>
    );
}
