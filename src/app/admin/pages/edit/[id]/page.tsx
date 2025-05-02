
"use client";

import * as React from "react";
import { useRouter, useParams, notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Trash2, Construction } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

// Mock data fetching - Replace with actual API call
interface PageData {
    id: string;
    title: string;
    slug: string;
    // Add content structure here later (e.g., blocks: Block[])
}

const getPageById = async (id: string): Promise<PageData | null> => {
    // Simulate API delay
    // await new Promise(resolve => setTimeout(resolve, 500));
    const pages: PageData[] = [
        { id: 'anasayfa', title: 'Anasayfa', slug: '' }, // Slug might be empty for homepage
        { id: 'hakkimizda', title: 'Hakkımızda', slug: 'hakkimizda' },
        { id: 'iletisim', title: 'İletişim', slug: 'iletisim' },
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

    React.useEffect(() => {
        if (pageId) {
            getPageById(pageId)
                .then(data => {
                    if (data) {
                        setPageData(data);
                        setTitle(data.title);
                        setSlug(data.slug);
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
        if (title && pageData && title !== pageData.title && slug === generateSlug(pageData.title)) {
            setSlug(generateSlug(title));
        }
     }, [title, pageData, slug]);


    const handleSave = () => {
         if (!title || !slug) {
            toast({ variant: "destructive", title: "Hata", description: "Sayfa başlığı ve URL metni zorunludur." });
            return;
        }
        // TODO: Implement actual API call to update the page structure
        console.log("Updating page:", { pageId, title, slug, content: [] }); // Placeholder for content
        toast({
            title: "Sayfa Güncellendi",
            description: `"${title}" başlıklı sayfa başarıyla güncellendi.`,
        });
         // Optionally refetch or update local state
        if(pageData) setPageData({...pageData, title, slug });
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

    if (loading) {
        return <div className="flex justify-center items-center h-64">Sayfa bilgileri yükleniyor...</div>;
    }

     if (!pageData) {
         return <div className="text-center py-10">Sayfa bulunamadı.</div>; // Should be caught by notFound earlier
    }


    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                     <Button variant="outline" size="sm" asChild className="mb-4">
                        <Link href="/admin/pages"><ArrowLeft className="mr-2 h-4 w-4" /> Sayfa Listesine Dön</Link>
                     </Button>
                    <h1 className="text-3xl font-bold">Sayfayı Düzenle: {pageData.title}</h1>
                    <p className="text-muted-foreground">Sayfanın temel bilgilerini ve içeriğini düzenleyin.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                     <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Sayfayı Sil
                    </Button>
                    <Button onClick={handleSave} disabled={!title || !slug}>
                        <Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet
                    </Button>
                </div>
            </div>

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
                        <Label htmlFor="page-slug">URL Metni (Slug) <span className="text-destructive">*</span></Label>
                        <Input
                            id="page-slug"
                            value={slug}
                            onChange={(e) => setSlug(generateSlug(e.target.value))}
                            required
                        />
                         <p className="text-xs text-muted-foreground">Tarayıcı adres çubuğunda görünecek kısım.</p>
                    </div>
                </CardContent>
            </Card>

            <Separator />

             {/* Placeholder for Visual Editor */}
             <Card className="border-dashed border-primary/50 bg-primary/5">
                 <CardHeader className="text-center">
                     <Construction className="h-10 w-10 text-primary mx-auto mb-2" />
                     <CardTitle className="text-primary">Görsel Sayfa Düzenleyici</CardTitle>
                     <CardDescription>
                        Bu alanda yakında sürükle-bırak arayüzü ile sayfa içeriğini (metin, görsel, buton vb.) oluşturup düzenleyebileceksiniz.
                    </CardDescription>
                </CardHeader>
                 <CardContent className="text-center">
                     <p className="text-sm text-muted-foreground">Bu özellik şu anda geliştirme aşamasındadır.</p>
                     {/* TODO: Integrate the actual visual page builder component here */}
                 </CardContent>
             </Card>

             <Separator />

             <div className="flex justify-end gap-2">
                <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" /> Sayfayı Sil
                </Button>
                 <Button onClick={handleSave} disabled={!title || !slug}>
                    <Save className="mr-2 h-4 w-4" /> Değişiklikleri Kaydet
                </Button>
             </div>
        </form>
    );
}
