
"use client";

import * as React from "react";
import { useRouter, useParams, notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Trash2, Eye } from "lucide-react"; // Added Eye for preview
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { BlockEditor } from "@/components/admin/block-editor"; // Import BlockEditor
import type { Block } from "@/components/admin/template-selector"; // Import Block type
import SeoPreview from "@/components/admin/seo-preview"; // Import SEO Preview

// Mock data fetching - Replace with actual API call
interface PageData {
    id: string;
    title: string;
    slug: string;
    blocks: Block[]; // Changed content structure to blocks
    seoTitle?: string; // Optional SEO fields
    seoDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
}

// Mock function - Updated to include blocks and SEO fields
const getPageById = async (id: string): Promise<PageData | null> => {
    // await new Promise(resolve => setTimeout(resolve, 300)); // Removed delay
    const pages: PageData[] = [
        {
            id: 'anasayfa',
            title: 'Anasayfa',
            slug: '',
            blocks: [
                { id: 'hpb1', type: 'heading', level: 1, content: 'TeknoBiyo\'ya Hoş Geldiniz!' },
                { id: 'hpb2', type: 'text', content: 'Teknoloji ve biyoloji dünyasındaki en son gelişmeleri, derinlemesine analizleri ve ilgi çekici makaleleri keşfedin.' },
                { id: 'hpb3', type: 'divider' },
                { id: 'hpb4', type: 'heading', level: 2, content: 'Öne Çıkanlar' },
                // Placeholder for dynamically loading featured articles
                { id: 'hpb5', type: 'text', content: '[Öne çıkan makaleler burada listelenecek...]' },
            ],
            seoTitle: 'TeknoBiyo | Teknoloji ve Biyoloji Makaleleri',
            seoDescription: 'Teknoloji ve biyoloji alanlarındaki en son gelişmeleri, derinlemesine analizleri ve ilgi çekici makaleleri keşfedin.',
        },
        {
            id: 'hakkimizda',
            title: 'Hakkımızda',
            slug: 'hakkimizda',
            blocks: [
                { id: 'ab1', type: 'heading', level: 2, content: 'Biz Kimiz?' },
                { id: 'ab2', type: 'text', content: 'TeknoBiyo, teknoloji ve biyoloji dünyalarının kesişim noktasında yer alan, meraklı zihinler için hazırlanmış bir bilgi platformudur...' },
                { id: 'ab3', type: 'image', url: 'https://picsum.photos/seed/teamwork/800/600', alt: 'Ekip Çalışması' },
            ],
            seoTitle: 'Hakkımızda | TeknoBiyo',
            seoDescription: 'TeknoBiyo\'nun arkasındaki vizyonu, misyonu ve değerleri keşfedin.',
        },
        {
            id: 'iletisim',
            title: 'İletişim',
            slug: 'iletisim',
            blocks: [
                { id: 'cb1', type: 'heading', level: 2, content: 'Bizimle İletişime Geçin' },
                { id: 'cb2', type: 'text', content: 'Sorularınız, önerileriniz veya işbirliği talepleriniz için bize ulaşın.' },
                // Placeholder for contact form/info blocks
            ],
            seoTitle: 'İletişim | TeknoBiyo',
            seoDescription: 'TeknoBiyo ile iletişime geçin. Sorularınız ve önerileriniz için buradayız.',
        },
    ];
    return pages.find(page => page.id === id) || null;
};


