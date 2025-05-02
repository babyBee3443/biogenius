"use client";

import * as React from "react";
import { useRouter, useParams, notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Trash2, Monitor, Tablet, Smartphone } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { BlockEditor } from "@/components/admin/block-editor";
import type { Block } from "@/components/admin/template-selector";
import SeoPreview from "@/components/admin/seo-preview";
import PagePreviewRenderer from "@/components/admin/page-preview-renderer";

// Mock data fetching - Replace with actual API call
interface PageData {
    id: string;
    title: string;
    slug: string;
    blocks: Block[];
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    imageUrl?: string; // Add imageUrl for preview consistency
}

// Mock function - Updated to include blocks and SEO fields
const getPageById = async (id: string): Promise<PageData | null> => {
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
                { id: 'hpb5', type: 'text', content: '[Öne çıkan makaleler burada listelenecek...]' },
            ],
            seoTitle: 'TeknoBiyo | Teknoloji ve Biyoloji Makaleleri',
            seoDescription: 'Teknoloji ve biyoloji alanlarındaki en son gelişmeleri, derinlemesine analizleri ve ilgi çekici makaleleri keşfedin.',
            imageUrl: 'https://picsum.photos/seed/homepage/1200/600'
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
            imageUrl: 'https://picsum.photos/seed/teamwork/1200/600' // Added imageUrl
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
             imageUrl: 'https://picsum.photos/seed/contactus/1200/600' // Added imageUrl
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
    const [blocks, setBlocks] = React.useState<Block[]>([]);
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [keywords, setKeywords] = React.useState<string[]>([]);
    const [canonicalUrl, setCanonicalUrl] = React.useState("");
    const [previewDevice, setPreviewDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null); // State for selected block


    React.useEffect(() => {
        if (pageId) {
            getPageById(pageId)
                .then(data => {
                    if (data) {
                        setPageData(data);
                        setTitle(data.title);
                        setSlug(data.slug);
                        setBlocks(data.blocks || []);
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
                    notFound();
                })
                .finally(() => setLoading(false));
        }
    }, [pageId]);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-').replace(/-+/g, '-');
    };

    React.useEffect(() => {
        if (title && pageData && title !== pageData.title) {
             if (!slug || slug === generateSlug(pageData.title)) {
                 setSlug(generateSlug(title));
            }
        }
     }, [title, pageData, slug]);

     React.useEffect(() => {
        if (title && !seoTitle && pageData && title !== pageData.title) {
            setSeoTitle(title);
        }
     }, [title, seoTitle, pageData]);

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
        setSelectedBlockId(newBlock.id); // Select the newly added block
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks(blocks.filter(block => block.id !== id));
        if (selectedBlockId === id) {
            setSelectedBlockId(null); // Deselect if deleted
        }
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

    // Callback for selecting block from preview
    const handleBlockSelect = (id: string) => {
        setSelectedBlockId(id);
        // Optional: Scroll editor to the selected block
         const editorElement = document.querySelector(`[data-block-wrapper-id="${id}"]`);
         if (editorElement) {
             editorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }
    };
    // --- End Block Handlers ---


    const handleSave = () => {
         if (!title) {
            toast({ variant: "destructive", title: "Hata", description: "Sayfa başlığı zorunludur." });
            return;
        }
        const saveData = { pageId, title, slug, blocks, seoTitle, seoDescription, keywords, canonicalUrl };
        console.log("Updating page:", saveData);
        toast({
            title: "Sayfa Güncellendi",
            description: `"${title}" başlıklı sayfa başarıyla güncellendi.`,
        });
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
            router.push('/admin/pages');
        }
    };

    // --- Preview Data for Renderer ---
    const currentPreviewData: PageData = {
        id: pageId || 'preview',
        title: title,
        slug: slug,
        blocks: blocks,
        seoTitle: seoTitle,
        seoDescription: seoDescription,
        imageUrl: (blocks.find(b => b.type === 'image') as Extract<Block, { type: 'image' }>)?.url || pageData?.imageUrl || 'https://picsum.photos/seed/page-preview/1200/600',
    };

    const getPreviewSizeClass = () => {
      switch (previewDevice) {
        case 'mobile': return 'w-[375px] h-[667px]';
        case 'tablet': return 'w-[768px] h-[1024px]';
        default: return 'w-full h-full';
      }
    }


    if (loading) {
        return <div className="flex justify-center items-center h-screen">Sayfa bilgileri yükleniyor...</div>;
    }

     if (!pageData) {
         return <div className="text-center py-10">Sayfa bulunamadı.</div>;
    }


    return (
        <div className="flex flex-col h-screen overflow-hidden">
             {/* Top Bar */}
             <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-20">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/pages"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                </Button>
                 <h1 className="text-xl font-semibold truncate" title={`Sayfayı Düzenle: ${pageData.title}`}>Sayfayı Düzenle</h1>
                 <div className="flex items-center gap-2">
                     {/* Preview Device Toggles */}
                     <Button
                        variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setPreviewDevice('desktop')}
                        title="Masaüstü Önizleme"
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button
                         variant={previewDevice === 'tablet' ? 'secondary' : 'ghost'}
                         size="icon"
                         className="h-8 w-8"
                         onClick={() => setPreviewDevice('tablet')}
                         title="Tablet Önizleme"
                      >
                         <Tablet className="h-4 w-4" />
                      </Button>
                      <Button
                         variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'}
                         size="icon"
                         className="h-8 w-8"
                         onClick={() => setPreviewDevice('mobile')}
                         title="Mobil Önizleme"
                      >
                         <Smartphone className="h-4 w-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6 mx-2" />

                     <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                      <Button size="sm" onClick={handleSave} disabled={!title}>
                        <Save className="mr-2 h-4 w-4" /> Kaydet
                    </Button>
                 </div>
            </div>

            {/* Main Content Area (Editor + Preview) */}
             <div className="flex flex-1 overflow-hidden">
                 {/* Left Editor Area */}
                 <div className="flex-1 overflow-y-auto p-6 space-y-6 border-r">
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
                                    disabled={pageId === 'anasayfa'}
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
                       selectedBlockId={selectedBlockId} // Pass selected block ID
                       onBlockSelect={handleBlockSelect} // Pass selection handler
                     />

                    {/* SEO Settings */}
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
                                    <Input
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
                                <Separator />
                                  <SeoPreview
                                      title={seoTitle || title}
                                      description={seoDescription || ''}
                                      slug={slug || '/'}
                                      category="sayfa"
                                  />
                            </CardContent>
                      </Card>
                 </div>

                  {/* Right Preview Pane */}
                   <aside className="w-1/2 lg:w-2/5 xl:w-1/2 bg-muted/30 p-4 overflow-hidden flex flex-col items-center justify-center">
                     <div className={`border bg-background shadow-lg rounded-lg overflow-hidden transform scale-95 origin-top ${getPreviewSizeClass()} transition-all duration-300 ease-in-out`}>
                       <PagePreviewRenderer
                          pageData={currentPreviewData}
                          selectedBlockId={selectedBlockId} // Pass selected block ID
                          onBlockSelect={handleBlockSelect} // Pass selection handler
                       />
                     </div>
                   </aside>
            </div>
        </div>
    );
}
