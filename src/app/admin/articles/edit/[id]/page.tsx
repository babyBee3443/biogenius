
"use client";

import * as React from "react";
import { notFound, useParams, useRouter } from 'next/navigation'; // Added useRouter
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
  Trash2,
  History,
  MessageSquare,
  Loader2, // Added Loader for saving state
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';
import { TemplateSelector, Block } from "@/components/admin/template-selector";
import { BlockEditor } from "@/components/admin/block-editor/block-editor";
import SeoPreview from "@/components/admin/seo-preview";
import { useDebouncedCallback } from 'use-debounce';
import { getArticleById, updateArticle, deleteArticle, type ArticleData } from '@/lib/mock-data'; // Import mock data functions

// --- Main Page Component ---

export default function EditArticlePage() {
    const params = useParams();
    const router = useRouter();
    const articleId = params.id as string;

    // --- State ---
    const [articleData, setArticleData] = React.useState<ArticleData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false); // Added saving state
    const [error, setError] = React.useState<string | null>(null); // Added error state

    // Form Field States (Sync with articleData on load and save)
    const [title, setTitle] = React.useState("");
    const [excerpt, setExcerpt] = React.useState("");
    const [category, setCategory] = React.useState<ArticleData['category'] | "">("");
    const [mainImageUrl, setMainImageUrl] = React.useState("");
    const [isFeatured, setIsFeatured] = React.useState(false);
    const [status, setStatus] = React.useState<ArticleData['status']>("Taslak");
    const [blocks, setBlocks] = React.useState<Block[]>([]);
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [canonicalUrl, setCanonicalUrl] = React.useState("");

    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = React.useState(false);
    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null); // Added for block editor interaction

    // --- Data Fetching ---
    React.useEffect(() => {
        let isMounted = true;
        if (articleId) {
            setLoading(true);
            setError(null); // Reset error on new fetch
            getArticleById(articleId)
                .then(data => {
                    if (isMounted) {
                        if (data) {
                            setArticleData(data); // Store fetched data
                            // Sync form state with fetched data
                            setTitle(data.title);
                            setExcerpt(data.excerpt || '');
                            setCategory(data.category);
                            setStatus(data.status);
                            setMainImageUrl(data.mainImageUrl || "");
                            setIsFeatured(data.isFeatured);
                            setBlocks(data.blocks || []);
                            setSeoTitle(data.seoTitle || '');
                            setSeoDescription(data.seoDescription || '');
                            setSlug(data.slug);
                            setKeywords(data.keywords || []);
                            setCanonicalUrl(data.canonicalUrl || "");
                        } else {
                            setError("Makale bulunamadı.");
                            // Consider using notFound() here, but might cause issues if API call fails temporarily
                            // notFound();
                        }
                    }
                })
                .catch(err => {
                    if (isMounted) {
                        console.error("Error fetching article:", err);
                        setError("Makale yüklenirken bir sorun oluştu.");
                        toast({ variant: "destructive", title: "Hata", description: "Makale yüklenirken bir sorun oluştu." });
                    }
                })
                .finally(() => {
                    if (isMounted) {
                        setLoading(false);
                    }
                });
        } else {
            setError("Geçersiz makale ID.");
            setLoading(false);
        }
        return () => { isMounted = false }; // Cleanup function
    }, [articleId]);

     // --- Handlers ---
     const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-').replace(/-+/g, '-');
    };

     // Auto-update slug when title changes (only if slug hasn't been manually changed or matches old slug)
    React.useEffect(() => {
        if (title && articleData && title !== articleData.title) {
             // Check if slug is empty OR if slug matches the slug generated from the *original* title
             if (!slug || slug === generateSlug(articleData.title)) {
                 setSlug(generateSlug(title));
             }
        } else if (title && !slug) { // Generate slug if title exists but slug is empty (e.g., on initial load from incomplete data)
            setSlug(generateSlug(title));
        }
    }, [title, articleData, slug]); // Depend on slug

     // Auto-generate SEO Title from main title if empty
     React.useEffect(() => {
       if (title && !seoTitle && articleData && title !== articleData.title) {
         setSeoTitle(title);
       }
     }, [title, seoTitle, articleData]);

      // Auto-generate SEO Description from excerpt if empty
     React.useEffect(() => {
        if (excerpt && !seoDescription && articleData && excerpt !== articleData.excerpt) {
          const desc = excerpt.length > 160 ? excerpt.substring(0, 157) + '...' : excerpt;
          setSeoDescription(desc);
        }
     }, [excerpt, seoDescription, articleData]);


    const handleAddBlock = (type: Block['type']) => {
        const newBlock: Block = {
            id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`,
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
        setBlocks([...blocks, newBlock]);
        setSelectedBlockId(newBlock.id); // Select the newly added block
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks(blocks.filter(block => block.id !== id));
        if (selectedBlockId === id) setSelectedBlockId(null); // Deselect if deleted
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

     // Debounced save function
     const debouncedSave = useDebouncedCallback(
        async (dataToSave: ArticleData): Promise<ArticleData | null> => { // Return updated data or null
            setSaving(true);
            try {
                const updated = await updateArticle(dataToSave.id, dataToSave);
                if (updated) {
                     toast({
                         title: "Makale Kaydedildi",
                         description: `"${updated.title}" başlıklı makale başarıyla kaydedildi (${updated.status}).`,
                     });
                     return updated; // Return the updated data on success
                } else {
                     toast({ variant: "destructive", title: "Kaydetme Hatası", description: "Makale kaydedilemedi." });
                     return null;
                }
            } catch (error) {
                console.error("Error saving article:", error);
                toast({ variant: "destructive", title: "Kaydetme Hatası", description: "Makale kaydedilirken bir hata oluştu." });
                return null; // Return null on error
            } finally {
                setSaving(false);
            }
        },
        1000 // Debounce time in ms (e.g., 1 second)
    );


    const handleSave = async (publish: boolean = false) => { // Make handleSave async
        const finalStatus = publish ? "Yayınlandı" : status;
        if (!category) {
             toast({ variant: "destructive", title: "Eksik Bilgi", description: "Lütfen bir kategori seçin." });
             return;
        }
        if (!title) {
             toast({ variant: "destructive", title: "Eksik Bilgi", description: "Lütfen makale başlığını girin." });
             return;
        }

         // Use the most recent articleData from state or fallback to initial if null
         const baseData = articleData || { id: articleId, createdAt: new Date().toISOString(), authorId: 'mock-admin' };

         const currentData: ArticleData = {
            ...baseData, // Spread existing data (like id, createdAt, authorId)
            title,
            excerpt: excerpt || "",
            category,
            status: finalStatus, // Use the final determined status
            mainImageUrl: mainImageUrl || null,
            isFeatured,
            slug: slug || generateSlug(title),
            keywords: keywords || [],
            canonicalUrl: canonicalUrl || "",
            blocks: blocks || [],
            seoTitle: seoTitle || title,
            seoDescription: seoDescription || excerpt.substring(0, 160) || "",
            updatedAt: new Date().toISOString(), // Always set current update time
        };

         console.log("Preparing to save:", currentData);

         // Call debounced save and wait for the result
         const savedArticle = await debouncedSave(currentData);

         if (savedArticle) {
             // Update the main articleData state with the returned saved data
             setArticleData(savedArticle);
             // Optionally re-sync individual form fields if necessary, though usually
             // relying on articleData should be sufficient if components rerender based on it.
             // Example: setStatus(savedArticle.status);
         }

         if (publish && !saving) { // Show immediate feedback for publish action if not currently saving
             toast({
                 title: "Makale Yayınlanıyor...",
                 description: `"${title}" başlıklı makale yayınlanmak üzere kaydediliyor.`,
             });
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
         if (blocks.length > 0 && blocks.some(b => (b.type === 'text' && b.content !== '') || b.type !== 'text')) { // Check if there's actual content
            if (!window.confirm("Mevcut içerik bölümlerinin üzerine şablon uygulansın mı? Bu işlem geri alınamaz.")) {
                 setIsTemplateSelectorOpen(false);
                 return;
            }
        }
         const newBlocks = templateBlocks.map(block => ({
            ...block,
            id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`
        }));
        setBlocks(newBlocks);
        setIsTemplateSelectorOpen(false);
        toast({ title: "Şablon Uygulandı", description: "Seçilen şablon içeriğe başarıyla uygulandı." });
     };

      const handlePreview = () => {
         if (!category) {
             toast({ variant: "destructive", title: "Önizleme Hatası", description: "Lütfen önizlemeden önce bir kategori seçin." });
             return;
         }
         const previewData = {
             id: articleId || 'preview',
             title: title || 'Başlıksız Makale',
             description: excerpt || '',
             category: category, // Use selected category
             imageUrl: mainImageUrl || 'https://picsum.photos/seed/preview/1200/600',
             blocks,
         };
         try {
             localStorage.setItem('articlePreviewData', JSON.stringify(previewData));
             window.open('/admin/preview', '_blank');
         } catch (error) {
             console.error("Error saving preview data to localStorage:", error);
             toast({
                 variant: "destructive",
                 title: "Önizleme Hatası",
                 description: "Önizleme verisi kaydedilemedi.",
             });
         }
     };

      // --- Block Selection Handler ---
     const handleBlockSelect = (id: string | null) => {
         setSelectedBlockId(id);
         // Optional: Scroll to the selected block in the editor view if needed
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

    if (!articleData) {
         // Should be handled by error state, but as a fallback
         return <div className="text-center py-10">Makale bulunamadı veya yüklenemedi.</div>;
    }


    return (
        <div className="flex flex-col h-full">
             {/* Top Bar */}
             <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-10">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/articles"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                </Button>
                 <h1 className="text-xl font-semibold truncate" title={`Makaleyi Düzenle: ${articleData.title}`}>Makaleyi Düzenle</h1>
                <div className="flex items-center gap-2">
                     <Button variant="destructive" size="sm" onClick={handleDelete} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
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
                                     <Select value={category} onValueChange={(value) => setCategory(value as ArticleData['category'])} required>
                                         <SelectTrigger id="category">
                                             <SelectValue placeholder="Kategori seçin" />
                                         </SelectTrigger>
                                         <SelectContent>
                                             <SelectItem value="Teknoloji">Teknoloji</SelectItem>
                                             <SelectItem value="Biyoloji">Biyoloji</SelectItem>
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
                                             <Label htmlFor="slug">URL Metni (Slug)</Label>
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
                                              category={category || "kategori"}
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
                                 {/* Use the status from the latest articleData state */}
                                 <Select value={articleData?.status ?? status} onValueChange={(value) => setStatus(value as ArticleData['status'])}>
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
                              <Button className="w-full" onClick={() => handleSave(false)} disabled={saving}> {/* Pass false explicitly */}
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Kaydet
                             </Button>
                             {/* Show publish button only if the current status is not 'Yayınlandı' */}
                             {(articleData?.status ?? status) !== 'Yayınlandı' && (
                                 <Button className="w-full" onClick={() => handleSave(true)} disabled={saving}>
                                     {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                     Yayınla
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
              />
         </div>
    );
}
