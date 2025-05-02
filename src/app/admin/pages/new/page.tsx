
"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Construction } from "lucide-react"; // Added Construction icon
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function NewPage() {
    const router = useRouter();
    const [title, setTitle] = React.useState("");
    const [slug, setSlug] = React.useState("");

    // Basic slug generation (same as article editor)
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
             setSlug(""); // Clear slug if title is empty
         }
     }, [title]);

    const handleSave = () => {
        if (!title || !slug) {
            toast({ variant: "destructive", title: "Hata", description: "Sayfa başlığı ve URL metni zorunludur." });
            return;
        }
        // TODO: Implement actual API call to save the new page structure
        console.log("Saving new page:", { title, slug, content: [] }); // Placeholder for content
        toast({
            title: "Sayfa Oluşturuldu",
            description: `"${title}" başlıklı sayfa taslak olarak kaydedildi.`,
        });
        // TODO: Redirect to the edit page for the newly created page or back to list
        // Example: router.push(`/admin/pages/edit/${newlyCreatedPageId}`);
        router.push('/admin/pages');
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                     <Button variant="outline" size="sm" asChild className="mb-4">
                        <Link href="/admin/pages"><ArrowLeft className="mr-2 h-4 w-4" /> Sayfa Listesine Dön</Link>
                     </Button>
                    <h1 className="text-3xl font-bold">Yeni Sayfa Oluştur</h1>
                    <p className="text-muted-foreground">Yeni bir statik sayfa tanımlayın.</p>
                </div>
                <Button onClick={handleSave} disabled={!title || !slug}>
                    <Save className="mr-2 h-4 w-4" /> Sayfayı Kaydet
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Temel Bilgiler</CardTitle>
                    <CardDescription>Sayfanın başlığını ve URL'sini belirleyin.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="page-title">Sayfa Başlığı <span className="text-destructive">*</span></Label>
                        <Input
                            id="page-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Örn: Gizlilik Politikası"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="page-slug">URL Metni (Slug) <span className="text-destructive">*</span></Label>
                        <Input
                            id="page-slug"
                            value={slug}
                            onChange={(e) => setSlug(generateSlug(e.target.value))} // Allow manual adjustment
                            placeholder="Sayfa URL'si"
                            required
                        />
                         <p className="text-xs text-muted-foreground">Tarayıcı adres çubuğunda görünecek kısım. Genellikle otomatik oluşturulur.</p>
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
                 </CardContent>
             </Card>

             <Separator />

             <div className="flex justify-end">
                <Button onClick={handleSave} disabled={!title || !slug}>
                    <Save className="mr-2 h-4 w-4" /> Sayfayı Kaydet
                </Button>
             </div>
        </form>
    );
}
