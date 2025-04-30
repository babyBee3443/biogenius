
"use client";

import * as React from "react";
import { notFound, useParams } from 'next/navigation';
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
  History, // Keep for revisions potentially
  MessageSquare, // Keep for comments potentially
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image'; // Keep for image previews
import { TemplateSelector, Block } from "@/components/admin/template-selector"; // Import Block type
import { BlockEditor } from "@/components/admin/block-editor/block-editor"; // Import BlockEditor
import SeoPreview from "@/components/admin/seo-preview"; // Import SEO Preview


// --- Mock Data Fetching ---
// TODO: Replace with actual API calls and data structure
interface ArticleData {
  id: string;
  title: string;
  excerpt: string;
  blocks: Block[]; // New block-based content
  category: 'Teknoloji' | 'Biyoloji';
  status: string;
  mainImageUrl: string | null; // Corresponds to Ana Görsel URL
  seoTitle: string;
  seoDescription: string;
  slug: string;
  isFeatured: boolean;
  keywords: string[];
  canonicalUrl: string;
  // Add other fields like author, createdAt, updatedAt etc.
}

// Mock Function
const getArticleById = async (id: string): Promise<ArticleData | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const articles: ArticleData[] = [
         {
            id: '1',
            title: 'Yapay Zeka Devrimi',
            excerpt: 'AI etkileri ve geleceği üzerine derinlemesine bir bakış.',
            blocks: [
                { id: 'b1', type: 'text', content: 'Yapay zeka (AI), makinelerin öğrenme, problem çözme ve karar verme gibi tipik olarak insan zekası gerektiren görevleri yerine getirme yeteneğidir.' },
                { id: 'b2', type: 'image', url: 'https://picsum.photos/seed/ai-edit/800/400', alt: 'Yapay Zeka Görseli', caption: 'AI teknolojileri gelişiyor.' },
                { id: 'b3', type: 'heading', level: 2, content: 'AI\'nın Etki Alanları' },
                { id: 'b4', type: 'text', content: 'Sağlık hizmetlerinde AI, hastalıkların daha erken teşhis edilmesine yardımcı olmaktadır...' }
            ],
            category: 'Teknoloji',
            status: 'Yayınlandı',
            mainImageUrl: 'https://picsum.photos/seed/ai/600/400',
            seoTitle: 'Yapay Zeka Devrimi | TeknoBiyo',
            seoDescription: 'AI etkileri ve geleceği üzerine derinlemesine bir bakış.',
            slug: 'yapay-zeka-devrimi',
            isFeatured: true,
            keywords: ['ai', 'makine öğrenimi', 'yapay zeka'],
            canonicalUrl: '',
        },
        // Add other articles if needed
    ];
    return articles.find(article => article.id === id) || null;
};


// --- Main Page Component ---