export default function EditPage() {
    const router = useRouter();
    const params = useParams();
    const pageId = params.id as string;

    const [pageData, setPageData] = React.useState<PageData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [title, setTitle] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [blocks, setBlocks] = React.useState<Block[]>([]); // State for blocks
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [canonicalUrl, setCanonicalUrl] = React.useState("");


    React.useEffect(() => {
        if (pageId) {
            getPageById(pageId)
                .then(data => {
                    if (data) {
                        setPageData(data);
                        setTitle(data.title);
                        setSlug(data.slug);
                        setBlocks(data.blocks || []); // Initialize blocks
                        setSeoTitle(data.seoTitle || '');
                        setSeoDescription(data.seoDescription || '');
                        setKeywords(data.keywords || []);
                        setCanonicalUrl(data.canonicalUrl || '');
                    } else {
                        notFound();
                    }
                })
                .catch(error => {
                    console.error("Error fetching page data:", error);
                    toast({ variant: "destructive", title: "Hata", description: "Sayfa bilgileri yüklenirken bir sorun oluştu." });
                    notFound(); // Or handle error differently
                })
                .finally(() => setLoading(false));
        }
    }, [pageId]);

    // Basic slug generation
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-').replace(/-+/g, '-');
    };

    // Auto-update slug when title changes (optional, only if slug wasn't manually set differently)
    React.useEffect(() => {
        // Only auto-update slug if it's empty or matches the generated slug of the *original* title
        if (title && pageData && title !== pageData.title) {
             if (!slug || slug === generateSlug(pageData.title)) {
                 setSlug(generateSlug(title));
            }
        }
     }, [title, pageData, slug]);

     // Auto-generate SEO Title
     React.useEffect(() => {
        if (title && !seoTitle && pageData && title !== pageData.title) {
            setSeoTitle(title);
        }
     }, [title, seoTitle, pageData]);

     // Auto-generate SEO Description (basic - could use AI or first paragraph later)
     React.useEffect(() => {
        if (blocks.length > 0 && !seoDescription && pageData) {
            const firstTextBlock = blocks.find(b => b.type === 'text') as Extract<Block, { type: 'text' }> | undefined;
            if (firstTextBlock && firstTextBlock.content && firstTextBlock.content !== (pageData.blocks.find(b => b.id === firstTextBlock.id) as Extract<Block, { type: 'text' }>)?.content) {
                 const desc = firstTextBlock.content.length > 160 ? firstTextBlock.content.substring(0, 157) + '...' : firstTextBlock.content;
                 setSeoDescription(desc);
            }
        }
     }, [blocks, seoDescription, pageData]);


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
         if (!title) { // Slug can be empty for homepage
            toast({ variant: "destructive", title: "Hata", description: "Sayfa başlığı zorunludur." });
            return;
        }
        // TODO: Implement actual API call to update the page structure including blocks and SEO fields
        const saveData = { pageId, title, slug, blocks, seoTitle, seoDescription, keywords, canonicalUrl };
        console.log("Updating page:", saveData);
        toast({
            title: "Sayfa Güncellendi",
            description: `"${title}" başlıklı sayfa başarıyla güncellendi.`,
        });
         // Optionally refetch or update local state
        if(pageData) setPageData({...pageData, title, slug, blocks, seoTitle, seoDescription, keywords, canonicalUrl });
    };

     const handleDelete = () => {
        if (window.confirm(`"${title}" başlıklı sayfayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            console.log("Deleting page:", pageId);
            // TODO: Implement actual API call to delete the page
             toast({
                 variant: "destructive",
                 title: "Sayfa Silindi",
                 description: `"${title}" başlıklı sayfa silindi.`,
            });
            router.push('/admin/pages'); // Redirect after delete
        }
    };

     // --- Preview Handler ---
     const handlePreview = () => {
        const previewData = {
            id: pageId || 'preview',
            title,
            description: seoDescription || '', // Use SEO description or fallback
            // Assuming category isn't directly applicable to pages like articles, maybe derive or omit
            // category: 'Page',
            imageUrl: (blocks.find(b => b.type === 'image') as Extract<Block, { type: 'image' }>)?.url || 'https://picsum.photos/seed/page-preview/1200/600', // Use first image or placeholder
            blocks,
        };
         try {
             // Using localStorage for preview, same mechanism as articles
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


    if (loading) {
        return <div className="flex justify-center items-center h-64">Sayfa bilgileri yükleniyor...</div>;
    }

     if (!pageData) {
         return <div className="text-center py-10">Sayfa bulunamadı.</div>; // Should be caught by notFound earlier
    }


    return (
        <div className="flex flex-col h-full">
             {/* Top Bar */}
             <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-10">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/pages"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                </Button>
                 <h1 className="text-xl font-semibold truncate" title={`Sayfayı Düzenle: ${pageData.title}`}>Sayfayı Düzenle</h1>
                 <div className="flex items-center gap-2">
                     <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                      <Button variant="outline" size="sm" onClick={handlePreview}>
                        <Eye className="mr-2 h-4 w-4" /> Önizle
                     </Button>
                      <Button size="sm" onClick={handleSave} disabled={!title}>
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
                            <CardDescription>Sayfanın başlığını ve URL'sini düzenleyin.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="page-title">Sayfa Başlığı <span className="text-destructive">*</span></Label>
                                <Input
                                    id="page-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="page-slug">URL Metni (Slug)</Label>
                                <Input
                                    id="page-slug"
                                    value={slug}
                                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                                    disabled={pageId === 'anasayfa'} // Disable slug editing for homepage
                                    placeholder={pageId === 'anasayfa' ? "(Anasayfa)" : "sayfa-url"}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {pageId === 'anasayfa' ? "Anasayfa URL'si değiştirilemez." : "Tarayıcı adres çubuğunda görünecek kısım."}
                                </p>
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
                                    <Input // Changed to Input for page consistency, can be Textarea if needed
                                        id="seo-description"
                                        value={seoDescription}
                                        onChange={(e) => setSeoDescription(e.target.value)}
                                        maxLength={160}
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
                              slug={slug || '/'} // Show root path for empty slug (homepage)
                              category="sayfa" // Generic category for pages
                          />
                       </div>
                  </aside>
            </div>
        </div>
    );
}

    