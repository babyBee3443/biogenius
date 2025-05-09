"use client"; // Essential for hooks like useState, useEffect, useRouter

import * as React from 'react';
import { useRouter } from 'next/navigation'; // Import hooks
import Link from 'next/link';
import Image from 'next/image';
import { toast } from "@/hooks/use-toast";
import { TemplateSelector, Block } from "@/components/admin/template-selector";
import { BlockEditor } from "@/components/admin/block-editor/block-editor";
import SeoPreview from "@/components/admin/seo-preview";
import { useDebouncedCallback } from 'use-debounce';
import { createArticle, type ArticleData, getCategories, type Category, generateSlug as generateSlugUtil } from '@/lib/mock-data'; // Import mock data functions including getCategories
import { usePermissions } from "@/hooks/usePermissions"; // Import usePermissions


import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Eye, Loader2, Save, Upload, Star, Layers } from "lucide-react"; // Added Layers icon

// Helper to generate unique block IDs safely on the client
const generateBlockId = () => `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;
const createDefaultBlock = (): Block => ({ id: generateBlockId(), type: 'text', content: '' });

const PREVIEW_STORAGE_KEY = 'preview_data';

// --- Main Page Component ---

export default function NewArticlePage() {
    const router = useRouter(); // Initialize router
    const { hasPermission, isLoading: permissionsLoading } = usePermissions();

    // --- State ---
    const [saving, setSaving] = React.useState(false); // Added saving state
    const [templateApplied, setTemplateApplied] = React.useState(false); // Track if template is applied
    const [categories, setCategories] = React.useState<Category[]>([]); // State for categories
    const [loadingCategories, setLoadingCategories] = React.useState(true); // Loading state for categories

    const [title, setTitle] = React.useState("");
    const [excerpt, setExcerpt] = React.useState("");
    const [category, setCategory] = React.useState<ArticleData['category'] | "">(""); // Category is a string
    const [mainImageUrl, setMainImageUrl] = React.useState("");
    const [isFeatured, setIsFeatured] = React.useState(false);
    const [isHero, setIsHero] = React.useState(false); // Added isHero state
    const [status, setStatus] = React.useState<ArticleData['status']>("Taslak");

    // Block Editor State - Initialize with default block client-side
    const [blocks, setBlocks] = React.useState<Block[]>([]); // Initialize empty

    // SEO States
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [canonicalUrl, setCanonicalUrl] = React.useState("");

    // Other States
    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = React.useState(false);
    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null); // Added for block editor interaction

     // Effect to set default block and load categories only on client side after mount
     React.useEffect(() => {
        if (!permissionsLoading && !hasPermission('Makale Oluşturma')) {
          toast({ variant: "destructive", title: "Erişim Reddedildi", description: "Yeni makale oluşturma yetkiniz yok." });
          router.push('/admin/articles');
          return;
        }

        if (blocks.length === 0) {
            setBlocks([createDefaultBlock()]);
        }

        setLoadingCategories(true);
        getCategories()
            .then(data => setCategories(data))
            .catch(err => {
                console.error("Error fetching categories:", err);
                toast({ variant: "destructive", title: "Hata", description: "Kategoriler yüklenemedi." });
            })
            .finally(() => setLoadingCategories(false));

     }, [permissionsLoading, hasPermission, router, blocks.length]); // Add blocks.length to ensure default block is set

    // --- Handlers ---

    // Basic slug generation
    // const generateSlug = (text: string) => { // Already using generateSlugUtil from mock-data
    //     if (!text) return '';
    //     return text
    //         .toLowerCase()
    //         .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    //         .replace(/[^a-z0-9 -]/g, '')
    //         .replace(/\s+/g, '-').replace(/-+/g, '-');
    // };

     // Auto-generate slug from title (debounced)
     const debouncedSetSlug = useDebouncedCallback((newTitle: string) => {
         if (newTitle) {
             setSlug(generateSlugUtil(newTitle));
         } else {
             setSlug(''); // Clear slug if title is empty
         }
     }, 500); // 500ms delay

     React.useEffect(() => {
         debouncedSetSlug(title);
     }, [title, debouncedSetSlug]);

    // Auto-generate SEO Title from main title if empty
    React.useEffect(() => {
      if (title && !seoTitle) {
        setSeoTitle(title);
      }
    }, [title, seoTitle]);

     // Auto-generate SEO Description from excerpt if empty
    React.useEffect(() => {
       if (excerpt && !seoDescription) {
         const desc = excerpt.length > 160 ? excerpt.substring(0, 157) + '...' : excerpt;
         setSeoDescription(desc);
       }
    }, [excerpt, seoDescription]);


    const handleAddBlock = (type: Block['type']) => {
        const newBlock: Block = {
            id: generateBlockId(),
            type: type,
            ...(type === 'text' && { content: '' }),
            ...(type === 'heading' && { level: 2, content: '' }),
            ...(type === 'image' && { url: '', alt: '', caption: '' }),
            ...(type === 'gallery' && { images: [] }),
            ...(type === 'video' && { url: '', youtubeId: '' }), // Added youtubeId
            ...(type === 'quote' && { content: '', citation: '' }),
             ...(type === 'divider' && {}),
             ...(type === 'section' && { sectionType: 'custom-text', settings: {} }),
        } as Block;
        setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
        setSelectedBlockId(newBlock.id); // Select the newly added block
        setTemplateApplied(false); // Adding manually modifies template
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks((prevBlocks) => prevBlocks.filter(block => block.id !== id));
         if (selectedBlockId === id) setSelectedBlockId(null); // Deselect if deleted
         setTemplateApplied(false); // Deleting modifies template
    };

     // Update block state
     const handleUpdateBlock = (updatedBlock: Block) => {
         setBlocks(prevBlocks =>
             prevBlocks.map(block =>
                 block.id === updatedBlock.id ? updatedBlock : block
             )
         );
         // Modifying content doesn't necessarily change template structure
     };

     // Reorder blocks
     const handleReorderBlocks = (reorderedBlocks: Block[]) => {
         setBlocks(reorderedBlocks);
         setTemplateApplied(false); // Reordering modifies template
     };

     // Block selection
     const handleBlockSelect = (id: string | null) => {
         setSelectedBlockId(id);
     };

    const handleSave = async (publish: boolean = false) => {
         const finalStatus = publish ? "Yayınlandı" : status;
         if (!category) {
             toast({ variant: "destructive", title: "Eksik Bilgi", description: "Lütfen bir kategori seçin." });
             return;
         }
         if (!title) {
             toast({ variant: "destructive", title: "Eksik Bilgi", description: "Lütfen makale başlığını girin." });
             return;
         }
         if (!slug) {
            toast({ variant: "destructive", title: "Eksik Bilgi", description: "URL metni (slug) boş olamaz." });
            return;
         }

         setSaving(true);

         const newArticleData: Omit<ArticleData, 'id' | 'createdAt' | 'updatedAt'> = {
             title,
             excerpt: excerpt || "",
             category, // Category is a string
             status: finalStatus,
             mainImageUrl: mainImageUrl || null,
             isFeatured,
             isHero, // Include isHero in save data
             slug: slug || generateSlugUtil(title),
             keywords: keywords || [],
             canonicalUrl: canonicalUrl || "",
             blocks: blocks.length > 0 ? blocks : [createDefaultBlock()], // Use default if empty
             seoTitle: seoTitle || title,
             seoDescription: seoDescription || excerpt.substring(0, 160) || "",
             authorId: 'mock-admin', // Assign a default author ID
         };

         console.log("Preparing to create article:", newArticleData);

         try {
             const newArticle = await createArticle(newArticleData);
             if (newArticle) {
                 toast({
                     title: "Makale Oluşturuldu",
                     description: `"${newArticle.title}" başlıklı makale başarıyla oluşturuldu (${newArticle.status}).`,
                 });
                  // Redirect to the edit page of the newly created article
                  router.push(`/admin/articles/edit/${newArticle.id}`);
                  // No need to setSaving(false) here as we are navigating away
             } else {
                  toast({ variant: "destructive", title: "Oluşturma Hatası", description: "Makale oluşturulamadı." });
                  setSaving(false); // Allow retry on failure
             }
         } catch (error) {
             console.error("Error creating article:", error);
             toast({ variant: "destructive", title: "Oluşturma Hatası", description: "Makale oluşturulurken bir hata oluştu." });
             setSaving(false); // Allow retry on failure
         }
    };

     // Handler for template selection
     const handleTemplateSelect = (templateBlocks: Block[]) => {
         // Confirmation handled within TemplateSelector now
         const newBlocks = templateBlocks.map(block => ({
             ...block,
             id: generateBlockId() // Assign new IDs on client
         }));
         setBlocks(newBlocks);
         setTemplateApplied(true); // Mark template as applied
         setIsTemplateSelectorOpen(false);
         toast({ title: "Şablon Uygulandı", description: "Seçilen şablon içeriğe başarıyla uygulandı." });
     };

     const handleRemoveTemplate = () => {
         if (window.confirm("Mevcut içeriği kaldırıp varsayılan boş metin bloğuna dönmek istediğinizden emin misiniz?")) {
             setBlocks([createDefaultBlock()]); // Reset to default block
             setTemplateApplied(false); // Mark template as removed
             setSelectedBlockId(null); // Deselect any selected block
             toast({ title: "Şablon Kaldırıldı", description: "İçerik varsayılan boş metin bloğuna döndürüldü." });
         }
     };


     const handlePreview = () => {
        if (typeof window === 'undefined') return; // Guard against server-side execution

        if (!category) {
            toast({ variant: "destructive", title: "Önizleme Hatası", description: "Lütfen önizlemeden önce bir kategori seçin." });
            return;
        }

        const previewData: Partial<ArticleData> & { previewType: 'article' } = {
            previewType: 'article',
            id: 'preview_new', // Use a distinct ID for new article preview
            title: title || 'Başlıksız Makale',
            excerpt: excerpt || '',
            category: category, // Category is string
            mainImageUrl: mainImageUrl || 'https://picsum.photos/seed/preview/1200/600',
            blocks,
            isFeatured: isFeatured,
            isHero: isHero,
            status: status,
            authorId: 'mock-admin',
            createdAt: new Date().toISOString(),
            seoTitle: seoTitle || title,
            seoDescription: seoDescription || excerpt.substring(0, 160) || "",
            slug: slug || generateSlugUtil(title),
            keywords: keywords || [],
            canonicalUrl: canonicalUrl || "",
        };

        console.log(`[NewArticlePage/handlePreview] Preparing to save preview data with key: ${PREVIEW_STORAGE_KEY}`);
        console.log(`[NewArticlePage/handlePreview] Preview Data:`, JSON.stringify(previewData, null, 2)); // Log the data being saved in a readable format

        try {
            const stringifiedData = JSON.stringify(previewData);
            if (!stringifiedData || stringifiedData === 'null' || stringifiedData === '{}') {
                console.error("[NewArticlePage/handlePreview] Error: Stringified preview data is empty or null.");
                toast({ variant: "destructive", title: "Önizleme Hatası", description: "Önizleme verisi oluşturulamadı (boş veri)." });
                return;
            }
            console.log(`[NewArticlePage/handlePreview] Stringified data length: ${stringifiedData.length}`);

            localStorage.setItem(PREVIEW_STORAGE_KEY, stringifiedData);
            const checkStoredData = localStorage.getItem(PREVIEW_STORAGE_KEY);
            console.log(`[NewArticlePage/handlePreview] Data AFTER setItem for key '${PREVIEW_STORAGE_KEY}':`, checkStoredData ? checkStoredData.substring(0, 200) + "..." : "NULL");


             // --- Verification Steps ---
            const storedData = localStorage.getItem(PREVIEW_STORAGE_KEY);
             if (storedData && storedData !== 'null' && storedData !== 'undefined') {
                 console.log(`[NewArticlePage/handlePreview] Verification 1 SUCCESS: Data found in localStorage. Length: ${storedData.length}`);
                 try {
                    const parsed = JSON.parse(storedData);
                    console.log(`[NewArticlePage/handlePreview] Verification 2 SUCCESS: Data parsed successfully. Title: ${parsed.title}`);
                 } catch (parseError: any) {
                      console.error(`[NewArticlePage/handlePreview] Verification 2 FAILED: Could not parse stored JSON.`, parseError);
                      throw new Error(`Verification failed: Data for key ${PREVIEW_STORAGE_KEY} is not valid JSON: ${parseError.message}`);
                 }
             } else {
                  console.error(`[NewArticlePage/handlePreview] Verification 1 FAILED: No data found (or data is 'null'/'undefined') for key ${PREVIEW_STORAGE_KEY}. Actual value:`, storedData);
                  throw new Error(`Verification failed: No data found (or data is 'null'/'undefined') for key ${PREVIEW_STORAGE_KEY}.`);
             }
             // --- End Verification Steps ---

            // Simplified URL - Preview page will read from the fixed key
            const previewUrl = `/admin/preview`;
            console.log(`[NewArticlePage/handlePreview] Opening preview window with URL: ${previewUrl}`);

             // Add a small delay before opening the window
            setTimeout(() => {
                const newWindow = window.open(previewUrl, '_blank');
                if (!newWindow) {
                     console.error("[NewArticlePage/handlePreview] Failed to open preview window. Pop-up blocker might be active.");
                     toast({
                         variant: "destructive",
                         title: "Önizleme Penceresi Açılamadı",
                         description: "Lütfen tarayıcınızın pop-up engelleyicisini kontrol edin.",
                         duration: 10000,
                     });
                } else {
                     console.log("[NewArticlePage/handlePreview] Preview window opened successfully after delay.");
                }
            }, 250); // Increased delay slightly

        } catch (error: any) {
            console.error("[NewArticlePage/handlePreview] Error during preview process:", error);
            toast({
                variant: "destructive",
                title: "Önizleme Hatası",
                description: `Önizleme verisi kaydedilemedi veya doğrulanamadı: ${error.message}`,
                duration: 10000,
            });
        }
    };

    if (permissionsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                Yükleniyor...
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Top Bar */}
             <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-10">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/articles"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                </Button>
                <h1 className="text-xl font-semibold">Yeni Makale Oluştur</h1>
                <div className="w-20"></div> {/* Spacer */}
            </div>

            {/* Main Content Area */}
             <div className="flex flex-1 overflow-hidden">
                {/* Left Content Area (Tabs & Editor) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <Tabs defaultValue="content">
                        <TabsList className="mb-6">
                            <TabsTrigger value="content">İçerik</TabsTrigger>
                            <TabsTrigger value="template" onClick={() => setIsTemplateSelectorOpen(true)}>Şablon Seç</TabsTrigger>
                            <TabsTrigger value="media">Medya</TabsTrigger>
                            <TabsTrigger value="seo">SEO</TabsTrigger>
                        </TabsList>

                        {/* Content Tab */}
                        <TabsContent value="content" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Makale Başlığı <span className="text-destructive">*</span></Label>
                                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Makalenizin başlığını girin" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori <span className="text-destructive">*</span></Label>
                                    <Select value={category} onValueChange={(value) => setCategory(value)} required disabled={loadingCategories}>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Kategori seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                             {loadingCategories ? (
                                                <SelectItem value="loading_placeholder" disabled>Yükleniyor...</SelectItem>
                                             ) : (
                                                categories.map(cat => (
                                                   <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                                ))
                                             )}
                                             {/* TODO: Add link/button to manage categories */}
                                             <Separator />
                                             {hasPermission('Kategorileri Yönetme') && (
                                                <Link href="/admin/categories" className="p-2 text-sm text-muted-foreground hover:text-primary">Kategorileri Yönet</Link>
                                             )}
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
                                        <Image 
                                            src={mainImageUrl} 
                                            alt="Ana Görsel Önizleme" 
                                            width={200} 
                                            height={100} 
                                            className="object-cover rounded" 
                                            data-ai-hint="article cover placeholder"
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-4 pt-2"> {/* Changed spacing */}
                                 <div className="flex items-center space-x-2">
                                     <Switch id="featured-article" checked={isFeatured} onCheckedChange={setIsFeatured} />
                                     <Label htmlFor="featured-article">Öne Çıkarılmış Makale</Label>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                     <Switch id="hero-article" checked={isHero} onCheckedChange={setIsHero} />
                                     <Label htmlFor="hero-article" className="flex items-center">
                                         <Star className="mr-1 h-3.5 w-3.5 text-yellow-500"/> Hero'da Göster
                                     </Label>
                                 </div>
                             </div>


                             <Separator className="my-8" />

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

                        </TabsContent>

                         {/* Template Tab (Content is handled by Modal) */}
                         <TabsContent value="template">
                             <p className="text-muted-foreground">Şablon seçmek için yukarıdaki "Şablon Seç" sekmesine tıklayın.</p>
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
                                                 onChange={(e) => setSlug(generateSlugUtil(e.target.value))}
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
                                              category={category || "kategori"} // Use string category
                                          />
                                      </div>
                                 </CardContent>
                             </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                 {/* Right Sidebar (Actions & Status) */}
                 <aside className="w-72 border-l bg-card p-6 overflow-y-auto space-y-6 hidden lg:block"> {/* Hide on smaller screens */}
                     <Card>
                        <CardHeader>
                           <CardTitle>Durum</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="status">Yayın Durumu</Label>
                                <Select value={status} onValueChange={(value) => setStatus(value as ArticleData['status'])}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Durum seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Taslak">Taslak</SelectItem>
                                        <SelectItem value="İncelemede">İncelemede</SelectItem>
                                        <SelectItem value="Hazır">Hazır (Admin/Editör Görsün)</SelectItem>
                                        <SelectItem value="Yayınlandı">Yayınlandı</SelectItem>
                                        <SelectItem value="Arşivlendi">Arşivlendi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <Separator />
                              <Button variant="outline" className="w-full justify-center" onClick={handlePreview} disabled={saving}>
                                 <Eye className="mr-2 h-4 w-4" /> Önizle
                             </Button>
                             <Button className="w-full" onClick={() => handleSave()} disabled={saving || !slug || !title}>
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Kaydet
                            </Button>
                             {status !== 'Yayınlandı' && (
                                 <Button className="w-full" variant="default" onClick={() => handleSave(true)} disabled={saving || !slug || !title}>
                                     {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />} Yayınla
                                 </Button>
                             )}
                             {/* Conditionally show Remove Template button */}
                             {templateApplied && (
                                <Button variant="outline" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10" onClick={handleRemoveTemplate} disabled={saving}>
                                    <Layers className="mr-2 h-4 w-4" /> Şablonu Kaldır
                                </Button>
                             )}
                        </CardContent>
                     </Card>
                 </aside>
             </div>

             {/* Template Selector Modal */}
             <TemplateSelector
                 isOpen={isTemplateSelectorOpen}
                 onClose={() => setIsTemplateSelectorOpen(false)}
                 onSelectTemplateBlocks={handleTemplateSelect}
                 blocksCurrentlyExist={blocks.length > 1 || (blocks.length === 1 && (blocks[0]?.type !== 'text' || blocks[0]?.content !== ''))}
                 templateTypeFilter="article"
             />
        </div>
    );
}

