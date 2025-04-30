
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
import { ArrowLeft, Save, Upload, Image as ImageIcon, Trash2, History, MessageSquare, LayoutTemplate } from "lucide-react"; // Added LayoutTemplate icon
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image'; // For image preview
import { TemplateSelector } from "@/components/admin/template-selector"; // Import TemplateSelector component

// Mock data fetching - replace with actual API call
const getArticleById = async (id: string): Promise<Article | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const articles: Article[] = [
        { id: '1', title: 'Yapay Zeka Devrimi', content: '<p>Yapay zeka (AI), makinelerin öğrenme...</p>', category: 'Teknoloji', status: 'Yayınlandı', imageUrl: 'https://picsum.photos/seed/ai/600/400', seoTitle: 'Yapay Zeka Devrimi | TeknoBiyo', seoDescription: 'AI etkileri ve geleceği üzerine derinlemesine bir bakış.', slug: 'yapay-zeka-devrimi', isFeatured: true, tags: ['ai', 'makine öğrenimi'] },
        { id: '3', title: 'Kuantum Bilgisayarlar', content: '<p>Kuantum bilgisayarlar, klasik bilgisayarların bitler...</p>', category: 'Teknoloji', status: 'Taslak', imageUrl: 'https://picsum.photos/seed/quantum/600/400', seoTitle: '', seoDescription: '', slug: 'kuantum-bilgisayarlar', isFeatured: false, tags: ['kuantum', 'hesaplama'] },
        // Add other articles used in list view if needed for testing
    ];
    return articles.find(article => article.id === id) || null;
};

interface Article {
  id: string;
  title: string;
  content: string; // Content should be structured data for a block editor ideally
  category: string;
  status: string;
  imageUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  slug: string;
  isFeatured: boolean;
  tags: string[];
}


// Placeholder for a Rich Text/Block Editor component - Needs replacement
const RichTextEditorPlaceholder = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { initialValue?: string; onContentChange: (content: string) => void }>(
    ({ initialValue, onContentChange, ...props }, ref) => (
        <Textarea
            ref={ref}
            rows={15}
            placeholder="Makale içeriğini buraya yazın veya bir şablon seçin..."
            defaultValue={initialValue}
            onChange={(e) => onContentChange(e.target.value)} // Ensure content changes are propagated
            {...props}
        />
    )
);
RichTextEditorPlaceholder.displayName = 'RichTextEditorPlaceholder';


