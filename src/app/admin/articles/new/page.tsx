
"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from "@/hooks/use-toast";
import { TemplateSelector, Block } from "@/components/admin/template-selector";
import { BlockEditor } from "@/components/admin/block-editor/block-editor";
import SeoPreview from "@/components/admin/seo-preview";
import { useDebouncedCallback } from 'use-debounce';
import { createArticle, type ArticleData, getCategories, type Category, ARTICLE_STORAGE_KEY } from '@/lib/data/articles'; // Changed mock-data to data/articles
import { generateSlug as generateSlugUtil } from '@/lib/utils'; // Corrected import path for generateSlug
import { usePermissions } from "@/hooks/usePermissions";


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
import { ArrowLeft, Eye, Loader2, Save, Upload, Star, Layers, FileText } from "lucide-react";

const generateBlockId = () => `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;
const createDefaultBlock = (): Block => ({ id: generateBlockId(), type: 'text', content: '' });

const PREVIEW_STORAGE_KEY = 'preview_data'; 

export default function NewArticlePage() {
    const router = useRouter();
    const { hasPermission, isLoading: permissionsLoading } = usePermissions();

    const [saving, setSaving] = React.useState(false);
    const [templateApplied, setTemplateApplied] = React.useState(false);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = React.useState(true);

    const [title, setTitle] = React.useState("");
    const [excerpt, setExcerpt] = React.useState("");
    const [category, setCategory] = React.useState<ArticleData['category'] | "">("");
    const [mainImageUrl, setMainImageUrl] = React.useState("");
    const [isFeatured, setIsFeatured] = React.useState(false);
    const [isHero, setIsHero] = React.useState(false);
    const [status, setStatus] = React.useState<ArticleData['status']>("Taslak");

    const [blocks, setBlocks] = React.useState<Block[]>([]);

    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [canonicalUrl, setCanonicalUrl] = React.useState("");

    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = React.useState(false);
    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null);
    const mainImageInputRef = React.useRef<HTMLInputElement>(null);

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

     }, [permissionsLoading, hasPermission, router, blocks.length]);

     const debouncedSetSlug = useDebouncedCallback((newTitle: string) => {
         if (newTitle) {
             setSlug(generateSlugUtil(newTitle));
         } else {
             setSlug('');
         }
     }, 500);

     React.useEffect(() => {
         debouncedSetSlug(title);
     }, [title, debouncedSetSlug]);

    React.useEffect(() => {
      if (title && !seoTitle) {
        setSeoTitle(title);
      }
    }, [title, seoTitle]);

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
            ...(type === 'video' && { url: '', youtubeId: '' }),
            ...(type === 'quote' && { content: '', citation: '' }),
             ...(type === 'divider' && {}),
             ...(type === 'section' && { sectionType: 'custom-text', settings: {} }),
        } as Block;
        setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
        setSelectedBlockId(newBlock.id);
        setTemplateApplied(false);
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks((prevBlocks) => prevBlocks.filter(block => block.id !== id));
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

    const handleSave = async (publish: boolean = false) => {
         let finalStatus = status;

        if (publish && status !== 'Yayınlandı') {
            finalStatus = "Yayınlandı";
        } else if (!publish && status === 'Yayınlandı') {
             finalStatus = "Hazır";
        } else if (!publish && (status === 'Taslak' || status === 'İncelemede')) {
            finalStatus = status;
        } else if (status === 'Hazır' && publish) {
            finalStatus = "Yayınlandı";
        } else if (status === 'Hazır' && !publish) {
            finalStatus = "Hazır";
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

         setSaving(true);

         const newArticleData: Omit<ArticleData, 'id' | 'createdAt' | 'updatedAt'> = {
             title,
             excerpt: excerpt || "",
             category,
             status: finalStatus,
             mainImageUrl: mainImageUrl || null,
             isFeatured,
             isHero,
             slug: slug || generateSlugUtil(title),
             keywords: keywords || [],
             canonicalUrl: canonicalUrl || "",
             blocks: blocks.length > 0 ? blocks : [createDefaultBlock()],
             seoTitle: seoTitle || title,
             seoDescription: seoDescription || excerpt.substring(0, 160) || "",
             authorId: 'admin001', // Default or logged-in user ID
         };

         try {
             const newArticle = await createArticle(newArticleData);
             if (newArticle) {
                 toast({
                     title: "Makale Oluşturuldu",
                     description: `"${newArticle.title}" başlıklı makale başarıyla oluşturuldu (${newArticle.status}).`,
                 });
                  router.push(`/admin/articles/edit/${newArticle.id}`);
             } else {
                  toast({ variant: "destructive", title: "Oluşturma Hatası", description: "Makale oluşturulamadı." });
                  setSaving(false);
             }
         } catch (error) {
             toast({ variant: "destructive", title: "Oluşturma Hatası", description: "Makale oluşturulurken bir hata oluştu." });
             setSaving(false);
         }
    };

     const handleTemplateSelect = (templateBlocks: Block[]) => {
         const newBlocks = templateBlocks.map(block => ({
             ...block,
             id: generateBlockId()
         }));
         setBlocks(newBlocks);
         setTemplateApplied(true);
         setIsTemplateSelectorOpen(false);
         toast({ title: "Şablon Uygulandı", description: "Seçilen şablon içeriğe başarıyla uygulandı." });
     };

     const handleRemoveTemplate = () => {
         if (window.confirm("Mevcut içeriği kaldırıp varsayılan boş metin bloğuna dönmek istediğinizden emin misiniz?")) {
             setBlocks([createDefaultBlock()]);
             setTemplateApplied(false);
             setSelectedBlockId(null);
             toast({ title: "Şablon Kaldırıldı", description: "İçerik varsayılan boş metin bloğuna döndürüldü." });
         }
     };


     const handlePreview = () => {
        if (typeof window === 'undefined') return;

        if (!category) {
            toast({ variant: "destructive", title: "Önizleme Hatası", description: "Lütfen önizlemeden önce bir kategori seçin." });
            return;
        }

        const previewData: Partial<ArticleData> & { previewType: 'article' } = {
            previewType: 'article',
            id: 'preview_new_article', 
            title: title || 'Başlıksız Makale',
            excerpt: excerpt || '',
            category: category,
            mainImageUrl: mainImageUrl || 'https://placehold.co/1200x600.png', // Updated placeholder
            blocks,
            isFeatured: isFeatured,
            isHero: isHero,
            status: status,
            authorId: 'admin001', 
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            seoTitle: seoTitle || title,
            seoDescription: seoDescription || excerpt.substring(0, 160) || "",
            slug: slug || generateSlugUtil(title),
            keywords: keywords || [],
            canonicalUrl: canonicalUrl || "",
        };
        
        console.log(`[NewArticlePage/handlePreview] Preparing to save preview data to localStorage with key: ${PREVIEW_STORAGE_KEY}`);
        console.log("[NewArticlePage/handlePreview] Preview Data before stringify:", previewData);

        if (!previewData || Object.keys(previewData).length === 0 || !previewData.previewType) {
            console.error("[NewArticlePage/handlePreview] Error: Preview data is empty or invalid before stringifying.", previewData);
            toast({ variant: "destructive", title: "Önizleme Hatası", description: "Oluşturulacak önizleme verisi boş veya geçersiz." });
            return;
        }
        
        try {
            const stringifiedData = JSON.stringify(previewData);
            console.log("[NewArticlePage/handlePreview] Stringified data:", stringifiedData.substring(0, 200) + "..."); // Log part of stringified data
            if (!stringifiedData || stringifiedData === 'null' || stringifiedData === '{}') {
                 console.error("[NewArticlePage/handlePreview] Error: Stringified preview data is empty or null.");
                 toast({ variant: "destructive", title: "Önizleme Hatası", description: "Önizleme verisi oluşturulamadı (boş veri)." });
                 return;
            }
            localStorage.setItem(PREVIEW_STORAGE_KEY, stringifiedData);
            console.log(`[NewArticlePage/handlePreview] Successfully called localStorage.setItem for key: ${PREVIEW_STORAGE_KEY}`);
            
            // Verification step
            const checkStoredData = localStorage.getItem(PREVIEW_STORAGE_KEY);
            console.log(`[NewArticlePage/handlePreview] Verification - Data retrieved from localStorage for key '${PREVIEW_STORAGE_KEY}':`, checkStoredData ? checkStoredData.substring(0,200) + "..." : "NULL");

            if (!checkStoredData || checkStoredData === 'null' || checkStoredData === 'undefined') {
                 console.error(`[NewArticlePage/handlePreview] Verification FAILED: No data found (or data is 'null'/'undefined') for key ${PREVIEW_STORAGE_KEY} immediately after setItem.`);
                 throw new Error("Verification failed: No data found in localStorage after setItem.");
            }
            const parsedVerify = JSON.parse(checkStoredData);
            if (!parsedVerify || parsedVerify.previewType !== 'article') {
                console.error(`[NewArticlePage/handlePreview] Verification FAILED: Invalid data structure or previewType in localStorage after setItem. Parsed:`, parsedVerify);
                throw new Error("Verification failed: Invalid data structure in localStorage after setItem.");
            }
            console.log("[NewArticlePage/handlePreview] Verification SUCCESS after setItem");

            const previewUrl = `/admin/preview`; 
            console.log(`[NewArticlePage/handlePreview] Opening preview window with URL: ${previewUrl}`);

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
                    console.log("[NewArticlePage/handlePreview] Preview window opened successfully.");
                }
            }, 300); 

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

    const handleMainImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) { // Max 5MB
            toast({ variant: "destructive", title: "Dosya Çok Büyük", description: "Lütfen 5MB'den küçük bir resim dosyası seçin." });
            return;
          }
          if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type)) {
            toast({ variant: "destructive", title: "Geçersiz Dosya Türü", description: "Lütfen PNG, JPG, GIF veya WEBP formatında bir resim seçin." });
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            setMainImageUrl(reader.result as string);
            toast({ title: "Ana Görsel Yüklendi (Önizleme)", description: "Değişiklikleri kaydetmeyi unutmayın." });
          };
          reader.readAsDataURL(file);
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
             <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-10">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/articles"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                </Button>
                <h1 className="text-xl font-semibold">Yeni Makale Oluştur</h1>
                <div className="w-20"></div> {/* Spacer to balance title */}
            </div>

             <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <Tabs defaultValue="content">
                        <TabsList className="mb-6">
                            <TabsTrigger value="content">İçerik</TabsTrigger>
                            <TabsTrigger value="template" onClick={() => setIsTemplateSelectorOpen(true)}>Şablon Seç</TabsTrigger>
                            <TabsTrigger value="media">Medya</TabsTrigger>
                            <TabsTrigger value="seo">SEO</TabsTrigger>
                            <TabsTrigger value="guide">Kullanım Kılavuzu</TabsTrigger>
                        </TabsList>

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
                                             ) : categories.length === 0 ? (
                                                <SelectItem value="no_categories_placeholder" disabled>Kategori bulunamadı.</SelectItem>
                                             ) : (
                                                categories.map(cat => (
                                                   <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                                ))
                                             )}
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
                                     <Input 
                                        id="main-image-url" 
                                        value={mainImageUrl.startsWith('data:') ? '(Yerel Dosya Yüklendi)' : mainImageUrl} 
                                        onChange={(e) => setMainImageUrl(e.target.value)} 
                                        placeholder="https://... veya dosya yükleyin"
                                        disabled={mainImageUrl.startsWith('data:')}
                                    />
                                     <Button variant="outline" onClick={() => mainImageInputRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4"/> Yükle
                                     </Button>
                                     <input
                                        type="file"
                                        ref={mainImageInputRef}
                                        className="hidden"
                                        onChange={handleMainImageFileChange}
                                        accept="image/png, image/jpeg, image/gif, image/webp"
                                     />
                                </div>
                                {mainImageUrl && (
                                    <div className="mt-2 rounded border p-2 w-fit">
                                        <Image
                                            src={mainImageUrl}
                                            alt="Ana Görsel Önizleme"
                                            width={200}
                                            height={100}
                                            className="object-cover rounded max-h-[150px]"
                                            data-ai-hint="article cover placeholder"
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-4 pt-2">
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

                         <TabsContent value="template">
                             <p className="text-muted-foreground">Şablon seçmek için yukarıdaki "Şablon Seç" sekmesine tıklayın.</p>
                        </TabsContent>

                        <TabsContent value="media">
                             <Card>
                                 <CardHeader>
                                    <CardTitle>Medya Yönetimi</CardTitle>
                                    <CardDescription>Mevcut medyaları yönetin veya yenilerini yükleyin.</CardDescription>
                                 </CardHeader>
                                 <CardContent>
                                     <p className="text-muted-foreground">Medya kütüphanesi burada yer alacak.</p>
                                     {/* Placeholder for future media library upload button */}
                                     {/* <Button className="mt-4"><Upload className="mr-2 h-4 w-4"/> Medya Yükle</Button> */}
                                 </CardContent>
                             </Card>
                        </TabsContent>

                        <TabsContent value="seo">
                             <Card>
                                 <CardHeader>
                                    <CardTitle>SEO Ayarları</CardTitle>
                                    <CardDescription>Makalenizin arama motorlarında nasıl görüneceğini optimize edin.</CardDescription>
                                 </CardHeader>
                                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                                 placeholder="https://biyohox.com/orijinal-makale-url"
                                             />
                                             <p className="text-xs text-muted-foreground">İçerik aynı olan başka bir URL varsa ekleyin.</p>
                                         </div>
                                     </div>

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
                         <TabsContent value="guide">
                             <Card>
                                 <CardHeader>
                                     <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> Kullanım Kılavuzu: Yeni Makale</CardTitle>
                                     <CardDescription>Bu sayfadaki alanları ve özellikleri nasıl kullanacağınızı öğrenin.</CardDescription>
                                 </CardHeader>
                                 <CardContent className="prose dark:prose-invert max-w-none">
                                     <h4>Temel Alanlar</h4>
                                     <ul>
                                         <li><strong>Makale Başlığı:</strong> Makalenizin ana başlığı. SEO için de önemlidir. URL metni (slug) otomatik olarak bu başlıktan türetilir.</li>
                                         <li><strong>Kategori:</strong> Makalenizin ait olduğu ana kategori. "Kategorileri Yönet" bağlantısı ile yeni kategori ekleyebilir veya mevcutları düzenleyebilirsiniz.</li>
                                         <li><strong>Özet:</strong> Makalenin kısa bir özeti. Listeleme sayfalarında ve SEO için meta açıklama olarak kullanılır (eğer özel bir SEO açıklaması girilmezse).</li>
                                         <li><strong>Ana Görsel URL:</strong> Makalenin ana listeleme görseli. URL yapıştırabilir veya "Yükle" butonu ile bilgisayarınızdan seçebilirsiniz.</li>
                                         <li><strong>Öne Çıkarılmış Makale:</strong> İşaretlenirse, makale anasayfadaki "Öne Çıkanlar" bölümünde gösterilir.</li>
                                         <li><strong>Hero'da Göster:</strong> İşaretlenirse, makale anasayfanın en üstündeki Hero (kayan) bölümde gösterilir.</li>
                                     </ul>
                                     <h4>İçerik Blokları</h4>
                                     <p>Makalenizin içeriğini oluşturmak için çeşitli bloklar ekleyebilirsiniz. "Bölüm Ekle" düğmesiyle yeni bloklar ekleyebilir, blokları sürükleyip bırakarak sıralayabilir ve her bloğun sağ üst köşesindeki kontrollerle silebilirsiniz.</p>
                                     <h4>Yayın Durumu (Sağ Panel)</h4>
                                     <ul>
                                         <li><strong>Taslak:</strong> Makale üzerinde çalışılıyor, yayınlanmadı.</li>
                                         <li><strong>İncelemede:</strong> Makale hazır, yayınlanmadan önce incelenmesi gerekiyor (Bu özellik daha sonra eklenebilir).</li>
                                         <li><strong>Hazır:</strong> Makale yayınlanmaya hazır. Sadece Admin ve Editörler önizleyebilir.</li>
                                         <li><strong>Yayınlandı:</strong> Makale tüm kullanıcılara görünür.</li>
                                         <li><strong>Arşivlendi:</strong> Makale yayından kaldırıldı ama sistemde duruyor.</li>
                                     </ul>
                                     <h4>Aksiyonlar (Sağ Panel)</h4>
                                     <ul>
                                         <li><strong>Önizle:</strong> Değişikliklerinizi canlı sitede nasıl görüneceğini gösterir.</li>
                                         <li><strong>Kaydet:</strong> Mevcut durumuyla makaleyi kaydeder. Durum "Taslak", "İncelemede" veya "Hazır" ise bu şekilde kalır.</li>
                                         <li><strong>Yayınla:</strong> Makaleyi "Yayınlandı" durumuna getirir ve herkese görünür yapar. Eğer makale zaten "Yayınlandı" ise, yapılan değişiklikleri kaydeder.</li>
                                         <li><strong>Şablonu Kaldır:</strong> Eğer bir şablon seçildiyse ve içerik şablondan yüklendiyse, bu buton görünür. Mevcut içeriği silip varsayılan boş metin bloğuna döndürür.</li>
                                     </ul>
                                     <h4>SEO Ayarları Sekmesi</h4>
                                     <p>Makalenizin arama motorlarındaki görünürlüğünü artırmak için SEO başlığı, meta açıklaması, URL metni (slug) ve anahtar kelimeleri buradan düzenleyebilirsiniz.</p>
                                 </CardContent>
                             </Card>
                         </TabsContent>
                    </Tabs>
                </div>

                 <aside className="w-96 border-l bg-card p-6 overflow-y-auto space-y-6 hidden lg:block">
                     <Card>
                        <CardHeader>
                           <CardTitle>Durum ve Aksiyonlar</CardTitle>
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
                                        {/* <SelectItem value="İncelemede">İncelemede</SelectItem> */}
                                        <SelectItem value="Hazır">Hazır (Admin/Editör Görsün)</SelectItem>
                                        <SelectItem value="Yayınlandı">Yayınlandı</SelectItem>
                                        {/* <SelectItem value="Arşivlendi">Arşivlendi</SelectItem> */}
                                    </SelectContent>
                                </Select>
                            </div>
                             <Separator />
                              <Button variant="outline" className="w-full justify-center" onClick={handlePreview} disabled={saving}>
                                 <Eye className="mr-2 h-4 w-4" /> Önizle
                             </Button>
                             <Button className="w-full" onClick={() => handleSave()} disabled={saving || !slug || !title || !category}>
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Kaydet
                            </Button>
                             {status !== 'Yayınlandı' && (
                                 <Button className="w-full" variant="default" onClick={() => handleSave(true)} disabled={saving || !slug || !title || !category}>
                                     {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />} Yayınla
                                 </Button>
                             )}
                             {templateApplied && (
                                <Button variant="outline" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10" onClick={handleRemoveTemplate} disabled={saving}>
                                    <Layers className="mr-2 h-4 w-4" /> Şablonu Kaldır
                                </Button>
                             )}
                        </CardContent>
                     </Card>
                 </aside>
             </div>

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
