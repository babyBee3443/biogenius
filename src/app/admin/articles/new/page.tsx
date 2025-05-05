import { TemplateSelector, Block } from "@/components/admin/template-selector";
import { BlockEditor } from "@/components/admin/block-editor/block-editor";
import SeoPreview from "@/components/admin/seo-preview";
// Removed useDebouncedCallback import
import { createArticle, type ArticleData } from '@/lib/mock-data'; // Import mock data functions

// --- Main Page Component ---

export default function NewArticlePage() {
    const router = useRouter(); // Initialize router

    // --- State ---
    const [saving, setSaving] = React.useState(false); // Added saving state

    const [title, setTitle] = React.useState("");
    const [excerpt, setExcerpt] = React.useState("");
    const [category, setCategory] = React.useState<ArticleData['category'] | "">("");
    const [mainImageUrl, setMainImageUrl] = React.useState("");
    const [isFeatured, setIsFeatured] = React.useState(false);
    const [isHero, setIsHero] = React.useState(false); // Added isHero state
    const [status, setStatus] = React.useState<ArticleData['status']>("Taslak");

    // Block Editor State - Initialize empty and add initial block client-side
    const [blocks, setBlocks] = React.useState<Block[]>([]);
    const [initialBlockAdded, setInitialBlockAdded] = React.useState(false);

    // SEO States
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [canonicalUrl, setCanonicalUrl] = React.useState("");

    // Other States
    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = React.useState(false);
    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null); // Added for block editor interaction

     // Generate initial block on client-side after hydration to avoid mismatch
    React.useEffect(() => {
        if (!initialBlockAdded) {
            const initialBlockId = `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;
            setBlocks([{ id: initialBlockId, type: 'text', content: '' }]);
            setInitialBlockAdded(true);
        }
    }, [initialBlockAdded]);


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
         } else {
             setSlug(''); // Clear slug if title is empty
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
         const desc = excerpt.length > 160 ? excerpt.substring(0, 157) + '...' : excerpt;
         setSeoDescription(desc);
       }
    }, [excerpt, seoDescription]);


    const handleAddBlock = (type: Block['type']) => {
        // ID generation happens client-side, safe from hydration issues here
        const newBlock: Block = {
            id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`,
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
        setBlocks([...blocks, newBlock]);
         setSelectedBlockId(newBlock.id); // Select the newly added block
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks(blocks.filter(block => block.id !== id));
         if (selectedBlockId === id) setSelectedBlockId(null); // Deselect if deleted
    };

     // Update block state
     const handleUpdateBlock = (updatedBlock: Block) => {
         setBlocks(prevBlocks =>
             prevBlocks.map(block =>
                 block.id === updatedBlock.id ? updatedBlock : block
             )
         );
     };

     // Reorder blocks
     const handleReorderBlocks = (reorderedBlocks: Block[]) => {
         setBlocks(reorderedBlocks);
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

         setSaving(true);

         const newArticleData: Omit<ArticleData, 'id' | 'createdAt' | 'updatedAt'> = {
             title,
             excerpt: excerpt || "",
             category,
             status: finalStatus,
             mainImageUrl: mainImageUrl || null,
             isFeatured,
             isHero, // Include isHero in save data
             slug: slug || generateSlug(title),
             keywords: keywords || [],
             canonicalUrl: canonicalUrl || "",
             blocks: blocks || [],
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
        if (blocks.length > 0 && blocks.some(b => (b.type === 'text' && b.content !== '') || b.type !== 'text')) {
            if (!window.confirm("Mevcut içerik bölümlerinin üzerine şablon uygulansın mı? Bu işlem geri alınamaz.")) {
                 setIsTemplateSelectorOpen(false);
                 return;
            }
        }
         // ID generation happens client-side during template selection, safe from hydration issues
        const newBlocks = templateBlocks.map(block => ({
            ...block,
            id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`
        }));
        // Clear existing blocks before applying the new template
        setBlocks([]); 
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
             id: 'preview',
             title: title || 'Başlıksız Makale',
             description: excerpt || '',
             category: category,
             imageUrl: mainImageUrl || 'https://picsum.photos/seed/preview/1200/600',
             blocks,
              // Include other relevant fields for preview if necessary
             isFeatured: isFeatured,
             isHero: isHero,
             status: status,
         };
         try {
             localStorage.setItem('articlePreviewData', JSON.stringify(previewData));
             window.open('/admin/preview', '_blank');
         } catch (error) {
             console.error("Error saving preview data:", error);
             toast({
                 variant: "destructive",
                 title: "Önizleme Hatası",
                 description: "Önizleme verisi kaydedilemedi. Tarayıcı depolama alanı dolu olabilir.",
             });
         }
     };

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
                            <TabsTrigger value="template" onClick={() => setIsTemplateSelectorOpen(true)}>Şablon</TabsTrigger>
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
                                    <Select value={category} onValueChange={(value) => setCategory(value as ArticleData['category'])} required>
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
                                        <SelectItem value="Yayınlandı">Yayınlandı</SelectItem>
                                        <SelectItem value="Arşivlendi">Arşivlendi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <Separator />
                              <Button variant="outline" className="w-full justify-center" onClick={handlePreview} disabled={saving}>
                                 <Eye className="mr-2 h-4 w-4" /> Önizle
                             </Button>
                             <Button className="w-full" onClick={() => handleSave()} disabled={saving}>
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Kaydet
                            </Button>
                             {status !== 'Yayınlandı' && (
                                 <Button className="w-full" variant="default" onClick={() => handleSave(true)} disabled={saving}>
                                     {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />} Yayınla
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
             />
        </div>
    );
}
