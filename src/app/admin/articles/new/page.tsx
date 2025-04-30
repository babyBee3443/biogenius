
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
import { ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react"; // Added icons
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

// Placeholder for a Rich Text Editor component
const RichTextEditorPlaceholder = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    (props, ref) => (
        <Textarea ref={ref} rows={15} placeholder="Makale içeriğini buraya yazın... Zengin metin editörü (WYSIWYG) entegrasyonu gereklidir." {...props} />
    )
);
RichTextEditorPlaceholder.displayName = 'RichTextEditorPlaceholder';


export default function NewArticlePage() {
    // TODO: Implement state management for form fields (e.g., using react-hook-form)
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [status, setStatus] = React.useState("Taslak"); // Default status
    const [featuredImage, setFeaturedImage] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [isFeatured, setIsFeatured] = React.useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFeaturedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setFeaturedImage(null);
            setImagePreview(null);
        }
    };

    const handleSave = (publish: boolean = false) => {
         const finalStatus = publish ? "Yayınlandı" : status;
         console.log("Saving article:", { title, content, category, status: finalStatus, featuredImage, seoTitle, seoDescription, slug, isFeatured });
         // TODO: Implement actual API call to save/publish the article
         toast({
             title: publish ? "Makale Yayınlandı" : "Makale Kaydedildi",
             description: `"${title}" başlıklı makale başarıyla ${publish ? 'yayınlandı' : 'kaydedildi (' + finalStatus + ')'}.`,
         });
         // Redirect or clear form based on action
    };


    // Basic slug generation (replace with a more robust library if needed)
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes
    };

     React.useEffect(() => {
        if (title && !slug) { // Auto-generate slug only if empty
            setSlug(generateSlug(title));
        }
    }, [title, slug]); // Added slug to dependencies


    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                     <Button variant="outline" size="sm" asChild className="mb-4">
                        <Link href="/admin/articles"><ArrowLeft className="mr-2 h-4 w-4" /> Makale Listesine Dön</Link>
                     </Button>
                    <h1 className="text-3xl font-bold">Yeni Makale Oluştur</h1>
                    <p className="text-muted-foreground">Yeni bir makale eklemek için aşağıdaki alanları doldurun.</p>
                </div>
                 <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleSave(false)}>
                        <Save className="mr-2 h-4 w-4" /> Taslak Olarak Kaydet
                    </Button>
                     <Button onClick={() => handleSave(true)}>
                        <Upload className="mr-2 h-4 w-4" /> Yayınla
                    </Button>
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
                                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Makale başlığını girin..." required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="content">İçerik</Label>
                                {/* Replace with actual Rich Text Editor */}
                                <RichTextEditorPlaceholder id="content" value={content} onChange={(e) => setContent(e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                         <CardHeader>
                            <CardTitle>SEO Ayarları</CardTitle>
                            <CardDescription>Arama motorları için makale görünürlüğünü optimize edin.</CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="slug">URL Metni (Slug)</Label>
                                <Input id="slug" value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} placeholder="makale-basligi-url" required />
                                 <p className="text-xs text-muted-foreground">Makalenin URL'si. Genellikle otomatik oluşturulur, ancak düzenleyebilirsiniz.</p>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="seo-title">SEO Başlığı</Label>
                                <Input id="seo-title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Arama sonuçlarında görünecek başlık (isteğe bağlı)" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="seo-description">Meta Açıklama</Label>
                                <Textarea id="seo-description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Arama sonuçlarında görünecek kısa açıklama (150-160 karakter önerilir)" rows={2} maxLength={160} />
                            </div>
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
                              {/* Optional: Add visibility (Public, Private) or publish date scheduling */}
                               <div className="flex items-center space-x-2 pt-2">
                                    <Switch id="featured-article" checked={isFeatured} onCheckedChange={setIsFeatured} />
                                    <Label htmlFor="featured-article">Öne Çıkan Makale</Label>
                                </div>
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
                                        <SelectValue placeholder="Kategori seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Teknoloji">Teknoloji</SelectItem>
                                        <SelectItem value="Biyoloji">Biyoloji</SelectItem>
                                        {/* Add more categories fetched dynamically */}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="tags">Etiketler</Label>
                                {/* TODO: Implement a Tag input component */}
                                <Input id="tags" placeholder="Etiketleri virgülle ayırın (ör: ai, crispr)" />
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
                                        width={600}
                                        height={400}
                                        className="w-full h-auto rounded-md object-cover"
                                     />
                                     <Button
                                         variant="destructive"
                                         size="sm"
                                         className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                         onClick={() => { setFeaturedImage(null); setImagePreview(null); }}>
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
                                    {featuredImage ? "Görseli Değiştir" : "Görsel Yükle"}
                                </Label>
                                <Input id="featured-image" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                                <p className="text-xs text-muted-foreground">
                                    Makale listesinde ve başında görünecek görsel.
                                </p>
                            </div>
                        </CardContent>
                     </Card>
                 </div>
            </div>

             <Separator />
             <div className="flex justify-end gap-2">
                 <Button variant="secondary" onClick={() => handleSave(false)}>
                    <Save className="mr-2 h-4 w-4" /> Taslak Olarak Kaydet
                </Button>
                 <Button onClick={() => handleSave(true)}>
                    <Upload className="mr-2 h-4 w-4" /> Yayınla
                </Button>
             </div>
        </form>
    );
}
