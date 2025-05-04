
"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, LayoutGrid } from "lucide-react"; // Added Eye for preview, LayoutGrid for Section
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { BlockEditor } from "@/components/admin/block-editor"; // Import BlockEditor
import type { Block } from "@/components/admin/template-selector"; // Import Block type
import SeoPreview from "@/components/admin/seo-preview"; // Import SEO Preview
import { Textarea } from "@/components/ui/textarea"; // Import Textarea for SEO Description


export default function NewPage() {
    const router = useRouter();
    const [title, setTitle] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [blocks, setBlocks] = React.useState<Block[]>([
        { id: `block-${Date.now()}`, type: 'text', content: '' }, // Start with an empty text block
    ]);
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [canonicalUrl, setCanonicalUrl] = React.useState("");


    // Basic slug generation (same as article editor)
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-').replace(/-+/g, '-');
    };

    // Auto-generate slug from title
     React.useEffect(() => {
         if (title) {
             setSlug(generateSlug(title));
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
            ...(type === 'section' && { sectionType: 'custom-text', settings: {} }), // Add section block default
        } as Block;
        setBlocks([...blocks, newBlock]);
     };

     const handleDeleteBlock = (id: string) => {
        setBlocks(blocks.filter(block => block.id !== id));
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
     // --- End Block Handlers ---

    const handleSave = () => {
        if (!title || !slug) {
            toast({ variant: "destructive", title: "Hata", description: "Sayfa başlığı ve URL metni zorunludur." });
            return;
        }
        // TODO: Implement actual API call to save the new page structure including blocks and SEO
        const newPageData = { title, slug, blocks, seoTitle, seoDescription, keywords, canonicalUrl };
        console.log("Saving new page:", newPageData);
        toast({
            title: "Sayfa Oluşturuldu",
            description: `"${title}" başlıklı sayfa taslak olarak kaydedildi.`,
        });
        // TODO: Redirect to the edit page for the newly created page or back to list
        // Example: router.push(`/admin/pages/edit/${newlyCreatedPageId}`);
        router.push('/admin/pages');
    };

     // --- Preview Handler ---
     const handlePreview = () => {
        const previewData = {
            id: 'preview', // Temporary ID for preview
            title,
            description: seoDescription || '',
            imageUrl: (blocks.find(b => b.type === 'image') as Extract<Block, { type: 'image' }>)?.url || 'https://picsum.photos/seed/new-page-preview/1200/600',
            blocks,
        };
         try {
             localStorage.setItem('articlePreviewData', JSON.stringify(previewData));
             window.open('/admin/preview', '_blank');
         } catch (error) {
             console.error("Error saving preview data:", error);
             toast({ variant: "destructive", title: "Önizleme Hatası", description: "Önizleme verisi kaydedilemedi." });
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
                     <Button variant="outline" size="sm" onClick={handlePreview}>
                        <Eye className="mr-2 h-4 w-4" /> Önizle
                     </Button>
                     <Button size="sm" onClick={handleSave} disabled={!title || !slug}>
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
                                    onChange={(e) => setSlug(generateSlug(e.target.value))} // Allow manual adjustment
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
                       selectedBlockId={null} // Add selectedBlockId prop
                       onBlockSelect={() => {}} // Add onBlockSelect prop
                     />
                 </div>

                  {/* Right Sidebar (SEO) */}
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
                                        placeholder="https://teknobiyo.com/orijinal-sayfa-url"
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
                              category="sayfa"
                          />
                       </div>
                 </aside>
            </div>
        </div>
    );
}

    