export default function EditArticlePage() {
    const params = useParams();
    const articleId = params.id as string;

    // --- State ---
    const [articleData, setArticleData] = React.useState<ArticleData | null>(null);
    const [loading, setLoading] = React.useState(true);

    const [title, setTitle] = React.useState("");
    const [excerpt, setExcerpt] = React.useState("");
    const [category, setCategory] = React.useState<"Teknoloji" | "Biyoloji" | "">("");
    const [mainImageUrl, setMainImageUrl] = React.useState("");
    const [isFeatured, setIsFeatured] = React.useState(false);
    const [status, setStatus] = React.useState("Taslak");
    const [blocks, setBlocks] = React.useState<Block[]>([]);
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [canonicalUrl, setCanonicalUrl] = React.useState("");

    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = React.useState(false);

    // --- Data Fetching ---
    React.useEffect(() => {
        if (articleId) {
            setLoading(true);
            getArticleById(articleId)
                .then(data => {
                    if (data) {
                        setArticleData(data);
                        // Initialize state from fetched data
                        setTitle(data.title);
                        setExcerpt(data.excerpt);
                        setCategory(data.category);
                        setStatus(data.status);
                        setMainImageUrl(data.mainImageUrl || "");
                        setIsFeatured(data.isFeatured);
                        setBlocks(data.blocks || []); // Initialize with fetched blocks
                        setSeoTitle(data.seoTitle);
                        setSeoDescription(data.seoDescription);
                        setSlug(data.slug);
                        setKeywords(data.keywords || []);
                        setCanonicalUrl(data.canonicalUrl || "");
                    } else {
                        notFound(); // Redirect to 404 if article not found
                    }
                })
                .catch(error => {
                    console.error("Error fetching article:", error);
                    toast({ variant: "destructive", title: "Hata", description: "Makale yüklenirken bir sorun oluştu." });
                })
                .finally(() => setLoading(false));
        }
    }, [articleId]);

     // --- Handlers ---
     const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-').replace(/-+/g, '-');
    };

     // Auto-update slug when title changes (optional)
    React.useEffect(() => {
        if (title && !slug && articleData && title !== articleData.title) { // Only auto-update if slug is empty and title changed
            setSlug(generateSlug(title));
        }
    }, [title, slug, articleData]); // Depend on slug too

     // Auto-generate SEO Title from main title if empty
     React.useEffect(() => {
       if (title && !seoTitle && articleData && title !== articleData.title) {
         setSeoTitle(title);
       }
     }, [title, seoTitle, articleData]);

      // Auto-generate SEO Description from excerpt if empty
     React.useEffect(() => {
        if (excerpt && !seoDescription && articleData && excerpt !== articleData.excerpt) {
          // Simple trim and take first 160 chars
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
            ...(type === 'video' && { url: '' }),
            ...(type === 'quote' && { content: '', citation: '' }),
            ...(type === 'code' && { language: 'javascript', content: '' }),
            ...(type === 'divider' && {}),
        } as Block;
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
         // TODO: Implement actual API call to update the article
         console.log("Updating article:", { articleId, title, excerpt, category, status: finalStatus, mainImageUrl, isFeatured, slug, keywords: keywords.join(','), canonicalUrl, blocks, seoTitle, seoDescription });

         toast({
             title: "Makale Güncellendi",
             description: `"${title}" başlıklı makale başarıyla güncellendi (${finalStatus}).`,
         });
    };

     const handleDelete = () => {
        if (window.confirm(`"${title}" başlıklı makaleyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            console.log("Deleting article:", articleId);
            // TODO: Implement actual API call to delete the article
             toast({
                 variant: "destructive",
                 title: "Makale Silindi",
                 description: `"${title}" başlıklı makale silindi.`,
            });
            // TODO: Redirect to articles list page after deletion
             // router.push('/admin/articles');
        }
    };

     const handleTemplateSelect = (templateBlocks: Block[]) => {
         if (blocks.length > 0) {
            if (!window.confirm("Mevcut içerik bölümlerinin üzerine şablon uygulansın mı? Bu işlem geri alınamaz.")) {
                 setIsTemplateSelectorOpen(false);
                 return;
            }
        }
         // Ensure new unique IDs for blocks from the template
         const newBlocks = templateBlocks.map(block => ({
            ...block,
            id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`
        }));
        setBlocks(newBlocks);
        setIsTemplateSelectorOpen(false);
     };

      const handlePreview = () => {
         const previewData = {
             id: articleId || 'preview', // Use actual ID if available
             title,
             description: excerpt,
             category: category || 'Teknoloji',
             imageUrl: mainImageUrl || 'https://picsum.photos/seed/preview/1200/600',
             blocks,
         };
         try {
             localStorage.setItem('articlePreviewData', JSON.stringify(previewData));
             window.open('/admin/preview', '_blank'); // Open preview in a new tab
         } catch (error) {
             console.error("Error saving preview data to localStorage:", error);
             toast({
                 variant: "destructive",
                 title: "Önizleme Hatası",
                 description: "Önizleme verisi kaydedilemedi.",
             });
         }
     };

     // --- Rendering ---

    if (loading) {
        // TODO: Replace with a proper Skeleton loader for the editor layout
        return <div className="flex justify-center items-center h-screen">Makale yükleniyor...</div>;
    }

    if (!articleData) {
         // Should be handled by notFound(), but as a fallback
         return <div className="text-center py-10">Makale bulunamadı.</div>;
    }


    return (
        <div className="flex flex-col h-full">
             {/* Top Bar */}
             <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-10">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/articles"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                </Button>
                 <h1 className="text-xl font-semibold truncate" title={`Makaleyi Düzenle: ${articleData.title}`}>Makaleyi Düzenle</h1>
                 {/* Action Buttons */}
                <div className="flex items-center gap-2">
                     <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    {/* Add other actions like Revision History here if needed */}
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
                                     <Label htmlFor="title">Makale Başlığı</Label>
                                     <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                 </div>
                                 <div className="space-y-2">
                                     <Label htmlFor="category">Kategori</Label>
                                     <Select value={category} onValueChange={(value) => setCategory(value as "Teknoloji" | "Biyoloji")} required>
                                         <SelectTrigger id="category"><SelectValue /></SelectTrigger>
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
                                 <Select value={status} onValueChange={setStatus}>
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
                               <Button variant="outline" className="w-full justify-center" onClick={handlePreview}>
                                 <Eye className="mr-2 h-4 w-4" /> Önizle
                             </Button>
                              <Button className="w-full" onClick={() => handleSave(status === 'Yayınlandı')}>
                                <Save className="mr-2 h-4 w-4" />
                                {status === 'Yayınlandı' ? 'Güncelle' : 'Kaydet'}
                             </Button>
                             {status !== 'Yayınlandı' && (
                                 <Button className="w-full" onClick={() => handleSave(true)}>
                                     <Upload className="mr-2 h-4 w-4" /> Yayınla
                                 </Button>
                             )}
                         </CardContent>
                      </Card>

                      {/* Keywords moved to main SEO section */}

                      {/* Placeholder for Comments - Keep if still relevant */}
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
