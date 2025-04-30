
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  GripVertical,
  Trash2,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  List,
  ListOrdered,
  Type,
  Heading2,
  Image as ImageIcon,
  GalleryHorizontal,
  Video,
  Quote,
  Code,
  PlusCircle, // Added for Add Block button
  Minus, // Added for Divider
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image'; // Used for image previews if needed
import { TemplateSelector, Block } from "@/components/admin/template-selector"; // Import Block type as well
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Added DropdownMenu
import { BlockEditor } from "@/components/admin/block-editor/block-editor"; // Import BlockEditor
import SeoPreview from "@/components/admin/seo-preview"; // Import SEO Preview


// --- Main Page Component ---

export default function NewArticlePage() {
    // --- State ---
    const [title, setTitle] = React.useState("");
    const [excerpt, setExcerpt] = React.useState("");
    const [category, setCategory] = React.useState<"Teknoloji" | "Biyoloji" | "">("");
    const [mainImageUrl, setMainImageUrl] = React.useState("");
    const [isFeatured, setIsFeatured] = React.useState(false);
    const [status, setStatus] = React.useState("Taslak");

    // Block Editor State
    const [blocks, setBlocks] = React.useState<Block[]>([
        // Initial block for example
        { id: `block-${Date.now()}`, type: 'text', content: '' },
    ]);

    // Other States
    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = React.useState(false);
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [canonicalUrl, setCanonicalUrl] = React.useState("");

    // --- Handlers ---

    // Basic slug generation
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
         }
     }, [title]);

    // Auto-generate SEO Title from main title if empty
    React.useEffect(() => {
      if (title && !seoTitle) {
        setSeoTitle(title);
      }
    }, [title, seoTitle]);

     // Auto-generate SEO Description from excerpt if empty
    React.useEffect(() => {
       if (excerpt && !seoDescription) {
         // Simple trim and take first 160 chars
         const desc = excerpt.length > 160 ? excerpt.substring(0, 157) + '...' : excerpt;
         setSeoDescription(desc);
       }
    }, [excerpt, seoDescription]);


    const handleAddBlock = (type: Block['type']) => {
        const newBlock: Block = {
            id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`, // More unique ID
            type: type,
            // Default content based on type
            ...(type === 'text' && { content: '' }),
            ...(type === 'heading' && { level: 2, content: '' }),
            ...(type === 'image' && { url: '', alt: '', caption: '' }),
            ...(type === 'gallery' && { images: [] }),
            ...(type === 'video' && { url: '' }),
            ...(type === 'quote' && { content: '', citation: '' }),
            ...(type === 'code' && { language: 'javascript', content: '' }),
             ...(type === 'divider' && {}),
        } as Block; // Added type assertion
        setBlocks([...blocks, newBlock]);
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks(blocks.filter(block => block.id !== id));
    };

     // Update block state (generic, used by BlockEditor)
     const handleUpdateBlock = (updatedBlock: Block) => {
         setBlocks(prevBlocks =>
             prevBlocks.map(block =>
                 block.id === updatedBlock.id ? updatedBlock : block
             )
         );
     };

     // Reorder blocks (generic, used by BlockEditor)
     const handleReorderBlocks = (reorderedBlocks: Block[]) => {
         setBlocks(reorderedBlocks);
     };


    const handleSave = (publish: boolean = false) => {
         const finalStatus = publish ? "Yayınlandı" : status;
         // TODO: Implement actual API call to save the article
         const blocksToSave = blocks; // Process blocks if needed
         console.log("Saving article:", { title, excerpt, category, status: finalStatus, mainImageUrl, isFeatured, slug, keywords: keywords.join(','), canonicalUrl, blocks: blocksToSave, seoTitle, seoDescription });
         toast({
             title: publish ? "Makale Yayınlandı" : "Makale Kaydedildi",
             description: `"${title}" başlıklı makale başarıyla ${publish ? 'yayınlandı' : 'kaydedildi (' + finalStatus + ')'}.`,
         });
         // Redirect or clear form based on action
    };

     // Handler for template selection (assuming template gives blocks)
     const handleTemplateSelect = (templateBlocks: Block[]) => {
        // Ask for confirmation before overwriting existing content
        if (blocks.length > 1 || (blocks.length === 1 && blocks[0].type === 'text' && (blocks[0] as Extract<Block, { type: 'text' }>).content !== '')) {
            if (!window.confirm("Mevcut içerik bölümlerinin üzerine şablon uygulansın mı? Bu işlem geri alınamaz.")) {
                 setIsTemplateSelectorOpen(false); // Close selector if cancelled
                 return;
            }
        }
        // Ensure new unique IDs for blocks from the template
        const newBlocks = templateBlocks.map(block => ({
            ...block,
            id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`
        }));
        setBlocks(newBlocks); // Update blocks state with template
        setIsTemplateSelectorOpen(false); // Close the selector
     };

      const handlePreview = () => {
         const previewData = {
             id: 'preview', // Use a temporary ID
             title,
             description: excerpt, // Use excerpt as description for preview
             category: category || 'Teknoloji', // Default category if not set
             imageUrl: mainImageUrl || 'https://picsum.photos/seed/preview/1200/600', // Placeholder if no image
             blocks, // Pass the current blocks
         };
         try {
             localStorage.setItem('articlePreviewData', JSON.stringify(previewData));
             window.open('/admin/preview', '_blank'); // Open preview in a new tab
         } catch (error) {
             console.error("Error saving preview data to localStorage:", error);
             toast({
                 variant: "destructive",
                 title: "Önizleme Hatası",
                 description: "Önizleme verisi kaydedilemedi. Tarayıcı depolama alanı dolu olabilir.",
             });
         }
     };


     // TODO: Add handlers for media upload, etc.


    return (
        <div className="flex flex-col h-full">
            {/* Top Bar */}
             <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-10">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/articles"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                </Button>
                <h1 className="text-xl font-semibold">Yeni Makale Oluştur</h1>
                {/* Placeholder for potential actions or user info */}
                <div className="w-20"></div> {/* Spacer */}
            </div>

            {/* Main Content Area */}
             <div className="flex flex-1 overflow-hidden">
                {/* Left Content Area (Tabs & Editor) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <Tabs defaultValue="content">
                        <TabsList className="mb-6">
                            <TabsTrigger value="content">İçerik</TabsTrigger>
                            <TabsTrigger value="template" onClick={() => setIsTemplateSelectorOpen(true)}>Şablon</TabsTrigger>
                            <TabsTrigger value="media">Medya</TabsTrigger>
                            <TabsTrigger value="seo">SEO</TabsTrigger>
                        </TabsList>

                        {/* Content Tab */}
                        <TabsContent value="content" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Makale Başlığı</Label>
                                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Makalenizin başlığını girin" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <Select value={category} onValueChange={(value) => setCategory(value as "Teknoloji" | "Biyoloji")} required>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Kategori seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Teknoloji">Teknoloji</SelectItem>
                                            <SelectItem value="Biyoloji">Biyoloji</SelectItem>
                                            {/* Add more categories fetched dynamically */}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="excerpt">Özet</Label>
                                <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Makalenizin kısa bir özetini girin" rows={3} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="main-image-url">Ana Görsel URL</Label>
                                <div className="flex gap-2">
                                     <Input id="main-image-url" value={mainImageUrl} onChange={(e) => setMainImageUrl(e.target.value)} placeholder="https://..." />
                                     <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> Yükle</Button> {/* TODO: Implement upload */}
                                </div>
                                {mainImageUrl && (
                                    <div className="mt-2 rounded border p-2 w-fit">
                                        <Image src={mainImageUrl} alt="Ana Görsel Önizleme" width={200} height={100} className="object-cover rounded"/>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Switch id="featured-article" checked={isFeatured} onCheckedChange={setIsFeatured} />
                                <Label htmlFor="featured-article">Öne Çıkarılmış Makale</Label>
                            </div>

                             <Separator className="my-8" />

                             {/* Block Editor Section */}
                             <BlockEditor
                                blocks={blocks}
                                onAddBlock={handleAddBlock}
                                onDeleteBlock={handleDeleteBlock}
                                onUpdateBlock={handleUpdateBlock}
                                onReorderBlocks={handleReorderBlocks}
                             />

                        </TabsContent>

                         {/* Template Tab (Content is handled by Modal) */}
                         <TabsContent value="template">
                             <p className="text-muted-foreground">Şablon seçmek için yukarıdaki "Şablon" sekmesine tıklayın.</p>
                        </TabsContent>

                        {/* Media Tab */}
                        <TabsContent value="media">
                             <Card>
                                 <CardHeader>
                                    <CardTitle>Medya Yönetimi</CardTitle>
                                    <CardDescription>Mevcut medyaları yönetin veya yenilerini yükleyin.</CardDescription>
                                 </CardHeader>
                                 <CardContent>
                                     {/* TODO: Implement Media Library Component */}
                                     <p className="text-muted-foreground">Medya kütüphanesi burada yer alacak.</p>
                                     <Button className="mt-4"><Upload className="mr-2 h-4 w-4"/> Medya Yükle</Button>
                                 </CardContent>
                             </Card>
                        </TabsContent>

                        {/* SEO Tab */}
                        <TabsContent value="seo">
                             <Card>
                                 <CardHeader>
                                    <CardTitle>SEO Ayarları</CardTitle>
                                    <CardDescription>Makalenizin arama motorlarında nasıl görüneceğini optimize edin.</CardDescription>
                                 </CardHeader>
                                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                     {/* SEO Form Fields */}
                                     <div className="space-y-6">
                                         <div className="space-y-2">
                                             <Label htmlFor="seo-title">SEO Başlığı</Label>
                                             <Input
                                                 id="seo-title"
                                                 value={seoTitle}
                                                 onChange={(e) => setSeoTitle(e.target.value)}
                                                 maxLength={60}
                                                 placeholder="Arama sonuçlarında görünecek başlık"
                                             />
                                             <p className="text-xs text-muted-foreground">Tavsiye edilen uzunluk: 50-60 karakter. ({seoTitle.length}/60)</p>
                                         </div>
                                         <div className="space-y-2">
                                             <Label htmlFor="seo-description">Meta Açıklama</Label>
                                             <Textarea
                                                 id="seo-description"
                                                 value={seoDescription}
                                                 onChange={(e) => setSeoDescription(e.target.value)}
                                                 rows={4}
                                                 maxLength={160}
                                                 placeholder="Arama sonuçlarında görünecek kısa açıklama"
                                             />
                                             <p className="text-xs text-muted-foreground">Tavsiye edilen uzunluk: 150-160 karakter. ({seoDescription.length}/160)</p>
                                         </div>
                                          <div className="space-y-2">
                                             <Label htmlFor="slug">URL Metni (Slug)</Label>
                                             <Input
                                                 id="slug"
                                                 value={slug}
                                                 onChange={(e) => setSlug(generateSlug(e.target.value))}
                                                 placeholder="makale-basligi-url"
                                                 required
                                             />
                                             <p className="text-xs text-muted-foreground">Makalenin URL'si. Genellikle otomatik oluşturulur.</p>
                                         </div>
                                         <div className="space-y-2">
                                             <Label htmlFor="keywords">Anahtar Kelimeler</Label>
                                             <Input
                                                 id="keywords"
                                                 value={keywords.join(', ')}
                                                 onChange={(e) => setKeywords(e.target.value.split(',').map(kw => kw.trim()).filter(kw => kw !== ''))}
                                                 placeholder="Anahtar kelimeleri virgülle ayırın"
                                             />
                                             <p className="text-xs text-muted-foreground">Makalenizle ilgili anahtar kelimeleri belirtin.</p>
                                         </div>
                                         <div className="space-y-2">
                                             <Label htmlFor="canonical-url">Canonical URL</Label>
                                             <Input
                                                 id="canonical-url"
                                                 type="url"
                                                 value={canonicalUrl}
                                                 onChange={(e) => setCanonicalUrl(e.target.value)}
                                                 placeholder="https://teknobiyo.com/orijinal-makale-url"
                                             />
                                             <p className="text-xs text-muted-foreground">İçerik aynı olan başka bir URL varsa ekleyin.</p>
                                         </div>
                                     </div>

                                     {/* SEO Preview */}
                                     <div className="sticky top-[calc(theme(spacing.16)+theme(spacing.6))] h-fit">
                                          <SeoPreview
                                              title={seoTitle || title}
                                              description={seoDescription || excerpt}
                                              slug={slug}
                                              category={category || "kategori"}
                                          />
                                      </div>
                                 </CardContent>
                             </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                 {/* Right Sidebar (Actions & Status) */}
                 <aside className="w-72 border-l bg-card p-6 overflow-y-auto space-y-6 hidden lg:block"> {/* Hide on smaller screens for simplicity for now */}
                     <Card>
                        <CardHeader>
                           <CardTitle>Durum</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="status">Yayın Durumu</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Durum seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Taslak">Taslak</SelectItem>
                                        <SelectItem value="İncelemede">İncelemede</SelectItem>
                                        <SelectItem value="Yayınlandı">Yayınlandı</SelectItem>
                                        <SelectItem value="Arşivlendi">Arşivlendi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Optional: Add visibility, publish date */}
                             <Separator />
                              <Button variant="outline" className="w-full justify-center" onClick={handlePreview}>
                                 <Eye className="mr-2 h-4 w-4" /> Önizle
                             </Button>
                             <Button className="w-full" onClick={() => handleSave(status === 'Yayınlandı')}>
                                <Save className="mr-2 h-4 w-4" /> Kaydet
                            </Button>
                            {/* Conditionally show Publish button */}
                             {status !== 'Yayınlandı' && (
                                 <Button className="w-full" variant="default" onClick={() => handleSave(true)}>
                                     <Upload className="mr-2 h-4 w-4" /> Yayınla
                                 </Button>
                             )}
                        </CardContent>
                     </Card>
                    {/* Keywords moved to main SEO section */}
                 </aside>
             </div>

             {/* Template Selector Modal */}
             <TemplateSelector
                 isOpen={isTemplateSelectorOpen}
                 onClose={() => setIsTemplateSelectorOpen(false)}
                 onSelectTemplateBlocks={handleTemplateSelect} // Use the new prop
             />
        </div>
    );
}
