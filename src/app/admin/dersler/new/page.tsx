
"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from "@/hooks/use-toast";
import { createCourse, type Course } from '@/lib/data/courses';
import { getCategories, type Category } from '@/lib/data/categories';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { ArrowLeft, Loader2, Save, BookOpen as DerslerIcon } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

export default function NewDersPage() {
    const router = useRouter();
    const { hasPermission, isLoading: permissionsLoading } = usePermissions();

    const [saving, setSaving] = React.useState(false);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = React.useState(true);

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [coverImageUrl, setCoverImageUrl] = React.useState("");
    const [instructor, setInstructor] = React.useState("BiyoHox Ekibi");


    React.useEffect(() => {
        if (!permissionsLoading && !hasPermission('Dersleri Yönetme')) {
            toast({ variant: "destructive", title: "Erişim Reddedildi", description: "Yeni ders ekleme yetkiniz yok." });
            router.push('/admin/dersler');
            return;
        }

        setLoadingCategories(true);
        getCategories()
            .then(data => setCategories(data.filter(cat => cat.id && cat.name)))
            .catch(err => {
                console.error("Error fetching categories:", err);
                toast({ variant: "destructive", title: "Hata", description: "Kategoriler yüklenemedi." });
            })
            .finally(() => setLoadingCategories(false));

    }, [permissionsLoading, hasPermission, router]);

    const handleSave = async () => {
        if (!title || !category || !description) {
            toast({ variant: "destructive", title: "Eksik Bilgi", description: "Lütfen Başlık, Kategori ve Açıklama alanlarını doldurun." });
            return;
        }
        setSaving(true);

        const newCourseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'sections' | 'totalDuration' | 'studentCount'> = {
            title,
            description,
            category,
            coverImageUrl: coverImageUrl || undefined, // Make it optional
            instructor: instructor || 'BiyoHox Ekibi',
        };

        try {
            const newCourse = await createCourse(newCourseData);
            if (newCourse) {
                toast({ title: "Kurs Oluşturuldu", description: `"${newCourse.title}" başlıklı kurs başarıyla oluşturuldu. Şimdi bölümleri ve dersleri ekleyebilirsiniz.` });
                router.push(`/admin/dersler/edit/${newCourse.id}`);
            } else {
                toast({ variant: "destructive", title: "Oluşturma Hatası", description: "Kurs oluşturulamadı." });
                setSaving(false);
            }
        } catch (error) {
            console.error("Error creating course:", error);
            toast({ variant: "destructive", title: "Oluşturma Hatası", description: "Kurs oluşturulurken bir hata oluştu." });
            setSaving(false);
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <Button variant="outline" size="sm" asChild className="mb-4">
                        <Link href="/admin/dersler"><ArrowLeft className="mr-2 h-4 w-4" /> Kurs Listesine Dön</Link>
                    </Button>
                    <h1 className="text-3xl font-bold flex items-center gap-2"><DerslerIcon className="h-8 w-8 text-primary"/> Yeni Kurs Ekle</h1>
                    <p className="text-muted-foreground">Yeni bir kurs için temel bilgileri girin.</p>
                </div>
                <Button onClick={handleSave} disabled={saving || !title || !category || !description}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Kursu Kaydet ve Devam Et
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Kurs Bilgileri</CardTitle>
                    <CardDescription>Kursun ana detaylarını buraya girin. Bölümler ve dersler sonraki adımda eklenecektir.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Kurs Başlığı <span className="text-destructive">*</span></Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: İleri Düzey Genetik Mühendisliği" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama <span className="text-destructive">*</span></Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Kurs hakkında kısa ve bilgilendirici bir açıklama." rows={3} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori <span className="text-destructive">*</span></Label>
                            <Select value={category} onValueChange={(value) => setCategory(value)} required disabled={loadingCategories}>
                                <SelectTrigger id="category"><SelectValue placeholder="Kategori seçin" /></SelectTrigger>
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
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instructor">Eğitmen</Label>
                            <Input id="instructor" value={instructor} onChange={(e) => setInstructor(e.target.value)} placeholder="Örn: Prof. Dr. Ayşe Yılmaz" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="coverImageUrl">Kapak Görseli URL (İsteğe Bağlı)</Label>
                        <Input id="coverImageUrl" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://example.com/kurs-kapak.jpg" />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving || !title || !category || !description}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Kursu Kaydet ve Devam Et
                </Button>
            </div>
        </div>
    );
}

    