
"use client"; // Essential for hooks like useState, useEffect, useRouter

import * as React from 'react';
import { useRouter, useParams, notFound } from 'next/navigation'; // Import hooks
import Link from 'next/link';
import Image from 'next/image';
import { toast } from "@/hooks/use-toast";
import { TemplateSelector, Block } from "@/components/admin/template-selector";
import { BlockEditor } from "@/components/admin/block-editor/block-editor";
import SeoPreview from "@/components/admin/seo-preview";
import { getArticleById, updateArticle, deleteArticle, type ArticleData, getCategories, type Category } from '@/lib/mock-data'; // Import mock data functions including getCategories
import { useDebouncedCallback } from 'use-debounce'; // Import debounce hook

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
import { ArrowLeft, Eye, Loader2, Save, Trash2, Upload, MessageSquare, Star, Layers } from "lucide-react"; // Added Layers icon for Remove Template

// Helper to generate unique block IDs safely on the client
const generateBlockId = () => `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;
const createDefaultBlock = (): Block => ({ id: generateBlockId(), type: 'text', content: '' });

const PREVIEW_STORAGE_KEY = 'preview_data'; // Fixed key for preview

// --- Main Page Component ---

export default function EditArticlePage() {
    const params = useParams();
    const router = useRouter();
    const articleId = React.use(params.id) as string; // Use React.use for simpler param access

    // --- State ---
    const [articleData, setArticleData] = React.useState<ArticleData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false); // Added saving state
    const [error, setError] = React.useState<string | null>(null); // Added error state
    const [templateApplied, setTemplateApplied] = React.useState(false); // Track if a template has been applied
    const [categories, setCategories] = React.useState<Category[]>([]); // State for categories

    // Form Field States (Sync with articleData on load and save)
    const [title, setTitle] = React.useState("");
    const [excerpt, setExcerpt] = React.useState("");
    const [category, setCategory] = React.useState<ArticleData['category'] | "">("");
    const [mainImageUrl, setMainImageUrl] = React.useState("");
    const [isFeatured, setIsFeatured] = React.useState(false);
    const [isHero, setIsHero] = React.useState(false); // Added isHero state
    const [status, setStatus] = React.useState<ArticleData['status']>("Taslak");
    const [blocks, setBlocks] = React.useState<Block[]>([]); // Initialize empty, create default in effect if needed
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [canonicalUrl, setCanonicalUrl] = React.useState("");

    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = React.useState(false);
    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null); // Added for block editor interaction

    // --- Data Fetching - Delayed until client-side hydration ---
    React.useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!articleId) {
                if (isMounted) {
                    setError("Geçersiz makale ID.");
                    setLoading(false);
                    setBlocks([createDefaultBlock()]);
                }
                return;
            }

             if (isMounted) {
                setLoading(true);
                setError(null);
             }

             try {
                 const [articleResult, categoriesResult] = await Promise.all([
                     getArticleById(articleId),
                     getCategories() // Fetch categories
                 ]);

                 if (isMounted) {
                     setCategories(categoriesResult); // Set categories state

                     if (articleResult) {
                         setArticleData(articleResult);
                         setTitle(articleResult.title);
                         setExcerpt(articleResult.excerpt || '');
                         setCategory(articleResult.category); // Now a string
                         setStatus(articleResult.status);
                         setMainImageUrl(articleResult.mainImageUrl || "");
                         setIsFeatured(articleResult.isFeatured);
                         setIsHero(articleResult.isHero);
                         setBlocks(articleResult.blocks && articleResult.blocks.length > 0 ? articleResult.blocks : [createDefaultBlock()]);
                         setSeoTitle(articleResult.seoTitle || '');
                         setSeoDescription(articleResult.seoDescription || '');
                         setSlug(articleResult.slug);
                         setKeywords(articleResult.keywords || []);
                         setCanonicalUrl(articleResult.canonicalUrl || "");
                         setTemplateApplied(false);
                     } else {
                         setError("Makale bulunamadı.");
                     }
                 }
             } catch (err) {
                 if (isMounted) {
                     console.error("Error fetching data:", err);
                     setError("Veri yüklenirken bir sorun oluştu.");
                     toast({ variant: "destructive", title: "Hata", description: "Makale veya kategori verileri yüklenemedi." });
                 }
             } finally {
                 if (isMounted) {
                     setLoading(false);
                 }
             }
        };

        fetchData();

        return () => { isMounted = false }; // Cleanup function
    }, [articleId]); // Only run when articleId changes

     // --- Handlers ---
     const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-').replace(/-+/g, '-');
    };

     // Auto-update slug when title changes (debounced, respects manual changes)
     const debouncedSetSlug = useDebouncedCallback((newTitle: string, originalTitle: string, currentSlug: string) => {
         if (newTitle && newTitle !== originalTitle) {
             // Check if slug is empty OR if slug matches the slug generated from the *original* title
             if (!currentSlug || currentSlug === generateSlug(originalTitle)) {
                 setSlug(generateSlug(newTitle));
             }
         } else if (newTitle && !currentSlug) { // Generate slug if title exists but slug is empty
            setSlug(generateSlug(newTitle));
         }
     }, 500); // 500ms delay

     React.useEffect(() => {
         if (articleData) { // Only run if articleData is loaded
             debouncedSetSlug(title, articleData.title, slug);
         } else if (title && !slug) { // Handle initial slug generation for potentially new articles (though this is edit page)
            setSlug(generateSlug(title));
         }
     }, [title, articleData, slug, debouncedSetSlug]);

     // Auto-generate SEO Title from main title if empty
     React.useEffect(() => {
       if (title && !seoTitle) { // Simplified: Always sync if seoTitle is empty
         setSeoTitle(title);
       }
     }, [title, seoTitle]);

      // Auto-generate SEO Description from excerpt if empty
     React.useEffect(() => {
        if (excerpt && !seoDescription) { // Simplified: Always sync if seoDescription is empty
          const desc = excerpt.length > 160 ? excerpt.substring(0, 157) + '...' : excerpt;
          setSeoDescription(desc);
        }
     }, [excerpt, seoDescription]);


    const handleAddBlock = (type: Block['type']) => {
        // ID generation happens client-side, safe from hydration issues
        const newBlock: Block = {
            id: generateBlockId(),
            type: type,
            ...(type === 'text' && { content: '' }),
            ...(type === 'heading' && { level: 2, content: '' }),
            ...(type === 'image' && { url: '', alt: '', caption: '' }),
            ...(type === 'gallery' && { images: [] }),
            ...(type === 'video' && { url: '', youtubeId: '' }), // Added youtubeId
            ...(type === 'quote' && { content: '', citation: '' }),
            ...(type === 'code' && { language: 'javascript', content: '' }),
            ...(type === 'divider' && {}),
            ...(type === 'section' && { sectionType: 'custom-text', settings: {} }),
        } as Block;
        setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
        setSelectedBlockId(newBlock.id); // Select the newly added block
        setTemplateApplied(false); // Adding a block manually means template is no longer strictly applied
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks((prevBlocks) => prevBlocks.filter(block => block.id !== id));
        if (selectedBlockId === id) setSelectedBlockId(null); // Deselect if deleted
        setTemplateApplied(false); // Removing a block means template is modified
    };

      // Update block state (generic, used by BlockEditor)
      const handleUpdateBlock = (updatedBlock: Block) => {
          setBlocks(prevBlocks =>
              prevBlocks.map(block =>
                  block.id === updatedBlock.id ? updatedBlock : block
              )
          );
          // Note: Updating content doesn't necessarily mean the template structure changed
          // If order/type changes, templateApplied should be false. Reordering handles this.
      };

      // Reorder blocks (generic, used by BlockEditor)
      const handleReorderBlocks = (reorderedBlocks: Block[]) => {
          setBlocks(reorderedBlocks);
          setTemplateApplied(false); // Reordering breaks the original template structure
      };

    const handleSave = async (publish: boolean = false) => {
        // Determine the status to save based on the 'publish' flag and current status
        let finalStatus = status; // Default to current status

        if (publish && status !== 'Yayınlandı') {
            finalStatus = "Yayınlandı";
        } else if (!publish && status === 'Yayınlandı') {
             // If unpublishing, revert to 'Taslak'
             finalStatus = "Taslak";
        } else if (!publish && status !== 'Yayınlandı') {
             // If saving as draft/review etc. keep the current status
             finalStatus = status;
        }


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

         // Use the most recent articleData from state or fallback to initial if null
         // IMPORTANT: Do not include 'id', 'createdAt', 'authorId' in the update payload itself
         // They are part of the base data but not usually part of what you send for an update.
         const currentData: Partial<ArticleData> = { // Use Partial for update data
            title,
            excerpt: excerpt || "",
            category, // Category is now a string
            status: finalStatus, // Use the determined final status
            mainImageUrl: mainImageUrl || null,
            isFeatured,
            isHero, // Include isHero in save data
            slug: slug, // Use state slug directly
            keywords: keywords || [],
            canonicalUrl: canonicalUrl || "",
            blocks: blocks.length > 0 ? blocks : [createDefaultBlock()], // Use default if empty
            seoTitle: seoTitle || title,
            seoDescription: seoDescription || excerpt.substring(0, 160) || "",
            // 'updatedAt' will be handled by the updateArticle function on the backend/mock
        };

         console.log("[EditArticlePage/handleSave] Preparing to save article:", articleId, "with data:", currentData);
         setSaving(true);

         try {
             const updatedArticle = await updateArticle(articleId, currentData);

             if (updatedArticle) {
                  // Update the main articleData state with the returned saved data
                 setArticleData(updatedArticle);
                  // Re-sync individual form fields with the *response* to ensure consistency
                 setTitle(updatedArticle.title);
                 setExcerpt(updatedArticle.excerpt || '');
                 setCategory(updatedArticle.category); // Ensure category string is updated
                 setStatus(updatedArticle.status); // Ensure status updates visually based on saved data
                 setMainImageUrl(updatedArticle.mainImageUrl || "");
                 setIsFeatured(updatedArticle.isFeatured);
                 setIsHero(updatedArticle.isHero); // Sync isHero after save
                 // Use default block if blocks are empty after save
                 setBlocks(updatedArticle.blocks && updatedArticle.blocks.length > 0 ? updatedArticle.blocks : [createDefaultBlock()]);
                 setSeoTitle(updatedArticle.seoTitle || '');
                 setSeoDescription(updatedArticle.seoDescription || '');
                 setSlug(updatedArticle.slug);
                 setKeywords(updatedArticle.keywords || []);
                 setCanonicalUrl(updatedArticle.canonicalUrl || "");
                 // Keep templateApplied state as is after save, only modification actions reset it
                  console.log("[EditArticlePage/handleSave] Save successful. Updated articleData state:", updatedArticle);
                 toast({
                     title: "Makale Kaydedildi",
                     description: `"${updatedArticle.title}" başlıklı makale başarıyla kaydedildi (${updatedArticle.status}).`,
                 });

             } else {
                  console.error("[EditArticlePage/handleSave] Save failed. API returned no data.");
                  toast({ variant: "destructive", title: "Kaydetme Hatası", description: "Makale kaydedilemedi." });
             }
         } catch (error) {
             console.error("[EditArticlePage/handleSave] Error during save:", error);
             toast({ variant: "destructive", title: "Kaydetme Hatası", description: "Makale kaydedilirken bir hata oluştu." });
         } finally {
             setSaving(false);
         }
    };

     const handleDelete = async () => {
        if (window.confirm(`"${title}" başlıklı makaleyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            setSaving(true); // Indicate deletion in progress
            try {
                const success = await deleteArticle(articleId);
                if (success) {
                    toast({
                        variant: "destructive",
                        title: "Makale Silindi",
                        description: `"${title}" başlıklı makale silindi.`,
                    });
                    router.push('/admin/articles'); // Redirect after successful deletion
                } else {
                     toast({ variant: "destructive", title: "Silme Hatası", description: "Makale silinemedi." });
                     setSaving(false);
                }
             } catch (error) {
                 console.error("Error deleting article:", error);
                 toast({ variant: "destructive", title: "Silme Hatası", description: "Makale silinirken bir hata oluştu." });
                 setSaving(false);
             }
        }
    };

     const handleTemplateSelect = (templateBlocks: Block[]) => {
        // Confirmation logic is handled inside TemplateSelector's onSelect now
        // Generate new IDs for template blocks safely on the client
         const newBlocks = templateBlocks.map(block => ({
            ...block,
            id: generateBlockId()
        }));
        setBlocks(newBlocks);
        setTemplateApplied(true); // Mark that a template was applied
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

        const previewData: Partial<ArticleData> = {
            id: articleId || 'preview_edit', // Use 'preview_edit' for existing article edits
            title: title || 'Başlıksız Makale',
            excerpt: excerpt || '',
            category: category, // Category is a string
            mainImageUrl: mainImageUrl || 'https://picsum.photos/seed/preview/1200/600',
            blocks,
            status: status,
            isFeatured: isFeatured,
            isHero: isHero,
            authorId: articleData?.authorId || 'mock-admin',
            createdAt: articleData?.createdAt || new Date().toISOString(),
            seoTitle: seoTitle || title,
            seoDescription: seoDescription || excerpt.substring(0, 160) || "",
            slug: slug || generateSlug(title),
            keywords: keywords || [],
            canonicalUrl: canonicalUrl || "",
        };

        console.log(`[EditArticlePage/handlePreview] Preparing to save preview data with key: ${PREVIEW_STORAGE_KEY}`);
        console.log(`[EditArticlePage/handlePreview] Preview Data:`, previewData); // Log the data being saved

        try {
            const stringifiedData = JSON.stringify(previewData);
            console.log(`[EditArticlePage/handlePreview] Stringified data length: ${stringifiedData.length}`);

            localStorage.setItem(PREVIEW_STORAGE_KEY, stringifiedData);
            console.log(`[EditArticlePage/handlePreview] Successfully called localStorage.setItem for key: ${PREVIEW_STORAGE_KEY}`);

            // --- Verification Steps ---
            const storedData = localStorage.getItem(PREVIEW_STORAGE_KEY);
            if (storedData) {
                console.log(`[EditArticlePage/handlePreview] Verification 1 SUCCESS: Data found in localStorage. Length: ${storedData.length}`);
                try {
                    const parsed = JSON.parse(storedData);
                    console.log(`[EditArticlePage/handlePreview] Verification 2 SUCCESS: Data parsed successfully. Title: ${parsed.title}`);
                } catch (parseError: any) {
                     console.error(`[EditArticlePage/handlePreview] Verification 2 FAILED: Could not parse stored JSON.`, parseError);
                     throw new Error(`Verification failed: Data for key ${PREVIEW_STORAGE_KEY} is not valid JSON: ${parseError.message}`);
                }
            } else {
                console.error(`[EditArticlePage/handlePreview] Verification 1 FAILED: No data found for key ${PREVIEW_STORAGE_KEY}.`);
                throw new Error(`Verification failed: No data found for key ${PREVIEW_STORAGE_KEY}.`);
            }
            // --- End Verification Steps ---

            // Simplified URL - Preview page will read from the fixed key
            const previewUrl = `/admin/preview`;
            console.log(`[EditArticlePage/handlePreview] Opening preview window with URL: ${previewUrl}`);

            // Add a small delay before opening the window - helps ensure localStorage is written
            setTimeout(() => {
                 const newWindow = window.open(previewUrl, '_blank');
                 if (!newWindow) {
                      console.error("[EditArticlePage/handlePreview] Failed to open preview window. Pop-up blocker might be active.");
                      toast({
                          variant: "destructive",
                          title: "Önizleme Penceresi Açılamadı",
                          description: "Lütfen tarayıcınızın pop-up engelleyicisini kontrol edin.",
                          duration: 10000,
                      });
                 } else {
                      console.log("[EditArticlePage/handlePreview] Preview window opened successfully after delay.");
                 }
            }, 150); // 150ms delay

        } catch (error: any) {
            console.error("[EditArticlePage/handlePreview] Error during preview process:", error);
            toast({
                variant: "destructive",
                title: "Önizleme Hatası",
                description: `Önizleme verisi kaydedilemedi veya doğrulanamadı: ${error.message}`,
                duration: 10000,
            });
        }
    };


      // --- Block Selection Handler ---
     const handleBlockSelect = (id: string | null) => {
         setSelectedBlockId(id);
         // Optional: Scroll to the selected block in the editor view if needed
     };

     // --- Revert to Draft Handler ---
     const handleRevertToDraft = () => {
        // Set status state to 'Taslak' immediately for visual feedback
        setStatus('Taslak');
        // Trigger save with publish=false to update the backend/mock
        handleSave(false); // Pass false to indicate saving as draft
     };


     // --- Rendering ---

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                Makale yükleniyor...
            </div>
        );
    }

    if (error) {
         return <div className="text-center py-10 text-destructive">{error}</div>;
    }

    if (!articleData && !loading) { // Show not found if loading is finished and articleData is still null
         return <div className="text-center py-10">Makale bulunamadı veya yüklenemedi.</div>;
    }


    return (
        <div className="flex flex-col h-full">
             {/* Top Bar */}
             <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-10">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/articles"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                </Button>
                 <h1 className="text-xl font-semibold truncate" title={`Makaleyi Düzenle: ${title || 'Yeni Makale'}`}>
                    {articleData ? `Makaleyi Düzenle` : 'Yeni Makale'}
                </h1>
                <div className="flex items-center gap-2">
                     {articleData && ( // Only show delete for existing articles
                        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      )}
                    {/* <Button variant="outline" size="sm"><History className="mr-2 h-4 w-4"/> Revizyonlar</Button> */}
                </div>
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
                                     <Label htmlFor="title">Makale Başlığı <span className="text-destructive">*</span></Label>
                                     <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                 </div>
                                 <div className="space-y-2">
                                     <Label htmlFor="category">Kategori <span className="text-destructive">*</span></Label>
                                     <Select value={category} onValueChange={(value) => setCategory(value)} required> {/* Set string value */}
                                         <SelectTrigger id="category">
                                             <SelectValue placeholder="Kategori seçin" />
                                         </SelectTrigger>
                                         <SelectContent>
                                             {categories.length === 0 && <SelectItem value="loading_placeholder" disabled>Yükleniyor...</SelectItem>}
                                             {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                             ))}
                                             {/* Option to add new category? Maybe link to categories page */}
                                         </SelectContent>
                                     </Select>
                                 </div>
                             </div>
                              <div className="space-y-2">
                                 <Label htmlFor="excerpt">Özet</Label>
                                 <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
                             </div>
                             <div className="space-y-2">
                                 <Label htmlFor="main-image-url">Ana Görsel URL</Label>
                                 <div className="flex gap-2">
                                      <Input id="main-image-url" value={mainImageUrl ?? ""} onChange={(e) => setMainImageUrl(e.target.value)} placeholder="https://..."/>
                                      <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> Yükle</Button>
                                 </div>
                                 {mainImageUrl && (
                                     <div className="mt-2 rounded border p-2 w-fit">
                                         <Image src={mainImageUrl} alt="Ana Görsel Önizleme" width={200} height={100} className="object-cover rounded" data-ai-hint="article cover placeholder"/>
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

                          {/* Template Tab */}
                         <TabsContent value="template">
                             <p className="text-muted-foreground">Şablon seçmek için yukarıdaki "Şablon" sekmesine tıklayın.</p>
                         </TabsContent>

                         {/* Media Tab */}
                         <TabsContent value="media">
                              <Card>
                                  <CardHeader>
                                     <CardTitle>Medya Yönetimi</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                      <p className="text-muted-foreground">Medya kütüphanesi burada yer alacak.</p>
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
                                             <Label htmlFor="slug">URL Metni (Slug) <span className="text-destructive">*</span></Label>
                                             <Input
                                                 id="slug"
                                                 value={slug}
                                                 onChange={(e) => setSlug(generateSlug(e.target.value))}
                                                 placeholder="makale-basligi-url"
                                                 required
                                             />
                                             <p className="text-xs text-muted-foreground">Makalenin URL'si.</p>
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

                  {/* Right Sidebar */}
                  <aside className="w-72 border-l bg-card p-6 overflow-y-auto space-y-6 hidden lg:block">
                      <Card>
                         <CardHeader><CardTitle>Durum</CardTitle></CardHeader>
                         <CardContent className="space-y-4">
                              <div className="space-y-2">
                                 <Label htmlFor="status">Yayın Durumu</Label>
                                 {/* Use the status from the component state */}
                                 <Select value={status} onValueChange={(value) => setStatus(value as ArticleData['status'])}>
                                     <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                                     <SelectContent>
                                         <SelectItem value="Taslak">Taslak</SelectItem>
                                         <SelectItem value="İncelemede">İncelemede</SelectItem>
                                         <SelectItem value="Yayınlandı">Yayınlandı</SelectItem>
                                         <SelectItem value="Arşivlendi">Arşivlendi</SelectItem>
                                     </SelectContent>
                                 </Select>
                             </div>
                              <Separator />
                               <Button variant="outline" className="w-full justify-center" onClick={handlePreview} disabled={saving}>
                                 <Eye className="mr-2 h-4 w-4" /> Önizle
                             </Button>
                              <Button className="w-full" onClick={() => handleSave(false)} disabled={saving || !slug}> {/* Save as draft/current status, disable if no slug */}
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Kaydet
                             </Button>
                             {/* Show publish button only if the current status is not 'Yayınlandı' */}
                             {status !== 'Yayınlandı' && (
                                 <Button className="w-full" onClick={() => handleSave(true)} disabled={saving || !slug}> {/* Disable if no slug */}
                                     {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                     Yayınla
                                 </Button>
                             )}
                              {/* Show revert to draft button only if currently 'Yayınlandı' */}
                              {status === 'Yayınlandı' && (
                                <Button variant="outline" className="w-full" onClick={handleRevertToDraft} disabled={saving}>
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowLeft className="mr-2 h-4 w-4" />}
                                    Taslağa Geri Al
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

                      {/* Placeholder for Comments */}
                       <Card>
                          <CardHeader>
                             <CardTitle>Yorumlar</CardTitle>
                             <CardDescription>Bu makaleye yapılan yorumlar.</CardDescription>
                          </CardHeader>
                          <CardContent>
                              <p className="text-sm text-muted-foreground">Yorum yönetimi burada olacak.</p>
                              <Button variant="outline" size="sm" className="mt-4"><MessageSquare className="mr-2 h-4 w-4" /> Yorumları Yönet</Button>
                          </CardContent>
                       </Card>
                  </aside>
              </div>

              {/* Template Selector Modal */}
              <TemplateSelector
                  isOpen={isTemplateSelectorOpen}
                  onClose={() => setIsTemplateSelectorOpen(false)}
                  onSelectTemplateBlocks={handleTemplateSelect}
                  blocksCurrentlyExist={blocks.length > 1 || (blocks.length === 1 && (blocks[0]?.type !== 'text' || blocks[0]?.content !== ''))} // Check if blocks have actual content
              />
         </div>
    );
}