export default function EditArticlePage() {
    const params = useParams();
    const articleId = params.id as string;

    const [article, setArticle] = React.useState<Article | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [featuredImageFile, setFeaturedImageFile] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = React.useState(false);

     // Form state - initialize with empty strings or defaults
     const [title, setTitle] = React.useState("");
     const [content, setContent] = React.useState(""); // Content state
     const [category, setCategory] = React.useState("");
     const [status, setStatus] = React.useState("Taslak");
     const [seoTitle, setSeoTitle] = React.useState("");
     const [seoDescription, setSeoDescription] = React.useState("");
     const [slug, setSlug] = React.useState("");
     const [isFeatured, setIsFeatured] = React.useState(false);
     const [tags, setTags] = React.useState<string[]>([]);


    React.useEffect(() => {
        if (articleId) {
            getArticleById(articleId)
                .then(data => {
                    if (data) {
                        setArticle(data);
                        // Initialize form state with fetched data
                        setTitle(data.title);
                        setContent(data.content); // Initialize content state
                        setCategory(data.category);
                        setStatus(data.status);
                        setImagePreview(data.imageUrl);
                        setSeoTitle(data.seoTitle);
                        setSeoDescription(data.seoDescription);
                        setSlug(data.slug);
                        setIsFeatured(data.isFeatured);
                        setTags(data.tags);
                    } else {
                        notFound(); // Redirect to 404 if article not found
                    }
                })
                .catch(error => {
                    console.error("Error fetching article:", error);
                    toast({ variant: "destructive", title: "Hata", description: "Makale yüklenirken bir sorun oluştu." });
                    // Optionally redirect or show error message
                })
                .finally(() => setLoading(false));
        }
    }, [articleId]);


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFeaturedImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string); // Update preview with new file
            };
            reader.readAsDataURL(file);
        }
    };

     const handleRemoveImage = () => {
        setFeaturedImageFile(null);
        setImagePreview(null); // Remove preview
        // TODO: Add logic to mark image for removal on the backend if necessary
    };

    const handleSave = (publish: boolean = false) => {
         const finalStatus = publish ? "Yayınlandı" : status;
         console.log("Updating article:", { articleId, title, content, category, status: finalStatus, featuredImageFile, seoTitle, seoDescription, slug, isFeatured, tags: tags.join(',') }); // Log tags
         // TODO: Implement actual API call to update the article
          // Use FormData if sending file:
         // const formData = new FormData();
         // formData.append('title', title);
         // ... other fields
         // if (featuredImageFile) formData.append('image', featuredImageFile);
         // ... API call using formData

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

     // Basic slug generation
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-').replace(/-+/g, '-');
    };

    // Auto-update slug when title changes (optional)
    React.useEffect(() => {
        if (title && articleId) { // Only update slug if title exists and we are editing
            setSlug(generateSlug(title));
        }
    }, [title, articleId]); // Re-run when title or articleId changes

     // Handler for tag input change
     const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const tagsString = event.target.value;
        setTags(tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '')); // Split and clean tags
     };

      // Handler for template selection
     const handleTemplateSelect = (templateContent: string) => {
        // Ask for confirmation before overwriting existing content
        if (content && !window.confirm("Mevcut içeriğin üzerine şablon uygulansın mı? Bu işlem geri alınamaz.")) {
            return;
        }
        setContent(templateContent); // Update content state with template
        setIsTemplateSelectorOpen(false); // Close the selector
     };


    if (loading) {
        // TODO: Replace with a proper Skeleton loader component
        return <div className="flex justify-center items-center h-64">Makale yükleniyor...</div>;
    }

    if (!article) {
         // This should ideally be handled by notFound() in useEffect, but as a fallback
         return <div className="text-center py-10">Makale bulunamadı.</div>;
    }

    return (
        <>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                     <Button variant="outline" size="sm" asChild className="mb-4">
                        <Link href="/admin/articles"><ArrowLeft className="mr-2 h-4 w-4" /> Makale Listesine Dön</Link>
                     </Button>
                    <h1 className="text-3xl font-bold">Makaleyi Düzenle</h1>
                    <p className="text-muted-foreground">"{article.title}"</p>
                </div>
                 <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm"><History className="mr-2 h-4 w-4"/> Revizyon Geçmişi</Button> {/* TODO: Implement Revision History Modal/Page */}
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Sil
                    </Button>
                    <Button variant="secondary" onClick={() => handleSave(false)}>
                        <Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet
                    </Button>
                     {status !== 'Yayınlandı' && (
                         <Button onClick={() => handleSave(true)}>
                             <Upload className="mr-2 h-4 w-4" /> Yayınla
                         </Button>
                     )}
                     {status === 'Yayınlandı' && (
                         <Button onClick={() => handleSave(false)}> {/* Or just handleSave() which keeps status */}
                             <Save className="mr-2 h-4 w-4" /> Güncelle
                         </Button>
                     )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                         <CardHeader>
                            <CardTitle>Makale İçeriği</CardTitle>
                         </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Başlık</Label>
                                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                             <div className="space-y-2">
                                 <div className="flex justify-between items-center mb-2">
                                     <Label htmlFor="content">İçerik</Label>
                                     <Button variant="outline" size="sm" onClick={() => setIsTemplateSelectorOpen(true)}>
                                         <LayoutTemplate className="mr-2 h-4 w-4" /> Şablon Seç
                                     </Button>
                                 </div>
                                {/* Replace with actual Rich Text/Block Editor */}
                                <RichTextEditorPlaceholder
                                    id="content"
                                    initialValue={content} // Pass initial content
                                    onContentChange={setContent} // Pass update handler
                                    key={articleId} // Force re-render if article changes
                                />
                                 <p className="text-xs text-muted-foreground">
                                    İçeriği biçimlendirmek için zengin metin editörünü kullanın veya hazır bir şablon seçin. Sürükle-bırak işlevselliği için gelişmiş bir editör gereklidir.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                         <CardHeader>
                            <CardTitle>SEO Ayarları</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="slug">URL Metni (Slug)</Label>
                                <Input id="slug" value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} required />
                             </div>
                             <div className="space-y-2">
                                <Label htmlFor="seo-title">SEO Başlığı</Label>
                                <Input id="seo-title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="seo-description">Meta Açıklama</Label>
                                <Textarea id="seo-description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} maxLength={160} />
                            </div>
                         </CardContent>
                     </Card>

                     {/* Placeholder for Comments Management */}
                    <Card>
                         <CardHeader>
                            <CardTitle>Yorumlar</CardTitle>
                             <CardDescription>Bu makaleye yapılan yorumları yönetin.</CardDescription>
                         </CardHeader>
                         <CardContent>
                             <p className="text-sm text-muted-foreground">Yorum yönetimi bölümü burada yer alacak (listeleme, onaylama, silme).</p>
                             {/* TODO: Implement comments listing and moderation */}
                             <Button variant="outline" size="sm" className="mt-4"><MessageSquare className="mr-2 h-4 w-4" /> Yorumları Yönet</Button>
                         </CardContent>
                     </Card>
                </div>

                {/* Sidebar Area */}
                <div className="space-y-6">
                     <Card>
                         <CardHeader>
                            <CardTitle>Yayınlama Ayarları</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="status">Durum</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger id="status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Taslak">Taslak</SelectItem>
                                        <SelectItem value="İncelemede">İncelemede</SelectItem>
                                        <SelectItem value="Yayınlandı">Yayınlandı</SelectItem>
                                        <SelectItem value="Arşivlendi">Arşivlendi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="flex items-center space-x-2 pt-2">
                                <Switch id="featured-article" checked={isFeatured} onCheckedChange={setIsFeatured} />
                                <Label htmlFor="featured-article">Öne Çıkan Makale</Label>
                            </div>
                             {/* Optional: Add Last Updated Info */}
                             <p className="text-xs text-muted-foreground pt-2">Son güncelleme: [Tarih]</p>
                         </CardContent>
                     </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Kategoriler ve Etiketler</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Kategori</Label>
                                <Select value={category} onValueChange={setCategory} required>
                                    <SelectTrigger id="category">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Teknoloji">Teknoloji</SelectItem>
                                        <SelectItem value="Biyoloji">Biyoloji</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="tags">Etiketler</Label>
                                 <Input
                                    id="tags"
                                    value={tags.join(', ')} // Display tags as comma-separated string
                                    onChange={handleTagsChange} // Use handler to update array
                                    placeholder="Etiketleri virgülle ayırın"
                                />
                                 <p className="text-xs text-muted-foreground">Etiketleri virgül (,) ile ayırarak girin.</p>
                             </div>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Öne Çıkan Görsel</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {imagePreview ? (
                                <div className="relative group">
                                     <Image
                                        src={imagePreview}
                                        alt="Öne çıkan görsel önizlemesi"
                                        width={600} height={400} // Provide initial dimensions
                                        className="w-full h-auto rounded-md object-cover"
                                     />
                                     <Button
                                         variant="destructive"
                                         size="sm"
                                         className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                         onClick={handleRemoveImage}>
                                         Kaldır
                                     </Button>
                                 </div>
                            ) : (
                                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-muted-foreground/50">
                                     <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                            )}
                            <div className="space-y-1 text-sm">
                                <Label htmlFor="featured-image" className="cursor-pointer text-primary hover:underline">
                                    {imagePreview ? "Görseli Değiştir" : "Görsel Yükle"}
                                </Label>
                                <Input id="featured-image" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                            </div>
                        </CardContent>
                     </Card>
                 </div>
            </div>

             <Separator />
             <div className="flex justify-end flex-wrap gap-2">
                 <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" /> Sil
                </Button>
                <Button variant="secondary" onClick={() => handleSave(false)}>
                    <Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet
                </Button>
                {status !== 'Yayınlandı' && (
                    <Button onClick={() => handleSave(true)}>
                        <Upload className="mr-2 h-4 w-4" /> Yayınla
                    </Button>
                )}
                 {status === 'Yayınlandı' && (
                     <Button onClick={() => handleSave(false)}>
                         <Save className="mr-2 h-4 w-4" /> Güncelle
                     </Button>
                 )}
             </div>
        </form>

        {/* Template Selector Modal */}
        <TemplateSelector
            isOpen={isTemplateSelectorOpen}
            onClose={() => setIsTemplateSelectorOpen(false)}
            onSelectTemplate={handleTemplateSelect}
        />
        </>
    );
}

